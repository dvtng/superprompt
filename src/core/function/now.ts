import { FunctionContext } from "../function-spec";

export default {
  name: "now",
  dataTypes: [],
  fn: async (_context: FunctionContext, format?: string) => {
    if (!format) {
      return new Date().toString();
    }
    const { default: formatFn } = await import("date-fns/format");
    return formatFn(new Date(), format);
  },
};
