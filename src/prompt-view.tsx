import { useSnapshot } from "valtio";
import { css } from "@emotion/css";
import { PromptInputForm } from "./prompt-input-form";
import { Box, useMantineTheme } from "@mantine/core";
import { useEffect } from "react";
import { PromptStateProvider, usePromptState } from "./context";
import { Messages } from "./messages";
import { useNavigate, useParams } from "react-router-dom";
import { saveDoc } from "./db";
import { nanoid } from "nanoid";
import { useDerivedState } from "./use-derived-state";
import { preparePromptState, promptStates } from "./prompt-states";
import { PromptEditorTitlebar } from "./prompt-editor-titlebar";
import { PromptEditorContainer } from "./prompt-editor-container";
import { ConvoPane } from "./convo-pane";
import { EXAMPLES } from "./example";
import { PromptEditorStarters } from "./prompt-editor-starters";

const styles = css`
  background: var(--bg-1);
  border-radius: 4px;
  display: grid;
  grid-template-columns: 1fr 1fr;
  height: 100%;
  margin: -1rem auto 0 auto;
  overflow: hidden;
  width: 100%;

  @media (max-width: 800px) {
    display: flex;
    height: calc(100% + 1rem);
    flex-direction: column;
    overflow: auto;
  }
`;

export function PromptView() {
  const theme = useMantineTheme();
  const bgColor =
    theme.colorScheme === "dark" ? theme.colors.dark[5] : theme.white;
  const color =
    theme.colorScheme === "dark" ? theme.white : theme.colors.dark[8];
  const convoPaneColor =
    theme.colorScheme === "dark" ? theme.colors.dark[6] : "#f9f9f9";
  const promptState = usePromptState();
  const _promptState = useSnapshot(promptState);

  return (
    <div className={styles} style={{ background: convoPaneColor }}>
      <Box
        sx={{
          color,
          background: bgColor,
          maxHeight: "100%",
          overflow: "auto",
          "@media(max-width: 800px)": {
            maxHeight: "none",
            overflow: "visible",
          },
        }}
      >
        <PromptEditorTitlebar />
        <div style={{ padding: "0 2rem 2rem" }}>
          <PromptEditorContainer />
        </div>
      </Box>
      {_promptState.content.length === 0 ? (
        <PromptEditorStarters />
      ) : (
        <ConvoPane>
          <PromptInputForm bgColor={convoPaneColor} />
          <Messages />
        </ConvoPane>
      )}
    </div>
  );
}

export function PromptViewContainer() {
  const params = useParams<"id">();
  const idFromUrl = params.id ?? "blank";
  const isExamplePrompt = idFromUrl in EXAMPLES;
  const [id] = useDerivedState(
    () => (isExamplePrompt ? nanoid() : idFromUrl),
    [idFromUrl]
  );
  preparePromptState(id, EXAMPLES[idFromUrl]);
  const promptState = useSnapshot(promptStates)[id];

  if (!promptState) {
    return null;
  }

  return (
    <PromptStateProvider value={promptStates[id]}>
      <PromptDocSaver idFromUrl={idFromUrl} />
      <PromptView />
    </PromptStateProvider>
  );
}

function PromptDocSaver({ idFromUrl }: { idFromUrl: string }) {
  const promptState = usePromptState();
  const _promptState = useSnapshot(promptState);
  const navigate = useNavigate();

  useEffect(() => {
    if (!_promptState.isDirty) {
      return;
    }

    saveDoc({
      id: _promptState.id,
      content: _promptState.content,
      title: _promptState.title,
    });

    if (idFromUrl !== _promptState.id) {
      navigate(`/prompt/${_promptState.id}`, { replace: true });
    }

    promptState.isDirty = false;
    promptState.isSaved = true;
  }, [navigate, _promptState, promptState, idFromUrl]);

  return null;
}
