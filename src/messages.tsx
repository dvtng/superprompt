import { Stack, Alert } from "@mantine/core";
import { usePromptState } from "./context";
import { useSnapshot } from "valtio";
import { css } from "@emotion/css";
import { IconX } from "@tabler/icons-react";
import { MessageActions } from "./message-actions";

const messageStyles = css`
  pre {
    font-family: inherit;
    margin: 0;
    text-wrap: wrap;
  }
`;

const labelStyles = css`
  font-size: 0.9em;
  letter-spacing: 1px;
  opacity: 0.3;
`;

export function Messages() {
  const promptState = usePromptState();
  const _promptState = useSnapshot(promptState);

  if (_promptState.messages.length + _promptState.errors.length === 0) {
    return null;
  }

  return (
    <Stack p="2rem">
      {_promptState.messages.map((message, i) => (
        <div key={i} className={messageStyles}>
          <Stack spacing="0.2rem">
            <div className={labelStyles}>
              {message.role === "user"
                ? "YOU"
                : message.role === "assistant"
                ? "AI"
                : "SYSTEM"}
            </div>
            <pre>{message.content}</pre>
            {i === _promptState.messages.length - 1 &&
            message.role === "assistant" ? (
              <MessageActions messageContent={message.content} />
            ) : null}
          </Stack>
        </div>
      ))}
      {_promptState.errors.map((errorMessage, i) => (
        <Alert
          key={i}
          icon={<IconX size="1.1rem" />}
          color="red"
          variant="outline"
        >
          {errorMessage}
        </Alert>
      ))}
    </Stack>
  );
}
