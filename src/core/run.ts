import { VariableNode } from "./ast";
import { FUNCTIONS } from "./function";
import { Message, PromptState } from "./prompt-state";
import { ApiKeyState } from "./api-key-state";
import { FunctionContext } from "./function-spec";
import OpenAI from "openai";

export async function runPrompt(
  promptState: PromptState,
  apiKeyState: ApiKeyState
) {
  const openai = new OpenAI({ apiKey: apiKeyState.OPENAI });

  let prompt = "";
  async function generate() {
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
    });
    if (chatCompletion.choices[0].message) {
      promptState.messages.push(chatCompletion.choices[0].message as Message);
    }
  }

  try {
    promptState.messages = [];
    promptState.isRunning = true;

    for (const node of promptState.parsed) {
      if (node.type === "text") {
        prompt += node.value;
      } else if (node.type === "placeholder") {
        const placeholderType = node.value.type;
        if (placeholderType === "variable") {
          prompt += await evalVariable(promptState, apiKeyState, node.value);
        } else if (placeholderType === "generator") {
          await generate();
        } else {
          const _never: never = placeholderType;
          return _never;
        }
      }
    }
    if (prompt.trim()) {
      generate();
    }
  } catch (e) {
    // TODO
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
      `Function "${placeholder.functionCall.identifier.name}" not found`
    );
  }
  const input = promptState.inputStates[placeholder.identifier.name];
  if (input === undefined) {
    throw new Error(`Input for "${placeholder.identifier.name}" not found`);
  }

  const args = await Promise.all(
    placeholder.functionCall.args.map((arg) => {
      return evalVariable(promptState, apiKeyState, arg);
    })
  );

  const context: FunctionContext = { apiKeyState };
  return await functionSpec.fn(context, input.value, ...args);
}
