const { conectar, desconectar, Usuario, Post, Comentario } = require('../index');

const URI = 'mongodb://localhost:27017/microblog_test';

async function main() {
  await conectar(URI);

  // ── Usuários ──────────────────────────────────────────
  console.log('\n--- Testando Usuários ---');

  const u1 = await Usuario.inserir({
    nome: 'Maria Silva',
    username: 'mariasilva',
    email: 'maria@email.com',
    bio: 'Dev apaixonada por Node.js',
  });
  console.log('Usuário criado:', u1.username);

  const u2 = await Usuario.inserir({
    nome: 'João Costa',
    username: 'joaocosta',
    email: 'joao@email.com',
  });
  console.log('Usuário criado:', u2.username);

  const encontrado = await Usuario.buscarPorUsername('mariasilva');
  console.log('Usuário encontrado:', encontrado.nome);

  console.log('\n--- Testando erro: username ausente ---');
  try {
    await Usuario.inserir({ nome: 'Sem Username', email: 'sem@email.com' });
  } catch (err) {
    console.log('Erro capturado:', err.message);
  }

  // ── Posts ─────────────────────────────────────────────
  console.log('\n--- Testando Posts ---');

  const p1 = await Post.inserir({
    autor: u1._id,
    conteudo: 'Meu primeiro post! #nodejs #backend',
    hashtags: ['nodejs', 'backend'],
  });
  console.log('Post criado:', p1._id);

  const p2 = await Post.inserir({
    autor: u2._id,
    conteudo: 'Olá pessoal! #nodejs',
    hashtags: ['nodejs'],
  });
  console.log('Post criado:', p2._id);

  const postsDaMaria = await Post.buscarPorAutor(u1._id);
  console.log('Posts da Maria:', postsDaMaria.length);

  const postsNodejs = await Post.buscarPorHashtag('nodejs');
  console.log('Posts com #nodejs:', postsNodejs.length);

  const postCurtido = await Post.curtir(p1._id);
  console.log('Curtidas no post 1:', postCurtido.curtidas);

  console.log('\n--- Testando erro: conteúdo ausente ---');
  try {
    await Post.inserir({ autor: u1._id });
  } catch (err) {
    console.log('Erro capturado:', err.message);
  }

  // ── Comentários ───────────────────────────────────────
  console.log('\n--- Testando Comentários ---');

  const c1 = await Comentario.inserir({
    post: p1._id,
    autor: u2._id,
    conteudo: 'Que post incrível!',
  });
  console.log('Comentário criado:', c1._id);

  const comentarios = await Comentario.buscarPorPost(p1._id);
  console.log('Comentários no post 1:', comentarios.length);

  console.log('\n--- Testando erro: post ausente ---');
  try {
    await Comentario.inserir({ autor: u1._id, conteudo: 'Sem post?' });
  } catch (err) {
    console.log('Erro capturado:', err.message);
  }

  // ── Deleções ──────────────────────────────────────────
  console.log('\n--- Testando Deleções ---');

  await Comentario.deletar(c1._id);
  console.log('Comentário deletado.');

  await Post.deletar(p2._id);
  console.log('Post deletado.');

  await Usuario.deletar(u2._id);
  console.log('Usuário deletado.');

  console.log('\n✅ Todos os testes passaram! Veja o arquivo logs/erros.log');

  await desconectar();
}

main().catch((err) => {
  console.error('Erro fatal:', err.message);
  process.exit(1);
});