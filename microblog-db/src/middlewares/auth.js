function autenticado(req, res, next) {
  if (req.session && req.session.usuario) {
    return next();
  }
  return res.status(401).json({ erro: 'Não autorizado. Faça login primeiro.' });
}

module.exports = { autenticado };