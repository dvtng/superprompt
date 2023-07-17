import { MantineTheme } from "@mantine/core";

export function getLayerBgColor(theme: MantineTheme) {
  return theme.colorScheme === "dark" ? theme.colors.dark[6] : "#f9f9f9";
}

export function getEditorBgColor(theme: MantineTheme) {
  return theme.colorScheme === "dark" ? theme.colors.dark[5] : theme.white;
}

export function getOverlayColor(theme: MantineTheme) {
  return theme.colorScheme === "dark" ? "#00000099" : "#00000033";
}
