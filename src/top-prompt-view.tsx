import { Stack } from "@mantine/core";
import { PromptDocPreview } from "./prompt-doc-preview";
import { TOP_PROMPTS } from "./prompt-data";

export function TopPromptView() {
  return (
    <Stack>
      {TOP_PROMPTS.map((promptDoc) => (
        <PromptDocPreview key={promptDoc.id} promptDoc={promptDoc} />
      ))}
    </Stack>
  );
}
