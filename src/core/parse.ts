import { Grammar, Parser } from "nearley";
import grammar from "./grammar";
import { InvalidNode, PlaceholderNode, ASTWithLocation } from "./ast";

export function parse(prompt: string): ASTWithLocation {
  const nodes: ASTWithLocation = [];
  let isPlaceholder = false;
  let column = 0;
  let currentSubstring = "";
  let escaped = false;

  function pushCurrentSubstring() {
    if (!currentSubstring) return;

    if (isPlaceholder) {
      nodes.push({
        ...parsePlaceholder(currentSubstring),
        column,
        length: currentSubstring.length + 2,
        text: currentSubstring,
      });
    } else {
      nodes.push({
        type: "text",
        value: currentSubstring,
        column,
        length: currentSubstring.length,
        text: currentSubstring,
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
      column = i;
      isPlaceholder = true;
      currentSubstring = "";
    } else if (char === "}" && !escaped && isPlaceholder) {
      pushCurrentSubstring();
      column = i + 1;
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
