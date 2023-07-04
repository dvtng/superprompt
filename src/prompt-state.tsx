import { proxy } from "valtio";
import { parsePrompt } from "./prompt-parser";
import { ParseNode } from "./ast";

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

export type BasePromptState = {
  raw: string;
  inputs: Record<string, InputState>;
  parsed: ParseNode[];
  parseError?: string;
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

const promptState = proxy<BasePromptState>({
  raw: examplePrompt,
  inputs: {},
  parsed: parsePrompt(examplePrompt),
});

export type PromptState = typeof promptState;

// TODO Convert to context-based state
export function usePromptState() {
  return promptState;
}

export function updateRawPrompt(promptState: PromptState, raw: string) {
  promptState.raw = raw;
  delete promptState.parseError;

  try {
    promptState.parsed = parsePrompt(raw);
  } catch (e) {
    if (e instanceof Error) {
      promptState.parseError = e.message;
    }
  }
}
