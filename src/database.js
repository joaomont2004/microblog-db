const mongoose = require('mongoose');
const logger = require('./logger');


async function conectar(uri) {
  try {
    await mongoose.connect(uri);
    console.log('Conectado ao MongoDB com sucesso!');
    logger.info('Conexão com MongoDB estabelecida.');
  } catch (err) {
    logger.erro(`Erro ao conectar ao MongoDB: ${err.message}`);
    throw err;
  }
}


async function desconectar() {
  try {
    await mongoose.disconnect();
    console.log('Desconectado do MongoDB.');
    logger.info('Conexão encerrada.');
  } catch (err) {
    logger.erro(`Erro ao desconectar: ${err.message}`);
    throw err;
  }
}

module.exports = { conectar, desconectar };
