import { Grammar, Parser } from "nearley";
import grammar from "./grammar";
import { InvalidNode, PlaceholderNode, ASTWithLocation } from "./ast";
import { never } from "./never";

export function parse(prompt: string): ASTWithLocation {
  return prompt.split("\n").reduce((acc, line) => {
    return acc.concat(parseLine(line));
  }, [] as ASTWithLocation);
}

export function parseLine(prompt: string): ASTWithLocation {
  const nodes: ASTWithLocation = [];
  let nodeType: "directive" | "text" | "placeholder" = "text";
  let column = 0;
  let currentSubstring = "";
  let escaped = false;

  function pushCurrentSubstring() {
    if (nodeType === "text" && !currentSubstring) return;

    if (nodeType === "placeholder") {
      nodes.push({
        ...parsePlaceholder(currentSubstring),
        column,
        length: currentSubstring.length + 2,
        text: currentSubstring,
      });
    } else if (nodeType === "directive") {
      const [name, value] = currentSubstring.slice(1).split(/\s+/);
      if (name && value) {
        nodes.push({
          type: "directive",
          name,
          value,
          column,
          length: currentSubstring.length,
          text: currentSubstring,
        });
      } else {
        nodes.push({
          type: "invalid",
          value: currentSubstring,
          column,
          length: currentSubstring.length,
          text: currentSubstring,
        });
      }
    } else if (nodeType === "text") {
      nodes.push({
        type: "text",
        value: currentSubstring,
        column,
        length: currentSubstring.length,
        text: currentSubstring,
      });
    } else {
      never(nodeType);
    }

    currentSubstring = "";
  }

  for (let i = 0; i < prompt.length; i++) {
    const char = prompt[i];

    if (char === "\\" && !escaped) {
      escaped = true;
      continue;
    }

    if (char === "{" && !escaped && nodeType === "text") {
      pushCurrentSubstring();
      column = i;
      nodeType = "placeholder";
      currentSubstring = "";
    } else if (char === "}" && !escaped && nodeType === "placeholder") {
      pushCurrentSubstring();
      column = i + 1;
      nodeType = "text";
      currentSubstring = "";
    } else if (char === "@" && i === 0) {
      nodeType = "directive";
      currentSubstring += char;
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
