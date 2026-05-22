import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import path from 'path';
import { fileURLToPath } from 'url';
import { GoogleGenAI } from '@google/genai';

const app = express();
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY,
});

const GEMINI_MODEL = 'gemini-3.5-flash';

app.use(cors());
app.use(express.json());

app.use(express.static(path.join(__dirname, 'public')));

app.get('/api/greeting', (_req, res) => {
    res.status(200).json({ result: 'Halo Seperadik ! Selamat Datang di BELULOT (Bot 🤖 Pelayanan Urusan Kepegawaian Terotomatisasi Terpadu). Saya siap membantu memberikan Informasi Kepegawaian dengan cepat dan akurat. Ada yang bisa 🤖 bantu hari ini ? Silahkan ketik pertanyaan Anda di bawah ini ! 🤖' });
});

const PORT = 3000;
app.listen(PORT, () => console.log(`Server ready on http://localhost:${PORT}`));

app.post('/api/chat', async (req, res) => {
    const { conversation } = req.body;

    try {
        if (!Array.isArray(conversation)) throw new Error('Messages must be an array !');

        const contents = conversation.map(({ role, text}) => ({
            role,
            parts: [{ text }]
        }));

        const response = await ai.models.generateContent({
            model: GEMINI_MODEL,
            contents,
            config: {
                temperature: 0.3,
                systemInstruction: 'Jawab hanya dengan Bahasa Indonesia. Kamu hanya boleh berbagi pengetahuan tentang Pemerintah Kota Pangkal Pinang dan Negara Kesatuan Republik Indonesia. Jangan membahas politik.'
            },
        });

        res.status(200).json({ result: response.text });
    } catch (e) {
        res.status(500).json({ error: e.message });
    }
});