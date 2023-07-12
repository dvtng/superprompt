import { VariableNode } from "./ast";
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
  apiKeyState: ApiKeyState
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

  try {
    promptState.messages = [];
    promptState.errors = [];
    promptState.isRunning = true;

    for (const node of promptState.parsed) {
      if (node.type === "text") {
        prompt += node.value;
      } else if (node.type === "placeholder") {
        const placeholderType = node.value.type;
        if (placeholderType === "variable") {
          prompt += await evalVariable(promptState, apiKeyState, node.value);
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
  } catch (e) {
    addError(promptState, e);
  } finally {
    promptState.isRunning = false;
  }
}

async function evalVariable(
  promptState: PromptState,
  apiKeyState: ApiKeyState,
  placeholder: VariableNode
): Promise<string> {
  const functionSpec = FUNCTIONS[placeholder.functionCall.identifier.name];
  if (!functionSpec) {
    throw new Error(
      `Function "${placeholder.functionCall.identifier.name}" doesn't exist`
    );
  }
  const input = promptState.inputStates[placeholder.identifier.name];
  if (input === undefined) {
    throw new Error(`Missing input for "${placeholder.identifier.name}"`);
  }

  const args = await Promise.all(
    placeholder.functionCall.args.map((arg) => {
      return evalVariable(promptState, apiKeyState, arg);
    })
  );

  const context: FunctionContext = { apiKeyState };
  return await functionSpec.fn(context, input.value, ...args);
}
