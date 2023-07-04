import { useMantineTheme } from "@mantine/core";

export function Divider({ h = false }: { h?: boolean }) {
  const theme = useMantineTheme();
  const color =
    theme.colorScheme === "dark"
      ? "rgba(255, 255, 255, 0.05)"
      : "rgba(0, 0, 0, 0.07)";
  const orientationStyles = h
    ? { width: "100%", height: 1 }
    : { height: "100%", width: 1 };

  return <div style={{ background: color, ...orientationStyles }} />;
}
