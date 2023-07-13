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
      {manualInputs.length ? (
        <form
          style={{
            padding: "2rem ",
          }}
          onSubmit={onSubmit}
          onKeyDown={(e) => {
            if (e.key === "Enter" && (e.ctrlKey || e.metaKey)) {
              onSubmit(e);
            }
          }}
        >
          <div className={styles}>
            {manualInputs.map((input) => (
              <PromptInputView key={input.name} input={input} />
            ))}
          </div>
        </form>
      ) : null}
      <Flex
        gap="md"
        sx={(theme) => ({
          background: bgColor,
          bottom: 0,
          padding: "1.5rem 2rem",
          position: "sticky",
          top: 0,
          zIndex: 1,
          ...(manualInputs.length
            ? {
                borderTop: `1px solid ${
                  theme.colorScheme === "dark" ? "#ffffff18" : "#00000018"
                }`,
              }
            : {}),
        })}
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
