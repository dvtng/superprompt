import { useSnapshot } from "valtio";
import { useApiKeyState, usePromptStateContext } from "../context";
import { EditorContent } from "./editor-content";
import { Box, Button } from "@mantine/core";
import { IconSend } from "@tabler/icons-react";
import { runPrompt } from "../core/run";
import { nanoid } from "nanoid";
import { parse } from "../core/parse";
import { useState } from "react";

export function MessageBox() {
  const promptState = usePromptStateContext();
  const _promptState = useSnapshot(promptState);
  const unsentMessage = _promptState.unsentMessage;
  const apiKeyState = useApiKeyState();
  const [autoFocus, setAutoFocus] = useState(false);
  const onSubmit = () => {
    const content = promptState.unsentMessage.content;
    setAutoFocus(true);
    promptState.unsentMessage = {
      id: nanoid(),
      content: "",
    };
    runPrompt(promptState, apiKeyState, parse(content));
  };

  return (
    <Box sx={{ padding: "1.5rem 2rem" }}>
      <Box
        sx={(theme) => ({
          border: `1px solid ${
            theme.colors.gray[theme.colorScheme === "dark" ? 7 : 3]
          }`,
          borderRadius: 4,
          position: "relative",

          ":focus-within": {
            borderColor: theme.colors.violet[6],
          },
        })}
      >
        <EditorContent
          id={unsentMessage.id}
          initialValue={unsentMessage.content}
          onChange={(value) => {
            promptState.unsentMessage.content = value;
          }}
          style={{ padding: "0.625rem 4rem 0.625rem calc(2.625rem / 3)" }}
          placeholder={<Box sx={{ opacity: 0.4 }}>Type a message</Box>}
          onSubmit={onSubmit}
          autoFocus={autoFocus}
        />
        {unsentMessage.content ? (
          <Button
            compact
            sx={{
              position: "absolute",
              top: "0.55rem",
              right: "calc(2.625rem / 3)",
            }}
            onClick={onSubmit}
            disabled={_promptState.isRunning}
          >
            <IconSend size="1rem" />
          </Button>
        ) : null}
      </Box>
    </Box>
  );
}
