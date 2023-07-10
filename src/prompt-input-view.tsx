import { ref, useSnapshot } from "valtio";
import { getColorForInput } from "./core/prompt-state";
import { PromptInput } from "./core/input";
import { css } from "@emotion/css";
import { FileInput, Textarea, useMantineTheme } from "@mantine/core";
import { usePromptState } from "./context";

const styles = css`
  align-items: center;
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
  width: 100%;

  > label {
    align-items: center;
    display: flex;
    font-size: 0.9em;
    gap: 0.5rem;
    justify-content: flex-start;
    width: 100%;
  }

  > label + * {
    width: 100%;
  }
`;

const dotStyles = css`
  border-radius: 50%;
  display: block;
  height: 0.5rem;
  width: 0.5rem;
`;

// Component that renders a label and an input for a placeholder node
export function PromptInputView({ input }: { input: PromptInput }) {
  const promptState = usePromptState();
  const _promptState = useSnapshot(promptState, { sync: true });
  const inputState = _promptState.inputStates[input.name];
  const dataType = input.dataTypes[0];
  const theme = useMantineTheme();

  return (
    <div className={styles}>
      <label style={{ fontFamily: theme.fontFamilyMonospace }}>
        <span
          className={dotStyles}
          style={{
            background:
              theme.colors[getColorForInput(_promptState, input.name)][4],
          }}
        />{" "}
        {input.name}
      </label>
      {dataType === "file" ? (
        <FileInput
          placeholder="Choose a file"
          accept="text/plain"
          size="md"
          value={
            inputState && inputState.dataType === "file"
              ? inputState.value
              : null
          }
          onChange={(file) => {
            if (file) {
              promptState.inputStates[input.name] = {
                dataType: "file",
                value: ref(file),
              };
            }
          }}
        />
      ) : (
        <Textarea
          placeholder="Enter text"
          value={
            inputState && inputState.dataType === "string"
              ? inputState.value
              : ""
          }
          onChange={(e) => {
            promptState.inputStates[input.name] = {
              dataType: "string",
              value: e.currentTarget.value,
            };
          }}
          size="md"
          autosize
        />
      )}
    </div>
  );
}
