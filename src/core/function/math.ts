import { FunctionContext } from "../function-spec";

export default {
  name: "math",
  dataTypes: [],
  fn: async (context: FunctionContext, expr: string) => {
    const { Parser } = await import("expr-eval");
    return Parser.evaluate(expr);
  },
};
