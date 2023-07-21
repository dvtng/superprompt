import { updatePromptContent, updatePromptTitle } from "./core/prompt-state";
import { db, saveDoc } from "./db";
import { promptStates } from "./prompt-states";
import { supabase } from "./supabase";

// Naive sync implementation. Improve later.
export async function sync(userId: string) {
  // Get all own docs from the server
  const { data } = await supabase.from("docs").select().eq("owner_id", userId);

  if (!data) return false;

  // Save each doc locally, if it's newer than the local version
  await Promise.all(
    data.map(async (doc) => {
      const didSave = await saveDoc(
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

      if (didSave && promptStates[doc.id]) {
        const promptState = promptStates[doc.id];
        promptState.nonce++;
        updatePromptTitle(promptState, doc.title);
        updatePromptContent(promptState, doc.content);
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
  }

  return true;
}
