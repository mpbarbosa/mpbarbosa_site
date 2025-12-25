/**
 * Booking Rules Utilities
 * Validates booking dates against holiday package rules
 * 
 * Business Rules:
 * - BR-18: Holiday reservation periods are pre-defined as closed packages
 * - BR-19: Reservations cannot be made on different dates during holiday periods (by default)
 * - BR-20: Booking rules can be optionally disabled via applyBookingRules parameter
 * 
 * @module utils/bookingRules
 * @version 1.5.0
 * @since 1.4.0
 */

/**
 * Holiday package definitions
 */
export const HOLIDAY_PACKAGES = {
  CHRISTMAS: {
    name: 'Christmas Package',
    startMonth: 11, // December (0-indexed)
    startDay: 22,
    endMonth: 11, // December
    endDay: 27,
    duration: '5 days/4 nights'
  },
  NEW_YEAR: {
    name: 'New Year Package',
    startMonth: 11, // December (0-indexed)
    startDay: 27,
    endMonth: 0, // January (0-indexed)
    endDay: 2,
    duration: '6 days/5 nights'
  }
};

/**
 * Parse date string in YYYY-MM-DD format
 * @param {string} dateString - Date in YYYY-MM-DD format
 * @returns {Date} Parsed date object
 */
const parseDate = (dateString) => {
  // Validate YYYY-MM-DD format
  if (!/^\d{4}-\d{2}-\d{2}$/.test(dateString)) {
    return new Date('invalid');
  }
  
  const [year, month, day] = dateString.split('-').map(Number);
  
  // Validate month and day ranges
  if (month < 1 || month > 12 || day < 1 || day > 31) {
    return new Date('invalid');
  }
  
  return new Date(year, month - 1, day); // month is 0-indexed in Date
};

/**
 * Check if a date falls within Christmas package period
 * @param {Date} date - Date to check
 * @returns {boolean} True if date is in Christmas period
 */
const isInChristmasPeriod = (date) => {
  const month = date.getMonth();
  const day = date.getDate();
  
  return month === HOLIDAY_PACKAGES.CHRISTMAS.startMonth && 
         day >= HOLIDAY_PACKAGES.CHRISTMAS.startDay && 
         day <= HOLIDAY_PACKAGES.CHRISTMAS.endDay;
};

/**
 * Check if a date falls within New Year package period
 * @param {Date} date - Date to check
 * @returns {boolean} True if date is in New Year period
 */
const isInNewYearPeriod = (date) => {
  const month = date.getMonth();
  const day = date.getDate();
  
  // Check December 27-31
  if (month === HOLIDAY_PACKAGES.NEW_YEAR.startMonth && 
      day >= HOLIDAY_PACKAGES.NEW_YEAR.startDay) {
    return true;
  }
  
  // Check January 1-2
  if (month === HOLIDAY_PACKAGES.NEW_YEAR.endMonth && 
      day <= HOLIDAY_PACKAGES.NEW_YEAR.endDay) {
    return true;
  }
  
  return false;
};

/**
 * Validate if dates match the Christmas package exactly
 * @param {Date} checkinDate - Check-in date
 * @param {Date} checkoutDate - Check-out date
 * @returns {boolean} True if dates match Christmas package
 */
const isValidChristmasPackage = (checkinDate, checkoutDate) => {
  const checkinMonth = checkinDate.getMonth();
  const checkinDay = checkinDate.getDate();
  const checkoutMonth = checkoutDate.getMonth();
  const checkoutDay = checkoutDate.getDate();
  
  return checkinMonth === HOLIDAY_PACKAGES.CHRISTMAS.startMonth &&
         checkinDay === HOLIDAY_PACKAGES.CHRISTMAS.startDay &&
         checkoutMonth === HOLIDAY_PACKAGES.CHRISTMAS.endMonth &&
         checkoutDay === HOLIDAY_PACKAGES.CHRISTMAS.endDay;
};

/**
 * Validate if dates match the New Year package exactly
 * @param {Date} checkinDate - Check-in date
 * @param {Date} checkoutDate - Check-out date
 * @returns {boolean} True if dates match New Year package
 */
const isValidNewYearPackage = (checkinDate, checkoutDate) => {
  const checkinMonth = checkinDate.getMonth();
  const checkinDay = checkinDate.getDate();
  const checkoutMonth = checkoutDate.getMonth();
  const checkoutDay = checkoutDate.getDate();
  const checkinYear = checkinDate.getFullYear();
  const checkoutYear = checkoutDate.getFullYear();
  
  // New Year package spans two years
  return checkinMonth === HOLIDAY_PACKAGES.NEW_YEAR.startMonth &&
         checkinDay === HOLIDAY_PACKAGES.NEW_YEAR.startDay &&
         checkoutMonth === HOLIDAY_PACKAGES.NEW_YEAR.endMonth &&
         checkoutDay === HOLIDAY_PACKAGES.NEW_YEAR.endDay &&
         checkoutYear === checkinYear + 1; // Must cross year boundary
};

/**
 * Validate booking dates against holiday package rules
 * 
 * @param {string} checkin - Check-in date in YYYY-MM-DD format
 * @param {string} checkout - Check-out date in YYYY-MM-DD format
 * @returns {Object} Validation result with success flag and error message
 * 
 * @example
 * // Valid Christmas package
 * validateBookingDates('2024-12-22', '2024-12-27')
 * // Returns: { valid: true }
 * 
 * @example
 * // Invalid - partial Christmas period
 * validateBookingDates('2024-12-23', '2024-12-26')
 * // Returns: { valid: false, error: '...', package: 'Christmas Package' }
 */
export const validateBookingDates = (checkin, checkout) => {
  try {
    // Parse dates
    const checkinDate = parseDate(checkin);
    const checkoutDate = parseDate(checkout);
    
    // Basic validation
    if (isNaN(checkinDate.getTime()) || isNaN(checkoutDate.getTime())) {
      return {
        valid: false,
        error: 'Invalid date format. Please use YYYY-MM-DD format.',
        code: 'INVALID_DATE_FORMAT'
      };
    }
    
    if (checkoutDate <= checkinDate) {
      return {
        valid: false,
        error: 'Check-out date must be after check-in date.',
        code: 'INVALID_DATE_RANGE'
      };
    }
    
    // First check if dates match valid packages exactly
    const isValidChristmas = isValidChristmasPackage(checkinDate, checkoutDate);
    const isValidNewYear = isValidNewYearPackage(checkinDate, checkoutDate);
    
    // If matches a valid package, it's valid
    if (isValidChristmas || isValidNewYear) {
      return {
        valid: true,
        message: 'Booking dates are valid'
      };
    }
    
    // Check which holiday period the dates fall into
    const checkinInChristmas = isInChristmasPeriod(checkinDate);
    const checkoutInChristmas = isInChristmasPeriod(checkoutDate);
    const checkinInNewYear = isInNewYearPeriod(checkinDate);
    const checkoutInNewYear = isInNewYearPeriod(checkoutDate);
    
    // Priority logic for overlapping dates (Dec 27 is in both periods):
    // 1. If checkout is in January (crossing year boundary), it's New Year package
    // 2. If checkin is before Dec 27, it's Christmas package
    // 3. Otherwise, determine by which period the dates mostly fall into
    
    const checkoutMonth = checkoutDate.getMonth();
    const checkinDay = checkinDate.getDate();
    const checkinMonth = checkinDate.getMonth();
    
    // If checkout is in January (0), this is clearly New Year package
    if (checkoutMonth === 0) {
      if (checkinInNewYear || checkoutInNewYear) {
        return {
          valid: false,
          error: 'New Year package requires check-in on December 27 and check-out on January 2. Custom dates are not allowed during this period.',
          code: 'INVALID_NEW_YEAR_PACKAGE',
          package: HOLIDAY_PACKAGES.NEW_YEAR.name,
          requiredDates: {
            checkin: 'December 27',
            checkout: 'January 2 (next year)',
            format: 'YYYY-12-27 to YYYY+1-01-02'
          }
        };
      }
    }
    
    // If checkin is in Christmas period (Dec 22-26, or Dec 27 with checkout in December)
    if (checkinInChristmas || (checkoutInChristmas && checkinMonth === 11 && checkinDay < 27)) {
      return {
        valid: false,
        error: 'Christmas package requires check-in on December 22 and check-out on December 27. Custom dates are not allowed during this period.',
        code: 'INVALID_CHRISTMAS_PACKAGE',
        package: HOLIDAY_PACKAGES.CHRISTMAS.name,
        requiredDates: {
          checkin: 'December 22',
          checkout: 'December 27',
          format: 'YYYY-12-22 to YYYY-12-27'
        }
      };
    }
    
    // If dates fall within New Year period (Dec 27-31 or Jan 1-2)
    if (checkinInNewYear || checkoutInNewYear) {
      return {
        valid: false,
        error: 'New Year package requires check-in on December 27 and check-out on January 2. Custom dates are not allowed during this period.',
        code: 'INVALID_NEW_YEAR_PACKAGE',
        package: HOLIDAY_PACKAGES.NEW_YEAR.name,
        requiredDates: {
          checkin: 'December 27',
          checkout: 'January 2 (next year)',
          format: 'YYYY-12-27 to YYYY+1-01-02'
        }
      };
    }
    
    // All validations passed
    return {
      valid: true,
      message: 'Booking dates are valid'
    };
    
  } catch (error) {
    return {
      valid: false,
      error: 'Error validating booking dates: ' + error.message,
      code: 'VALIDATION_ERROR'
    };
  }
};

/**
 * Get holiday package information for a date range
 * @param {string} checkin - Check-in date in YYYY-MM-DD format
 * @param {string} checkout - Check-out date in YYYY-MM-DD format
 * @returns {Object|null} Package information or null if not a holiday package
 */
export const getHolidayPackageInfo = (checkin, checkout) => {
  const checkinDate = parseDate(checkin);
  const checkoutDate = parseDate(checkout);
  
  if (isValidChristmasPackage(checkinDate, checkoutDate)) {
    return {
      ...HOLIDAY_PACKAGES.CHRISTMAS,
      isHolidayPackage: true,
      type: 'CHRISTMAS'
    };
  }
  
  if (isValidNewYearPackage(checkinDate, checkoutDate)) {
    return {
      ...HOLIDAY_PACKAGES.NEW_YEAR,
      isHolidayPackage: true,
      type: 'NEW_YEAR'
    };
  }
  
  return null;
};

/**
 * Check if a date range is a holiday package
 * @param {string} checkin - Check-in date in YYYY-MM-DD format
 * @param {string} checkout - Check-out date in YYYY-MM-DD format
 * @returns {boolean} True if dates represent a holiday package
 */
export const isHolidayPackage = (checkin, checkout) => {
  return getHolidayPackageInfo(checkin, checkout) !== null;
};
