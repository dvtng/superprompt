import { Flex, Header, AppShell as MantineAppShell } from "@mantine/core";
import { Outlet, useLocation } from "react-router-dom";
import { ColorSchemeToggle } from "./color-scheme-toggle";
import { AppHomeLink } from "./app-home-link";
import { HideOnMobile } from "./hide-on-mobile";
import { OpenHelpModalButton } from "./help-modal";
import { getBodyBgColor, useSetBodyStyles } from "./color";

export function AppShell() {
  const location = useLocation();
  const maxWidth = location.pathname === "/" ? 1000 : "100%";
  useSetBodyStyles();

  return (
    <MantineAppShell
      styles={{
        main: { height: "100vh", margin: "auto", maxWidth },
      }}
      header={
        <Header
          height={60}
          p="md"
          withBorder={false}
          sx={(theme) => ({
            background: getBodyBgColor(theme),
            margin: "auto",
            maxWidth,
            transition: "0.3s max-width ease-in-out",
          })}
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
