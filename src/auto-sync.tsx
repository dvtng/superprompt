import { useSnapshot } from "valtio";
import { appState } from "./app-state";
import { useEffect } from "react";
import { sync } from "./sync";

export function AutoSync() {
  const { user } = useSnapshot(appState);

  useEffect(() => {
    if (user?.id) {
      sync();
    }
  }, [user?.id]);

  useEffect(() => {
    function onFocus() {
      sync();
    }
    window.addEventListener("focus", onFocus);
    return () => {
      window.removeEventListener("focus", onFocus);
    };
  }, []);

  return null;
}
