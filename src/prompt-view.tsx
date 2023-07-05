import { useSnapshot } from "valtio";
import { css, cx } from "@emotion/css";
import { PromptInputForm, RunPromptButton } from "./prompt-input-form";
import { usePromptState } from "./prompt-state";
import { shadow } from "./common-style";
import { Divider } from "./divider";
import { PromptProgress } from "./prompt-progress";
import { useMantineTheme } from "@mantine/core";
import { PromptEditor } from "./prompt-editor";

const styles = css`
  background: var(--bg-1);
  border-radius: 4px;
  display: grid;
  grid-template-columns: 1fr auto 1fr;
  height: calc(100% - 4rem);
  margin: 2rem auto;
  max-width: 1100px;
  width: calc(100% - 4rem);
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
          padding: "0 2rem",
        }}
      >
        <PromptInputForm />
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
