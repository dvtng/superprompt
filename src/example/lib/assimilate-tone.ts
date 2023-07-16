import { createExample } from "../create-example";

export default createExample({
  id: "assimilate-tone",
  title: "Assimilate tone",
  content: `
Describe the tone of the following text in one word. Choose between professional and casual:
{them}
{*tone}
Rewrite the following text in a {tone} tone:
{you}
`,
});
