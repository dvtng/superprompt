import { useSnapshot } from "valtio";
import { css, cx } from "@emotion/css";
import { PromptInputForm, RunPromptButton } from "./prompt-input-form";
import { updateRawPrompt, usePromptState } from "./prompt-state";
import { shadow } from "./common-style";
import { Divider } from "./divider";
import { PromptProgress } from "./prompt-progress";
import { useMantineTheme } from "@mantine/core";

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

const textareaStyles = css`
  background: none;
  border: none;
  display: block;
  font-family: inherit;
  font-size: inherit;
  height: 100%;
  line-height: 1.7;
  outline: none;
  padding: 2rem;
  resize: none;
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
      <textarea
        className={textareaStyles}
        value={_promptState.raw}
        onChange={(e) => {
          updateRawPrompt(promptState, e.currentTarget.value);
        }}
        style={{ color }}
      />
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
