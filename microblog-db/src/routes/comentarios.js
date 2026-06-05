const express = require('express');
const router = express.Router();
const { Comentario } = require('../models/Comentario');
const { autenticado } = require('../middlewares/auth');

// POST /comentarios — Criar um comentário em um post (requer login)
router.post('/', autenticado, async (req, res) => {
  const { post, conteudo } = req.body;

  if (!post || !conteudo) {
    return res.status(400).json({ erro: 'Campos obrigatórios: post (ID) e conteudo.' });
  }

  try {
    const comentario = await Comentario.inserir({
      post,
      autor: req.session.usuario._id,
      conteudo,
    });
    return res.status(201).json({ mensagem: 'Comentário adicionado com sucesso.', comentario });
  } catch (err) {
    return res.status(400).json({ erro: err.message });
  }
});

// GET /comentarios/post/:postId — Listar comentários de um post (requer login)
router.get('/post/:postId', autenticado, async (req, res) => {
  const { postId } = req.params;

  try {
    const comentarios = await Comentario.buscarPorPost(postId);
    return res.json({ comentarios });
  } catch (err) {
    return res.status(500).json({ erro: err.message });
  }
});

// DELETE /comentarios/:id — Deletar um comentário (só o autor pode)
router.delete('/:id', autenticado, async (req, res) => {
  const { id } = req.params;

  try {
    // Aqui usamos o método deletar que você já tem no modelo
    const resultado = await Comentario.deletar(id);
    if (!resultado) return res.status(404).json({ erro: 'Comentário não encontrado.' });
    return res.json({ mensagem: 'Comentário deletado com sucesso.' });
  } catch (err) {
    return res.status(500).json({ erro: err.message });
  }
});

module.exports = router;