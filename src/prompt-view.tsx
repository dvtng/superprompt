import { useSnapshot } from "valtio";
import { css } from "@emotion/css";
import { PromptInputForm } from "./prompt-input-form";
import { useMantineTheme } from "@mantine/core";
import { PromptEditor } from "./prompt-editor";
import { useEffect } from "react";
import { PROMPTS } from "./prompt-data";
import { PromptStateProvider, usePromptState } from "./context";
import { Messages } from "./messages";
import { useNavigate, useParams } from "react-router-dom";
import { saveDoc } from "./db";
import { nanoid } from "nanoid";
import { useDerivedState } from "./use-derived-state";
import {
  deletePromptState,
  preparePromptState,
  promptStates,
} from "./prompt-states";
import { PromptEditorTitlebar } from "./prompt-editor-titlebar";

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

const convoStyles = css`
  display: flex;
  flex-direction: column;
  height: 100%;
  overflow: auto;

  @media (max-width: 800px) {
    height: auto;
    overflow: visible;
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

  return (
    <div className={styles} style={{ background: convoPaneColor }}>
      <div style={{ color, background: bgColor }}>
        <PromptEditorTitlebar />
        <PromptEditor />
      </div>
      <div className={convoStyles} style={{ background: convoPaneColor }}>
        <PromptInputForm bgColor={convoPaneColor} />
        <Messages />
      </div>
    </div>
  );
}

export function PromptViewContainer() {
  const params = useParams<"id">();
  const idFromUrl = params.id ?? "blank";
  const isExamplePrompt = idFromUrl in PROMPTS;
  const [id] = useDerivedState(
    () => (isExamplePrompt ? nanoid() : idFromUrl),
    [idFromUrl]
  );
  preparePromptState(id, PROMPTS[idFromUrl]);
  const promptState = useSnapshot(promptStates)[id];

  useEffect(() => {
    return () => {
      deletePromptState(id);
    };
  }, [id]);

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
  }, [navigate, _promptState, promptState, idFromUrl]);

  return null;
}
