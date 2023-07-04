import { useSnapshot } from "valtio";
import { css, cx } from "@emotion/css";
import { PromptInputForm } from "./prompt-input-form";
import { updateRawPrompt, usePromptState } from "./prompt-state";
import { shadow } from "./common-style";

const styles = css`
  display: grid;
  gap: 4rem;
  grid-template-columns: 1.5fr 1fr;
  height: 100%;
  padding: 2rem;
  width: 100%;
`;

const textareaStyles = css`
  background: var(--bg-1);
  border: none;
  border-radius: 4px;
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
    <div className={styles}>
      <textarea
        className={cx(textareaStyles, shadow)}
        value={_promptState.raw}
        onChange={(e) => {
          updateRawPrompt(promptState, e.currentTarget.value);
        }}
      />
      <PromptInputForm />
    </div>
  );
}
