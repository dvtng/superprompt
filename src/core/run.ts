import { AST, FunctionCallNode, VariableNode } from "./ast";
import { FUNCTIONS } from "./function";
import {
  Message,
  PromptState,
  addError,
  getOptionsWithDefaults,
} from "./prompt-state";
import { ApiKeyState } from "./api-key-state";
import { FunctionContext } from "./function-spec";
import OpenAI from "openai";

export async function runPrompt(
  promptState: PromptState,
  apiKeyState: ApiKeyState,
  append?: AST
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

  async function runAST(ast: AST) {
    for (const node of ast) {
      if (node.type === "text") {
        prompt += node.value;
      } else if (node.type === "placeholder") {
        const placeholderType = node.value.type;
        if (
          placeholderType === "variable" ||
          placeholderType === "functionCall"
        ) {
          prompt += await evalPlaceholder(promptState, apiKeyState, node.value);
        } else if (placeholderType === "generator") {
          await generate(node.value.identifier?.name);
        } else {
          const _never: never = placeholderType;
          return _never;
        }
      }
    }
    if (prompt.trim()) {
      await generate();
    }
  }

  try {
    if (append) {
      promptState.isRunning = true;
      await runAST(append);
    } else {
      promptState.messages = [];
      promptState.errors = [];
      promptState.isRunning = true;
      await runAST(promptState.parsed);
    }
  } catch (e) {
    addError(promptState, e);
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
    const _never: never = placeholder;
    return _never;
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
