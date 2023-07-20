import Dexie, { Table } from "dexie";
import { PromptDoc } from "./prompt-doc";

export class LocalDb extends Dexie {
  docs!: Table<PromptDoc>;

  constructor() {
    super("superprompt");
    this.version(1).stores({
      docs: "++id, updatedAt", // Primary key and indexed props
    });
  }
}

export const localDb = new LocalDb();

export async function saveDoc(doc: PromptDoc) {
  const _doc = { ...doc };
  const now = new Date().toISOString();
  if (!_doc.createdAt) {
    _doc.createdAt = now;
  }
  _doc.updatedAt = now;
  await localDb.docs.put(_doc);
}

export async function deleteDoc(id: string) {
  await localDb.docs.delete(id);
}
