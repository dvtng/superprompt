import { Header, AppShell as MantineAppShell } from "@mantine/core";
import { Outlet, useLocation } from "react-router-dom";
import { getBodyBgColor, useSetBodyStyles } from "./color";
import { AppHeader } from "./app-header";

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
          <AppHeader />
        </Header>
      }
    >
      <Outlet />
    </MantineAppShell>
  );
}
