import { defineFunction } from "../function-spec";

export default defineFunction({
  name: "_",
  dataTypes: ["string"],
  fn: async (context, value: string) => {
    return value;
  },
});
