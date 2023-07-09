/* eslint-disable react-refresh/only-export-components */
import { proxy } from "valtio";
import { parsePrompt } from "./prompt-parser";
import { AST } from "./core/ast";
import { PromptInput, getInputs } from "./input";
import { ReactNode, createContext, useContext } from "react";

export type PromptState = {
  raw: string;
  inputs: PromptInput[];
  inputStates: Record<string, InputState>;
  parsed: AST;
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

export function createPromptState(raw: string) {
  const promptState = proxy<PromptState>({
    raw: "",
    inputs: [],
    inputStates: {},
    parsed: [],
    isRunning: false,
  });

  if (raw) {
    updateRawPrompt(promptState, raw);
  }

  return promptState;
}

const PromptStateContext = createContext<PromptState | null>(null);

export function PromptStateProvider({
  value,
  children,
}: {
  value: PromptState;
  children: ReactNode;
}) {
  return (
    <PromptStateContext.Provider value={value}>
      {children}
    </PromptStateContext.Provider>
  );
}

export function usePromptState() {
  const promptState = useContext(PromptStateContext);
  if (!promptState) {
    throw new Error(`usePromptState must be used within a PromptStateProvider`);
  }
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

export function getColorForInput(promptState: PromptState, inputName: string) {
  const index = promptState.inputs.findIndex(
    (input) => input.name === inputName
  );
  if (index === -1) {
    return "gray";
  }
  return colors[index % colors.length];
}
