import { defineFunction } from "../function-spec";

export default defineFunction({
  name: "google",
  dataTypes: [],
  fn: async (context, query: string) => {
    return fetch(
      `/.netlify/functions/serper?q=${encodeURIComponent(query)}`
    ).then((res) => res.json());
  },
});
