import { ref, useSnapshot } from "valtio";
import { usePromptState } from "./prompt-state";
import { PromptInput } from "./input";
import { css } from "@emotion/css";
import { FileInput, Input, useMantineTheme } from "@mantine/core";

const styles = css`
  align-items: center;
  display: flex;
  flex-direction: row;
  gap: 1rem;
  width: 100%;

  > label {
    display: flex;
    font-size: 0.9em;
    justify-content: space-between;
    width: 40%;
  }

  > label + * {
    width: 100%;
  }
`;

// Component that renders a label and an input for a placeholder node
export function PromptInputView({ input }: { input: PromptInput }) {
  const promptState = usePromptState();
  const _promptState = useSnapshot(promptState);
  const inputState = _promptState.inputs[input.name];
  const dataType = input.dataTypes[0];
  const theme = useMantineTheme();

  return (
    <div className={styles}>
      <label style={{ fontFamily: theme.fontFamilyMonospace }}>
        {input.name}
      </label>
      {dataType === "file" ? (
        <FileInput
          placeholder="Choose a file"
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
        <Input
          placeholder="Enter text"
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
          size="sm"
        />
      )}
    </div>
  );
}
