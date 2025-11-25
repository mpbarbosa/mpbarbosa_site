/**
 * Middleware de autenticação
 * Exemplo de middleware para validar tokens de autenticação
 */
export const authMiddleware = (req, res, next) => {
  try {
    const token = req.headers.authorization;
    
    if (!token) {
      return res.status(401).json({ error: 'Token não fornecido' });
    }

    // TODO: Implementar validação de token
    // const decoded = jwt.verify(token, process.env.API_SECRET);
    // req.user = decoded;
    
    next();
  } catch (error) {
    res.status(401).json({ error: 'Token inválido' });
  }
};

export default authMiddleware;
