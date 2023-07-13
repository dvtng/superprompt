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
    const docFromDb = await db.docs.get(id);
    promptStates[id] = createPromptState(
      docFromDb ?? { ...defaultDoc, id },
      Boolean(docFromDb)
    );
    delete isLoadingDict[id];
  }
}

export function deletePromptState(id: string) {
  delete promptStates[id];
}
