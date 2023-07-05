import { useSnapshot } from "valtio";
import { usePromptState } from "./prompt-state";
import { PromptInputView } from "./prompt-input-view";
import { css } from "@emotion/css";
import { Button } from "@mantine/core";
import { runPrompt } from "./run-prompt";
import { IconPlayerPlayFilled } from "@tabler/icons-react";

const styles = css`
  align-items: start;
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
  padding-top: 2rem;
`;

export function PromptInputForm() {
  const promptState = usePromptState();
  const _promptState = useSnapshot(promptState);

  return (
    <div className={styles}>
      {_promptState.inputs.map((input) => (
        <PromptInputView key={input.name} input={input} />
      ))}
    </div>
  );
}

export function RunPromptButton() {
  const promptState = usePromptState();
  const _promptState = useSnapshot(promptState);

  return (
    <Button
      onClick={() => runPrompt(promptState)}
      loading={_promptState.isRunning}
      leftIcon={<IconPlayerPlayFilled size="1rem" />}
      loaderProps={{ size: "1rem" }}
    >
      Run
    </Button>
  );
}
