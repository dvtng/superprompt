// Lightweight localStorage wrapper.
// Serialize/deserialize values to/from JSON.
export const locals = {
  get<T>(key: string, defaultValue: T): T {
    try {
      return JSON.parse(localStorage.getItem(key) ?? "null") ?? defaultValue;
    } catch (e) {
      return defaultValue;
    }
  },

  set(key: string, value: unknown) {
    localStorage.setItem(key, JSON.stringify(value));
  },
};
