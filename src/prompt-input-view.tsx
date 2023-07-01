import { ref, useSnapshot } from "valtio";
import { usePromptState } from "./prompt-state";
import { PromptInput } from "./input";
import { css, cx } from "@emotion/css";
import { shadow } from "./common-style";
import { FileInput, Textarea } from "@mantine/core";

const styles = css`
  background: var(--bg-1);
  border-radius: 4px;
  display: flex;
  flex-direction: column;
  gap: 1rem;
  padding: 1rem;
  width: 100%;

  > label {
    display: flex;
    justify-content: space-between;

    em {
      font-style: italic;
      opacity: 0.5;
    }
  }
`;

// Component that renders a label and an input for a placeholder node
export function PromptInputView({ input }: { input: PromptInput }) {
  const promptState = usePromptState();
  const _promptState = useSnapshot(promptState);
  const inputState = _promptState.inputs[input.name];
  const dataType = input.dataTypes[0];

  return (
    <div className={cx(styles, shadow)}>
      <label>
        <strong>{input.name}</strong> <em>{dataType}</em>
      </label>
      {dataType === "file" ? (
        <FileInput
          placeholder="Pick file"
          accept="text/plain"
          value={
            inputState && inputState.dataType === "file"
              ? inputState.value
              : null
          }
          onChange={(file) => {
            if (file) {
              promptState.inputs[input.name] = {
                dataType: "file",
                value: ref(file),
              };
            }
          }}
        />
      ) : (
        <Textarea
          placeholder={input.name}
          value={
            inputState && inputState.dataType === "string"
              ? inputState.value
              : ""
          }
          onChange={(e) => {
            promptState.inputs[input.name] = {
              dataType: "string",
              value: e.currentTarget.value,
            };
          }}
          minRows={1}
          maxRows={10}
          autosize
        />
      )}
    </div>
  );
}
