import { ActionIcon, useMantineColorScheme } from "@mantine/core";
import { IconMoon, IconSun } from "@tabler/icons-react";

export function ColorSchemeToggle() {
  const { colorScheme, toggleColorScheme } = useMantineColorScheme();
  return (
    <ActionIcon onClick={() => toggleColorScheme()}>
      {colorScheme === "dark" ? (
        <IconSun size="1.3rem" />
      ) : (
        <IconMoon size="1.3rem" />
      )}
    </ActionIcon>
  );
}
