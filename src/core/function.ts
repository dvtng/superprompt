import { keyBy } from "lodash";
import { FunctionSpec } from "./function-spec";

const functionModules: Record<string, { default: FunctionSpec }> =
  import.meta.glob("./function/*.ts", { eager: true });

export const FUNCTIONS: Record<string, FunctionSpec> = keyBy(
  Object.values(functionModules).map((module) => module.default),
  "name"
);
