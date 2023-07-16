import { Stack } from "@mantine/core";
import { PromptDocPreview } from "./prompt-doc-preview";
import EXAMPLE_GRADE from "./example/lib/grade";
import EXAMPLE_EXPERTS from "./example/lib/experts";
import EXAMPLE_ASSIMILATE_TONE from "./example/lib/assimilate-tone";
import EXAMPLE_CHARACTER from "./example/lib/character";
import EXAMPLE_AGENT from "./example/lib/agent";

const EXAMPLES = [
  EXAMPLE_GRADE,
  EXAMPLE_EXPERTS,
  EXAMPLE_ASSIMILATE_TONE,
  EXAMPLE_CHARACTER,
  EXAMPLE_AGENT,
];

export function ExampleDocList() {
  return (
    <Stack>
      {EXAMPLES.map((promptDoc) => (
        <PromptDocPreview key={promptDoc.id} promptDoc={promptDoc} />
      ))}
    </Stack>
  );
}
