import { useMemo } from "react";
import { Message } from "../core/prompt-state";
import { parse } from "../core/parse";
import { ASTWithLocation } from "../core/ast";
import { Box } from "@mantine/core";
import { ContentP } from "./content-p";

export function MessageContent({ message }: { message: Message }) {
  const parsed = useMemo(() => parse(message.content), [message.content]);
  const lines = useMemo(() => {
    const lines: ASTWithLocation[] = [];
    for (const node of parsed) {
      if (node.column === 0) {
        lines.push([node]);
      } else {
        lines[lines.length - 1].push(node);
      }
    }
    return lines;
  }, [parsed]);

  return (
    <Box sx={{ whiteSpace: "pre-wrap" }}>
      {lines.map((line, i) => (
        <ContentP key={i}>
          {line.map((node) => {
            return node.text;
          })}
        </ContentP>
      ))}
    </Box>
  );
}
