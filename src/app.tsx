import {
  ColorScheme,
  ColorSchemeProvider,
  MantineProvider,
} from "@mantine/core";
import { useLayoutEffect, useState } from "react";
import { router } from "./router";
import { RouterProvider } from "react-router-dom";
import { proxy } from "valtio";
import { loadApiKeyState } from "./core/api-key-state";
import { ApiKeyStateProvider, DocListProvider } from "./context";

export function App() {
  const [colorScheme, setColorScheme] = useState<ColorScheme>(() => {
    const colorSchemeQuery = matchMedia("(prefers-color-scheme: dark)");
    return colorSchemeQuery.matches ? "dark" : "light";
  });
  const toggleColorScheme = (value?: ColorScheme) =>
    setColorScheme(value || (colorScheme === "dark" ? "light" : "dark"));
  const [apiKeyState] = useState(() => proxy(loadApiKeyState()));

  const background = colorScheme === "dark" ? "#1A1A1E" : "#ebebea";
  useLayoutEffect(() => {
    document.body.style.background = background;
  });

  return (
    <ColorSchemeProvider
      colorScheme={colorScheme}
      toggleColorScheme={toggleColorScheme}
    >
      <MantineProvider
        theme={{
          colorScheme,
          colors: { background: [background] },
          primaryColor: "violet",
          headings: {
            fontFamily: "'Nunito', serif;",
          },
        }}
        withGlobalStyles
        withNormalizeCSS
      >
        <DocListProvider>
          <ApiKeyStateProvider value={apiKeyState}>
            <RouterProvider router={router} />
          </ApiKeyStateProvider>
        </DocListProvider>
      </MantineProvider>
    </ColorSchemeProvider>
  );
}
