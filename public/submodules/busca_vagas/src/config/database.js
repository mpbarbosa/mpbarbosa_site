/**
 * Configuração do banco de dados
 * Descomente e configure conforme necessário
 */
export const host = process.env.DB_HOST || 'localhost';
export const port = process.env.DB_PORT || 5432;
export const database = process.env.DB_NAME || 'busca_vagas';
export const user = process.env.DB_USER || 'postgres';
export const password = process.env.DB_PASSWORD || '';

export default {
  host,
  port,
  database,
  user,
  password
};
