import { useMemo } from "react";
import { parse } from "../core/parse";
import { Button, Code } from "@mantine/core";
import { runPrompt } from "../core/run";
import { useApiKeyState, usePromptStateContext } from "../context";

export function MessageActions({ messageContent }: { messageContent: string }) {
  const promptState = usePromptStateContext();
  const apiKeyState = useApiKeyState();
  const nodesToEval = useMemo(() => {
    const ast = parse(messageContent);
    return ast.filter(
      (node) =>
        node.type === "placeholder" &&
        (node.value.type === "functionCall" || node.value.type === "variable")
    );
  }, [messageContent]);

  return (
    <>
      {nodesToEval.map((node, i) => {
        return (
          <Button
            key={i}
            variant="outline"
            onClick={() => {
              runPrompt(promptState, apiKeyState, [node], true);
            }}
          >
            Run <Code sx={{ fontSize: "1em" }}>{node.text}</Code>
          </Button>
        );
      })}
    </>
  );
}
