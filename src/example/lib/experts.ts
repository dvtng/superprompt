import { createExample } from "../create-example";

export default createExample({
  id: "experts",
  title: "Panel of experts",
  content: `
Name 3 experts who would be great at answering the following question. Choose people who might have conflicting views with each other.
{question}
{*}
Now answer the question as each of the above experts.
{*}
You are an intelligent observer who has carefully considered the expert responses. Give a concise and definitive answer to the question. Don't repeat what the experts said, but instead give your own opinion. You prefer to give decisive and single-sentence answers, even if it could be wrong.
`,
});
