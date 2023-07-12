import { proxy } from "valtio";
import { PromptState, createPromptState } from "./core/prompt-state";
import { db } from "./db";
import { PromptDoc } from "./prompt-doc";
import { PROMPTS } from "./prompt-data";

export const promptStates = proxy<Record<string, PromptState>>({});

const isLoadingDict: Record<string, boolean> = {};

export async function preparePromptState(
  id: string,
  defaultDoc: PromptDoc = PROMPTS.blank
) {
  if (!promptStates[id] && !isLoadingDict[id]) {
    isLoadingDict[id] = true;
    promptStates[id] = createPromptState(
      (await db.docs.get(id)) ?? { ...defaultDoc, id }
    );
    delete isLoadingDict[id];
  }
}

export function deletePromptState(id: string) {
  delete promptStates[id];
}
