const mongoose = require('mongoose');
const logger = require('../logger');

const comentarioSchema = new mongoose.Schema(
  {
    post: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Post',
      required: [true, 'O post é obrigatório.'],
    },
    autor: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Usuario',
      required: [true, 'O autor é obrigatório.'],
    },
    conteudo: {
      type: String,
      required: [true, 'O conteúdo é obrigatório.'],
      maxlength: [280, 'O comentário pode ter no máximo 280 caracteres.'],
      trim: true,
    },
  },
  { timestamps: true }
);

const ComentarioModel = mongoose.model('Comentario', comentarioSchema);

class Comentario {
  static async inserir(dados) {
    try {
      if (!dados.post) throw new Error('Campo obrigatório ausente: post.');
      if (!dados.autor) throw new Error('Campo obrigatório ausente: autor.');
      if (!dados.conteudo) throw new Error('Campo obrigatório ausente: conteudo.');

      const comentario = new ComentarioModel(dados);
      const salvo = await comentario.save();
      logger.info(`Comentário inserido: id=${salvo._id} no post=${salvo.post}`);
      return salvo;
    } catch (err) {
      logger.erro(`Comentario.inserir: ${err.message}`);
      throw err;
    }
  }

  static async buscarPorPost(postId) {
    try {
      if (!postId) throw new Error('postId é obrigatório para a busca.');
      return await ComentarioModel.find({ post: postId })
        .populate('autor', 'nome username')
        .sort({ createdAt: 1 });
    } catch (err) {
      logger.erro(`Comentario.buscarPorPost: ${err.message}`);
      throw err;
    }
  }

  static async buscarPorAutor(autorId) {
    try {
      if (!autorId) throw new Error('autorId é obrigatório para a busca.');
      return await ComentarioModel.find({ autor: autorId })
        .populate('post', 'conteudo')
        .sort({ createdAt: -1 });
    } catch (err) {
      logger.erro(`Comentario.buscarPorAutor: ${err.message}`);
      throw err;
    }
  }

  static async deletar(id) {
    try {
      if (!id) throw new Error('id é obrigatório para deletar.');
      const resultado = await ComentarioModel.findByIdAndDelete(id);
      if (resultado) logger.info(`Comentário deletado: id=${id}`);
      return resultado;
    } catch (err) {
      logger.erro(`Comentario.deletar: ${err.message}`);
      throw err;
    }
  }
}

module.exports = { Comentario };