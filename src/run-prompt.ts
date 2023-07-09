import { VariableNode } from "./ast";
import { FUNCTIONS } from "./function";
import { PromptState } from "./prompt-state";
import { getModel } from "./get-model";

export async function runPrompt(promptState: PromptState) {
  try {
    promptState.isRunning = true;
    const filledPrompt = await getFilledPrompt(promptState);
    promptState.filledPrompt = filledPrompt;
    promptState.output = await getModel().predict(filledPrompt);
  } catch (e) {
    // TODO
  } finally {
    promptState.isRunning = false;
  }
}

export async function getFilledPrompt(prompt: PromptState) {
  let filledPrompt = "";
  for (const node of prompt.parsed) {
    if (node.type === "text") {
      filledPrompt += node.value;
    } else if (node.type === "variable") {
      filledPrompt += await evalVariable(prompt, node);
    } else if (node.type === "generator") {
      filledPrompt += await getModel().predict(filledPrompt);
    }
  }
  console.log(filledPrompt);
  return filledPrompt;
}

async function evalVariable(
  prompt: PromptState,
  placeholder: VariableNode
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
      return evalVariable(prompt, arg);
    })
  );

  return await functionSpec.fn(input.value, ...args);
}
