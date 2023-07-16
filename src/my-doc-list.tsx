import { Text, Anchor, Box } from "@mantine/core";
import { Link } from "react-router-dom";
import { PromptDocPreview } from "./prompt-doc-preview";
import { useDocList } from "./context";

export function MyDocList() {
  const docs = useDocList();
  if (!docs) {
    return null;
  }
  if (!docs.length) {
    return (
      <Text c="dimmed">
        Start with one of the provided examples, or{" "}
        <Anchor component={Link} to="new">
          create a new one
        </Anchor>{" "}
        from scratch.
      </Text>
    );
  }

  return (
    <Box>
      {docs.map((doc) => (
        <PromptDocPreview key={doc.id} promptDoc={doc} />
      ))}
    </Box>
  );
}
