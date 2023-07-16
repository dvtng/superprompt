import { defineFunction } from "../function-spec";

export default defineFunction({
  name: "weather",
  dataTypes: [],
  fn: async (context, latitude: string, longitude: string) => {
    return fetch(
      `https://api.open-meteo.com/v1/forecast?latitude=${encodeURIComponent(
        latitude
      )}&longitude=${encodeURIComponent(longitude)}&current_weather=true`
    ).then((res) => res.json());
  },
});
