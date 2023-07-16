import { createExample } from "../create-example";

export default createExample({
  id: "grade",
  title: "Grade exam question",
  content: `
You are an expert in {topic}.
You are grading a student's exam.
In the exam, the student was asked: {question}.
They responded with: {answer}.
Please grade the student's response on a scale of 1 to 5.
Please format it as follows:
Grade: [1-5]
Explanation: [your explanation]
`,
});
