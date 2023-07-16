import { ASTWithLocation, FunctionCallNode, VariableNode } from "./ast";
import { FUNCTIONS } from "./function";
import { Message, PromptState, getOptionsWithDefaults } from "./prompt-state";
import { ApiKeyState } from "./api-key-state";
import { FunctionContext } from "./function/function-spec";
import OpenAI from "openai";
import { never } from "./never";
import { getErrorMessage } from "./get-error-message";

export async function runPrompt(
  promptState: PromptState,
  apiKeyState: ApiKeyState,
  append?: ASTWithLocation
) {
  const openai = new OpenAI({ apiKey: apiKeyState.OPENAI });
  const options = getOptionsWithDefaults(promptState);

  let prompt = "";

  async function generate(generatedInputName?: string) {
    if (prompt.trim()) {
      promptState.messages.push({
        role: "user",
        content: prompt.trim(),
      });
    }
    prompt = "";
    const chatCompletion = await openai.chat.completions.create({
      model: "gpt-3.5-turbo",
      messages: promptState.messages,
      temperature: options.temperature,
      max_tokens: options.maxTokens === "inf" ? undefined : options.maxTokens,
      presence_penalty: options.presencePenalty,
      frequency_penalty: options.frequencyPenalty,
    });
    const message = chatCompletion.choices[0].message as Message | undefined;
    if (message) {
      promptState.messages.push(message);
      if (generatedInputName) {
        promptState.inputStates[generatedInputName] = {
          dataType: "string",
          value: message.content,
        };
      }
    }
  }

  async function runAST(ast: ASTWithLocation) {
    for (const node of ast) {
      if (node.type === "text") {
        if (node.column === 0) {
          prompt += "\n";
        }
        prompt += node.value;
      } else if (node.type === "placeholder") {
        const placeholderType = node.value.type;
        if (
          placeholderType === "variable" ||
          placeholderType === "functionCall"
        ) {
          if (node.column === 0) {
            prompt += "\n";
          }
          prompt += await evalPlaceholder(promptState, apiKeyState, node.value);
        } else if (placeholderType === "generator") {
          await generate(node.value.identifier?.name);
        } else {
          never(placeholderType);
        }
      } else if (node.type === "directive") {
        if (node.name in options) {
          const num = Number(node.value);
          if (!isNaN(num)) {
            options[node.name as keyof typeof options] = num;
          }
        }
      } else if (node.type === "invalid") {
        // Ignore
      } else {
        never(node);
      }
    }
    if (prompt.trim()) {
      await generate();
    }
  }

  try {
    promptState.isRunning = true;
    promptState.isStuckToBottom = true;
    if (append) {
      await runAST(append);
    } else {
      promptState.messages = [];
      promptState.errors = [];
      await runAST(promptState.parsed);
    }
  } catch (e) {
    if (append) {
      const errorMessage = getErrorMessage(e);
      runPrompt(promptState, apiKeyState, [
        {
          type: "text",
          value: errorMessage,
          column: 0,
          length: errorMessage.length,
          text: errorMessage,
        },
      ]);
    } else {
      promptState.errors.push(getErrorMessage(e));
    }
  } finally {
    promptState.isRunning = false;
  }
}

async function evalPlaceholder(
  promptState: PromptState,
  apiKeyState: ApiKeyState,
  placeholder: VariableNode | FunctionCallNode
): Promise<string> {
  let functionCall: FunctionCallNode;
  let prependArgs: unknown[] = [];
  if (placeholder.type === "variable") {
    functionCall = placeholder.functionCall;
    const input = promptState.inputStates[placeholder.identifier.name];
    if (input === undefined) {
      throw new Error(`Missing input for "${placeholder.identifier.name}"`);
    }
    prependArgs = [input.value];
  } else if (placeholder.type === "functionCall") {
    functionCall = placeholder;
  } else {
    never(placeholder);
  }

  const functionSpec = FUNCTIONS[functionCall.identifier.name];
  if (!functionSpec) {
    throw new Error(`Function "${functionCall.identifier.name}" doesn't exist`);
  }

  const args = await Promise.all(
    functionCall.args.map((arg) => {
      if (arg.type === "stringLiteral" || arg.type === "numberLiteral") {
        return arg.value;
      }
      return evalPlaceholder(promptState, apiKeyState, arg);
    })
  );

  const context: FunctionContext = { apiKeyState };
  const returnValue = await functionSpec.fn(context, ...prependArgs, ...args);
  if (typeof returnValue !== "string") {
    return JSON.stringify(returnValue, undefined, 2);
  }
  return returnValue;
}
