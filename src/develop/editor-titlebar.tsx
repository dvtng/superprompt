import { Button, Flex, Input } from "@mantine/core";
import { useDerivedState } from "../use-derived-state";
import { usePromptState } from "../context";
import { useRef } from "react";
import { updatePromptTitle } from "../core/prompt-state";
import { DeleteDocButton } from "./delete-doc-button";

export function EditorTitlebar() {
  const promptState = usePromptState({ sync: true });
  const inputRef = useRef<HTMLInputElement>(null);
  const [hasTitle, setHasTitle] = useDerivedState(
    () =>
      Boolean(promptState.title) || document.activeElement === inputRef.current,
    [promptState.title]
  );

  return (
    <Flex
      style={{ height: "5rem", padding: "0 2rem" }}
      align="center"
      justify="space-between"
    >
      {hasTitle ? (
        <Input
          ref={inputRef}
          size="xl"
          styles={(theme) => ({
            wrapper: {
              width: "100%",
            },
            input: {
              background: "none",
              border: "none",
              fontFamily: theme.headings.fontFamily,
              fontSize: theme.headings.sizes.h3.fontSize,
              fontWeight: "bold",
              paddingLeft: 0,
            },
          })}
          placeholder="Enter a title"
          value={promptState.title ?? ""}
          onChange={(e) => {
            updatePromptTitle(promptState, e.currentTarget.value);
          }}
          onBlur={() => {
            if (!promptState.title) {
              setHasTitle(false);
            }
          }}
        />
      ) : (
        <Button
          variant="default"
          compact
          onClick={() => {
            setHasTitle(true);
            setTimeout(() => {
              inputRef.current?.focus();
            });
          }}
          styles={(theme) => ({
            root: {
              color: theme.colors.gray[6],
            },
          })}
        >
          + Add title
        </Button>
      )}
      <DeleteDocButton />
    </Flex>
  );
}
