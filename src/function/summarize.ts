import { loadSummarizationChain } from "langchain/chains";
import { OpenAI } from "langchain/llms/openai";
import { getOpenAiKey } from "../api-key";
import { TextLoader } from "langchain/document_loaders/fs/text";

export default {
  name: "summarize",
  dataTypes: ["file"],
  fn: async (file: File) => {
    const model = new OpenAI({
      openAIApiKey: getOpenAiKey(),
      modelName: "gpt-3.5-turbo",
      temperature: 0,
    });
    const chain = loadSummarizationChain(model, { type: "map_reduce" });
    const loader = new TextLoader(file);
    const docs = await loader.loadAndSplit();
    console.log(`Summarizing ${docs.length} documents`);
    const res = await chain.call({
      input_documents: docs,
    });
    return res.text;
  },
};
