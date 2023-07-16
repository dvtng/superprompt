import { Divider, Stack, Text } from "@mantine/core";
import { ExampleDocList } from "./example-doc-list";

export function PromptEditorStarters() {
  return (
    <Stack sx={{ padding: "2rem" }}>
      <Text>Or, start with one of these example prompts:</Text>
      <Divider />
      <ExampleDocList size="sm" />
    </Stack>
  );
}
