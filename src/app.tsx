import {
  ColorScheme,
  ColorSchemeProvider,
  MantineProvider,
} from "@mantine/core";
import { useState } from "react";
import { router } from "./router";
import { RouterProvider } from "react-router-dom";
import { proxy } from "valtio";
import { loadApiKeyState } from "./core/api-key-state";
import { ApiKeyStateProvider } from "./context";

export function App() {
  const [colorScheme, setColorScheme] = useState<ColorScheme>(() => {
    const colorSchemeQuery = matchMedia("(prefers-color-scheme: dark)");
    return colorSchemeQuery.matches ? "dark" : "light";
  });
  const toggleColorScheme = (value?: ColorScheme) =>
    setColorScheme(value || (colorScheme === "dark" ? "light" : "dark"));
  const [apiKeyState] = useState(() => proxy(loadApiKeyState()));

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
        <ApiKeyStateProvider value={apiKeyState}>
          <RouterProvider router={router} />
        </ApiKeyStateProvider>
      </MantineProvider>
    </ColorSchemeProvider>
  );
}
