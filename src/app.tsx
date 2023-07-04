import {
  AppShell,
  ColorScheme,
  ColorSchemeProvider,
  Header,
  MantineProvider,
} from "@mantine/core";
import { PromptView } from "./prompt-view";
import { useState } from "react";

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
        theme={{ colorScheme }}
        withGlobalStyles
        withNormalizeCSS
      >
        <AppShell
          header={
            <Header height={60} p="md" withBorder={false}>
              <strong>ULTRA:PROMPT</strong>
            </Header>
          }
        >
          <PromptView />
        </AppShell>
      </MantineProvider>
    </ColorSchemeProvider>
  );
}
