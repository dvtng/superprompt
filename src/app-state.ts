import { proxy } from "valtio";

const API_KEY_PREFIX = "API_KEY_";

export type AppState = {
  apiKeys: Record<string, string>;
};

export const appState = proxy<AppState>({
  apiKeys: {},
});

loadAPIKeys();

export function getOpenAIKey() {
  return appState.apiKeys.OPENAI;
}

export function loadAPIKeys() {
  for (let i = 0; i < localStorage.length; i++) {
    const name = localStorage.key(i);
    if (name && name.startsWith(API_KEY_PREFIX)) {
      const value = localStorage.getItem(name);
      if (value) {
        appState.apiKeys[name.substring(API_KEY_PREFIX.length)] = value;
      }
    }
  }
}

export function setAPIKey(name: string, value: string, save = false) {
  appState.apiKeys[name] = value;
  if (save) {
    localStorage.setItem(API_KEY_PREFIX + name, value);
  }
}

export function getMissingAPIKeys(
  appState: AppState,
  names: string[]
): string[] {
  return names.filter((name) => !appState.apiKeys[name]);
}
