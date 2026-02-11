import express from 'express';
import cors from 'cors';
import { env } from './config/env';
import aiRouter from './routes/ai';

const app = express();

// --------------- Middleware ---------------
app.use(cors({ origin: env.FRONTEND_ORIGIN }));
app.use(express.json({ limit: '1mb' }));

// --------------- Routes ------------------
app.use('/api', aiRouter);

// --------------- Health ------------------
app.get('/api/health', (_req, res) => {
  res.json({ status: 'ok', uptime: process.uptime() });
});

// --------------- Start -------------------
app.listen(env.PORT, () => {
  console.log(`[DeckWise] Backend running → http://localhost:${env.PORT}`);
  console.log(`[DeckWise] CORS origin     → ${env.FRONTEND_ORIGIN}`);
  console.log(`[DeckWise] OpenAI model    → ${env.OPENAI_MODEL}`);
});
