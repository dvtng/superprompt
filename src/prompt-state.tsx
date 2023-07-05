import { proxy } from "valtio";
import { parsePrompt } from "./prompt-parser";
import { ParseNode } from "./ast";
import { PromptInput, getInputs } from "./input";

const examplePrompt = `
Consider the following excerpts:
---
{book:query(question)}
---
Pretend to be the character {character_name} from the above excerpts.
I'm going to ask you questions and I want you to respond as {character_name} would.
Take care to mimic their personality and mannerisms.
Let's start.
{question}
`.trim();

export type PromptState = {
  raw: string;
  inputs: PromptInput[];
  inputStates: Record<string, InputState>;
  parsed: ParseNode[];
  parseError?: string;
  filledPrompt?: string;
  isRunning: boolean;
  output?: string;
};

export type InputState =
  | {
      dataType: "string";
      value: string;
    }
  | {
      dataType: "file";
      value: File;
    };

const promptState = proxy<PromptState>({
  raw: "",
  inputs: [],
  inputStates: {},
  parsed: [],
  isRunning: false,
});

updateRawPrompt(promptState, examplePrompt);

// TODO Convert to context-based state
export function usePromptState() {
  return promptState;
}

export function updateRawPrompt(promptState: PromptState, raw: string) {
  promptState.raw = raw;
  delete promptState.parseError;

  try {
    promptState.parsed = parsePrompt(raw);
    promptState.inputs = getInputs(promptState.parsed);
  } catch (e) {
    if (e instanceof Error) {
      promptState.parseError = e.message;
    }
  }
}

const colors = ["blue", "yellow", "teal", "grape", "lime", "orange", "cyan"];

export function getColorForInput(inputName: string) {
  const index = promptState.inputs.findIndex(
    (input) => input.name === inputName
  );
  if (index === -1) {
    return "gray";
  }
  return colors[index % colors.length];
}
