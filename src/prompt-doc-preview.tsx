import { PromptDoc } from "./prompt-doc";
import { Anchor, Title, Text, TitleOrder } from "@mantine/core";
import { Link } from "react-router-dom";

export type DocPreviewSize = "sm" | "md";

const sizes: Record<string, { titleOrder: TitleOrder; lineClamp: number }> = {
  sm: {
    titleOrder: 4,
    lineClamp: 2,
  },
  md: {
    titleOrder: 3,
    lineClamp: 2,
  },
};

export function PromptDocPreview({
  promptDoc,
  size = "md",
}: {
  promptDoc: PromptDoc;
  size?: DocPreviewSize;
}) {
  const { titleOrder, lineClamp } = sizes[size] ?? sizes.md;

  return (
    <Anchor
      component={Link}
      to={`/prompt/${promptDoc.id}`}
      sx={(theme) => ({
        borderRadius: theme.radius.sm,
        color: "inherit",
        display: "block",
        margin: "0 -1rem",
        padding: "0.75rem 1rem",
        transition: "all 200ms",
        ":hover": {
          background:
            theme.colorScheme === "dark"
              ? "rgba(255, 255, 255, 0.05)"
              : "rgba(0, 0, 0, 0.05)",
          textDecoration: "none",
        },
      })}
    >
      {promptDoc.title ? (
        <Title order={titleOrder} style={{ marginBottom: "0.2rem" }}>
          {promptDoc.title}
        </Title>
      ) : null}
      <Text lineClamp={lineClamp} sx={{ opacity: 0.8 }}>
        {promptDoc.content}
      </Text>
    </Anchor>
  );
}
