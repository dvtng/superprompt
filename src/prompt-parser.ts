import { Grammar, Parser } from "nearley";
import grammar from "./grammar";
import {
  ParseNode,
  NodeType,
  PlaceholderNode,
  InvalidPlaceholderNode,
} from "./ast";

export type ParseNodeWithLocation = ParseNode & {
  offset: number;
  length: number;
};

export function parsePrompt(prompt: string): ParseNodeWithLocation[] {
  const nodes: ParseNodeWithLocation[] = [];
  let nodeType: NodeType = "text";
  let offset = 0;
  let currentSubstring = "";
  let escaped = false;

  function pushCurrentSubstring() {
    if (!currentSubstring) return;

    if (nodeType === "text") {
      nodes.push({
        type: nodeType,
        value: currentSubstring,
        offset,
        length: currentSubstring.length,
      });
    } else if (nodeType === "placeholder") {
      nodes.push({
        ...parsePlaceholder(currentSubstring),
        offset,
        length: currentSubstring.length + 2,
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
      nodeType = "placeholder";
      currentSubstring = "";
    } else if (char === "}" && !escaped && nodeType === "placeholder") {
      pushCurrentSubstring();
      offset = i + 1;
      nodeType = "text";
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
function parsePlaceholder(
  placeholder: string
): InvalidPlaceholderNode | PlaceholderNode {
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
      type: "invalid-placeholder",
      value: placeholder,
    };
  }
}
