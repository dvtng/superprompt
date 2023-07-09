import { uniq } from "lodash";
import { AST, VariableNode, filterNodes } from "./ast";
import { FUNCTIONS } from "./function";
import { DATA_TYPES, DataType } from "./function-spec";

export type PromptInput = {
  name: string;
  dataTypes: DataType[];
};

export function getInputs(ast: AST): PromptInput[] {
  const variableNodes = filterNodes(ast, (node): node is VariableNode => {
    return node.type === "variable";
  });

  const uniqueVariableNames = uniq(
    variableNodes.map((node) => node.identifier.name)
  );

  const dataTypesByInputName = Object.fromEntries(
    uniqueVariableNames.map((name) => [name, new Set(DATA_TYPES)])
  );

  for (const variableNode of variableNodes) {
    const functionSpec = FUNCTIONS[variableNode.functionCall.identifier.name];
    if (!functionSpec) {
      continue;
    }
    // Intersect input dataTypes with function dataTypes
    dataTypesByInputName[variableNode.identifier.name] = new Set(
      [...dataTypesByInputName[variableNode.identifier.name]].filter(
        (dataType) => functionSpec.dataTypes.includes(dataType)
      )
    );
  }

  return Object.entries(dataTypesByInputName).map(([name, dataTypes]) => ({
    name,
    dataTypes: Array.from(dataTypes),
  }));
}
