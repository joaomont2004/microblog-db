const { conectar, desconectar } = require('./src/database');
const { Usuario } = require('./src/models/Usuario');
const { Post } = require('./src/models/Post');
const { Comentario } = require('./src/models/Comentario');

module.exports = { conectar, desconectar, Usuario, Post, Comentario };