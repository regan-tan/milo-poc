# DeckWise — Cursor for Slides

AI-powered slide editing via natural language. A three-panel app where a chat interface controls a live slide canvas, with real-time code preview.

## Architecture

```
milo-poc/
├── backend/    # Node.js + Express + TypeScript + OpenAI
├── frontend/   # Vue 3 + Vite + TypeScript
├── package.json
└── README.md
```

## Quick Start

### 1. Install dependencies

```bash
# From project root
cd backend && npm install
cd ../frontend && npm install
```

### 2. Configure environment

```bash
# Copy the example env file and add your OpenAI API key
cp backend/.env.example backend/.env
# Edit backend/.env and set OPENAI_API_KEY=sk-...
```

### 3. Run both servers

In two separate terminals:

```bash
# Terminal 1 — Backend (http://localhost:4000)
cd backend
npm run dev

# Terminal 2 — Frontend (http://localhost:5173)
cd frontend
npm run dev
```

### 4. Open the app

Navigate to **http://localhost:5173** in your browser.

## Tech Stack

| Layer    | Technology                        |
|----------|-----------------------------------|
| Frontend | Vue 3, TypeScript, Vite           |
| Backend  | Node.js, Express, TypeScript      |
| AI       | OpenAI API (GPT-4.1)             |
| Styling  | Plain CSS (flexbox/grid)          |

## How It Works

1. The user types a natural-language instruction in the **Chat Panel** (left).
2. The frontend sends the current slide HTML/CSS + instruction to the backend.
3. The backend calls OpenAI with a system prompt (DEX) that returns updated `{ html, css }`.
4. The frontend updates the **Slide Canvas** (center) and **Code Panel** (right) in sync.

## Scripts

### Backend (`/backend`)

| Script  | Description                          |
|---------|--------------------------------------|
| `dev`   | Start dev server with hot-reload     |
| `build` | Compile TypeScript to `dist/`        |
| `start` | Run compiled JS from `dist/`         |
| `lint`  | Type-check without emitting          |

### Frontend (`/frontend`)

| Script    | Description                        |
|-----------|------------------------------------|
| `dev`     | Start Vite dev server              |
| `build`   | Type-check + production build      |
| `preview` | Preview production build locally   |
| `lint`    | Type-check without emitting        |
