import { Button, Flex, Input } from "@mantine/core";
import { useDerivedState } from "./use-derived-state";
import { usePromptState } from "./context";
import { useSnapshot } from "valtio";
import { useRef } from "react";
import { updatePromptTitle } from "./core/prompt-state";
import { DeleteDocButton } from "./delete-doc-button";

export function PromptEditorTitlebar() {
  const promptState = usePromptState();
  const _promptState = useSnapshot(promptState);
  const inputRef = useRef<HTMLInputElement>(null);
  const [hasTitle, setHasTitle] = useDerivedState(
    () =>
      Boolean(_promptState.title) ||
      document.activeElement === inputRef.current,
    [_promptState.title]
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
          value={_promptState.title ?? ""}
          onChange={(e) => {
            updatePromptTitle(promptState, e.currentTarget.value);
          }}
          onBlur={() => {
            if (!_promptState.title) {
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
