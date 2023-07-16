import { defineFunction } from "../function-spec";

export default defineFunction({
  name: "math",
  dataTypes: [],
  fn: async (context, expr: string) => {
    const { Parser } = await import("expr-eval");
    return Parser.evaluate(expr);
  },
});
