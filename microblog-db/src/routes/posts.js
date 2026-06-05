const express = require('express');
const router = express.Router();
const { Post } = require('../models/Post');
const { autenticado } = require('../middlewares/auth');

// GET /posts — lista posts recentes (requer login)
router.get('/', autenticado, async (req, res) => {
  try {
    const limite = parseInt(req.query.limite) || 20;
    const posts = await Post.listarRecentes(limite);
    return res.json({ posts });
  } catch (err) {
    return res.status(500).json({ erro: err.message });
  }
});

// GET /posts/hashtag/:tag — busca por hashtag (requer login)
router.get('/hashtag/:tag', autenticado, async (req, res) => {
  const { tag } = req.params;

  try {
    const posts = await Post.buscarPorHashtag(tag);
    return res.json({ posts });
  } catch (err) {
    return res.status(500).json({ erro: err.message });
  }
});

// GET /posts/autor/:autorId — posts de um autor (requer login)
router.get('/autor/:autorId', autenticado, async (req, res) => {
  const { autorId } = req.params;

  try {
    const posts = await Post.buscarPorAutor(autorId);
    return res.json({ posts });
  } catch (err) {
    return res.status(500).json({ erro: err.message });
  }
});

// GET /posts/:id — busca post por id (requer login)
router.get('/:id', autenticado, async (req, res) => {
  const { id } = req.params;

  try {
    const post = await Post.buscarPorId(id);
    if (!post) return res.status(404).json({ erro: 'Post não encontrado.' });
    return res.json({ post });
  } catch (err) {
    return res.status(500).json({ erro: err.message });
  }
});

// POST /posts — criar post (requer login)
router.post('/', autenticado, async (req, res) => {
  const { conteudo, hashtags } = req.body;

  if (!conteudo) {
    return res.status(400).json({ erro: 'Campo obrigatório: conteudo.' });
  }

  if (conteudo.length > 280) {
    return res.status(400).json({ erro: 'O conteúdo não pode ter mais de 280 caracteres.' });
  }

  try {
    const post = await Post.inserir({
      autor: req.session.usuario._id,
      conteudo,
      hashtags: hashtags || [],
    });
    return res.status(201).json({ mensagem: 'Post criado com sucesso.', post });
  } catch (err) {
    return res.status(400).json({ erro: err.message });
  }
});

// POST /posts/:id/curtir — curtir post (requer login)
router.post('/:id/curtir', autenticado, async (req, res) => {
  const { id } = req.params;

  try {
    const post = await Post.curtir(id);
    if (!post) return res.status(404).json({ erro: 'Post não encontrado.' });
    return res.json({ mensagem: 'Post curtido!', curtidas: post.curtidas });
  } catch (err) {
    return res.status(500).json({ erro: err.message });
  }
});

// DELETE /posts/:id — deletar post (só o autor pode)
router.delete('/:id', autenticado, async (req, res) => {
  const { id } = req.params;

  try {
    const post = await Post.buscarPorId(id);
    if (!post) return res.status(404).json({ erro: 'Post não encontrado.' });

    if (post.autor._id.toString() !== req.session.usuario._id.toString()) {
      return res.status(403).json({ erro: 'Você só pode deletar seus próprios posts.' });
    }

    await Post.deletar(id);
    return res.json({ mensagem: 'Post deletado com sucesso.' });
  } catch (err) {
    return res.status(500).json({ erro: err.message });
  }
});

module.exports = router;