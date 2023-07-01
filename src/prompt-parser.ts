import { Grammar, Parser } from "nearley";
import grammar from "./grammar";
import { ParseNode, NodeType, PlaceholderNode } from "./ast";

export function parsePrompt(prompt: string): ParseNode[] {
  const nodes: ParseNode[] = [];
  let nodeType: NodeType = "text";
  let currentSubstring = "";
  let escaped = false;

  function pushCurrentSubstring() {
    if (!currentSubstring) return;

    if (nodeType === "text") {
      nodes.push({
        type: nodeType,
        value: currentSubstring,
      });
    } else if (nodeType === "placeholder") {
      nodes.push(parsePlaceholder(currentSubstring));
    } else {
      const _never: never = nodeType;
      return _never;
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
      nodeType = "placeholder";
      currentSubstring = "";
    } else if (char === "}" && !escaped && nodeType === "placeholder") {
      pushCurrentSubstring();
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
function parsePlaceholder(placeholder: string): PlaceholderNode {
  const result = new Parser(Grammar.fromCompiled(grammar))
    .feed(placeholder)
    .finish()[0] as PlaceholderNode;
  return result;
}
