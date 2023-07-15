export type AST = RootNode[];

export type ASTWithLocation = (RootNode & {
  column: number;
  length: number;
  text: string;
})[];

export type RootNode = DirectiveNode | TextNode | InvalidNode | PlaceholderNode;

export type ParseNode =
  | RootNode
  | VariableNode
  | GeneratorNode
  | FunctionCallNode
  | IdentifierNode;

export type NodeType = ParseNode["type"];

export type DirectiveNode = {
  type: "directive";
  name: string;
  value: string;
};

export type TextNode = {
  type: "text";
  value: string;
};

export type InvalidNode = {
  type: "invalid";
  value: string;
};

export type PlaceholderNode = {
  type: "placeholder";
  value: VariableNode | FunctionCallNode | GeneratorNode;
};

export type GeneratorNode = {
  type: "generator";
  identifier?: IdentifierNode;
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

export type StringLiteralNode = {
  type: "stringLiteral";
  value: string;
  offset: number;
};

export type NumberLiteralNode = {
  type: "numberLiteral";
  value: number;
  offset: number;
};

export type ExpressionNode =
  | VariableNode
  | FunctionCallNode
  | StringLiteralNode
  | NumberLiteralNode;

export function isParseNode(value: unknown): value is ParseNode {
  return (
    typeof value === "object" &&
    value !== null &&
    typeof (value as Record<string, unknown>).type === "string"
  );
}

export function filterNodes<T extends ParseNode>(
  ast: AST,
  predicate: (value: ParseNode) => value is T
): T[] {
  const results: T[] = [];
  visitNodes(ast, (value) => {
    if (predicate(value)) {
      results.push(value);
    }
  });
  return results;
}

// Visits each node recusively
export function visitNodes(
  value: unknown,
  visitor: (node: ParseNode, parent: ParseNode | null) => void,
  parent: ParseNode | null = null
): void {
  if (typeof value !== "object" || value === null) {
    return;
  }

  if (Array.isArray(value)) {
    for (const item of value) {
      visitNodes(item, visitor, parent);
    }
  } else {
    if (isParseNode(value)) {
      visitor(value, parent);
      parent = value;
    }

    const _value = value as Record<string, unknown>;
    for (const key of Object.keys(_value)) {
      visitNodes(_value[key], visitor, parent);
    }
  }
}
