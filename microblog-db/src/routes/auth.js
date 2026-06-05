const express = require('express');
const router = express.Router();
const { Usuario } = require('../models/Usuario');

// POST /auth/cadastro
router.post('/cadastro', async (req, res) => {
  const { nome, username, email, senha, bio } = req.body;

  if (!nome || !username || !email || !senha) {
    return res.status(400).json({ erro: 'Campos obrigatórios: nome, username, email, senha.' });
  }

  try {
    const usuarioExistente = await Usuario.buscarPorUsername(username);
    if (usuarioExistente) {
      return res.status(400).json({ erro: 'Username já está em uso.' });
    }

    const emailExistente = await Usuario.buscarPorEmail(email);
    if (emailExistente) {
      return res.status(400).json({ erro: 'E-mail já cadastrado.' });
    }

    const novo = await Usuario.inserir({ nome, username, email, senha, bio });
    const { senha: _, ...usuarioSemSenha } = novo.toObject();

    return res.status(201).json({ mensagem: 'Usuário cadastrado com sucesso.', usuario: usuarioSemSenha });
  } catch (err) {
    return res.status(400).json({ erro: err.message });
  }
});

// POST /auth/login
router.post('/login', async (req, res) => {
  const { username, senha } = req.body;

  if (!username || !senha) {
    return res.status(400).json({ erro: 'Campos obrigatórios: username e senha.' });
  }

  try {
    const usuario = await Usuario.buscarPorUsername(username);

    if (!usuario || usuario.senha !== senha) {
      return res.status(401).json({ erro: 'Username ou senha inválidos.' });
    }

    req.session.usuario = {
      _id: usuario._id,
      nome: usuario.nome,
      username: usuario.username,
      email: usuario.email,
      bio: usuario.bio,
    };

    return res.json({ mensagem: 'Login realizado com sucesso.', usuario: req.session.usuario });
  } catch (err) {
    return res.status(500).json({ erro: err.message });
  }
});

// POST /auth/logout
router.post('/logout', (req, res) => {
  req.session.destroy((err) => {
    if (err) return res.status(500).json({ erro: 'Erro ao encerrar sessão.' });
    return res.json({ mensagem: 'Logout realizado com sucesso.' });
  });
});

// GET /auth/me — retorna o usuário logado
router.get('/me', (req, res) => {
  if (!req.session.usuario) {
    return res.status(401).json({ erro: 'Não há sessão ativa.' });
  }
  return res.json({ usuario: req.session.usuario });
});

module.exports = router;