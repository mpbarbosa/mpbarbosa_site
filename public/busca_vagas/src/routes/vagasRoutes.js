/**
 * Vagas Routes
 * API routes for vacancy and hotel management
 * 
 * @module routes/vagasRoutes
 * @version 1.5.0
 * @since 1.0.0
 * @updated 1.5.0 - Added applyBookingRules parameter support
 */

import express from 'express';
import * as vagasController from '../controllers/vagasController.js';
import * as vagasControllerPuppeteer from '../controllers/vagasControllerPuppeteer.js';
import * as hoteisController from '../controllers/hoteisController.js';
import { validateBookingRules } from '../middlewares/validation.js';

const router = express.Router();

// GET /api/vagas - Lista todas as vagas
router.get('/', vagasController.listarVagas);

// GET /api/vagas/hoteis - Lista todos os hotéis disponíveis
router.get('/hoteis', hoteisController.listarHoteis);

// GET /api/vagas/hoteis/cache - Get cache information
router.get('/hoteis/cache', hoteisController.getCacheInfo);

// DELETE /api/vagas/hoteis/cache - Clear hotel list cache
router.delete('/hoteis/cache', hoteisController.clearCache);

// GET /api/vagas/hoteis/scrape - Scrape hotel list from AFPESP website
router.get('/hoteis/scrape', hoteisController.scrapeHoteis);

// GET /api/vagas/hoteis/:id - Get hotel by ID
router.get('/hoteis/:id', hoteisController.buscarHotelPorId);

// GET /api/vagas/search - Search for vacancies by dates (Puppeteer - RECOMMENDED)
// Example: /api/vagas/search?checkin=2024-12-25&checkout=2024-12-26
// Example: /api/vagas/search?checkin=2024-12-23&checkout=2024-12-26&applyBookingRules=false
// Validates booking rules (BR-18, BR-19, BR-20) for holiday packages
router.get('/search', validateBookingRules, vagasControllerPuppeteer.searchByDates);

// GET /api/vagas/search/weekends - Search all upcoming weekends (Puppeteer - RECOMMENDED)
router.get('/search/weekends', vagasControllerPuppeteer.searchWeekends);

// GET /api/vagas/search/selenium - Search for vacancies by dates (Selenium - Legacy)
// Kept for backward compatibility, also validates booking rules
router.get('/search/selenium', validateBookingRules, vagasController.searchByDates);

// Legacy endpoint alias (redirects to Puppeteer)
router.get('/search/bydates', validateBookingRules, vagasControllerPuppeteer.searchByDates);

// GET /api/vagas/:id - Busca vaga por ID
router.get('/:id', vagasController.buscarVagaPorId);

// POST /api/vagas - Cria nova vaga
router.post('/', vagasController.criarVaga);

// PUT /api/vagas/:id - Atualiza vaga existente
router.put('/:id', vagasController.atualizarVaga);

// DELETE /api/vagas/:id - Remove vaga
router.delete('/:id', vagasController.removerVaga);

export default router;
