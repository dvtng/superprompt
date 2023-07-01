import { uniq } from "lodash";
import { AST, PlaceholderNode, filterInAST } from "./ast";
import { FUNCTIONS } from "./function";
import { DATA_TYPES, DataType } from "./function-spec";

export type PromptInput = {
  name: string;
  dataTypes: DataType[];
};

export function getInputs(ast: AST): PromptInput[] {
  const placeholderNodes = filterInAST(ast, (node): node is PlaceholderNode => {
    return node.type === "placeholder";
  });

  const uniquePlaceholderNames = uniq(
    placeholderNodes.map((node) => node.name)
  );

  const dataTypesByInputName = Object.fromEntries(
    uniquePlaceholderNames.map((name) => [name, new Set(DATA_TYPES)])
  );

  for (const placeholderNode of placeholderNodes) {
    const functionSpec = FUNCTIONS[placeholderNode.functionCall.name];
    if (!functionSpec) {
      continue;
    }
    // Intersect input dataTypes with function dataTypes
    dataTypesByInputName[placeholderNode.name] = new Set(
      [...dataTypesByInputName[placeholderNode.name]].filter((dataType) =>
        functionSpec.dataTypes.includes(dataType)
      )
    );
  }

  return Object.entries(dataTypesByInputName).map(([name, dataTypes]) => ({
    name,
    dataTypes: Array.from(dataTypes),
  }));
}
