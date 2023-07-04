import {
  AppShell,
  ColorScheme,
  ColorSchemeProvider,
  Flex,
  Header,
  MantineProvider,
} from "@mantine/core";
import { PromptView } from "./prompt-view";
import { useState } from "react";
import { ColorSchemeToggle } from "./color-scheme-toggle";

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
        <AppShell
          header={
            <Header height={60} p="md" withBorder={false}>
              <Flex align="center" justify="space-between">
                <strong style={{ letterSpacing: 1 }}>{"{superprompt}"}</strong>
                <ColorSchemeToggle />
              </Flex>
            </Header>
          }
        >
          <PromptView />
        </AppShell>
      </MantineProvider>
    </ColorSchemeProvider>
  );
}
