import { PromptDoc } from "../prompt-doc";

export function createExample(doc: PromptDoc): PromptDoc {
  return { ...doc, content: doc.content.trim() };
}
