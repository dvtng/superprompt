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
import { ApiKeyStateProvider, DocListProvider } from "./context";
import { AutoSync } from "./auto-sync";
import { ModalsProvider } from "@mantine/modals";

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
        theme={{
          colorScheme,
          primaryColor: "violet",
          headings: {
            fontFamily: "'Nunito', serif;",
          },
        }}
        withGlobalStyles
        withNormalizeCSS
      >
        <ModalsProvider>
          <DocListProvider>
            <ApiKeyStateProvider value={apiKeyState}>
              <AutoSync />
              <RouterProvider router={router} />
            </ApiKeyStateProvider>
          </DocListProvider>
        </ModalsProvider>
      </MantineProvider>
    </ColorSchemeProvider>
  );
}
