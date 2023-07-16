import { keyBy } from "lodash";
import { PromptDoc } from "../prompt-doc";

const modules: Record<string, { default: PromptDoc }> = import.meta.glob(
  "./lib/*.ts",
  { eager: true }
);

export const EXAMPLES: Record<string, PromptDoc> = keyBy(
  Object.values(modules).map((module) => module.default),
  "id"
);
