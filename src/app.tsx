import {
  ColorScheme,
  ColorSchemeProvider,
  MantineProvider,
} from "@mantine/core";
import { useState } from "react";
import { router } from "./router";
import { RouterProvider } from "react-router-dom";

export function App() {
  const [colorScheme, setColorScheme] = useState<ColorScheme>(() => {
    const colorSchemeQuery = matchMedia("(prefers-color-scheme: dark)");
    return colorSchemeQuery.matches ? "dark" : "light";
  });
  const toggleColorScheme = (value?: ColorScheme) =>
    setColorScheme(value || (colorScheme === "dark" ? "light" : "dark"));

  return (
    <ColorSchemeProvider
      colorScheme={colorScheme}
      toggleColorScheme={toggleColorScheme}
    >
      <MantineProvider
        theme={{ colorScheme, primaryColor: "violet" }}
        withGlobalStyles
        withNormalizeCSS
      >
        <RouterProvider router={router} />
      </MantineProvider>
    </ColorSchemeProvider>
  );
}
