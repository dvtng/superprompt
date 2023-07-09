export type AST = ParseNode[];

export type ParseNode = TextNode | InvalidNode | PlaceholderNode;

export type PlaceholderNode = GeneratorNode | VariableNode;

export type NodeType = ParseNode["type"];

export type TextNode = {
  type: "text";
  value: string;
};

export type InvalidNode = {
  type: "invalid";
  value: string;
};

export type GeneratorNode = {
  type: "generator";
};

export type VariableNode = {
  type: "variable";
  identifier: IdentifierNode;
  functionCall: FunctionCallNode;
};

export type FunctionCallNode = {
  type: "functionCall";
  identifier: IdentifierNode;
  args: ExpressionNode[];
};

export type IdentifierNode = {
  type: "identifier";
  name: string;
  offset: number;
};

export type ExpressionNode = VariableNode;

export function filterInAST<T extends Record<string, unknown>>(
  ast: AST,
  predicate: (value: Record<string, unknown>) => value is T
): T[] {
  const results: T[] = [];
  visit(ast, (value) => {
    if (predicate(value)) {
      results.push(value);
    }
  });
  return results;
}

// Visits each object recusively
export function visit(
  value: unknown,
  visitor: (value: Record<string, unknown>, parent: unknown) => void,
  parent: unknown = null
): void {
  if (typeof value === "object" && value !== null) {
    if (Array.isArray(value)) {
      for (const item of value) {
        visit(item, visitor, value);
      }
    } else {
      const _value = value as Record<string, unknown>;
      visitor(_value, parent);

      for (const key of Object.keys(_value)) {
        visit(_value[key], visitor, _value);
      }
    }
  }
}
