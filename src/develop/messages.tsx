import { Stack, Divider } from "@mantine/core";
import { usePromptStateContext } from "../context";
import { useSnapshot } from "valtio";
import { css } from "@emotion/css";
import { MessageActions } from "./message-actions";
import { Fragment } from "react";
import { MessageContent } from "./message-content";
import { ErrorMessage } from "../error-message";

const labelStyles = css`
  font-size: 0.9em;
  letter-spacing: 1px;
  opacity: 0.3;
`;

export function Messages() {
  const promptState = usePromptStateContext();
  const _promptState = useSnapshot(promptState);

  if (_promptState.messages.length + _promptState.errors.length === 0) {
    return null;
  }

  return (
    <>
      <Divider variant="dashed" />
      <Stack p="2rem">
        {_promptState.messages.map((message, i) => (
          <Fragment key={i}>
            <div className={labelStyles}>
              {message.role === "user"
                ? "YOU"
                : message.role === "assistant"
                ? "AI"
                : "SYSTEM"}
            </div>
            <MessageContent message={message} />
            {i === _promptState.messages.length - 1 &&
            message.role === "assistant" ? (
              <MessageActions messageContent={message.content} />
            ) : null}
          </Fragment>
        ))}
        {_promptState.errors.map((errorMessage, i) => (
          <ErrorMessage key={i} error={errorMessage} />
        ))}
      </Stack>
    </>
  );
}
