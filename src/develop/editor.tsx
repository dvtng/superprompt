import { useSnapshot } from "valtio";
import { usePromptState } from "../context";
import { EditorContent } from "./editor-content";
import { updatePromptContent } from "../core/prompt-state";
import { Box } from "@mantine/core";
import { EditorTitlebar } from "./editor-titlebar";
import { getEditorBgColor } from "../color";
import { EditorPlaceholder } from "./editor-placeholder";

export function Editor() {
  const promptState = usePromptState();
  const _promptState = useSnapshot(promptState);

  return (
    <Box
      sx={(theme) => ({
        background: getEditorBgColor(theme),
        height: "100%",
        overflow: "auto",
      })}
    >
      <EditorTitlebar />
      <div style={{ marginTop: "-1rem", padding: "0 2rem 2rem" }}>
        <EditorContent
          id={promptState.id}
          initialValue={_promptState.content}
          onChange={(value) => {
            updatePromptContent(promptState, value);
          }}
          placeholder={<EditorPlaceholder />}
          autoFocus
        />
      </div>
    </Box>
  );
}
