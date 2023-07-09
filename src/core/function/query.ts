import { OpenAIEmbeddings } from "langchain/embeddings/openai";
import { TextLoader } from "langchain/document_loaders/fs/text";
import { MemoryVectorStore } from "langchain/vectorstores/memory";
import { FunctionContext } from "../function-spec";

export default {
  name: "query",
  dataTypes: ["file"],
  fn: async (context: FunctionContext, file: File, question: string) => {
    // Create the models
    const embeddings = new OpenAIEmbeddings({
      openAIApiKey: context.apiKeyState.OPENAI,
    });

    // Load the documents and create the vector store
    const loader = new TextLoader(file);
    const docs = await loader.loadAndSplit();
    const store = await MemoryVectorStore.fromDocuments(docs, embeddings);
    console.log(`Querying ${docs.length} documents`);

    // Select the relevant documents
    const relevantDocs = await store.similaritySearch(question);
    const text = relevantDocs.reduce((acc, doc) => {
      return acc + doc.pageContent + "\n";
    }, "");

    return text;
  },
};
