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
};
