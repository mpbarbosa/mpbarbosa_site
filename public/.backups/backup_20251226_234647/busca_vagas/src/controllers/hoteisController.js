/**
 * Hotels Controller
 * Handles HTTP requests for hotel-related operations
 * 
 * @module controllers/hoteisController
 * @version 1.4.0
 * @since 1.0.0
 */

import * as hoteisService from '../services/hoteisService.js';

/**
 * List all hotels
 * GET /api/vagas/hoteis
 * Query params:
 *   - nocache: true to bypass cache
 */
export const listarHoteis = async (req, res) => {
  try {
    const useCache = req.query.nocache !== 'true';
    const hoteis = hoteisService.getAllHotels(useCache);
    const cacheInfo = hoteisService.getCacheInfo();
    
    res.json({
      success: true,
      count: hoteis.length,
      data: hoteis,
      cache: cacheInfo
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
};

/**
 * Get hotel by ID
 * GET /api/vagas/hoteis/:id
 */
export const buscarHotelPorId = async (req, res) => {
  try {
    const { id } = req.params;
    const hotel = hoteisService.getHotelById(id);
    
    if (!hotel) {
      return res.status(404).json({
        success: false,
        error: 'Hotel não encontrado'
      });
    }
    
    res.json({
      success: true,
      data: hotel
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
};

/**
 * Scrape hotel list from AFPESP website
 * GET /api/vagas/hoteis/scrape
 * Query params:
 *   - force: true to force refresh cache
 */
export const scrapeHoteis = async (req, res) => {
  try {
    const forceRefresh = req.query.force === 'true';
    const hoteis = await hoteisService.scrapeHotelList(forceRefresh);
    const cacheInfo = hoteisService.getCacheInfo();
    
    res.json({
      success: true,
      count: hoteis.length,
      data: hoteis,
      source: 'AFPESP Website - ddlHoteis dropdown',
      cached: !forceRefresh,
      cache: cacheInfo
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
};

/**
 * Get cache information
 * GET /api/vagas/hoteis/cache
 */
export const getCacheInfo = async (req, res) => {
  try {
    const cacheInfo = hoteisService.getCacheInfo();
    
    res.json({
      success: true,
      data: cacheInfo
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
};

/**
 * Clear hotel list cache
 * DELETE /api/vagas/hoteis/cache
 */
export const clearCache = async (req, res) => {
  try {
    hoteisService.clearCache();
    
    res.json({
      success: true,
      message: 'Hotel list cache cleared successfully'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
};
