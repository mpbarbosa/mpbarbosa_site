import express from 'express';
import vagasRoutes from './vagasRoutes.js';

/**
 * Arquivo principal de rotas
 * Centraliza todas as rotas da API
 */
const router = express.Router();

// Rota de health check
router.get('/health', (req, res) => {
  res.json({ status: 'OK', message: 'API está funcionando' });
});

// Rotas de vagas
router.use('/vagas', vagasRoutes);

export default router;
