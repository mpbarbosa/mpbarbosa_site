/**
 * Configuração do servidor
 */
export const port = process.env.PORT || 3000;
export const env = process.env.NODE_ENV || 'development';
export const clientUrl = process.env.CLIENT_URL || 'http://localhost:3001';

export default {
  port,
  env,
  clientUrl
};
