/**
 * Vagas Controller
 * Controller for managing vacancy-related operations
 * 
 * @module controllers/vagasController
 * @version 1.5.0
 * @since 1.0.0
 * @updated 1.5.0 - Added applyBookingRules parameter support
 */

import { Builder, By, until, Select } from 'selenium-webdriver';

async function openVagasPage() {
  // Create a new WebDriver instance (using Chrome by default)
  const driver = await new Builder().forBrowser('chrome').build();

  console.log('Navigating to Vagas page...');
  // Navigate to the Vagas page
  await driver.get('https://associadoh.afpesp.org.br/Servicos/Reservas/Vagas-disponiveis.aspx');

  // Wait for the page to load (wait for body element)
  await driver.wait(until.elementLocated(By.css('body')), 10000);

  console.log('Vagas page loaded successfully!');
  return driver;
}

/**
 * Lista todas as vagas
 */
export const listarVagas = async (req, res) => {

  const driver = await openVagasPage();
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
 * Search for vacancies by dates (Legacy Selenium)
 * 
 * Query parameters:
 * - checkin (required): Check-in date in YYYY-MM-DD format
 * - checkout (required): Check-out date in YYYY-MM-DD format
 * - headless (optional): Run in headless mode (default: true)
 * - applyBookingRules (optional): Apply holiday booking restrictions (default: true)
 * 
 * Note: This is the legacy Selenium implementation. Use /api/vagas/search (Puppeteer) instead.
 */
export const searchByDates = async (req, res) => {
  try {
    const { checkin, checkout, headless, applyBookingRules } = req.query;
    
    if (!checkin || !checkout) {
      return res.status(400).json({ error: 'Both checkin and checkout parameters are required' });
    }

    // Parse headless parameter (default to true)
    const isHeadless = headless === 'false' ? false : true;
    
    console.log(`\n🔍 API Request (Selenium): Searching vacancies from ${checkin} to ${checkout}`);
    console.log(`   Headless mode: ${isHeadless}`);
    console.log(`   Booking rules: ${req.bookingRulesBypassed ? 'bypassed' : 'enforced'}`);
    
    // Check if this is a holiday package (set by validation middleware)
    if (req.holidayPackage) {
      console.log(`   🎄 Holiday Package: ${req.holidayPackage.name} (${req.holidayPackage.duration})`);
      if (req.bookingRulesBypassed) {
        console.log('   ⚠️  Note: Booking rules were bypassed for this search');
      }
    }

    const { searchVacanciesByDay } = await import('./selenium-script.cjs');
    const results = await searchVacanciesByDay(checkin, checkout, isHeadless);
    
    const response = {
      success: true,
      method: 'selenium',
      query: {
        checkin,
        checkout,
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
    res.status(500).json({ 
      success: false,
      error: error.message || 'Erro ao buscar vagas',
      method: 'selenium'
    });
  }
};
