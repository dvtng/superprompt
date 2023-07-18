import { Box, Divider, Stack, Text } from "@mantine/core";
import { ExampleDocList } from "./example-doc-list";

export function EditorPlaceholder() {
  return (
    <Stack sx={{ height: "100%" }}>
      <Text c="dimmed">Start typing...</Text>
      <Divider sx={{ marginTop: "1rem" }} />
      <Text sx={{ opacity: 0.5, pointerEvents: "none" }}>
        Or, start with one of these example prompts:
      </Text>
      <Box
        sx={{
          paddingBottom: "1rem",
          "> *": {
            opacity: 0.5,
            ":hover": {
              opacity: 1,
            },
          },
        }}
      >
        <ExampleDocList />
      </Box>
    </Stack>
  );
}
