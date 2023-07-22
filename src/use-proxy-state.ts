import { useState } from "react";
import { proxy, useSnapshot } from "valtio";
import { useProxy } from "valtio/utils";

export function useProxyState<T extends object>(
  initializer: T | (() => T),
  options?: Parameters<typeof useSnapshot>[1]
) {
  const [proxyState] = useState(() =>
    proxy(typeof initializer === "function" ? initializer() : initializer)
  );
  return useProxy(proxyState, options);
}
