import { PromptDoc } from "../prompt-doc";
import { Anchor, Title, Text } from "@mantine/core";
import { Link } from "react-router-dom";
import { getEditorBgColor } from "../color";

export function DocPreview({
  promptDoc,
  isActive = false,
}: {
  promptDoc: PromptDoc;
  isActive?: boolean;
}) {
  return (
    <Anchor
      component={Link}
      to={`/prompt/${promptDoc.id}`}
      sx={(theme) => ({
        background: isActive ? getEditorBgColor(theme) : undefined,
        borderRadius: theme.radius.sm,
        color: "inherit",
        display: "block",
        margin: "0 -1rem",
        padding: "0.75rem 1rem",
        transition: "all 200ms",
        ":hover": {
          background: isActive
            ? getEditorBgColor(theme)
            : theme.colorScheme === "dark"
            ? "rgba(255, 255, 255, 0.05)"
            : "rgba(0, 0, 0, 0.05)",
          textDecoration: "none",
        },
      })}
    >
      {promptDoc.title ? (
        <Title order={4} style={{ marginBottom: "0.2rem" }}>
          {promptDoc.title}
        </Title>
      ) : null}
      <Text lineClamp={2} sx={{ opacity: 0.8 }}>
        {promptDoc.content}
      </Text>
    </Anchor>
  );
}
