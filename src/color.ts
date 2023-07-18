import { MantineTheme, useMantineTheme } from "@mantine/core";
import { useLayoutEffect } from "react";

export function getBodyBgColor(theme: MantineTheme) {
  return theme.colorScheme === "dark" ? "#1A1A1E" : "#e2e2de";
}

export function useSetBodyStyles() {
  const theme = useMantineTheme();
  useLayoutEffect(() => {
    document.body.style.background = getBodyBgColor(theme);
  }, [theme]);
}

export function getLayerBgColor(theme: MantineTheme) {
  return theme.colorScheme === "dark" ? theme.colors.dark[6] : "#f8f8f6";
}

export function getEditorBgColor(theme: MantineTheme) {
  return theme.colorScheme === "dark" ? theme.colors.dark[5] : theme.white;
}

export function getOverlayColor(theme: MantineTheme) {
  return theme.colorScheme === "dark" ? "#00000099" : "#00000033";
}
