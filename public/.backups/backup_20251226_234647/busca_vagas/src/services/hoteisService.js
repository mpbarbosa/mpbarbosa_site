/**
 * Hotels Service
 * 
 * This service separates pure functions (referentially transparent) from impure ones:
 * - Pure functions: Data transformation, searching, filtering
 * - Impure functions: Cache operations, I/O, side effects
 * 
 * @module services/hoteisService
 * @version 1.4.0
 * @since 1.0.0
 * @updated 1.4.0 - Added pure functions for referential transparency
 */

import puppeteer from 'puppeteer';
import cache from '../utils/cache.js';

// Cache configuration
const CACHE_KEY = 'hotel_list';
const CACHE_TTL = parseInt(process.env.HOTEL_CACHE_TTL) || 24 * 60 * 60 * 1000; // Default: 24 hours

/**
 * List of available hotels (fallback/default list)
 * Based on AFPESP union hotel system
 * Last updated: 2025-12-03 (via /api/vagas/hoteis/scrape)
 */
const defaultHotels = [
  {
    id: 1,
    hotelId: '-1',
    name: 'Todas',
    type: 'All',
    description: 'All hotels'
  },
  {
    id: 2,
    hotelId: '4007',
    name: 'Amparo',
    type: 'Hotel',
    description: 'Hotel Amparo'
  },
  {
    id: 3,
    hotelId: '4003',
    name: 'Appenzell',
    type: 'Hotel',
    description: 'Hotel Appenzell'
  },
  {
    id: 4,
    hotelId: '4001',
    name: 'Areado',
    type: 'Hotel',
    description: 'Hotel Areado'
  },
  {
    id: 5,
    hotelId: '4002',
    name: 'Avaré',
    type: 'Hotel',
    description: 'Hotel Avaré'
  },
  {
    id: 6,
    hotelId: '4024',
    name: 'Boraceia',
    type: 'Hotel',
    description: 'Hotel Boraceia'
  },
  {
    id: 7,
    hotelId: '4004',
    name: 'Campos do Jordão',
    type: 'Hotel',
    description: 'Hotel Campos do Jordão'
  },
  {
    id: 8,
    hotelId: '4013',
    name: 'Caraguatatuba',
    type: 'Hotel',
    description: 'Hotel Caraguatatuba'
  },
  {
    id: 9,
    hotelId: '4023',
    name: 'Fazenda Ibirá',
    type: 'Hotel',
    description: 'Hotel Fazenda Ibirá'
  },
  {
    id: 10,
    hotelId: '4014',
    name: 'Guarujá',
    type: 'Hotel',
    description: 'Hotel Guarujá'
  },
  {
    id: 11,
    hotelId: '4015',
    name: 'Itanhaém',
    type: 'Hotel',
    description: 'Hotel Itanhaém'
  },
  {
    id: 12,
    hotelId: '4008',
    name: 'Lindoia',
    type: 'Hotel',
    description: 'Hotel Lindoia'
  },
  {
    id: 13,
    hotelId: '4018',
    name: 'Maresias',
    type: 'Hotel',
    description: 'Hotel Maresias'
  },
  {
    id: 14,
    hotelId: '4005',
    name: 'Monte Verde',
    type: 'Hotel',
    description: 'Hotel Monte Verde'
  },
  {
    id: 15,
    hotelId: '4021',
    name: 'Peruíbe I',
    type: 'Hotel',
    description: 'Hotel Peruíbe I'
  },
  {
    id: 16,
    hotelId: '4022',
    name: 'Peruíbe II',
    type: 'Hotel',
    description: 'Hotel Peruíbe II'
  },
  {
    id: 17,
    hotelId: '4006',
    name: 'Poços de Caldas',
    type: 'Hotel',
    description: 'Hotel Poços de Caldas'
  },
  {
    id: 18,
    hotelId: '4020',
    name: 'Saha',
    type: 'Hotel',
    description: 'Hotel Saha'
  },
  {
    id: 19,
    hotelId: '4019',
    name: 'São Lourenço',
    type: 'Hotel',
    description: 'Hotel São Lourenço'
  },
  {
    id: 20,
    hotelId: '4011',
    name: 'São Pedro',
    type: 'Hotel',
    description: 'Hotel São Pedro'
  },
  {
    id: 21,
    hotelId: '4009',
    name: 'Serra Negra',
    type: 'Hotel',
    description: 'Hotel Serra Negra'
  },
  {
    id: 22,
    hotelId: '4010',
    name: 'Socorro',
    type: 'Hotel',
    description: 'Hotel Socorro'
  },
  {
    id: 23,
    hotelId: '4012',
    name: 'Termas de Ibirá',
    type: 'Hotel',
    description: 'Hotel Termas de Ibirá'
  },
  {
    id: 24,
    hotelId: '4016',
    name: 'Ubatuba',
    type: 'Hotel',
    description: 'Hotel Ubatuba'
  },
  {
    id: 25,
    hotelId: '4017',
    name: 'Unidade Capital',
    type: 'Hotel',
    description: 'Unidade Capital'
  }
];

// ============================================================================
// PURE FUNCTIONS (Referentially Transparent)
// These functions always return the same output for the same input
// and have no side effects
// ============================================================================

/**
 * Find hotel by ID in a hotel list (PURE)
 * @param {Array} hotels - List of hotels to search
 * @param {number|string} id - Hotel ID to find
 * @returns {Object|null} Hotel object or null if not found
 */
export const findHotelById = (hotels, id) => {
  return hotels.find(hotel => hotel.id === parseInt(id)) || null;
};

/**
 * Find hotel by name in a hotel list (PURE)
 * @param {Array} hotels - List of hotels to search
 * @param {string} name - Hotel name to find (case-insensitive)
 * @returns {Object|null} Hotel object or null if not found
 */
export const findHotelByName = (hotels, name) => {
  return hotels.find(hotel => 
    hotel.name.toLowerCase() === name.toLowerCase()
  ) || null;
};

/**
 * Transform raw hotel options into standardized hotel objects (PURE)
 * @param {Array} rawOptions - Raw options from DOM dropdown
 * @returns {Array} Transformed hotel objects
 */
export const transformHotelOptions = (rawOptions) => {
  return rawOptions.map((option, index) => ({
    id: index + 1,
    hotelId: option.value,
    name: option.text.trim(),
    type: option.value === '' || option.value === '-1' ? 'All' : 'Hotel'
  }));
};

/**
 * Calculate cache expiration info (PURE)
 * @param {number|null} ttl - Time to live in milliseconds
 * @param {number} currentTime - Current timestamp
 * @param {number} cacheTTL - Configured cache TTL
 * @returns {Object} Cache information object
 */
export const calculateCacheInfo = (ttl, currentTime, cacheTTL) => {
  return {
    cached: ttl !== null,
    ttlMs: ttl,
    ttlHours: ttl ? (ttl / (60 * 60 * 1000)).toFixed(2) : null,
    expiresAt: ttl ? new Date(currentTime + ttl).toISOString() : null,
    cacheTTLMs: cacheTTL,
    cacheTTLHours: cacheTTL / (60 * 60 * 1000)
  };
};

// ============================================================================
// IMPURE FUNCTIONS (Side Effects)
// These functions interact with external state, I/O, or have side effects
// ============================================================================

/**
 * Get all hotels (IMPURE - reads from cache)
 * Returns cached list if available, otherwise returns default list
 * @param {boolean} useCache - Whether to use cache (default: true)
 * @returns {Array} List of all hotels
 */
export const getAllHotels = (useCache = true) => {
  if (useCache) {
    const cachedHotels = cache.get(CACHE_KEY);
    if (cachedHotels) {
      return cachedHotels;
    }
  }
  
  return defaultHotels;
};

/**
 * Get hotel by ID (IMPURE - depends on getAllHotels which reads cache)
 * @param {number} id - Hotel ID
 * @returns {Object|null} Hotel object or null if not found
 */
export const getHotelById = (id) => {
  const hotels = getAllHotels();
  return findHotelById(hotels, id);
};

/**
 * Get hotel by name (IMPURE - depends on getAllHotels which reads cache)
 * @param {string} name - Hotel name
 * @returns {Object|null} Hotel object or null if not found
 */
export const getHotelByName = (name) => {
  const hotels = getAllHotels();
  return findHotelByName(hotels, name);
};

/**
 * Scrape hotel list from AFPESP website dropdown (IMPURE - I/O operations)
 * Automatically caches the result for future use
 * @param {boolean} forceRefresh - Force refresh cache (default: false)
 * @returns {Promise<Array>} List of hotels from the website
 */
export const scrapeHotelList = async (forceRefresh = false) => {
  // Check cache first unless force refresh
  if (!forceRefresh) {
    const cachedHotels = cache.get(CACHE_KEY);
    if (cachedHotels) {
      return cachedHotels;
    }
  }

  let browser;
  
  try {
    browser = await puppeteer.launch({
      headless: 'new',
      executablePath: '/usr/bin/google-chrome-stable',
      args: [
        '--no-sandbox',
        '--disable-setuid-sandbox',
        '--disable-dev-shm-usage',
        '--disable-accelerated-2d-canvas',
        '--no-first-run',
        '--no-zygote',
        '--disable-gpu'
      ],
      defaultViewport: {
        width: 1280,
        height: 800
      }
    });

    const page = await browser.newPage();
    await page.goto('https://associadoh.afpesp.org.br/Servicos/Reservas/Vagas-disponiveis.aspx', {
      waitUntil: 'networkidle2',
      timeout: 30000
    });

    // Extract raw dropdown options from page
    const rawOptions = await page.evaluate(() => {
      // eslint-disable-next-line no-undef
      const dropdown = document.getElementById('ddlHoteis');
      if (!dropdown) {
        throw new Error('Dropdown element ddlHoteis not found');
      }

      const options = Array.from(dropdown.options);
      return options.map(option => ({
        value: option.value,
        text: option.text
      }));
    });

    await browser.close();
    
    // Transform raw data using pure function
    const hotelOptions = transformHotelOptions(rawOptions);
    
    // Cache the scraped hotel list
    cache.set(CACHE_KEY, hotelOptions, CACHE_TTL);
    
    return hotelOptions;

  } catch (error) {
    if (browser) {
      await browser.close();
    }
    throw new Error(`Failed to scrape hotel list: ${error.message}`);
  }
};

/**
 * Get cache information for hotel list (IMPURE - reads cache and uses Date.now())
 * @returns {Object} Cache info including TTL and status
 */
export const getCacheInfo = () => {
  const ttl = cache.getTTL(CACHE_KEY);
  
  return calculateCacheInfo(ttl, Date.now(), CACHE_TTL);
};

/**
 * Clear hotel list cache (IMPURE - mutates cache)
 */
export const clearCache = () => {
  cache.delete(CACHE_KEY);
};
