export function getOpenAiKey() {
  return localStorage.getItem("OPENAI_API_KEY") ?? undefined;
}
