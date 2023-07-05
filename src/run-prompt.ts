import { OpenAI } from "langchain/llms/openai";
import { PlaceholderNode } from "./ast";
import { FUNCTIONS } from "./function";
import { PromptState } from "./prompt-state";
import { getOpenAIKey } from "./app-state";

export async function runPrompt(promptState: PromptState) {
  try {
    promptState.isRunning = true;
    const filledPrompt = await getFilledPrompt(promptState);
    promptState.filledPrompt = filledPrompt;
    const model = new OpenAI({
      openAIApiKey: getOpenAIKey(),
      modelName: "gpt-3.5-turbo",
      temperature: 0,
    });
    promptState.output = await model.predict(filledPrompt);
  } catch (e) {
    // TODO
  } finally {
    promptState.isRunning = false;
  }
}

export async function getFilledPrompt(prompt: PromptState) {
  let filledPrompt = "";
  for (const node of prompt.parsed) {
    if (node.type === "placeholder") {
      filledPrompt += await evalPlaceholder(prompt, node);
    } else {
      filledPrompt += node.value;
    }
  }
  console.log(filledPrompt);
  return filledPrompt;
}

async function evalPlaceholder(
  prompt: PromptState,
  placeholder: PlaceholderNode
): Promise<string> {
  const functionSpec = FUNCTIONS[placeholder.functionCall.identifier.name];
  if (!functionSpec) {
    throw new Error(
      `Function "${placeholder.functionCall.identifier.name}" not found`
    );
  }
  const input = prompt.inputStates[placeholder.identifier.name];
  if (input === undefined) {
    throw new Error(`Input for "${placeholder.identifier.name}" not found`);
  }

  const args = await Promise.all(
    placeholder.functionCall.args.map((arg) => {
      return evalPlaceholder(prompt, arg);
    })
  );

  return await functionSpec.fn(input.value, ...args);
}
