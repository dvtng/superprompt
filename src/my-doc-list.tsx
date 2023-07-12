import { useLiveQuery } from "dexie-react-hooks";
import { db } from "./db";
import { Text, Anchor, Stack } from "@mantine/core";
import { Link } from "react-router-dom";
import { PromptDocPreview } from "./prompt-doc-preview";

export function MyDocList() {
  const docs = useLiveQuery(() => db.docs.toArray(), []);
  if (!docs) {
    return null;
  }
  if (!docs.length) {
    return (
      <Text c="dimmed">
        Start by editing someone else's prompt, or{" "}
        <Anchor component={Link} to="new">
          create a new one
        </Anchor>{" "}
        from scratch.
      </Text>
    );
  }

  return (
    <Stack>
      {docs.map((doc) => (
        <PromptDocPreview key={doc.id} promptDoc={doc} />
      ))}
    </Stack>
  );
}