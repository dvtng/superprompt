import { PlaceholderNode } from "./ast";
import { FUNCTIONS } from "./function";
import { PromptState } from "./prompt-state";

export async function getCompletedPrompt(prompt: PromptState) {
  let completedPrompt = "";
  for (const node of prompt.parsed) {
    if (node.type === "placeholder") {
      completedPrompt += await evalPlaceholder(prompt, node);
    } else {
      completedPrompt += node.value;
    }
  }
  console.log(completedPrompt);
  return completedPrompt;
}

async function evalPlaceholder(
  prompt: PromptState,
  placeholder: PlaceholderNode
): Promise<string> {
  const functionSpec = FUNCTIONS[placeholder.functionCall.name];
  if (!functionSpec) {
    throw new Error(`Function "${placeholder.functionCall.name}" not found`);
  }
  const input = prompt.inputs[placeholder.name];
  if (input === undefined) {
    throw new Error(`Input for "${placeholder.name}" not found`);
  }

  const args = await Promise.all(
    placeholder.functionCall.args.map((arg) => {
      return evalPlaceholder(prompt, arg);
    })
  );

  return await functionSpec.fn(input.value, ...args);
}
