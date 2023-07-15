import { parse } from "./parse";
import { AST } from "./ast";
import { PromptInput, getInputs } from "./input";
import { PromptDoc } from "../prompt-doc";

export type PromptState = {
  id: string;
  title?: string;
  content: string;
  inputs: PromptInput[];
  inputStates: Record<string, InputState>;
  parsed: AST;
  parseError?: string;
  isRunning: boolean;
  messages: Message[];
  options: Options;
  errors: string[];
  isDirty: boolean;
  isSaved: boolean;
  isStuckToBottom: boolean;
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

export function createPromptState(doc: PromptDoc, isSaved: boolean) {
  const promptState: PromptState = {
    id: doc.id,
    title: doc.title,
    content: doc.content,
    inputs: [],
    inputStates: {},
    parsed: [],
    isRunning: false,
    messages: [],
    options: {},
    errors: [],
    isDirty: false,
    isSaved,
    isStuckToBottom: false,
  };

  if (promptState.content) {
    parseContent(promptState);
  }

  return promptState;
}

export function updatePromptContent(promptState: PromptState, content: string) {
  if (promptState.content === content) {
    return;
  }

  promptState.isDirty = true;
  promptState.content = content;

  parseContent(promptState);
}

export function updatePromptTitle(promptState: PromptState, title: string) {
  if (promptState.title === title) {
    return;
  }

  promptState.isDirty = true;
  if (title) {
    promptState.title = title;
  } else {
    delete promptState.title;
  }
}

function parseContent(promptState: PromptState) {
  delete promptState.parseError;

  try {
    promptState.parsed = parse(promptState.content);
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

export function addError(promptState: PromptState, error: unknown) {
  if (error instanceof Error) {
    promptState.errors.push(error.message || error.name);
  } else {
    promptState.errors.push(String(error));
  }
}
