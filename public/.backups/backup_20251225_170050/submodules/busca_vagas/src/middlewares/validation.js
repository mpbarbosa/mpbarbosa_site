/**
 * Validation Middleware
 * Validates input data for API requests
 * 
 * @module middlewares/validation
 * @version 1.5.0
 * @since 1.0.0
 */

import { validateBookingDates, getHolidayPackageInfo } from '../utils/bookingRules.js';

export const validarVaga = (req, res, next) => {
  const { titulo, hotel, sindicato } = req.body;

  if (!titulo) {
    return res.status(400).json({ error: 'Título é obrigatório' });
  }

  if (!hotel) {
    return res.status(400).json({ error: 'Hotel é obrigatório' });
  }

  if (!sindicato) {
    return res.status(400).json({ error: 'Sindicato é obrigatório' });
  }

  next();
};

/**
 * Validate booking dates according to holiday package rules (BR-18, BR-19, BR-20)
 * 
 * This middleware validates that:
 * - Christmas package (Dec 22-27) requires exact dates (by default)
 * - New Year package (Dec 27-Jan 2) requires exact dates (by default)
 * - No partial or custom dates during holiday periods (by default)
 * - Rules can be bypassed with applyBookingRules=false parameter
 * 
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 * @param {Function} next - Express next middleware function
 */
export const validateBookingRules = (req, res, next) => {
  const { checkin, checkout, applyBookingRules } = req.query;
  
  // Skip validation if dates are not provided (will be caught by other validation)
  if (!checkin || !checkout) {
    return next();
  }
  
  // Check if booking rules should be applied (default: true)
  const shouldApplyRules = applyBookingRules === undefined || 
                           applyBookingRules === 'true' || 
                           applyBookingRules === true;
  
  // If rules are disabled, skip validation but still check for holiday package info
  if (!shouldApplyRules) {
    const packageInfo = getHolidayPackageInfo(checkin, checkout);
    if (packageInfo) {
      req.holidayPackage = packageInfo;
    }
    req.bookingRulesBypassed = true;
    return next();
  }
  
  // Validate booking dates
  const validation = validateBookingDates(checkin, checkout);
  
  if (!validation.valid) {
    return res.status(400).json({
      success: false,
      error: validation.error,
      code: validation.code,
      package: validation.package,
      requiredDates: validation.requiredDates,
      providedDates: {
        checkin,
        checkout
      },
      documentation: {
        businessRules: ['BR-18', 'BR-19', 'BR-20'],
        reference: 'See docs/api/FUNCTIONAL_REQUIREMENTS.md#631-booking-rules',
        bypassOption: 'Add applyBookingRules=false to search custom dates during holiday periods'
      }
    });
  }
  
  // Add holiday package info to request if applicable
  const packageInfo = getHolidayPackageInfo(checkin, checkout);
  if (packageInfo) {
    req.holidayPackage = packageInfo;
  }
  
  next();
};
