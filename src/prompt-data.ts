import { keyBy } from "lodash";
import { EXAMPLE_PROMPTS } from "./example-prompt";
import { PromptDoc } from "./prompt-doc";

export const PROMPTS: Record<string, PromptDoc> = keyBy(
  [
    {
      id: "grade",
      title: "Grade exam question",
      content: EXAMPLE_PROMPTS.grade,
    },
    {
      id: "assimilate-tone",
      title: "Assimilate tone",
      content: EXAMPLE_PROMPTS.assimilateTone,
    },
    {
      id: "expert-panel",
      title: "Expert panel",
      content: EXAMPLE_PROMPTS.expertPanel,
    },
    {
      id: "character",
      title: "Character chat",
      content: EXAMPLE_PROMPTS.character,
    },
  ],
  "id"
);

export const TOP_PROMPTS: PromptDoc[] = Object.values(PROMPTS);
