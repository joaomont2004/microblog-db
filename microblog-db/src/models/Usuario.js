const mongoose = require('mongoose');
const logger = require('../logger');

const usuarioSchema = new mongoose.Schema(
  {
    nome: {
      type: String,
      required: [true, 'O nome é obrigatório.'],
      trim: true,
    },
    username: {
      type: String,
      required: [true, 'O username é obrigatório.'],
      unique: true,
      trim: true,
      lowercase: true,
      minlength: [3, 'O username deve ter pelo menos 3 caracteres.'],
    },
    email: {
      type: String,
      required: [true, 'O e-mail é obrigatório.'],
      unique: true,
      trim: true,
      lowercase: true,
      match: [/\S+@\S+\.\S+/, 'E-mail inválido.'],
    },
    senha: {
      type: String,
      required: [true, 'A senha é obrigatória.'],
      minlength: [6, 'A senha deve ter pelo menos 6 caracteres.'],
    },
    bio: {
      type: String,
      maxlength: [160, 'A bio pode ter no máximo 160 caracteres.'],
      default: '',
    },
  },
  { timestamps: true }
);

const UsuarioModel = mongoose.model('Usuario', usuarioSchema);

class Usuario {
  static async inserir(dados) {
    try {
      if (!dados.nome) throw new Error('Campo obrigatório ausente: nome.');
      if (!dados.username) throw new Error('Campo obrigatório ausente: username.');
      if (!dados.email) throw new Error('Campo obrigatório ausente: email.');
      if (!dados.senha) throw new Error('Campo obrigatório ausente: senha.');

      const usuario = new UsuarioModel(dados);
      const salvo = await usuario.save();
      logger.info(`Usuário inserido: ${salvo.username}`);
      return salvo;
    } catch (err) {
      logger.erro(`Usuario.inserir: ${err.message}`);
      throw err;
    }
  }

  static async buscarPorUsername(username) {
    try {
      if (!username) throw new Error('username é obrigatório para a busca.');
      return await UsuarioModel.findOne({ username: username.toLowerCase() });
    } catch (err) {
      logger.erro(`Usuario.buscarPorUsername: ${err.message}`);
      throw err;
    }
  }

  static async buscarPorEmail(email) {
    try {
      if (!email) throw new Error('email é obrigatório para a busca.');
      return await UsuarioModel.findOne({ email: email.toLowerCase() });
    } catch (err) {
      logger.erro(`Usuario.buscarPorEmail: ${err.message}`);
      throw err;
    }
  }

  static async listarTodos() {
    try {
      return await UsuarioModel.find({}, '-senha');
    } catch (err) {
      logger.erro(`Usuario.listarTodos: ${err.message}`);
      throw err;
    }
  }

  static async deletar(id) {
    try {
      if (!id) throw new Error('id é obrigatório para deletar.');
      const resultado = await UsuarioModel.findByIdAndDelete(id);
      if (resultado) logger.info(`Usuário deletado: ${resultado.username}`);
      return resultado;
    } catch (err) {
      logger.erro(`Usuario.deletar: ${err.message}`);
      throw err;
    }
  }
}

module.exports = { Usuario };