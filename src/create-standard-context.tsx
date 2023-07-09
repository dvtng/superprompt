import { ReactNode, createContext, useContext } from "react";

export function createStandardContext<T extends object>(debugName: string) {
  const Context = createContext<T | null>(null);

  const Provider = function ({
    value,
    children,
  }: {
    value: T;
    children: ReactNode;
  }) {
    return <Context.Provider value={value}>{children}</Context.Provider>;
  };

  const useValue = (): T => {
    const value = useContext(Context);
    if (!value) {
      throw new Error(
        `Context hook for ${debugName} must be wrapped in a matching Provider`
      );
    }
    return value;
  };

  return [Provider, useValue] as const;
}
