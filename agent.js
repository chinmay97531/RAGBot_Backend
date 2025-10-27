// Taking Data -> Splitting the data -> Create embeddings -> Store in vector DB -> Create Agent with tools -> Query the agent

import { ChatAnthropic } from '@langchain/anthropic';
import { createReactAgent } from '@langchain/langgraph/prebuilt';
import { MemorySaver } from '@langchain/langgraph';
import { vectorStore, addYTVideoToVectorStore } from './embeddings.js';
import { getTranscript } from './data.js';

import { tool } from '@langchain/core/tools';
import { z } from 'zod';
import dotenv from 'dotenv';
dotenv.config();

// First Tool: Trigger YouTube Transcript Tool
const triggerYoutubeTranscriptTool = tool(async ({ video_url }) => {

    const urlObj = new URL(video_url);
    const video_id = urlObj.searchParams.get('v');
    if (!video_id) {
        return `Invalid YouTube URL provided.`;
    }

    const transcriptData = await getTranscript(video_id);
    if (transcriptData) {
        await addYTVideoToVectorStore(transcriptData, video_id);
        console.log(`Transcript for video ID ${video_id} added to vector store. Use the tool only if the video is not already added.`);
        return `Transcript for video has been added to the vector store.`;
    } else {
        return `Failed to retrieve transcript for video ID ${video_id}.`;
    }
  },
  {
    name: 'trigger_youtube_transcript_tool',
    description: 'Fetches the transcript of a YouTube video given its video URL and get its video Id from that and then adds it to the vector store for future retrieval.',
    schema: z.object({
        video_url: z.string(),
    }),
});

// Second Tool: Retrieve relevant chunks from vector store
const retrieveTool = tool(
  async ({ query, video_id}, {configurable: {}}) => {

    const retrievedDocs = await vectorStore.similaritySearch(query, 3, {
      video_id,
    });

    const serializedDocs = retrievedDocs.map((doc, idx) => `Document ${idx + 1}:\n${doc.pageContent}`).join('\n\n');

    return serializedDocs;
  },
  {
    name: 'retrieve',
    description: 'Retrieve the most relevant chunks from the transcript for a specific YouTube video.',
    schema: z.object({
      query: z.string(),
      video_id: z.string().describe('The ID of the YouTube video to retrieve the transcript for.'),
    }),
  }
);

// Third Tool: Retrieve similar videos from vector store
const retrieveSimilarVideosTool = tool(
  async ({ query}, {configurable: {}}) => {

    const retrievedDocs = await vectorStore.similaritySearch(query, 3);

    const ids = retrievedDocs.map(doc => doc.metadata.video_id).join('\n');

    return ids;
  },
  {
    name: 'retrieve',
    description: 'Retrieve the ids of the most relevant YouTube videos based on the query.',
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

export const agent = createReactAgent({ 
   llm,
   tools: [retrieveTool, triggerYoutubeTranscriptTool, retrieveSimilarVideosTool],
   checkpointer,
 });