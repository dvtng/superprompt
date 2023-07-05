export type AST = ParseNode[];

export type ParseNode = TextNode | InvalidPlaceholderNode | PlaceholderNode;

export type NodeType = ParseNode["type"];

export type TextNode = {
  type: "text";
  value: string;
};

export type InvalidPlaceholderNode = {
  type: "invalid-placeholder";
  value: string;
};

export type PlaceholderNode = {
  type: "placeholder";
  name: string;
  functionCall: FunctionCallNode;
};

export type FunctionCallNode = {
  type: "functionCall";
  name: string;
  args: ExpressionNode[];
};

export type ExpressionNode = PlaceholderNode;

export function filterInAST<T extends Record<string, unknown>>(
  ast: AST,
  predicate: (value: Record<string, unknown>) => value is T
): T[] {
  const results: T[] = [];

  const traverse = (value: unknown) => {
    if (typeof value === "object" && value !== null) {
      if (Array.isArray(value)) {
        for (const item of value) {
          traverse(item);
        }
      } else {
        const _value = value as Record<string, unknown>;
        if (predicate(_value)) {
          results.push(_value);
        }

        for (const key of Object.keys(_value)) {
          traverse(_value[key]);
        }
      }
    }
  };

  traverse(ast);

  return results;
}
