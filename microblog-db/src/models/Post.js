const mongoose = require('mongoose');
const logger = require('../logger');

const postSchema = new mongoose.Schema(
  {
    autor: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Usuario',
      required: [true, 'O autor é obrigatório.'],
    },
    conteudo: {
      type: String,
      required: [true, 'O conteúdo é obrigatório.'],
      maxlength: [280, 'O post pode ter no máximo 280 caracteres.'],
      trim: true,
    },
    hashtags: {
      type: [String],
      default: [],
    },
    curtidas: {
      type: Number,
      default: 0,
    },
  },
  { timestamps: true }
);

const PostModel = mongoose.model('Post', postSchema);

class Post {
  static async inserir(dados) {
    try {
      if (!dados.autor) throw new Error('Campo obrigatório ausente: autor.');
      if (!dados.conteudo) throw new Error('Campo obrigatório ausente: conteudo.');

      const post = new PostModel(dados);
      const salvo = await post.save();
      logger.info(`Post inserido: id=${salvo._id}`);
      return salvo;
    } catch (err) {
      logger.erro(`Post.inserir: ${err.message}`);
      throw err;
    }
  }

  static async buscarPorId(id) {
    try {
      if (!id) throw new Error('id é obrigatório para a busca.');
      return await PostModel.findById(id).populate('autor', 'nome username');
    } catch (err) {
      logger.erro(`Post.buscarPorId: ${err.message}`);
      throw err;
    }
  }

  static async buscarPorAutor(autorId) {
    try {
      if (!autorId) throw new Error('autorId é obrigatório para a busca.');
      return await PostModel.find({ autor: autorId })
        .populate('autor', 'nome username')
        .sort({ createdAt: -1 });
    } catch (err) {
      logger.erro(`Post.buscarPorAutor: ${err.message}`);
      throw err;
    }
  }

  static async buscarPorHashtag(hashtag) {
    try {
      if (!hashtag) throw new Error('hashtag é obrigatória para a busca.');
      return await PostModel.find({ hashtags: hashtag.toLowerCase() })
        .populate('autor', 'nome username')
        .sort({ createdAt: -1 });
    } catch (err) {
      logger.erro(`Post.buscarPorHashtag: ${err.message}`);
      throw err;
    }
  }

  static async listarRecentes(limite = 20) {
    try {
      return await PostModel.find()
        .populate('autor', 'nome username')
        .sort({ createdAt: -1 })
        .limit(limite);
    } catch (err) {
      logger.erro(`Post.listarRecentes: ${err.message}`);
      throw err;
    }
  }

  static async curtir(id) {
    try {
      if (!id) throw new Error('id é obrigatório para curtir.');
      return await PostModel.findByIdAndUpdate(
        id,
        { $inc: { curtidas: 1 } },
        { returnDocument: 'after' }
      );
    } catch (err) {
      logger.erro(`Post.curtir: ${err.message}`);
      throw err;
    }
  }

  static async deletar(id) {
    try {
      if (!id) throw new Error('id é obrigatório para deletar.');
      const resultado = await PostModel.findByIdAndDelete(id);
      if (resultado) logger.info(`Post deletado: id=${id}`);
      return resultado;
    } catch (err) {
      logger.erro(`Post.deletar: ${err.message}`);
      throw err;
    }
  }
}

module.exports = { Post };