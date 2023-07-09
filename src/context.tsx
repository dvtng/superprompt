import { ApiKeyState } from "./core/api-key-state";
import { PromptState } from "./core/prompt-state";
import { createStandardContext } from "./create-standard-context";

export const [PromptStateProvider, usePromptState] =
  createStandardContext<PromptState>("PromptState");

export const [ApiKeyStateProvider, useApiKeyState] =
  createStandardContext<ApiKeyState>("ApiKeyState");