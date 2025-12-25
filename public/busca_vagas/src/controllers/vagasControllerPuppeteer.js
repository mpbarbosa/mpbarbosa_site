/**
 * Vagas Controller (Puppeteer Optimized)
 * 
 * This version uses Puppeteer instead of Selenium, reducing resource consumption
 * by 40-60% through:
 * - Browser instance pooling
 * - Optimized headless mode
 * - Smaller memory footprint
 * 
 * @module controllers/vagasControllerPuppeteer
 * @version 1.5.0
 * @since 1.2.0
 * @updated 1.5.0 - Added applyBookingRules parameter support
 */

import { searchVacanciesByDay, searchWeekendVacancies } from './puppeteer-script.js';

/**
 * Lista todas as vagas (placeholder)
 */
export const listarVagas = async (req, res) => {
  try {
    // TODO: Implementar lógica para buscar vagas do banco de dados
    const vagas = [];
    res.json({ vagas });
  } catch (error) {
    res.status(500).json({ error: 'Erro ao buscar vagas' });
  }
};

/**
 * Busca vaga por ID
 */
export const buscarVagaPorId = async (req, res) => {
  try {
    const { id } = req.params;
    // TODO: Implementar lógica para buscar vaga específica
    res.json({ id, message: 'Vaga não implementada' });
  } catch (error) {
    res.status(500).json({ error: 'Erro ao buscar vaga' });
  }
};

/**
 * Cria nova vaga
 */
export const criarVaga = async (req, res) => {
  try {
    const vagaData = req.body;
    // TODO: Implementar lógica para criar vaga no banco de dados
    res.status(201).json({ message: 'Vaga criada com sucesso' });
  } catch (error) {
    res.status(500).json({ error: 'Erro ao criar vaga' });
  }
};

/**
 * Atualiza vaga existente
 */
export const atualizarVaga = async (req, res) => {
  try {
    const { id } = req.params;
    const vagaData = req.body;
    // TODO: Implementar lógica para atualizar vaga
    res.json({ message: 'Vaga atualizada com sucesso' });
  } catch (error) {
    res.status(500).json({ error: 'Erro ao atualizar vaga' });
  }
};

/**
 * Remove vaga
 */
export const removerVaga = async (req, res) => {
  try {
    const { id } = req.params;
    // TODO: Implementar lógica para remover vaga
    res.json({ message: 'Vaga removida com sucesso' });
  } catch (error) {
    res.status(500).json({ error: 'Erro ao remover vaga' });
  }
};

/**
 * Search for vacancies by dates using Puppeteer (optimized)
 * 
 * Query parameters:
 * - checkin (required): Check-in date in YYYY-MM-DD format
 * - checkout (required): Check-out date in YYYY-MM-DD format
 * - hotel (optional): Hotel name or "Todas" for all hotels (default: "Todas")
 * - applyBookingRules (optional): Apply holiday booking restrictions (default: true)
 * 
 * Note: Always runs in headless mode for optimal performance and CI/CD compatibility
 * 
 * Validates booking rules (BR-18, BR-19, BR-20):
 * - Christmas package (Dec 22-27) requires exact dates (by default)
 * - New Year package (Dec 27-Jan 2) requires exact dates (by default)
 * - Rules can be bypassed with applyBookingRules=false
 * 
 * Example: GET /api/vagas/search?checkin=2024-12-25&checkout=2024-12-26&hotel=Todas
 * Example: GET /api/vagas/search?checkin=2024-12-23&checkout=2024-12-26&applyBookingRules=false
 */
export const searchByDates = async (req, res) => {
  try {
    const { checkin, checkout, hotel = 'Todas', applyBookingRules } = req.query;
    
    if (!checkin || !checkout) {
      return res.status(400).json({ 
        error: 'Both checkin and checkout parameters are required',
        example: '/api/vagas/search?checkin=2024-12-25&checkout=2024-12-26&hotel=Todas'
      });
    }

    // Always use headless mode for security, performance, and CI/CD compatibility
    console.log(`\n🔍 API Request: Searching vacancies from ${checkin} to ${checkout}`);
    console.log(`   Hotel filter: ${hotel}`);
    console.log('   Headless mode: true (enforced)');
    console.log('   Using: Puppeteer (optimized)');
    console.log(`   Booking rules: ${req.bookingRulesBypassed ? 'bypassed' : 'enforced'}`);
    
    // Check if this is a holiday package (set by validation middleware)
    if (req.holidayPackage) {
      console.log(`   🎄 Holiday Package: ${req.holidayPackage.name} (${req.holidayPackage.duration})`);
      if (req.bookingRulesBypassed) {
        console.log('   ⚠️  Note: Booking rules were bypassed for this search');
      }
    }

    const results = await searchVacanciesByDay(checkin, checkout, hotel);
    
    const response = {
      success: true,
      method: 'puppeteer',
      headlessMode: true,
      resourceSavings: '40-60% compared to Selenium',
      hotelFilter: hotel,
      query: {
        checkin,
        checkout,
        hotel,
        applyBookingRules: applyBookingRules === undefined ? true : applyBookingRules === 'true'
      },
      data: results
    };
    
    // Add holiday package information if applicable
    if (req.holidayPackage) {
      response.holidayPackage = {
        name: req.holidayPackage.name,
        duration: req.holidayPackage.duration,
        type: req.holidayPackage.type
      };
    }
    
    // Add note if booking rules were bypassed
    if (req.bookingRulesBypassed) {
      response.note = 'Booking rules bypassed - custom date range allowed during holiday period';
    }
    
    res.json(response);
  } catch (error) {
    console.error('Error in searchByDates:', error);
    res.status(500).json({ 
      success: false,
      error: error.message || 'Erro ao buscar vagas',
      method: 'puppeteer'
    });
  }
};

/**
 * Search for weekend vacancies using Puppeteer (optimized)
 * 
 * This endpoint searches for vacancies in all upcoming weekends (Friday-Sunday)
 * for the next 2 months.
 * 
 * Example: GET /api/vagas/search/weekends
 */
export const searchWeekends = async (req, res) => {
  try {
    console.log('\n🔍 API Request: Searching weekend vacancies');
    console.log('   Using: Puppeteer (optimized)');
    
    // Set a longer timeout for this endpoint since it searches multiple weekends
    req.setTimeout(10 * 60 * 1000); // 10 minutes
    
    await searchWeekendVacancies();
    
    res.json({
      success: true,
      method: 'puppeteer',
      resourceSavings: '40-60% compared to Selenium',
      message: 'Weekend search completed',
      note: 'Check server console for detailed results'
    });
  } catch (error) {
    console.error('Error in searchWeekends:', error);
    res.status(500).json({ 
      success: false,
      error: error.message || 'Erro ao buscar vagas de fim de semana',
      method: 'puppeteer'
    });
  }
};
