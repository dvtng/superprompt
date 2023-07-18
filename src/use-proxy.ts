import { useState } from "react";
import { proxy, useSnapshot } from "valtio";

export function useProxy<T extends object>(initializer: () => T) {
  const [proxyState] = useState(() => proxy(initializer()));
  return [useSnapshot(proxyState), proxyState];
}
