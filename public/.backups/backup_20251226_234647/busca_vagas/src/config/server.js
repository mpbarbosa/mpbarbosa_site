/**
 * Server Configuration
 * Configure server settings via environment variables
 * 
 * @module config/server
 * @version 1.4.0
 * @since 1.0.0
 */

export const port = process.env.PORT || 3000;
export const env = process.env.NODE_ENV || 'development';
export const clientUrl = process.env.CLIENT_URL || 'http://localhost:3001';

export default {
  port,
  env,
  clientUrl
};

