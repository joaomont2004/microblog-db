const fs = require('fs');
const path = require('path');

const LOG_DIR = path.join(__dirname, '..', 'logs');
const LOG_FILE = path.join(LOG_DIR, 'erros.log');

if (!fs.existsSync(LOG_DIR)) {
  fs.mkdirSync(LOG_DIR, { recursive: true });
}

function formatar(nivel, mensagem) {
  const agora = new Date().toISOString();
  return `[${agora}] [${nivel}] ${mensagem}\n`;
}

function gravar(linha) {
  fs.appendFileSync(LOG_FILE, linha, 'utf8');
}

const logger = {
  info: (msg) => gravar(formatar('INFO', msg)),
  erro: (msg) => gravar(formatar('ERRO', msg)),
};

module.exports = logger;
