import { Grammar, Parser } from "nearley";
import grammar from "./grammar";
import { ParseNode, InvalidNode, PlaceholderNode } from "./ast";

export type ParseNodeWithLocation = ParseNode & {
  offset: number;
  length: number;
};

export function parsePrompt(prompt: string): ParseNodeWithLocation[] {
  const nodes: ParseNodeWithLocation[] = [];
  let isPlaceholder = false;
  let offset = 0;
  let currentSubstring = "";
  let escaped = false;

  function pushCurrentSubstring() {
    if (!currentSubstring) return;

    if (isPlaceholder) {
      nodes.push({
        ...parsePlaceholder(currentSubstring),
        offset,
        length: currentSubstring.length + 2,
      });
    } else {
      nodes.push({
        type: "text",
        value: currentSubstring,
        offset,
        length: currentSubstring.length,
      });
    }

    currentSubstring = "";
  }

  for (let i = 0; i < prompt.length; i++) {
    const char = prompt[i];

    if (char === "\\" && !escaped) {
      escaped = true;
      continue;
    }

    if (char === "{" && !escaped) {
      pushCurrentSubstring();
      offset = i;
      isPlaceholder = true;
      currentSubstring = "";
    } else if (char === "}" && !escaped && isPlaceholder) {
      pushCurrentSubstring();
      offset = i + 1;
      isPlaceholder = false;
      currentSubstring = "";
    } else {
      currentSubstring += char;
    }

    escaped = false;
  }

  pushCurrentSubstring();

  return nodes;
}

// Parse placeholder using nearley grammar
function parsePlaceholder(placeholder: string): InvalidNode | PlaceholderNode {
  try {
    const result = new Parser(Grammar.fromCompiled(grammar))
      .feed(placeholder)
      .finish();
    if (result.length === 0) {
      throw new Error("No parse results");
    }
    if (result.length > 1) {
      console.warn(`Ambiguous parse result for: ${placeholder}`);
    }
    return result[0] as PlaceholderNode;
  } catch (e) {
    return {
      type: "invalid",
      value: placeholder,
    };
  }
}
