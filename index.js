import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { agent } from './agent.js';

dotenv.config();

const app = express();
const PORT = Number(process.env.PORT);
app.use(express.json({ limit: '200mb' }));
app.use(cors());

app.get('/', (req, res) => {
    res.send('AI Chat Bot with YouTube Videos is running!');
});

app.post('/generate', async (req, res) => {
    try {
        const { query, thread_id } = req.body;

        if (!query) {
            return res.status(400).send('Missing query');
        }

        const results = await agent.invoke({
            messages: [
                {
                    role: 'user',
                    content: query,
                },
            ],
        }, { configurable: { thread_id: String(thread_id ?? 'default') } });

        const content = results.messages.at(-1)?.content;
        console.log(content);

        res.send(content);
    } catch (error) {
        console.error('Agent error:', error);
        if (error?.status === 429 || /quota|rate limit|Too Many Requests/i.test(error?.message || '')) {
            return res.status(429).send(
                'Gemini free-tier quota exceeded for this model. Wait a bit, switch GEMINI_MODEL in .env (e.g. gemini-3.5-flash-lite), or enable billing in Google AI Studio.'
            );
        }
        res.status(500).send(error?.message || 'Agent failed');
    }
});

const server = app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});

server.on('error', (error) => {
    if (error.code === 'EADDRINUSE') {
        console.error(`Port ${PORT} is already in use. Set PORT in .env to a free port.`);
    } else {
        console.error(error);
    }
    process.exit(1);
});
