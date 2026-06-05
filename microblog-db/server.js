const express = require('express');
const session = require('express-session');
const { conectar } = require('./index'); // Puxa a conexão do seu Projeto 1

// Importando as rotas que criamos
const authRoutes = require('./src/routes/auth');
const usuariosRoutes = require('./src/routes/usuarios');
const postsRoutes = require('./src/routes/posts');
const comentariosRoutes = require('./src/routes/comentarios');

const app = express();
const PORT = 3000;

// Middlewares globais
app.use(express.json()); // Permite ler JSON no corpo (body) dos posts

// Configuração da Sessão requerida pelo Projeto 2
app.use(
  session({
    secret: 'chave_secreta_do_microblog_utfpr',
    resave: false,
    saveUninitialized: false,
    cookie: { maxAge: 1000 * 60 * 60 }, // Sessão dura 1 hora
  })
);

// Vinculando as rotas ao servidor
app.use('/auth', authRoutes);
app.use('/usuarios', usuariosRoutes);
app.use('/posts', postsRoutes);
app.use('/comentarios', comentariosRoutes);

// Rota inicial simples para testar se o servidor está online
app.get('/', (req, res) => {
  res.json({ status: 'Servidor rodando e pronto!' });
});

// Inicialização do banco e do servidor Express
async function inicializar() {
  try {
    await conectar(); // Conecta no MongoDB usando a função do Projeto 1
    console.log('=> Banco de dados MongoDB conectado com sucesso!');
    
    app.listen(PORT, () => {
      console.log(`=> Servidor rodando com sucesso na porta ${PORT}`);
      console.log(`=> Teste abrindo no navegador: http://localhost:${PORT}/`);
    });
  } catch (err) {
    console.error('Erro crítico ao iniciar o servidor:', err.message);
    process.exit(1);
  }
}

inicializar();