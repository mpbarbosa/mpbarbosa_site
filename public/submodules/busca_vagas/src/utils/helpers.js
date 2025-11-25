/**
 * Utilitários gerais
 */

/**
 * Gera um ID único
 */
export const gerarId = () => {
  return Date.now().toString(36) + Math.random().toString(36).substr(2);
};

/**
 * Formata resposta de sucesso
 */
export const respostaSucesso = (data, mensagem = 'Sucesso') => {
  return {
    sucesso: true,
    mensagem,
    data
  };
};

/**
 * Formata resposta de erro
 */
export const respostaErro = (mensagem, erros = []) => {
  return {
    sucesso: false,
    mensagem,
    erros
  };
};

/**
 * Valida email
 */
export const validarEmail = (email) => {
  const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return regex.test(email);
};
