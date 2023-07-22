import { appState } from "./app-state";

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
  forkedFrom: string | null;
};

export type PartialPromptDoc = Partial<PromptDoc> & { id: string };

export function getDocWithDefaults(doc: PartialPromptDoc): PromptDoc {
  const now = new Date().toISOString();
  return {
    ownerId: appState.user?.id ?? null,
    content: "",
    title: "",
    createdAt: now,
    updatedAt: doc.createdAt ?? now,
    deleted: false,
    synced: false,
    visibility: "private",
    forkedFrom: null,
    ...doc,
  };
}

export type RemotePromptDoc = {
  id: string;
  owner_id: string | null;
  content: string;
  title: string;
  created_at: string;
  updated_at: string;
  deleted: boolean;
  visibility: "public" | "private";
  forked_from: string | null;
};

export function fromRemoteDoc(doc: RemotePromptDoc): PromptDoc {
  return {
    id: doc.id,
    ownerId: doc.owner_id,
    content: doc.content,
    title: doc.title,
    createdAt: doc.created_at,
    updatedAt: doc.updated_at,
    deleted: doc.deleted,
    visibility: doc.visibility,
    forkedFrom: doc.forked_from,
    synced: true,
  };
}

export function toRemoteDoc(doc: PromptDoc): RemotePromptDoc {
  return {
    id: doc.id,
    owner_id: doc.ownerId,
    content: doc.content,
    title: doc.title,
    created_at: doc.createdAt,
    updated_at: doc.updatedAt,
    deleted: doc.deleted,
    visibility: doc.visibility,
    forked_from: doc.forkedFrom,
  };
}

export function forkFromDoc(id: string, otherDoc: PromptDoc): PromptDoc {
  return getDocWithDefaults({
    id,
    content: otherDoc.content,
    title: otherDoc.title,
    forkedFrom: otherDoc.id,
  });
}
