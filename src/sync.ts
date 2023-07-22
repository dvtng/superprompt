import { appState } from "./app-state";
import { updatePromptContent, updatePromptTitle } from "./core/prompt-state";
import { db, saveDoc } from "./db";
import { debounce } from "./debounce";
import { locals } from "./locals";
import { fromRemoteDoc, toRemoteDoc } from "./prompt-doc";
import { promptStateCache } from "./prompt-state-cache";
import { supabase } from "./supabase";

export const sync = debounce(doSync, 1000);

export const LAST_SYNC_KEY = "superprompt.lastSync";

const SYNC_ERROR_MARGIN = 2000;

// Naive sync implementation. Improve later.
async function doSync() {
  const lastSync = locals.get(LAST_SYNC_KEY, "0");

  const userId = appState.user?.id;
  if (!userId) return false;

  // Get all own docs from the server
  const { data } = await supabase
    .from("docs")
    .select()
    .eq("owner_id", userId)
    .filter("updated_at", "gte", lastSync);

  // Save the last sync time
  const syncTime = Date.now() - SYNC_ERROR_MARGIN;
  locals.set(LAST_SYNC_KEY, new Date(syncTime).toISOString());

  if (!data) return false;

  // Save each doc locally, if it's newer than the local version
  await Promise.all(
    data.map(async (doc) => {
      const savedDoc = await saveDoc(
        fromRemoteDoc(doc),
        (existingDoc) => !existingDoc || doc.updated_at > existingDoc.updatedAt
      );

      if (savedDoc) {
        const promptState = promptStateCache[doc.id]?.data;
        if (promptState) {
          promptState.nonce++;
          updatePromptTitle(promptState, doc.title, false);
          updatePromptContent(promptState, doc.content, false);
        }
      }
    })
  );

  // Get all unsynced docs from the local DB
  const unsyncedDocs = await db.docs
    .filter(
      (doc) => !doc.synced && (doc.ownerId === null || doc.ownerId === userId)
    )
    .toArray();

  // Push them to the server
  for (const doc of unsyncedDocs) {
    await supabase
      .from("docs")
      .upsert(toRemoteDoc({ ...doc, ownerId: userId }));
    await db.docs.update(doc.id, { synced: true, ownerId: userId });
  }

  return true;
}
