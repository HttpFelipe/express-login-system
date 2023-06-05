const jwt = require('jsonwebtoken');

/**
 * Gera um token de autenticação com base no ID do usuário.
 * @param {string} userId - ID do usuário.
 * @returns {string} Token de autenticação.
 */
function generateAuthToken(userId) {
  const token = jwt.sign({ userId }, 'example');
  return token;
}

/**
 * Middleware para verificar o token de autenticação.
 * @param {object} req - Objeto de requisição.
 * @param {object} res - Objeto de resposta.
 * @param {function} next - Função de próximo middleware.
 */
function verifyAuthToken(req, res, next) {
  const token = req.cookies.token;
  
  if (!token) {
    return res.redirect('/'); // Redireciona para a página de login se não houver token
  }
  
  jwt.verify(token, 'example', (err, decoded) => {
    if (err) {
      return res.redirect('/'); // Redireciona para a página de login se houver algum erro com o token
    }
    
    req.userId = decoded.userId; // Armazena o ID do usuário decodificado na requisição
    next();
  });
}

module.exports = {
  generateAuthToken,
  verifyAuthToken
};
