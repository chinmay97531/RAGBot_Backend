// import { OpenAIEmbeddings } from "langchain/embeddings/openai";
// import { MemoryVectorStore } from "langchain/vectorstores/memory";
// import dotenv from "dotenv";
// import { Embeddings } from "@langchain/core/embeddings";

// dotenv.config();

// const embeddings = new OpenAIEmbeddings({
//   openAIApiKey: process.env.OPENAI_API_KEY,
// });

// const store = await MemoryVectorStore.fromTexts(
//   [
//     "Einstein developed the theory of relativity.",
//     "The capital of France is Paris.",
//     "LangChain helps build LLM-based apps easily.",
//   ],
//   [{ id: 1 }, { id: 2 }, { id: 3 }],
//   embeddings
// );

// const result = await store.similaritySearch("Where did Einstein work?", 2);
// console.log(result);


// In Embeddings.js
// import { MemoryVectorStore } from "langchain/vectorstores/memory";
// import { Chroma } from "@langchain/community/vectorstores/chroma";