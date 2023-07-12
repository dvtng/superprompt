import Dexie, { Table } from "dexie";
import { PromptDoc } from "./prompt-doc";

export class Db extends Dexie {
  docs!: Table<PromptDoc>;

  constructor() {
    super("superprompt");
    this.version(1).stores({
      docs: "++id", // Primary key and indexed props
    });
  }
}

export const db = new Db();

export function createDoc(doc: PromptDoc) {
  return db.docs.add(doc);
}

export async function saveDoc(doc: PromptDoc) {
  await db.docs.put(doc);
}
