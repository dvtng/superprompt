import { proxy } from "valtio";
import { css, cx } from "@emotion/css";
import { PromptInputForm } from "./prompt-input-form";
import { createPromptState } from "./core/prompt-state";
import { shadow } from "./common-style";
import { Divider } from "./divider";
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
  grid-template-columns: 1fr auto 1fr;
  height: calc(100% - 4rem);
  margin: 2rem auto;
  overflow: hidden;
  width: 100%;
`;

export function PromptView() {
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
          overflow: "auto",
          padding: "2rem",
        }}
      >
        <PromptInputForm />
        <Divider h />
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
