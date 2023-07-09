import { keyBy } from "lodash";
import { EXAMPLE_PROMPTS } from "./example-prompt";
import { PromptDoc } from "./prompt-doc";

export const PROMPTS: Record<string, PromptDoc> = keyBy(
  [
    {
      id: "character",
      title: "Book character",
      content: EXAMPLE_PROMPTS.character,
    },
    {
      id: "grade",
      title: "Grade an exam question",
      content: EXAMPLE_PROMPTS.grade,
    },
    {
      id: "expert-panel",
      title: "Expert panel",
      content: EXAMPLE_PROMPTS.expertPanel,
    },
  ],
  "id"
);

export const TOP_PROMPTS: PromptDoc[] = Object.values(PROMPTS);
