import { useSnapshot } from "valtio";
import { InputView } from "./input-view";
import { css } from "@emotion/css";
import { Box, Button, Flex } from "@mantine/core";
import { runPrompt } from "../core/run";
import { IconPlayerPlayFilled } from "@tabler/icons-react";
import { useRequestRequiredApiKeysModal } from "../api-key-modal";
import { FormEvent } from "react";
import { useApiKeyState, usePromptStateContext } from "../context";
import { OpenAdvancedOptionsModalButton } from "./advanced-options";
import { getLayerBgColor } from "../color";

const styles = css`
  align-items: start;
  display: flex;
  flex-direction: column;
  gap: 1rem;
`;

const requiredApiKeys = ["OPENAI"];

export function InputForm() {
  const apiKeyState = useApiKeyState();
  const promptState = usePromptStateContext();
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
        <Box
          component="form"
          sx={(theme) => ({
            backgroundColor: getLayerBgColor(theme),
            padding: "2rem 2rem 0",
          })}
          onSubmit={onSubmit}
          onKeyDown={(e) => {
            if (e.key === "Enter" && (e.ctrlKey || e.metaKey)) {
              onSubmit(e);
            }
          }}
        >
          <div className={styles}>
            {manualInputs.map((input) => (
              <InputView key={input.name} input={input} />
            ))}
          </div>
        </Box>
      ) : null}
      <Flex
        gap="md"
        sx={(theme) => ({
          background: getLayerBgColor(theme),
          bottom: 0,
          padding: "1.5rem 2rem",
          position: "sticky",
          top: 0,
          zIndex: 1,
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
        <OpenAdvancedOptionsModalButton />
      </Flex>
    </>
  );
}
