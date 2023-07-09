import { useSnapshot } from "valtio";
import { usePromptState } from "./prompt-state";
import { PromptInputView } from "./prompt-input-view";
import { css } from "@emotion/css";
import { Button, Stack } from "@mantine/core";
import { runPrompt } from "./run-prompt";
import { IconPlayerPlayFilled } from "@tabler/icons-react";
import { useRequestRequiredApiKeysModal } from "./api-key-modal";
import { FormEvent } from "react";

const styles = css`
  align-items: start;
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
`;

const requiredApiKeys = ["OPENAI"];

export function PromptInputForm() {
  const promptState = usePromptState();
  const _promptState = useSnapshot(promptState);
  const [apiKeysModal, requestRequiredApiKeys] =
    useRequestRequiredApiKeysModal(requiredApiKeys);
  const onSubmit = (e: FormEvent | KeyboardEvent) => {
    e.preventDefault();
    requestRequiredApiKeys().then((hasRequiredApiKeys) => {
      if (hasRequiredApiKeys) {
        runPrompt(promptState);
      }
    });
  };

  return (
    <form
      onSubmit={onSubmit}
      onKeyDown={(e) => {
        if (e.key === "Enter" && (e.ctrlKey || e.metaKey)) {
          onSubmit(e);
        }
      }}
    >
      {apiKeysModal}
      <Stack spacing="2rem">
        <div className={styles}>
          {_promptState.inputs.map((input) => (
            <PromptInputView key={input.name} input={input} />
          ))}
        </div>
        <div>
          <Button
            type="submit"
            loading={_promptState.isRunning}
            leftIcon={<IconPlayerPlayFilled size="1rem" />}
            loaderProps={{ size: "1rem" }}
          >
            Run
          </Button>
        </div>
      </Stack>
    </form>
  );
}
