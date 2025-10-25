import { OpenAIEmbeddings } from '@langchain/openai';
// import { MemoryVectorStore } from "langchain/vectorstores/memory";
// import { Chroma } from "@langchain/community/vectorstores/chroma";
import { PGVectorStore } from "@langchain/community/vectorstores/pgvector";
import { RecursiveCharacterTextSplitter } from '@langchain/textsplitters';
import { Document } from "@langchain/core/documents";

import dotenv from 'dotenv';
dotenv.config();

const embeddings = new OpenAIEmbeddings({
    model: "text-embedding-3-small",
    openAIApiKey: process.env.OPENAI_API_KEY,
});

export const vectorStore = await PGVectorStore.initialize(embeddings, {
    postgresConnectionOptions: {
        connectionString: process.env.DATABASE_API_KEY,
    },
    tableName: "transcripts",
    columns: {
        idColumnName: 'id',
        vectorColumnName: 'vector',
        contentColumnName: 'content',
        metadataColumnName: 'metadata',
    },
    distanceStrategy: 'cosine',
});


export const addYTVideoToVectorStore = async (data) => {
    const docs = [
        new Document({ pageContent: data }),
    ];

    const splitter = new RecursiveCharacterTextSplitter({
        chunkSize: 1000,
        chunkOverlap: 200,
    });

    const chunks = await splitter.splitDocuments(docs);

    await vectorStore.addDocuments(chunks);
}