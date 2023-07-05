import { keyBy } from "lodash";
import { EXAMPLE_PROMPTS } from "./example-prompt";
import { PromptDoc } from "./prompt-doc";

export const PROMPTS: Record<string, PromptDoc> = keyBy(
  [
    {
      id: "character",
      title: "Book Character",
      content: EXAMPLE_PROMPTS.character,
    },
  ],
  "id"
);

export const TOP_PROMPTS: PromptDoc[] = [PROMPTS.character];
