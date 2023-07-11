import { useSnapshot } from "valtio";
import { PromptInputView } from "./prompt-input-view";
import { css } from "@emotion/css";
import { Button, Flex } from "@mantine/core";
import { runPrompt } from "./core/run";
import { IconPlayerPlayFilled } from "@tabler/icons-react";
import { useRequestRequiredApiKeysModal } from "./api-key-modal";
import { FormEvent } from "react";
import { useApiKeyState, usePromptState } from "./context";
import { OpenPromptAdvancedOptionsModalButton } from "./prompt-advanced-options";

const styles = css`
  align-items: start;
  display: flex;
  flex-direction: column;
  gap: 1rem;
`;

const requiredApiKeys = ["OPENAI"];

export function PromptInputForm({ bgColor }: { bgColor: string }) {
  const apiKeyState = useApiKeyState();
  const promptState = usePromptState();
  const _promptState = useSnapshot(promptState);
  const [apiKeysModal, requestRequiredApiKeys] =
    useRequestRequiredApiKeysModal(requiredApiKeys);
  const onSubmit = (e: FormEvent | KeyboardEvent) => {
    e.preventDefault();
    requestRequiredApiKeys().then((hasRequiredApiKeys) => {
      if (hasRequiredApiKeys) {
        runPrompt(promptState, apiKeyState);
      }
    });
  };
  const manualInputs = _promptState.inputs.filter(
    (input) => !input.isGenerated
  );

  return (
    <>
      {apiKeysModal}
      <form
        style={{
          padding: "2rem",
        }}
        onSubmit={onSubmit}
        onKeyDown={(e) => {
          if (e.key === "Enter" && (e.ctrlKey || e.metaKey)) {
            onSubmit(e);
          }
        }}
      >
        {manualInputs.length ? (
          <div className={styles}>
            {manualInputs.map((input) => (
              <PromptInputView key={input.name} input={input} />
            ))}
          </div>
        ) : null}
      </form>
      <Flex
        gap="md"
        style={{
          background: bgColor,
          bottom: 0,
          margin: "-2rem 0",
          padding: "2rem",
          position: "sticky",
          top: 0,
          zIndex: 1,
        }}
      >
        <Button
          loading={_promptState.isRunning}
          leftIcon={<IconPlayerPlayFilled size="1rem" />}
          loaderProps={{ size: "1rem" }}
          onClick={onSubmit}
        >
          Run
        </Button>
        <OpenPromptAdvancedOptionsModalButton />
      </Flex>
    </>
  );
}
