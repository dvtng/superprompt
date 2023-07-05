import { useSnapshot } from "valtio";
import { css, cx } from "@emotion/css";
import { PromptInputForm, RunPromptButton } from "./prompt-input-form";
import {
  PromptStateProvider,
  createPromptState,
  usePromptState,
} from "./prompt-state";
import { shadow } from "./common-style";
import { Divider } from "./divider";
import { PromptProgress } from "./prompt-progress";
import { useMantineTheme } from "@mantine/core";
import { PromptEditor } from "./prompt-editor";
import { useState } from "react";
import { PROMPTS } from "./prompt-data";

const styles = css`
  background: var(--bg-1);
  border-radius: 4px;
  display: grid;
  grid-template-columns: 1fr auto 1fr;
  height: calc(100% - 4rem);
  margin: 2rem auto;
  width: 100%;
`;

export function PromptView() {
  const promptState = usePromptState();
  const _promptState = useSnapshot(promptState, { sync: true });
  const theme = useMantineTheme();
  const bgColor =
    theme.colorScheme === "dark" ? theme.colors.dark[5] : theme.white;
  const color =
    theme.colorScheme === "dark" ? theme.white : theme.colors.dark[8];

  return (
    <div className={cx(styles, shadow)} style={{ background: bgColor }}>
      <div style={{ color }}>
        <PromptEditor />
      </div>
      <Divider />
      <div
        style={{
          background:
            theme.colorScheme === "dark" ? theme.colors.dark[6] : "#fafafa",
          display: "flex",
          flexDirection: "column",
          gap: "2rem",
          padding: "2rem",
        }}
      >
        {_promptState.inputs.length ? <PromptInputForm /> : null}
        <div>
          <RunPromptButton />
        </div>
        <Divider h />
        {_promptState.isRunning ? (
          <PromptProgress />
        ) : _promptState.output ? (
          <div>{_promptState.output}</div>
        ) : null}
      </div>
    </div>
  );
}

export function NewPromptView() {
  const [promptState] = useState(() => createPromptState(""));

  return (
    <PromptStateProvider value={promptState}>
      <PromptView />
    </PromptStateProvider>
  );
}

export function ExistingPromptView({ id }: { id: string }) {
  const promptDoc = PROMPTS[id];
  const [promptState] = useState(() => createPromptState(promptDoc.content));

  return (
    <PromptStateProvider value={promptState}>
      <PromptView />
    </PromptStateProvider>
  );
}
