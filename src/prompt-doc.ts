export type PromptDoc = {
  id: string;
  ownerId: string | null;
  content: string;
  title: string;
  createdAt: string;
  updatedAt: string;
  deleted: boolean;
  synced: boolean;
  visibility: "public" | "private";
};

export type PartialPromptDoc = Partial<PromptDoc> & { id: string };

export function getDocWithDefaults(doc: PartialPromptDoc): PromptDoc {
  const now = new Date().toISOString();
  return {
    ownerId: null,
    content: "",
    title: "",
    createdAt: now,
    updatedAt: doc.createdAt ?? now,
    deleted: false,
    synced: false,
    visibility: "private",
    ...doc,
  };
}
