/**
 * Vagas Service
 * 
 * This service separates pure functions (referentially transparent) from impure ones:
 * - Pure functions: Validation, filtering, data transformation
 * - Impure functions: I/O operations, external API calls
 * 
 * @module services/vagasService
 * @version 1.4.0
 * @since 1.0.0
 * @updated 1.4.0 - Added pure functions for referential transparency
 */

// ============================================================================
// PURE FUNCTIONS (Referentially Transparent)
// These functions always return the same output for the same input
// and have no side effects
// ============================================================================

/**
 * Validate vacancy data (PURE)
 * @param {Object} vagaData - Vacancy data to validate
 * @returns {Array<string>} Array of error messages (empty if valid)
 */
export const validateVagaData = (vagaData) => {
  const erros = [];

  if (!vagaData || typeof vagaData !== 'object') {
    erros.push('Dados da vaga são inválidos');
    return erros;
  }

  if (!vagaData.titulo) {
    erros.push('Título é obrigatório');
  }

  if (!vagaData.hotel) {
    erros.push('Hotel é obrigatório');
  }

  if (!vagaData.sindicato) {
    erros.push('Sindicato é obrigatório');
  }

  return erros;
};

/**
 * Check if vacancy data is valid (PURE)
 * @param {Object} vagaData - Vacancy data to validate
 * @returns {boolean} True if valid, false otherwise
 */
export const isValidVagaData = (vagaData) => {
  const erros = validateVagaData(vagaData);
  return erros.length === 0;
};

/**
 * Filter vacancies by hotel (PURE)
 * @param {Array} vagas - List of vacancies
 * @param {string} hotelId - Hotel ID to filter by
 * @returns {Array} Filtered vacancies
 */
export const filterVagasByHotel = (vagas, hotelId) => {
  if (!hotelId || hotelId === '-1' || hotelId === 'all') {
    return vagas;
  }
  return vagas.filter(vaga => vaga.hotelId === hotelId || vaga.hotel === hotelId);
};

/**
 * Filter vacancies by sindicato (PURE)
 * @param {Array} vagas - List of vacancies
 * @param {string} sindicatoId - Sindicato ID to filter by
 * @returns {Array} Filtered vacancies
 */
export const filterVagasBySindicato = (vagas, sindicatoId) => {
  if (!sindicatoId || sindicatoId === '-1' || sindicatoId === 'all') {
    return vagas;
  }
  return vagas.filter(vaga => vaga.sindicatoId === sindicatoId || vaga.sindicato === sindicatoId);
};

/**
 * Apply multiple filters to vacancies (PURE)
 * @param {Array} vagas - List of vacancies
 * @param {Object} filtros - Filters to apply
 * @param {string} filtros.hotelId - Hotel ID filter
 * @param {string} filtros.sindicatoId - Sindicato ID filter
 * @param {string} filtros.searchTerm - Search term for title/description
 * @returns {Array} Filtered vacancies
 */
export const applyFilters = (vagas, filtros = {}) => {
  let result = [...vagas];

  // Filter by hotel
  if (filtros.hotelId) {
    result = filterVagasByHotel(result, filtros.hotelId);
  }

  // Filter by sindicato
  if (filtros.sindicatoId) {
    result = filterVagasBySindicato(result, filtros.sindicatoId);
  }

  // Filter by search term
  if (filtros.searchTerm && filtros.searchTerm.trim()) {
    const term = filtros.searchTerm.toLowerCase().trim();
    result = result.filter(vaga => 
      (vaga.titulo && vaga.titulo.toLowerCase().includes(term)) ||
      (vaga.descricao && vaga.descricao.toLowerCase().includes(term))
    );
  }

  return result;
};

/**
 * Sort vacancies by field (PURE)
 * @param {Array} vagas - List of vacancies
 * @param {string} field - Field to sort by (e.g., 'titulo', 'hotel', 'dataInicio')
 * @param {string} order - Sort order ('asc' or 'desc')
 * @returns {Array} Sorted vacancies
 */
export const sortVagas = (vagas, field = 'titulo', order = 'asc') => {
  const sorted = [...vagas].sort((a, b) => {
    const aVal = a[field] || '';
    const bVal = b[field] || '';
    
    if (aVal < bVal) return order === 'asc' ? -1 : 1;
    if (aVal > bVal) return order === 'asc' ? 1 : -1;
    return 0;
  });
  
  return sorted;
};

/**
 * Transform vacancy data to standardized format (PURE)
 * @param {Object} rawVaga - Raw vacancy data
 * @returns {Object} Standardized vacancy object
 */
export const transformVagaData = (rawVaga) => {
  return {
    id: rawVaga.id || null,
    titulo: rawVaga.titulo || rawVaga.title || '',
    descricao: rawVaga.descricao || rawVaga.description || '',
    hotel: rawVaga.hotel || '',
    hotelId: rawVaga.hotelId || rawVaga.hotel_id || '',
    sindicato: rawVaga.sindicato || '',
    sindicatoId: rawVaga.sindicatoId || rawVaga.sindicato_id || '',
    dataInicio: rawVaga.dataInicio || rawVaga.data_inicio || null,
    dataFim: rawVaga.dataFim || rawVaga.data_fim || null,
    vagas: rawVaga.vagas || rawVaga.quantidade || 0,
    status: rawVaga.status || 'disponivel'
  };
};

/**
 * Transform multiple vacancy records (PURE)
 * @param {Array} rawVagas - Array of raw vacancy data
 * @returns {Array} Array of standardized vacancy objects
 */
export const transformVagasData = (rawVagas) => {
  if (!Array.isArray(rawVagas)) {
    return [];
  }
  return rawVagas.map(transformVagaData);
};

// ============================================================================
// IMPURE FUNCTIONS (Side Effects)
// These functions interact with external state, I/O, or have side effects
// ============================================================================

/**
 * VagasService class (IMPURE - maintains backward compatibility)
 * This class wraps the pure functions for I/O operations
 */
export class VagasService {
  /**
   * Busca vagas com filtros (IMPURE - would fetch from database/API)
   * @param {Object} filtros - Filters to apply
   * @returns {Promise<Array>} Filtered vacancies
   */
  async buscarVagasComFiltros(filtros) {
    // TODO: Implementar lógica de busca com filtros
    // Exemplo: buscar do banco de dados ou API
    const vagas = []; // Would fetch from database/API
    
    // Use pure function for filtering
    return applyFilters(vagas, filtros);
  }

  /**
   * Busca vagas por sindicato (IMPURE - would fetch from database/API)
   * @param {string} sindicatoId - Sindicato ID
   * @returns {Promise<Array>} Filtered vacancies
   */
  async buscarVagasPorSindicato(sindicatoId) {
    // TODO: Implementar busca por sindicato
    const vagas = []; // Would fetch from database/API
    
    // Use pure function for filtering
    return filterVagasBySindicato(vagas, sindicatoId);
  }

  /**
   * Busca vagas por hotel (IMPURE - would fetch from database/API)
   * @param {string} hotelId - Hotel ID
   * @returns {Promise<Array>} Filtered vacancies
   */
  async buscarVagasPorHotel(hotelId) {
    // TODO: Implementar busca por hotel
    const vagas = []; // Would fetch from database/API
    
    // Use pure function for filtering
    return filterVagasByHotel(vagas, hotelId);
  }

  /**
   * Valida dados da vaga (delegates to pure function)
   * @param {Object} vagaData - Vacancy data to validate
   * @returns {Array<string>} Array of error messages
   */
  validarDadosVaga(vagaData) {
    return validateVagaData(vagaData);
  }
}

export default new VagasService();
