import Dexie, { Table } from "dexie";
import { PartialPromptDoc, PromptDoc, getDocWithDefaults } from "./prompt-doc";
import { sync } from "./sync";

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
// Returns the updates made, or false if no update was made.
export async function saveDoc(
  doc: PartialPromptDoc,
  condition: (existingDoc: PromptDoc | undefined) => boolean = () => true
): Promise<PartialPromptDoc | false> {
  const now = new Date().toISOString();

  const savedDoc = await db.transaction("rw", db.docs, async () => {
    const existingDoc = await db.docs.get(doc.id);
    if (existingDoc) {
      if (condition(existingDoc)) {
        const updates: PartialPromptDoc = {
          updatedAt: now,
          synced: false,
          ...doc,
        };
        await db.docs.update(doc.id, updates);
        return updates;
      }
    } else if (condition(undefined)) {
      const newDoc = getDocWithDefaults(doc);
      await db.docs.put(newDoc);
      return newDoc;
    }
    return false;
  });

  const isLocalUpdate = savedDoc && !savedDoc.synced;
  if (isLocalUpdate) {
    sync();
  }

  return savedDoc;
}

export async function deleteDoc(id: string) {
  await saveDoc({ id, deleted: true, title: "", content: "" });
}
