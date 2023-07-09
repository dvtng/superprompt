import { ApiKeyState } from "./api-key-state";

export const DATA_TYPES = ["string", "file"] as const;

export type DataType = (typeof DATA_TYPES)[number];

export type FunctionSpec = {
  name: string;
  dataTypes: DataType[];
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  fn: (context: FunctionContext, ...args: any[]) => Promise<string>;
};

export type FunctionContext = {
  apiKeyState: ApiKeyState;
};
