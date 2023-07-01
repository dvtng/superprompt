import { proxy } from "valtio";
import { derive } from "valtio/utils";
import { parsePrompt } from "./prompt-parser";

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

const rawState = proxy<BasePromptState>({
  raw: examplePrompt,
  inputs: {},
});

const promptState = derive(
  { parsed: (get) => parsePrompt(get(rawState).raw) },
  { proxy: rawState }
);

export type PromptState = typeof promptState;

// TODO Convert to context-based state
export function usePromptState() {
  return promptState;
}
