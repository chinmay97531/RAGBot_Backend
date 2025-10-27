import express from 'express';
import cors from 'cors';

import { agent } from './agent.js';

const app = express();
const PORT = process.env.PORT || 3000;
app.use(express.json({ limit: '200mb' }));
app.use(cors());

app.get('/', (req, res) => {
    res.send('AI Chat Bot with YouTube Videos is running!');
});

app.post('/generate', async (req, res) => {
    const { query, thread_id } = req.body;

    const results = await agent.invoke({
        messages: [
            {
                role: 'user',
                content: query,
            },
        ],
    }, { configurable: { thread_id } });

    console.log(results.messages.at(-1)?.content);

    res.send(results.messages.at(-1)?.content);
});


app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
