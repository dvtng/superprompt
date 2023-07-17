import { proxy } from "valtio";
import { PromptState, createPromptState } from "./core/prompt-state";
import { db } from "./db";
import { PromptDoc } from "./prompt-doc";
import BLANK_DOC from "./example/lib/blank.ts";

export const promptStates = proxy<Record<string, PromptState>>({});

const isLoadingDict: Record<string, boolean> = {};

/**
 * Loads doc from DB and initializes its state, if not already present.
 */
export async function loadPromptState(
  id: string,
  defaultDoc: PromptDoc = BLANK_DOC
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
