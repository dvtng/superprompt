import { Anchor, Flex } from "@mantine/core";
import { Link } from "react-router-dom";
import { HideOnMobile } from "./hide-on-mobile";

export function AppHomeLink() {
  return (
    <Anchor
      component={Link}
      to="/"
      sx={(theme) => ({
        color:
          theme.colorScheme === "dark"
            ? theme.colors.gray[5]
            : theme.colors.gray[7],
        fontWeight: 500,
        ":hover": {
          color: theme.colorScheme === "dark" ? theme.colors.gray[0] : "#000",
          textDecoration: "none",
        },
      })}
    >
      <Flex align="center" gap="0.25rem">
        <svg width="24px" height="24px" viewBox="0 0 24 24">
          <path
            d="M13.6138 2.30996C13.8904 2.42774 14.07 2.69935 14.07 3.00002V9.99821H18C18.2667 9.99821 18.5133 10.1398 18.6478 10.3702C18.7822 10.6005 18.7842 10.885 18.653 11.1172L18.1609 11.988C16.2948 15.2907 13.9149 18.2753 11.1106 20.8298L10.3151 21.5545C10.0955 21.7545 9.7786 21.8061 9.50693 21.6861C9.23526 21.566 9.06 21.297 9.06 21V14.0612H5C4.58579 14.0612 4.25 13.7254 4.25 13.3112C4.25 13.177 4.28523 13.0511 4.34693 12.9421C6.10572 9.69066 8.3575 6.73119 11.0222 4.16896L12.8002 2.45939C13.0169 2.251 13.3371 2.19218 13.6138 2.30996ZM6.28458 12.5612H9.81C10.2242 12.5612 10.56 12.8969 10.56 13.3112V19.2945C12.9786 17.009 15.0517 14.3827 16.7134 11.4982H13.32C12.9058 11.4982 12.57 11.1624 12.57 10.7482V4.76164L12.0619 5.25021C9.8111 7.41442 7.86782 9.87444 6.28458 12.5612Z"
            fill="currentColor"
          />
        </svg>
        <HideOnMobile>superprompt</HideOnMobile>
      </Flex>
    </Anchor>
  );
}
