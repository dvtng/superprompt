import { useSnapshot } from "valtio";
import { usePromptState } from "./prompt-state";

export function PromptProgress() {
  const promptState = usePromptState();
  const _promptState = useSnapshot(promptState);

  return (
    <em>
      {_promptState.filledPrompt
        ? "Generating response..."
        : "Generating prompt...."}
    </em>
  );
}
