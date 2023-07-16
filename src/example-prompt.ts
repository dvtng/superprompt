export const EXAMPLE_PROMPTS: Record<string, string> = {
  character: `
Consider the following excerpts:
---
{book:query(question)}
---
Pretend to be the character {character_name} from the above excerpts.
I'm going to ask you questions and I want you to respond as {character_name} would.
Take care to mimic their personality and mannerisms.
Let's start.
{question}
`.trim(),
  grade: `
You are an expert in {topic}.
You are grading a student's exam.
In the exam, the student was asked: {question}.
They responded with: {answer}.
Please grade the student's response on a scale of 1 to 5.
Please format it as follows:
Grade: [1-5]
Explanation: [your explanation]
`.trim(),
  expertPanel: `
Name 3 experts who would be great at answering the following question. Choose people who might have conflicting views with each other.
{question}
{*}
Now answer the question as each of the above experts.
{*}
You are an intelligent observer who has carefully considered the expert responses. Give a concise and definitive answer to the question. Don't repeat what the experts said, but instead give your own opinion. You prefer to give decisive and single-sentence answers, even if it could be wrong.
`.trim(),
  assimilateTone: `
Describe the tone of the following text in one word. Choose between professional and casual:
{them}
{*tone}
Rewrite the following text in a {tone} tone:
{you}
`.trim(),
  agent: `
@temperature 0
You are a chat assistant. When you are asked a question you perform the following steps in a loop:
- Plan: Create a step by step list of the remaining steps required to reach the answer. Make the steps as granular as possible.
- Action: use one of the available tools. The tool call must be surrounded by curly braces. Do not nest tool calls within each other.
- WAIT: do not output anything or continue past this step until I provide the output of the tool.
- Observation: describe your observations of the output.
Tools:
weather(latitude: string, longitude: string): gives current weather information for the given location. Temperature unit is celsius and distance unit is km.
now(): gives the current time
location(): gives the coordinates of the user's location
math(expression: string): evaluates a math expression
Respond in the following format:
Plan: [steps]
Action: \\{action()}
{question}
`.trim(),
};
