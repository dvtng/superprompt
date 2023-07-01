import { OpenAIEmbeddings } from "langchain/embeddings/openai";
import { getOpenAiKey } from "../api-key";
import { TextLoader } from "langchain/document_loaders/fs/text";
import { MemoryVectorStore } from "langchain/vectorstores/memory";

export default {
  name: "query",
  dataTypes: ["file"],
  fn: async (file: File, question: string) => {
    // Create the models
    const openAIApiKey = getOpenAiKey();
    const embeddings = new OpenAIEmbeddings({ openAIApiKey });

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
