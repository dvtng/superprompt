import { appState } from "./app-state";
import { updatePromptContent, updatePromptTitle } from "./core/prompt-state";
import { db, saveDoc } from "./db";
import { debounce } from "./debounce";
import { locals } from "./locals";
import { promptStates } from "./prompt-states";
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
        {
          id: doc.id,
          ownerId: doc.owner_id,
          content: doc.content,
          title: doc.title,
          createdAt: doc.created_at,
          updatedAt: doc.updated_at,
          deleted: doc.deleted,
          visibility: doc.visibility,
          synced: true,
        },
        (existingDoc) => !existingDoc || doc.updated_at > existingDoc.updatedAt
      );

      if (savedDoc && promptStates[doc.id]) {
        const promptState = promptStates[doc.id];
        promptState.nonce++;
        updatePromptTitle(promptState, doc.title, false);
        updatePromptContent(promptState, doc.content, false);
      }
    })
  );

  // Get all unsynced docs from the local DB
  const unsyncedDocs = await db.docs.filter((doc) => !doc.synced).toArray();

  // Push them to the server
  for (const doc of unsyncedDocs) {
    await supabase.from("docs").upsert({
      id: doc.id,
      owner_id: userId,
      content: doc.content,
      title: doc.title,
      created_at: doc.createdAt,
      updated_at: doc.updatedAt,
      deleted: doc.deleted,
      visibility: doc.visibility,
    });
    await db.docs.update(doc.id, { synced: true });
  }

  return true;
}
