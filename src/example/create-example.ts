import { PartialPromptDoc, PromptDoc, getDocWithDefaults } from "../prompt-doc";

export function createExample(doc: PartialPromptDoc): PromptDoc {
  return getDocWithDefaults({ ...doc, content: doc.content?.trim() });
}
