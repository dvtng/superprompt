const API_KEY_PREFIX = "API_KEY_";

export type ApiKeyState = Record<string, string>;

export function loadApiKeyState(): ApiKeyState {
  const apiKeyState: ApiKeyState = {};
  for (let i = 0; i < localStorage.length; i++) {
    const name = localStorage.key(i);
    if (name && name.startsWith(API_KEY_PREFIX)) {
      const value = localStorage.getItem(name);
      if (value) {
        apiKeyState[name.substring(API_KEY_PREFIX.length)] = value;
      }
    }
  }
  return apiKeyState;
}

export function setApiKey(
  apiKeyState: ApiKeyState,
  name: string,
  value: string,
  save = false
) {
  apiKeyState[name] = value;
  if (save) {
    localStorage.setItem(API_KEY_PREFIX + name, value);
  }
}

export function getMissingApiKeys(
  apiKeyState: ApiKeyState,
  keys: string[]
): string[] {
  return keys.filter((key) => !apiKeyState[key]);
}
