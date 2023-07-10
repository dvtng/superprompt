import { parse } from "./parse";
import { AST } from "./ast";
import { PromptInput, getInputs } from "./input";

export type PromptState = {
  raw: string;
  inputs: PromptInput[];
  inputStates: Record<string, InputState>;
  parsed: AST;
  parseError?: string;
  isRunning: boolean;
  messages: Message[];
  options: Options;
};

export type Message = {
  role: "system" | "user" | "assistant";
  content: string;
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

export type Options = {
  temperature?: number;
  maxTokens?: number | "inf";
  presencePenalty?: number;
  frequencyPenalty?: number;
};

export function createPromptState(raw: string) {
  const promptState: PromptState = {
    raw: "",
    inputs: [],
    inputStates: {},
    parsed: [],
    isRunning: false,
    messages: [],
    options: {},
  };

  if (raw) {
    updateRawPrompt(promptState, raw);
  }

  return promptState;
}

export function updateRawPrompt(promptState: PromptState, raw: string) {
  promptState.raw = raw;
  delete promptState.parseError;

  try {
    promptState.parsed = parse(raw);
    promptState.inputs = getInputs(promptState.parsed);
  } catch (e) {
    if (e instanceof Error) {
      promptState.parseError = e.message;
    }
  }
}

const colors = ["blue", "yellow", "teal", "grape", "lime", "orange", "cyan"];

export function getColorForInput(promptState: PromptState, inputName: string) {
  const index = promptState.inputs.findIndex(
    (input) => input.name === inputName
  );
  if (index === -1) {
    return "gray";
  }
  return colors[index % colors.length];
}

export const defaultOptions: Required<Options> = {
  temperature: 1,
  maxTokens: "inf",
  presencePenalty: 0,
  frequencyPenalty: 0,
};

export function getOptionsWithDefaults(
  promptState: PromptState
): Required<Options> {
  return {
    ...defaultOptions,
    ...promptState.options,
  };
}
