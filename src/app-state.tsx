import { proxy } from "valtio";

export type User = {
  id: string;
  email?: string;
};

export type AnonUser = null;

export const ANON_USER: AnonUser = null;

const DEFAULT_APP_STATE = {
  user: undefined as User | AnonUser | undefined,
};

export type AppState = typeof DEFAULT_APP_STATE;

export const appState = proxy(DEFAULT_APP_STATE);

export function requireSignedInUser() {
  if (!appState.user) {
    throw new Error("User must be signed in");
  }
  return appState.user;
}
