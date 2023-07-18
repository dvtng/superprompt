import { Flex } from "@mantine/core";
import { AppHomeLink } from "./app-home-link";
import { ColorSchemeToggle } from "./color-scheme-toggle";
import { OpenHelpModalButton } from "./help-modal";
import { HideOnMobile } from "./hide-on-mobile";
import { BetaSignUpButton } from "./beta-sign-up-form";

export function AppHeader() {
  return (
    <Flex align="center" justify="space-between" style={{ height: "100%" }}>
      <Flex align="center" gap="1rem">
        <AppHomeLink />
      </Flex>
      <Flex gap="md" align="center">
        <BetaSignUpButton />
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
