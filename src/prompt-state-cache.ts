import { proxy, useSnapshot } from "valtio";
import { PromptState, createPromptState } from "./core/prompt-state.tsx";
import { db } from "./db.ts";
import { PromptDoc, forkFromDoc, fromRemoteDoc } from "./prompt-doc.ts";
import { supabase } from "./supabase.ts";
import { CacheValue } from "./cache-value.ts";

export type PromptStateCache = {
  [id: string]: CacheValue<PromptState>;
};

export const promptStateCache = proxy<PromptStateCache>({});

/**
 * Loads doc from DB or remote server, and initializes its state.
 */
export function usePromptStateCacheValue(id: string, defaultDoc?: PromptDoc) {
  useSnapshot(promptStateCache);

  if (promptStateCache[id]) {
    return promptStateCache[id];
  }

  promptStateCache[id] = {
    loading: true,
  };
  loadPromptState(id, defaultDoc).then(
    (promptState) => {
      promptStateCache[id].loading = false;
      promptStateCache[id].data = promptState;
    },
    (error) => {
      promptStateCache[id].loading = false;
      promptStateCache[id].error = error;
    }
  );
  return promptStateCache[id];
}

async function loadPromptState(id: string, defaultDoc?: PromptDoc) {
  const docFromDb = await db.docs.get(id);
  let promptState: PromptState;
  if (docFromDb) {
    promptState = createPromptState(docFromDb, true);
  } else if (defaultDoc) {
    promptState = createPromptState(forkFromDoc(id, defaultDoc), false);
  } else {
    const { data, error } = await supabase
      .from("docs")
      .select()
      .eq("id", id)
      .limit(1);

    if (error) {
      throw error;
    }

    if (!data || data.length === 0) {
      throw new Error(`That prompt could not be found.`);
    }

    promptState = createPromptState(fromRemoteDoc(data[0]), false);
  }

  return promptState;
}
