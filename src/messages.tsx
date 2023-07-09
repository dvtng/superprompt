import { Stack } from "@mantine/core";
import { usePromptState } from "./context";
import { useSnapshot } from "valtio";
import { css } from "@emotion/css";

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

  return (
    <Stack>
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
          </Stack>
        </div>
      ))}
    </Stack>
  );
}
