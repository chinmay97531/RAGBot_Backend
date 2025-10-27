# 🧠 RAG Bot with YouTube Integration (Backend)

This project powers an **AI chatbot that can understand and answer questions about YouTube videos**.  
It automatically:
1. Fetches video transcripts from YouTube via the **ScrapingBee API**
2. Splits and embeds the transcript using **OpenAI embeddings**
3. Stores the embeddings in a **Neon Console**
4. Creates an **intelligent agent** (via LangGraph + Anthropic Claude) that can:
   - Fetch video transcripts dynamically  
   - Retrieve relevant context  
   - Answer natural language queries about the video  

---

## 🚀 Features

- 🧩 **LangChain + LangGraph Agent**
- 🎥 **YouTube transcript fetching** (via ScrapingBee)
- 🧠 **OpenAI Embeddings** for semantic search
- 💾 **Neon vector Database** for persistent vector storage
- 🤖 **Anthropic Claude 3.5 Haiku** as the reasoning LLM
- 🔍 **Retrieval-based Question Answering**
- ⚙️ **Express.js REST API** for frontend integration

---

## ⚙️ Environment Variables

Create a `.env` file in the root directory with the following keys:

```bash
# OpenAI API key (for embeddings)
OPENAI_API_KEY=your_openai_api_key

# Anthropic API key (for the Claude model)
ANTHROPIC_API_KEY=your_anthropic_api_key

# ScrapingBee API key (for fetching YouTube transcripts)
SCRAPINGBEE_API_KEY=your_scrapingbee_api_key

# PostgreSQL connection URL with pgvector enabled
DATABASE_API_KEY=postgres://username:password@host:port/dbname


# 1️⃣ Clone the repository
git clone https://github.com/<your-username>/AIChatBotWithYoutube.git
cd AIChatBotWithYoutube/server

# 2️⃣ Install dependencies
npm install

# 3️⃣ Start the backend server
npm run dev

# Your server should now be running at:
http://localhost:3000

# Access the Frintend from
https://github.com/chinmay97531/RAGBot_Frontend
