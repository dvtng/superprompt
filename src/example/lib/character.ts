import { createExample } from "../create-example";

export default createExample({
  id: "character",
  title: "AI character",
  content: `
Consider the following excerpts:
---
{book:query(question)}
---
Pretend to be the character {character_name} from the above excerpts.
I'm going to ask you questions and I want you to respond as {character_name} would.
Take care to mimic their personality and mannerisms.
Let's start.
{question}
`,
});
