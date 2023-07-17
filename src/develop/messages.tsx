import { Stack, Alert, Divider } from "@mantine/core";
import { usePromptState } from "../context";
import { useSnapshot } from "valtio";
import { css } from "@emotion/css";
import { IconX } from "@tabler/icons-react";
import { MessageActions } from "./message-actions";
import { EditorContent } from "./editor-content";

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
    <>
      <Divider variant="dashed" />
      <Stack p="2rem">
        {_promptState.messages.map((message, i) => (
          <div key={i} className={messageStyles}>
            <Stack spacing="1rem">
              <div className={labelStyles}>
                {message.role === "user"
                  ? "YOU"
                  : message.role === "assistant"
                  ? "AI"
                  : "SYSTEM"}
              </div>
              <EditorContent
                id={_promptState.id + "/" + i}
                initialValue={message.content}
                readOnly
              />
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
    </>
  );
}
