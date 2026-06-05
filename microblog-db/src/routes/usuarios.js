const express = require('express');
const router = express.Router();
const { Usuario } = require('../models/Usuario');
const { autenticado } = require('../middlewares/auth');

// GET /usuarios — lista todos (requer login)
router.get('/', autenticado, async (req, res) => {
  try {
    const usuarios = await Usuario.listarTodos();
    return res.json({ usuarios });
  } catch (err) {
    return res.status(500).json({ erro: err.message });
  }
});

// GET /usuarios/:username — busca perfil por username (requer login)
router.get('/:username', autenticado, async (req, res) => {
  const { username } = req.params;

  try {
    const usuario = await Usuario.buscarPorUsername(username);
    if (!usuario) {
      return res.status(404).json({ erro: 'Usuário não encontrado.' });
    }
    const { senha: _, ...perfil } = usuario.toObject();
    return res.json({ usuario: perfil });
  } catch (err) {
    return res.status(500).json({ erro: err.message });
  }
});

// DELETE /usuarios/:id — deleta usuário (só pode deletar a si mesmo)
router.delete('/:id', autenticado, async (req, res) => {
  const { id } = req.params;

  if (req.session.usuario._id.toString() !== id) {
    return res.status(403).json({ erro: 'Você só pode deletar sua própria conta.' });
  }

  try {
    const resultado = await Usuario.deletar(id);
    if (!resultado) return res.status(404).json({ erro: 'Usuário não encontrado.' });

    req.session.destroy();
    return res.json({ mensagem: 'Conta deletada com sucesso.' });
  } catch (err) {
    return res.status(500).json({ erro: err.message });
  }
});

module.exports = router;