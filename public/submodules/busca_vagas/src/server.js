import dotenv from 'dotenv';
import express from 'express';
import cors from 'cors';
import routes from './routes/index.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

// Middlewares
// CORS: Enable cross-origin resource sharing for API access
app.use(cors());
// Body parsing: express.json() replaces body-parser for JSON payloads
// Note: In ES modules, use express.json() not import { json } from 'express'
app.use(express.json());
// URL-encoded: express.urlencoded() for form data with extended query string parsing
// Note: In ES modules, use express.urlencoded() not import { urlencoded } from 'express'
app.use(express.urlencoded({ extended: true }));

// Routes
app.get('/', (req, res) => {
  res.json({ message: 'Busca Vagas API' });
});

// API Routes
app.use('/api', routes);

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: 'Algo deu errado!' });
});

// Start server
const startServer = () => {
  const server = app.listen(PORT, () => {
    console.log(`Servidor rodando na porta ${PORT}`);
  });

  server.on('error', (err) => {
    if (err.code === 'EADDRINUSE') {
      console.error(`Porta ${PORT} já está em uso. Tente uma porta diferente ou encerre o processo usando a porta.`);
      process.exit(1);
    } else {
      throw err;
    }
  });
};

if (import.meta.url === `file://${process.argv[1]}`) {
  startServer();
}

export default app;
