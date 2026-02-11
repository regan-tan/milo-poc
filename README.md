# Canvas Editor

A web-based canvas editor with a **Vue.js 3 + Vite** frontend and a **Node.js / Express** backend (MVC architecture).  
All code is plain JavaScript — **no TypeScript**.

## Features

- **Create text boxes** — click **T** to add draggable, editable text boxes to the canvas
- **Text formatting** — select text, then click **B** (bold), **U** (underline), or **I** (italic)
- **Drag and drop** — move text boxes around the canvas; constrained to bounds
- **Save / Load / Clear** — REST API endpoints for persisting canvas state (in-memory)

## Project Structure

```
project-root/
├── backend/           # Node.js + Express MVC (ES modules)
│   ├── server.js
│   ├── .env
│   ├── config/
│   ├── models/
│   ├── controllers/
│   ├── routes/
│   └── middleware/
├── frontend/          # Vue.js 3 + Vite
│   ├── index.html
│   ├── vite.config.js
│   └── src/
│       ├── main.js
│       ├── App.vue
│       ├── components/
│       ├── composables/
│       └── assets/
└── README.md
```

## Getting Started

### Prerequisites

- [Node.js](https://nodejs.org/) v16 or later

### Terminal 1 — Backend

```bash
cd backend
npm install
npm run dev
```

Backend runs at **http://localhost:5000** (auto-reloads via nodemon).

### Terminal 2 — Frontend

```bash
cd frontend
npm install
npm run dev
```

Frontend runs at **http://localhost:5173** (hot-reloads via Vite).  
API calls are proxied to the backend automatically.

## API Endpoints

| Method | Endpoint            | Description        |
|--------|---------------------|--------------------|
| GET    | `/api/health`       | Health check       |
| POST   | `/api/canvas/save`  | Save canvas state  |
| GET    | `/api/canvas/load`  | Load canvas state  |
| DELETE | `/api/canvas/clear` | Clear canvas state |