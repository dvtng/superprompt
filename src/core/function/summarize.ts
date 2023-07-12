import { FunctionContext } from "../function-spec";

export default {
  name: "summarize",
  dataTypes: ["file"],
  fn: async (context: FunctionContext, file: File) => {
    const [{ loadSummarizationChain }, { OpenAI }, { TextLoader }] =
      await Promise.all([
        import("langchain/chains"),
        import("langchain/llms/openai"),
        import("langchain/document_loaders/fs/text"),
      ]);

    const model = new OpenAI({
      openAIApiKey: context.apiKeyState.OPENAI,
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
