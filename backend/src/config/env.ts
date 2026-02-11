import dotenv from 'dotenv';
import path from 'path';

// Load .env from the backend root (one level above src/)
dotenv.config({ path: path.resolve(__dirname, '../../.env') });

function requireEnv(name: string): string {
  const value = process.env[name];
  if (!value) {
    throw new Error(`Missing required environment variable: ${name}`);
  }
  return value;
}

export const env = {
  PORT: parseInt(process.env.PORT || '4000', 10),
  FRONTEND_ORIGIN: process.env.FRONTEND_ORIGIN || 'http://localhost:5173',
  OPENAI_API_KEY: requireEnv('OPENAI_API_KEY'),
  OPENAI_MODEL: process.env.OPENAI_MODEL || 'gpt-4.1',
} as const;
