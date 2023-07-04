import { useSnapshot } from "valtio";
import { usePromptState } from "./prompt-state";
import { PromptInputView } from "./prompt-input-view";
import { useMemo } from "react";
import { getInputs } from "./input";
import { css } from "@emotion/css";
import { Button } from "@mantine/core";
import { runPrompt } from "./run-prompt";
import { IconPlayerPlayFilled } from "@tabler/icons-react";
import { shadow } from "./common-style";

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
  const inputs = useMemo(() => {
    return getInputs(_promptState.parsed);
  }, [_promptState.parsed]);

  return (
    <div className={styles}>
      {inputs.map((input) => (
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
      className={shadow}
      color="violet"
      onClick={() => runPrompt(promptState)}
      loading={_promptState.isRunning}
      leftIcon={<IconPlayerPlayFilled size="1rem" />}
      size="md"
      loaderProps={{ size: "1rem" }}
    >
      Run
    </Button>
  );
}
