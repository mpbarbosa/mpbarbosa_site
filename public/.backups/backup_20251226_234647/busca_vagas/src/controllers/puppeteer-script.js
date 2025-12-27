/**
 * Puppeteer Script for Hotel Vacancy Search (Optimized)
 * 
 * This script provides lightweight automated searching for hotel vacancies using Puppeteer.
 * Significantly reduces resource consumption compared to Selenium (40-60% savings).
 * 
 * @module controllers/puppeteer-script
 * @version 1.4.0
 * @since 1.2.0
 * @updated 1.4.0 - Aligned with referential transparency refactoring
 * 
 * 1. Main Features:
 *    1.1. Browser instance pooling for reuse
 *    1.2. Optimized headless mode with minimal flags
 *    1.3. Reduced memory footprint
 *    1.4. Faster execution times
 * 
 * 2. Main Functions:
 *    2.1. searchVacanciesByDay(startDate, endDate, headless) - Search all hotels for a date range
 *    2.2. searchWeekendVacancies() - Search all upcoming weekends
 *    2.3. openVagasPage(checkinDate, checkoutDate, weekendNumber, totalWeekends, headless) - Core search function
 */

import puppeteer from 'puppeteer';

// Browser instance pool
class BrowserPool {
  constructor() {
    this.browser = null;
    this.isInitializing = false;
    this.maxAge = 5 * 60 * 1000; // 5 minutes
    this.lastUsed = null;
  }

  async getBrowser() {
    // Reuse existing browser if still valid
    if (this.browser && this.lastUsed && (Date.now() - this.lastUsed < this.maxAge)) {
      this.lastUsed = Date.now();
      return this.browser;
    }

    // Close old browser if exists
    if (this.browser) {
      await this.closeBrowser();
    }

    // Wait if another initialization is in progress
    while (this.isInitializing) {
      await new Promise(resolve => setTimeout(resolve, 100));
    }

    this.isInitializing = true;

    try {
      // Always use headless mode for security, performance, and CI/CD compatibility
      this.browser = await puppeteer.launch({
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

      this.lastUsed = Date.now();
      return this.browser;
    } finally {
      this.isInitializing = false;
    }
  }

  async closeBrowser() {
    if (this.browser) {
      try {
        await this.browser.close();
      } catch (error) {
        console.error('Error closing browser:', error.message);
      }
      this.browser = null;
      this.lastUsed = null;
    }
  }
}

const browserPool = new BrowserPool();

/**
 * Search for vacancies in all hotels for a date range
 * @param {Date|string} startDate - The check-in date (can be Date object or string)
 * @param {Date|string} endDate - The check-out date (can be Date object or string)
 * @param {string} hotel - Hotel name or "Todas" for all hotels (default: "Todas")
 * @returns {Promise<Object>} Search results with availability information
 * 
 * Note: Always runs in headless mode for optimal performance and CI/CD compatibility
 */
export async function searchVacanciesByDay(startDate, endDate, hotel = 'Todas') {
  let checkInDate;
  let checkOutDate;
  
  // Convert startDate to Date object if it's a string
  if (typeof startDate === 'string') {
    const [year, month, day] = startDate.split('-').map(Number);
    checkInDate = new Date(year, month - 1, day);
  } else if (startDate instanceof Date) {
    checkInDate = new Date(startDate);
  } else {
    throw new Error('Invalid startDate parameter. Please provide a Date object or date string.');
  }
  
  // Convert endDate to Date object if it's a string
  if (typeof endDate === 'string') {
    const [year, month, day] = endDate.split('-').map(Number);
    checkOutDate = new Date(year, month - 1, day);
  } else if (endDate instanceof Date) {
    checkOutDate = new Date(endDate);
  } else {
    throw new Error('Invalid endDate parameter. Please provide a Date object or date string.');
  }
  
  // Validate the dates
  if (isNaN(checkInDate.getTime())) {
    throw new Error('Invalid startDate provided. Please check the date format.');
  }
  
  if (isNaN(checkOutDate.getTime())) {
    throw new Error('Invalid endDate provided. Please check the date format.');
  }
  
  // Validate that endDate is after startDate
  if (checkOutDate <= checkInDate) {
    throw new Error('endDate must be after startDate.');
  }
  
  console.log(`\n${'='.repeat(80)}`);
  console.log('🔍 SEARCHING VACANCIES FOR DATE RANGE (Puppeteer)');
  console.log(`   Check-in: ${checkInDate.toLocaleDateString()} (${['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'][checkInDate.getDay()]})`);
  console.log(`   Check-out: ${checkOutDate.toLocaleDateString()} (${['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'][checkOutDate.getDay()]})`);
  console.log(`   Hotel: ${hotel}`);
  console.log('   Headless mode: true (enforced)');
  console.log(`${'='.repeat(80)}`);
  
  try {
    const result = await openVagasPage(checkInDate, checkOutDate, 1, 1, hotel);
    
    if (result && result.hasAvailability) {
      console.log(`\n✅ VACANCIES FOUND for ${checkInDate.toLocaleDateString()}`);
      console.log(`📊 ${result.summary}`);
      
      if (result.hotelGroups && Object.keys(result.hotelGroups).length > 0) {
        console.log(`\n🏨 HOTELS WITH AVAILABILITY (${Object.keys(result.hotelGroups).length} total):`);
        Object.entries(result.hotelGroups).forEach(([hotel, vacancies], index) => {
          console.log(`\n${index + 1}. 🏨 ${hotel} (${vacancies.length} room type${vacancies.length > 1 ? 's' : ''})`);
          let vIndex = 0;
          vacancies.forEach((vacancy) => {
            const cleanVacancy = vacancy.replace(/<[^>]*>/g, '').replace(/\s+/g, ' ').trim();
            console.log(`   ${String.fromCharCode(97 + vIndex)}. ${cleanVacancy}`);
            vIndex++;
          });
        });
      }
      
      return {
        success: true,
        date: checkInDate.toLocaleDateString(),
        hasAvailability: true,
        result: result
      };
    } else {
      console.log(`\n🔴 NO VACANCIES AVAILABLE for ${checkInDate.toLocaleDateString()}`);
      console.log(`📊 ${result ? result.summary : 'No results returned'}`);
      
      return {
        success: true,
        date: checkInDate.toLocaleDateString(),
        hasAvailability: false,
        result: result
      };
    }
  } catch (error) {
    console.error(`\n❌ ERROR searching for vacancies on ${checkInDate.toLocaleDateString()}: ${error.message}`);
    
    return {
      success: false,
      date: checkInDate.toLocaleDateString(),
      hasAvailability: false,
      error: error.message
    };
  }
}

// Function to get all Friday-Sunday weekends for the next two months
function getNextWeekends(monthsAhead = 2) {
  const weekends = [];
  const today = new Date();
  const endDate = new Date(today);
  endDate.setMonth(today.getMonth() + monthsAhead);
    
  let currentFriday = new Date(today);
  const daysUntilFriday = (5 - today.getDay() + 7) % 7;
  if (daysUntilFriday === 0 && today.getDay() !== 5) {
    currentFriday.setDate(today.getDate() + 7);
  } else {
    currentFriday.setDate(today.getDate() + daysUntilFriday);
  }
    
  while (currentFriday <= endDate) {
    const currentSunday = new Date(currentFriday);
    currentSunday.setDate(currentFriday.getDate() + 2);
        
    weekends.push({
      friday: new Date(currentFriday),
      sunday: new Date(currentSunday),
      weekend: `${currentFriday.toLocaleDateString()} to ${currentSunday.toLocaleDateString()}`
    });
        
    currentFriday.setDate(currentFriday.getDate() + 7);
  }
    
  return weekends;
}

// Function to display comprehensive weekend search summary
function displayWeekendSummary(searchResults) {
  console.log(`\n${'='.repeat(100)}`);
  console.log('🏨 COMPREHENSIVE WEEKEND HOTEL VACANCY SUMMARY (Puppeteer)');
  console.log(`${'='.repeat(100)}`);
    
  const availableWeekends = searchResults.filter(r => r.result && r.result.hasAvailability === true);
  const unavailableWeekends = searchResults.filter(r => r.result && r.result.hasAvailability === false);
  const errorWeekends = searchResults.filter(r => r.status === 'ERROR');
    
  console.log('\n📊 OVERALL STATISTICS:');
  console.log(`  🟢 Available Weekends: ${availableWeekends.length}/${searchResults.length}`);
  console.log(`  🔴 No Availability: ${unavailableWeekends.length}/${searchResults.length}`);
  console.log(`  ❌ Errors: ${errorWeekends.length}/${searchResults.length}`);
    
  if (availableWeekends.length > 0) {
    console.log('\n🎉 WEEKENDS WITH AVAILABILITY:');
    availableWeekends.forEach(weekend => {
      console.log(`  ✅ Weekend ${weekend.weekendNumber}: ${weekend.dates}`);
      if (weekend.result && weekend.result.summary) {
        console.log(`      📊 ${weekend.result.summary}`);
      }
      if (weekend.result && weekend.result.hotelGroups && Object.keys(weekend.result.hotelGroups).length > 0) {
        console.log('      🏨 Hotels with Availability:');
        Object.entries(weekend.result.hotelGroups).slice(0, 3).forEach(([hotel, vacancies], index) => {
          console.log(`        ${index + 1}. 🏨 ${hotel} (${vacancies.length} vacancy type${vacancies.length > 1 ? 's' : ''})`);
          vacancies.slice(0, 2).forEach((vacancy) => {
            const cleanVacancy = vacancy.replace(/<[^>]*>/g, '').replace(/\s+/g, ' ').trim();
            console.log(`           • ${cleanVacancy}`);
          });
          if (vacancies.length > 2) {
            console.log(`           • ... and ${vacancies.length - 2} more room types`);
          }
        });
        const totalHotels = Object.keys(weekend.result.hotelGroups).length;
        if (totalHotels > 3) {
          console.log(`        ... and ${totalHotels - 3} more hotels`);
        }
      }
    });
  }
    
  if (unavailableWeekends.length > 0) {
    console.log('\n⚠️ WEEKENDS WITHOUT AVAILABILITY:');
    unavailableWeekends.forEach(weekend => {
      console.log(`  🔴 Weekend ${weekend.weekendNumber}: ${weekend.dates}`);
    });
  }
    
  if (errorWeekends.length > 0) {
    console.log('\n❌ WEEKENDS WITH ERRORS:');
    errorWeekends.forEach(weekend => {
      console.log(`  ❌ Weekend ${weekend.weekendNumber}: ${weekend.dates} - ${weekend.result}`);
    });
  }
    
  console.log('\n💡 RECOMMENDATIONS:');
  if (availableWeekends.length > 0) {
    console.log('  🎯 Book immediately for available weekends!');
    console.log('  📞 Contact trade union directly for reservations');
  } else {
    console.log('  🔄 Check back regularly as availability changes frequently');
    console.log('  📅 Consider mid-week stays for better availability');
    console.log('  🏨 Try searching individual hotels instead of \'All Hotels\'');
  }
    
  console.log(`\n🕐 Search completed at: ${new Date().toLocaleString()}`);
  console.log(`${'='.repeat(100)}`);
}

// Main function to search for weekend hotel vacancies across all weekends
export async function searchWeekendVacancies() {
  const weekends = getNextWeekends(2);
  console.log(`\n🗓️ WEEKEND SEARCH PLAN: Found ${weekends.length} weekends to check in the next 2 months`);
  weekends.forEach((weekend, index) => {
    console.log(`  ${index + 1}. ${weekend.weekend}`);
  });
    
  console.log(`\n🔍 Starting comprehensive search across all ${weekends.length} weekends (Puppeteer)...\n`);
    
  const searchResults = [];
    
  for (let i = 0; i < weekends.length; i++) {
    const weekend = weekends[i];
    console.log(`\n${'='.repeat(80)}`);
    console.log(`🔍 WEEKEND ${i + 1}/${weekends.length}: ${weekend.weekend}`);
    console.log(`${'='.repeat(80)}`);
        
    try {
      const result = await openVagasPage(weekend.friday, weekend.sunday, i + 1, weekends.length);
      searchResults.push({
        weekendNumber: i + 1,
        dates: weekend.weekend,
        friday: weekend.friday,
        sunday: weekend.sunday,
        result: result || 'No availability detected',
        status: result && result.hasAvailability ? 'AVAILABLE' : 'NO AVAILABILITY'
      });
    } catch (error) {
      console.error(`❌ Error searching weekend ${i + 1}: ${error.message}`);
      searchResults.push({
        weekendNumber: i + 1,
        dates: weekend.weekend,
        friday: weekend.friday,
        sunday: weekend.sunday,
        result: `Error: ${error.message}`,
        status: 'ERROR'
      });
    }
        
    if (i < weekends.length - 1) {
      console.log('\n⏳ Waiting 2 seconds before next weekend search...');
      await new Promise(resolve => setTimeout(resolve, 2000));
    }
  }
    
  displayWeekendSummary(searchResults);
  
  // Clean up browser pool after all searches
  await browserPool.closeBrowser();
}

async function openVagasPage(fridayDate = null, sundayDate = null, weekendNumber = null, totalWeekends = null, hotel = 'Todas') { // eslint-disable-line no-unused-vars
  // Always use headless mode
  const browser = await browserPool.getBrowser();
  const page = await browser.newPage();
    
  let nextFriday, nextSunday;
    
  try {
    console.log('Opening the vagas page...');
        
    await page.goto('https://associadoh.afpesp.org.br/Servicos/Reservas/Vagas-disponiveis.aspx', {
      waitUntil: 'networkidle2',
      timeout: 30000
    });
        
    console.log('Page loaded successfully!');
        
    const title = await page.title();
    console.log('Page title:', title);
        
    console.log('\n--- Setting Hotel Selection ---');
    
    await page.waitForSelector('#ddlHoteis', { timeout: 10000 });
    
    // Get all available options
    const hotelOptions = await page.evaluate(() => {
      const select = document.getElementById('ddlHoteis'); // eslint-disable-line no-undef
      const options = [];
      for (let i = 0; i < select.options.length; i++) {
        options.push({
          value: select.options[i].value,
          text: select.options[i].text.trim()
        });
      }
      return options;
    });
    
    // Find the hotel option
    let selectedValue = '-1'; // Default to "Todas"
    if (hotel && hotel !== 'Todas') {
      const matchingOption = hotelOptions.find(opt => 
        opt.text.toLowerCase().includes(hotel.toLowerCase()) || 
        hotel.toLowerCase().includes(opt.text.toLowerCase())
      );
      if (matchingOption) {
        selectedValue = matchingOption.value;
        console.log(`✅ Found hotel: ${matchingOption.text} (value: ${selectedValue})`);
      } else {
        console.log(`⚠️ Hotel "${hotel}" not found. Using "Todas" instead.`);
        console.log('Available hotels:', hotelOptions.map(opt => opt.text).join(', '));
      }
    } else {
      console.log('✅ Using "Todas" (all hotels)');
    }
    
    await page.select('#ddlHoteis', selectedValue);
    console.log(`✅ Successfully selected hotel option (value: ${selectedValue})`);
        
    await new Promise(resolve => setTimeout(resolve, 2000));
        
    console.log('\n--- Setting Check-in Date ---');
    const currentDate = new Date();
    if (fridayDate) {
      nextFriday = new Date(fridayDate);
    } else {
      nextFriday = new Date(currentDate);
      const daysUntilFriday = (5 - currentDate.getDay() + 7) % 7;
      if (daysUntilFriday === 0 && currentDate.getDay() !== 5) {
        nextFriday.setDate(currentDate.getDate() + 7);
      } else {
        nextFriday.setDate(currentDate.getDate() + daysUntilFriday);
      }
    }
        
    const dayStr = String(nextFriday.getDate()).padStart(2, '0');
    const monthStr = String(nextFriday.getMonth() + 1).padStart(2, '0');
    const yearStr = nextFriday.getFullYear().toString();
    const checkinDate = `${dayStr}/${monthStr}/${yearStr}`;
        
    console.log(`Weekend Check-in Date: ${nextFriday.toLocaleDateString()} (Friday)`);
        
    await page.evaluate((date) => {
      const input = document.getElementById('txtCheckin'); // eslint-disable-line no-undef
      input.value = date;
      input.dispatchEvent(new Event('change', { bubbles: true }));
    }, checkinDate);
        
    console.log(`✅ Successfully set check-in date: ${checkinDate}`);
        
    console.log('\n--- Setting Check-out Date ---');
    if (sundayDate) {
      nextSunday = new Date(sundayDate);
    } else {
      nextSunday = new Date(nextFriday);
      nextSunday.setDate(nextFriday.getDate() + 2);
    }
        
    const sundayDayStr = String(nextSunday.getDate()).padStart(2, '0');
    const sundayMonthStr = String(nextSunday.getMonth() + 1).padStart(2, '0');
    const sundayYearStr = nextSunday.getFullYear().toString();
    const checkoutDate = `${sundayDayStr}/${sundayMonthStr}/${sundayYearStr}`;
        
    console.log(`Weekend Check-out Date: ${nextSunday.toLocaleDateString()} (Sunday)`);
        
    await page.evaluate((date) => {
      const input = document.getElementById('txtCheckout'); // eslint-disable-line no-undef
      input.value = date;
      input.dispatchEvent(new Event('change', { bubbles: true }));
      input.dispatchEvent(new Event('input', { bubbles: true }));
    }, checkoutDate);
        
    console.log(`✅ Successfully set check-out date: ${checkoutDate}`);
        
    console.log('\n--- Clicking btnConsulta Button ---');
    await page.waitForSelector('#btnConsulta', { timeout: 10000 });
    await page.click('#btnConsulta');
    console.log('✅ Successfully clicked btnConsulta button');
        
    console.log('Waiting for hotel vacancy query to complete...');
    await page.waitForSelector('#lyConsulta', { timeout: 15000 });
    
    // Wait for dynamic content to fully load (the page loads hotels progressively)
    console.log('Waiting for all hotels to load (progressive loading)...');
    await new Promise(resolve => setTimeout(resolve, 15000));
        
    console.log('✅ Query completed and lyConsulta element loaded');
        
    const lyConsultaContent = await page.evaluate(() => {
      const element = document.getElementById('lyConsulta'); // eslint-disable-line no-undef
      return element ? element.textContent || element.innerText : '';
    });
        
    const lyConsultaHTML = await page.evaluate(() => {
      const element = document.getElementById('lyConsulta'); // eslint-disable-line no-undef
      return element ? element.innerHTML : '';
    });
        
    console.log(`lyConsulta content length: ${lyConsultaContent.length} characters`);
        
    console.log('\n=== HOTEL VACANCY DETECTION ===');
        
    const noRoomMessage = 'No período escolhido não há nenhum quarto disponível na Unidade de Lazer selecionada. Lembramos que as reservas não pagas ou canceladas voltam para o site.';
    const hasNoRoomMessage = lyConsultaContent.includes(noRoomMessage);
        
    const hotelVacancyRegex = /(?:BLUES\s+)?(?:Triplo|Duplo|Apartamento|Chalé|Homem\s+de\s+Melo|Perdizes|Sumaré)\s*(?:Luxo|PcD)?\s*\(até\s+\d+\s+pessoas?\)[\s\n]*(?:\d{1,2}\/\d{1,2}\s*-\s*\d{1,2}\/\d{1,2}\s*\(\d+\s+dias?\s+livres?\)\s*-\s*\d+\s+Quarto\(s\)(?:\s*-\s*adaptado)?[\s\n]*)+/gi;
    const vacancyMatches = lyConsultaContent.match(hotelVacancyRegex) || [];
        
    console.log(`Found ${vacancyMatches.length} vacancy pattern(s)`);
        
    const pageSource = lyConsultaHTML;
    const foundVacancies = [];
    let hasActualAvailability = false;
        
    const hotelSections = pageSource.split(/<div class="cc_tit">/i);
        
    for (let i = 1; i < hotelSections.length; i++) {
      const section = hotelSections[i];
      const hotelNameMatch = section.match(/^([^<]+)</);
      const rawHotelName = hotelNameMatch ? hotelNameMatch[1].trim() : 'Unknown Hotel';
      const hotelName = rawHotelName.replace(/<[^>]*>/g, '').replace(/\s+/g, ' ').trim();
            
      if (new RegExp(noRoomMessage.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'i').test(section)) {
        continue;
      }
            
      const vacancyPatterns = [
        /<b>([^<]+)<\/b>\s*<br>\s*((?:\d{1,2}\/\d{1,2}\s*-\s*\d{1,2}\/\d{1,2}\s*\([^)]+\)\s*-\s*\d+\s+Quarto\(s\)(?:\s*-\s*adaptado)?\s*<br>\s*)+)/gim
      ];
            
      vacancyPatterns.forEach(pattern => {
        let match;
        while ((match = pattern.exec(section)) !== null) {
          const roomName = match[1].trim();
          const allVacancyLines = match[2].trim();
          
          // Split individual date/room entries
          const datePattern = /(\d{1,2}\/\d{1,2}\s*-\s*\d{1,2}\/\d{1,2}\s*\([^)]+\)\s*-\s*\d+\s+Quarto\(s\)(?:\s*-\s*adaptado)?)/g;
          const dateMatches = allVacancyLines.match(datePattern);
          
          if (dateMatches) {
            dateMatches.forEach(dateEntry => {
              const cleanEntry = dateEntry.replace(/\s+/g, ' ').trim();
              const cleanVacancy = `${roomName}${cleanEntry}`;
              
              const vacancyInfo = {
                hotel: hotelName,
                vacancy: cleanVacancy,
                fullText: `${hotelName}: ${cleanVacancy}`
              };
                            
              if (!foundVacancies.some(v => v.fullText === vacancyInfo.fullText)) {
                foundVacancies.push(vacancyInfo);
                hasActualAvailability = true;
              }
            });
          }
        }
      });
    }
        
    if (hasActualAvailability && foundVacancies.length > 0) {
      const hotelGroups = {};
      foundVacancies.forEach(vacancy => {
        if (!hotelGroups[vacancy.hotel]) {
          hotelGroups[vacancy.hotel] = [];
        }
        hotelGroups[vacancy.hotel].push(vacancy.vacancy);
      });
            
      console.log(`\n✅ Found vacancies in ${Object.keys(hotelGroups).length} hotel(s)`);
            
      return {
        hasAvailability: true,
        status: 'AVAILABLE',
        summary: `Found vacancies in ${Object.keys(hotelGroups).length} hotel(s): ${Object.keys(hotelGroups).join(', ')}`,
        vacancies: foundVacancies.map(v => v.fullText),
        hotelGroups: hotelGroups
      };
    } else {
      console.log('\n🔴 No vacancies available');
      return {
        hasAvailability: false,
        status: 'NO AVAILABILITY',
        summary: hasNoRoomMessage ? 'No rooms available message detected' : 'No vacancy patterns found',
        vacancies: [],
        hotelGroups: {}
      };
    }
        
  } catch (error) {
    console.error('An error occurred:', error);
    return {
      status: 'ERROR',
      summary: `Error: ${error.message}`,
      vacancies: []
    };
  } finally {
    await page.close();
    console.log('Page closed.');
  }
}

// Clean up browser pool on process exit
process.on('exit', async () => {
  await browserPool.closeBrowser();
});

process.on('SIGINT', async () => {
  await browserPool.closeBrowser();
  process.exit(0);
});

process.on('SIGTERM', async () => {
  await browserPool.closeBrowser();
  process.exit(0);
});

export { openVagasPage };
