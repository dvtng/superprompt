import { useSnapshot } from "valtio";
import { usePromptState } from "./prompt-state";
import { PromptInputView } from "./prompt-input-view";
import { css } from "@emotion/css";
import { Button } from "@mantine/core";
import { runPrompt } from "./run-prompt";
import { IconPlayerPlayFilled } from "@tabler/icons-react";
import { useDisclosure } from "@mantine/hooks";
import { ApiKeyModal } from "./api-key-modal";
import { appState, getMissingAPIKeys } from "./app-state";

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

const requiredApiKeys = ["OPENAI"];

export function RunPromptButton() {
  const promptState = usePromptState();
  const _promptState = useSnapshot(promptState);
  const _appState = useSnapshot(appState);
  const [opened, { open, close }] = useDisclosure(false, {
    onClose: () => {
      if (getMissingAPIKeys(appState, requiredApiKeys).length === 0) {
        runPrompt(promptState);
      }
    },
  });
  const missingAPIKeys = getMissingAPIKeys(_appState, requiredApiKeys);

  return (
    <>
      <ApiKeyModal names={missingAPIKeys} opened={opened} onClose={close} />
      <Button
        onClick={() => {
          if (missingAPIKeys.length > 0) {
            open();
            return;
          }
          runPrompt(promptState);
        }}
        loading={_promptState.isRunning}
        leftIcon={<IconPlayerPlayFilled size="1rem" />}
        loaderProps={{ size: "1rem" }}
      >
        Run
      </Button>
    </>
  );
}
