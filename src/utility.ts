export function keyBy<T>(array: T[], key: keyof T) {
  return Object.fromEntries(array.map((item) => [item[key], item]));
}

export function unique<T>(array: T[]) {
  return [...new Set(array)];
}
