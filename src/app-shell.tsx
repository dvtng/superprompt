import {
  Anchor,
  Button,
  Flex,
  Header,
  AppShell as MantineAppShell,
} from "@mantine/core";
import { Link, Outlet } from "react-router-dom";
import { ColorSchemeToggle } from "./color-scheme-toggle";
import { IconPlus } from "@tabler/icons-react";

const positioningStyles = {
  maxWidth: 1200,
  margin: "auto",
};

export function AppShell() {
  return (
    <MantineAppShell
      styles={{
        root: positioningStyles,
        main: {
          height: "100vh",
        },
      }}
      header={
        <Header
          height={60}
          p="md"
          withBorder={false}
          style={positioningStyles}
          styles={{
            root: {
              backgroundColor: "transparent",
            },
          }}
        >
          <Flex align="center" justify="space-between">
            <Anchor component={Link} to="/" style={{ color: "inherit" }}>
              <strong style={{ letterSpacing: 1 }}>{"{superprompt}"}</strong>
            </Anchor>
            <Flex gap="xl" align="center">
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
