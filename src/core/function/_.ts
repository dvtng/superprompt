import { FunctionContext } from "../function-spec";

export default {
  name: "_",
  dataTypes: ["string"],
  fn: async (context: FunctionContext, value: string) => {
    return value;
  },
};
