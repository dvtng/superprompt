import { useSnapshot } from "valtio";
import { css, cx } from "@emotion/css";
import { PromptInputForm, RunPromptButton } from "./prompt-input-form";
import { updateRawPrompt, usePromptState } from "./prompt-state";
import { shadow } from "./common-style";
import { Divider } from "./divider";
import { PromptProgress } from "./prompt-progress";

const styles = css`
  background: var(--bg-1);
  border-radius: 4px;
  display: grid;
  gap: 2rem;
  grid-template-columns: 1fr auto 1fr;
  height: calc(100% - 4rem);
  margin: 2rem;
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

  return (
    <div className={cx(styles, shadow)}>
      <textarea
        className={textareaStyles}
        value={_promptState.raw}
        onChange={(e) => {
          updateRawPrompt(promptState, e.currentTarget.value);
        }}
      />
      <Divider />
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          gap: "2rem",
          paddingRight: "2rem",
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
