// Taking Data -> Splitting the data -> Create embeddings -> Store in vector DB -> Create Agent with tools -> Query the agent

import { ChatAnthropic } from '@langchain/anthropic';
import { createReactAgent } from '@langchain/langgraph/prebuilt';
import { MemorySaver } from '@langchain/langgraph';
import { vectorStore, addYTVideoToVectorStore } from './embeddings.js';

import data from './data.js';
import { tool } from '@langchain/core/tools';
import { z } from 'zod';
import dotenv from 'dotenv';
dotenv.config();

// await addYTVideoToVectorStore(data.text);

const retrieveTool = tool(
  async ({ query }) => {

    const retrievedDocs = await vectorStore.similaritySearch(query, 3);

    const serializedDocs = retrievedDocs.map((doc, idx) => `Document ${idx + 1}:\n${doc.pageContent}`).join('\n\n');

    return serializedDocs;
  },
  {
    name: 'retrieve',
    description: 'Retrieve the most relevant chunks from the transcript of a YouTube video.',
    schema: z.object({
      query: z.string(),
    }),
  }
);

const llm = new ChatAnthropic({
    model: "claude-3-5-haiku-latest",
    apiKey: process.env.ANTHROPIC_API_KEY,
});


const checkpointer = new MemorySaver();

const agent = createReactAgent({ 
   llm,
   tools: [retrieveTool],
   checkpointer,
 });

console.log('Q1: Name all the races held in f1 in 2024 that you know?');
const results = await agent.invoke({
    messages: [
        {
            role: 'user',
            content:  'Name all the races held in f1 in 2024 that you know?',
        },
    ],
}, { configurable: { thread_id: 1 } });

console.log(results.messages.at(-1)?.content);
