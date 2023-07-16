import { useLiveQuery } from "dexie-react-hooks";
import { ApiKeyState } from "./core/api-key-state";
import { PromptState } from "./core/prompt-state";
import { createStandardContext } from "./create-standard-context";
import { PromptDoc } from "./prompt-doc";
import { db } from "./db";
import { createContext, useContext } from "react";

export const [PromptStateProvider, usePromptState] =
  createStandardContext<PromptState>("PromptState");

export const [ApiKeyStateProvider, useApiKeyState] =
  createStandardContext<ApiKeyState>("ApiKeyState");

const DocListContext = createContext<PromptDoc[] | undefined>(undefined);

export const useDocList = () => useContext(DocListContext);

export function DocListProvider({ children }: { children: React.ReactNode }) {
  const docs = useLiveQuery(
    () => db.docs.orderBy("updatedAt").reverse().toArray(),
    []
  );

  return (
    <DocListContext.Provider value={docs}>{children}</DocListContext.Provider>
  );
}
