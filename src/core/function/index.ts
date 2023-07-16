import { keyBy } from "lodash";
import { FunctionSpec } from "./function-spec";

const modules: Record<string, { default: FunctionSpec }> = import.meta.glob(
  "./lib/*.ts",
  { eager: true }
);

export const FUNCTIONS: Record<string, FunctionSpec> = keyBy(
  Object.values(modules).map((module) => module.default),
  "name"
);
