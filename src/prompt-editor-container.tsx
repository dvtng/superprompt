import { useSnapshot } from "valtio";
import { usePromptState } from "./context";
import { PromptEditor } from "./prompt-editor";
import { updatePromptContent } from "./core/prompt-state";

export function PromptEditorContainer() {
  const promptState = usePromptState();
  const _promptState = useSnapshot(promptState);

  return (
    <PromptEditor
      initialValue={_promptState.content}
      onChange={(value) => {
        updatePromptContent(promptState, value);
      }}
    />
  );
}
