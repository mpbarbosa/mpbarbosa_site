/**
 * Middleware de validação de dados
 * Exemplo de middleware para validar dados de entrada
 */
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
