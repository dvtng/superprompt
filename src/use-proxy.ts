import { useState } from "react";
import { proxy, useSnapshot } from "valtio";

export function useProxy<T extends object>(initializer: T | (() => T)) {
  const [proxyState] = useState(() =>
    proxy(typeof initializer === "function" ? initializer() : initializer)
  );
  return [useSnapshot(proxyState), proxyState];
}
