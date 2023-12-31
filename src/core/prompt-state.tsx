import { parse } from "./parse";
import { ASTWithLocation } from "./ast";
import { PromptInput, getInputs } from "./input";
import { PromptDoc } from "../prompt-doc";
import { nanoid } from "nanoid";
import { appState } from "../app-state";

export type PromptState = {
  id: string;
  nonce: number; // incremented to remote changes to force editor update
  doc: PromptDoc;
  title: string;
  content: string;
  visibility: "public" | "private";
  inputs: PromptInput[];
  inputStates: Record<string, InputState>;
  parsed: ASTWithLocation;
  parseError?: string;
  isRunning: boolean;
  messages: Message[];
  options: Options;
  errors: string[];
  isDirty: boolean;
  isSaved: boolean;
  isStuckToBottom: boolean;
  unsentMessage: Omit<Message, "role">;
};

export type Message = {
  id: string;
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
    nonce: 0,
    doc,
    title: doc.title,
    content: doc.content,
    visibility: doc.visibility,
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
    unsentMessage: {
      id: nanoid(),
      content: "",
    },
  };

  if (promptState.content) {
    parseContent(promptState);
  }

  return promptState;
}

export function updatePromptContent(
  promptState: PromptState,
  content: string,
  isDirty = true
) {
  if (promptState.content === content) {
    return;
  }

  promptState.isDirty = isDirty;
  promptState.content = content;

  parseContent(promptState);
}

export function updatePromptTitle(
  promptState: PromptState,
  title: string,
  isDirty = true
) {
  if (promptState.title === title) {
    return;
  }

  promptState.isDirty = isDirty;
  promptState.title = title;
}

export function updateVisibility(
  promptState: PromptState,
  visibility: PromptDoc["visibility"],
  isDirty = true
) {
  if (promptState.visibility === visibility) {
    return;
  }

  promptState.isDirty = isDirty;
  promptState.visibility = visibility;
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

export function isReadOnly(promptState: PromptState) {
  return (
    promptState.doc.ownerId !== null &&
    promptState.doc.ownerId !== appState.user?.id
  );
}
