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
      id: "experts",
      title: "Ask the experts",
      content: EXAMPLE_PROMPTS.expertPanel,
    },
    {
      id: "assimilate-tone",
      title: "Assimilate tone",
      content: EXAMPLE_PROMPTS.assimilateTone,
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
