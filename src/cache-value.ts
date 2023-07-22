export type CacheValue<T> = {
  loading: boolean;
  data?: T;
  error?: unknown;
};
