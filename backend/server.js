import dotenv from 'dotenv';
dotenv.config();

import express from 'express';
import cors from 'cors';
import config from './config/config.js';
import mountRoutes from './routes/index.js';
import errorHandler from './middleware/errorHandler.js';

const app = express();

// --------------- Middleware ---------------
app.use(cors({ origin: config.frontendUrl }));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// --------------- API routes ---------------
mountRoutes(app);

// --------------- Error handler ---------------
app.use(errorHandler);

// --------------- Start server ---------------
app.listen(config.port, () => {
  console.log(`Canvas Editor backend running at http://localhost:${config.port}`);
  console.log(`Environment: ${config.nodeEnv}`);
});
