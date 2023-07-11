import { proxy } from "valtio";
import { css, cx } from "@emotion/css";
import { PromptInputForm } from "./prompt-input-form";
import { createPromptState } from "./core/prompt-state";
import { shadow } from "./common-style";
import { useMantineTheme } from "@mantine/core";
import { PromptEditor } from "./prompt-editor";
import { useState } from "react";
import { PROMPTS } from "./prompt-data";
import { PromptStateProvider } from "./context";
import { Messages } from "./messages";

const styles = css`
  background: var(--bg-1);
  border-radius: 4px;
  display: grid;
  grid-template-columns: 1fr 1fr;
  height: calc(100% - 2rem);
  margin: 0 auto 2rem auto;
  overflow: hidden;
  width: 100%;

  @media (max-width: 800px) {
    display: flex;
    flex-direction: column;
    height: 100%;
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
    theme.colorScheme === "dark" ? theme.colors.dark[6] : "#fafafa";

  return (
    <div className={cx(styles, shadow)} style={{ background: bgColor }}>
      <div style={{ color }}>
        <PromptEditor />
      </div>
      <div className={convoStyles} style={{ background: convoPaneColor }}>
        <PromptInputForm bgColor={convoPaneColor} />
        <Messages />
      </div>
    </div>
  );
}

export function NewPromptView() {
  const [promptState] = useState(() => proxy(createPromptState("")));

  return (
    <PromptStateProvider value={promptState}>
      <PromptView />
    </PromptStateProvider>
  );
}

export function ExistingPromptView({ id }: { id: string }) {
  const promptDoc = PROMPTS[id];
  const [promptState] = useState(() =>
    proxy(createPromptState(promptDoc.content))
  );

  return (
    <PromptStateProvider value={promptState}>
      <PromptView />
    </PromptStateProvider>
  );
}
