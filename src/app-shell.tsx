import {
  Button,
  Flex,
  Header,
  AppShell as MantineAppShell,
  useMantineTheme,
} from "@mantine/core";
import { Link, Outlet } from "react-router-dom";
import { ColorSchemeToggle } from "./color-scheme-toggle";
import { IconPlus } from "@tabler/icons-react";
import { AppHomeLink } from "./app-home-link";

const positioningStyles = {
  maxWidth: 1200,
  margin: "auto",
};

export function AppShell() {
  const theme = useMantineTheme();

  return (
    <MantineAppShell
      styles={{
        main: {
          ...positioningStyles,
          height: "100vh",
        },
      }}
      header={
        <Header
          height={60}
          p="md"
          withBorder={false}
          style={{
            ...positioningStyles,
            background: theme.colors.background[0],
          }}
        >
          <Flex
            align="center"
            justify="space-between"
            style={{ height: "100%" }}
          >
            <AppHomeLink />
            <Flex gap="md" align="center">
              <Button
                component={Link}
                to="/new"
                leftIcon={<IconPlus />}
                variant="default"
              >
                New
              </Button>
              <ColorSchemeToggle />
            </Flex>
          </Flex>
        </Header>
      }
    >
      <Outlet />
    </MantineAppShell>
  );
}
