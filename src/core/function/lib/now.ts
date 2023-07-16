import { defineFunction } from "../function-spec";

export default defineFunction({
  name: "now",
  dataTypes: [],
  fn: async (context, format?: string) => {
    if (!format) {
      return new Date().toString();
    }
    const { default: formatFn } = await import("date-fns/format");
    return formatFn(new Date(), format);
  },
});
