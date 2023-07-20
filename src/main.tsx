import React from "react";
import ReactDOM from "react-dom/client";
import { App } from "./app.tsx";
import { initUser } from "./auth.ts";

declare module "valtio" {
  function useSnapshot<T extends object>(p: T): T;
  function useSnapshot<T extends object>(p: T, params: { sync?: boolean }): T;
}

initUser();

ReactDOM.createRoot(document.getElementById("root") as HTMLElement).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
