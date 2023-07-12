export type PromptDoc = {
  id: string;
  content: string;
  title?: string;
};

export function isEqualPromptDoc(a: PromptDoc, b: PromptDoc) {
  return a.id === b.id && a.content === b.content && a.title === b.title;
}
