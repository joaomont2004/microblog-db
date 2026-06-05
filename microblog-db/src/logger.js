const fs = require('fs');
const path = require('path');

const logDir = path.join(__dirname, '..', 'logs');
if (!fs.existsSync(logDir)) fs.mkdirSync(logDir);

const logFile = path.join(logDir, 'erros.log');

function escrever(nivel, mensagem) {
  const linha = `[${new Date().toISOString()}] [${nivel}] ${mensagem}\n`;
  fs.appendFileSync(logFile, linha);
}

module.exports = {
  info: (msg) => escrever('INFO', msg),
  erro: (msg) => escrever('ERRO', msg),
};