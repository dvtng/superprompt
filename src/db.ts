import Dexie, { Table } from "dexie";
import { PartialPromptDoc, PromptDoc, getDocWithDefaults } from "./prompt-doc";

export class Db extends Dexie {
  docs!: Table<PromptDoc>;

  constructor() {
    super("superprompt");

    this.version(1).stores({
      docs: "++id, updatedAt", // Primary key and indexed props
    });

    this.version(2)
      .stores({
        docs: "++id, updatedAt, visibility",
      })
      .upgrade((tx) => {
        return tx
          .table("docs")
          .toCollection()
          .modify((doc) => {
            doc.ownerId = null;
            doc.content = doc.content ?? "";
            doc.title = doc.title ?? "";
            doc.deleted = false;
            doc.synced = false;
            doc.visibility = "private";
          });
      });
  }
}

export const db = new Db();

// Save doc with optional condition.
// Returns boolean indicating whether a write operation occured.
export async function saveDoc(
  doc: PartialPromptDoc,
  condition: (existingDoc: PromptDoc | undefined) => boolean = () => true
) {
  const now = new Date().toISOString();

  return db.transaction("rw", db.docs, async () => {
    const existingDoc = await db.docs.get(doc.id);
    if (existingDoc) {
      if (condition(existingDoc)) {
        const updates: PartialPromptDoc = {
          updatedAt: now,
          synced: false,
          ...doc,
        };
        await db.docs.update(doc.id, updates);
        return true;
      }
    } else if (condition(undefined)) {
      await db.docs.put(getDocWithDefaults(doc));
      return true;
    }
    return false;
  });
}

export async function deleteDoc(id: string) {
  await saveDoc({ id, deleted: true, title: "", content: "" });
}
