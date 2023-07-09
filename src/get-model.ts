import { OpenAI } from "langchain/llms/openai";
import { getOpenAIKey } from "./app-state";

export function getModel() {
  return new OpenAI({
    openAIApiKey: getOpenAIKey(),
    modelName: "gpt-3.5-turbo",
    temperature: 0.5,
  });
}
