import { useLiveQuery } from "dexie-react-hooks";
import { db } from "./db";
import { Text, Anchor, Stack } from "@mantine/core";
import { Link } from "react-router-dom";
import { PromptDocPreview } from "./prompt-doc-preview";

export function MyDocList() {
  const docs = useLiveQuery(
    () => db.docs.orderBy("updatedAt").reverse().toArray(),
    []
  );
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
    <Stack>
      {docs.map((doc) => (
        <PromptDocPreview key={doc.id} promptDoc={doc} />
      ))}
    </Stack>
  );
}
