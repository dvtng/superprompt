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
import { HideOnMobile } from "./hide-on-mobile";
import { OpenHelpModalButton } from "./help-modal";

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
            <Flex align="center" gap="1rem">
              <AppHomeLink />
            </Flex>
            <Flex gap="md" align="center">
              <Button
                component={Link}
                to="/new"
                leftIcon={<IconPlus size="1.1rem" />}
                variant="outline"
              >
                New
              </Button>
              <Flex gap="xs" align="center">
                <OpenHelpModalButton />
                <HideOnMobile>
                  <ColorSchemeToggle />
                </HideOnMobile>
              </Flex>
            </Flex>
          </Flex>
        </Header>
      }
    >
      <Outlet />
    </MantineAppShell>
  );
}
