import { Flex } from "@mantine/core";
import { AppHomeLink } from "./app-home-link";
import { ColorSchemeToggle } from "./color-scheme-toggle";
import { OpenHelpModalButton } from "./help-modal";
import { HideOnMobile } from "./hide-on-mobile";
import { SignInButton } from "./sign-in-button";
import { appState } from "./app-state";
import { useSnapshot } from "valtio";
import { UserMenu } from "./user-menu";

export function AppHeader() {
  const _appState = useSnapshot(appState);

  return (
    <Flex align="center" justify="space-between" style={{ height: "100%" }}>
      <Flex align="center" gap="1rem">
        <AppHomeLink />
      </Flex>
      <Flex gap="md" align="center">
        {_appState.user ? <UserMenu /> : <SignInButton />}
        <Flex gap="xs" align="center">
          <OpenHelpModalButton />
          <HideOnMobile>
            <ColorSchemeToggle />
          </HideOnMobile>
        </Flex>
      </Flex>
    </Flex>
  );
}
