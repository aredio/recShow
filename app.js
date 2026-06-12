// --- Passo 5: Lógica da página inicial (index.html) ---
const nomeJogadorEl = document.getElementById('nome-jogador');
const btnSortear = document.getElementById('btn-sortear');
const btnConfirmar = document.getElementById('btn-confirmar');

let listaAlunos = [];
let jogadorAtual = "";

async function carregarAlunos() {
  // Executa apenas se estiver na página inicial
  if (!nomeJogadorEl) return; 

  try {
    const response = await fetch('./alunos.md');
    if (!response.ok) throw new Error("Falha ao ler arquivo");
    const texto = await response.text();
    
    // Extrair os nomes (linhas que começam com "- ")
    listaAlunos = texto.split('\n')
      .map(linha => linha.trim())
      .filter(linha => linha.startsWith('- '))
      .map(linha => linha.replace('- ', '').trim());
      
  } catch (error) {
    console.warn("Erro no fetch (possível bloqueio CORS local), usando fallback.", error);
    // Fallback caso o fetch falhe (ex: rodando localmente sem servidor)
    listaAlunos = [
      "Ana Clara Souza", "Bruno Henrique Lima", "Carla Mendes Rocha",
      "Diego Ferreira Santos", "Eduarda Pinto Alves", "Felipe Costa Ribeiro",
      "Gabriela Nunes Teixeira", "Henrique Barbosa Moraes", "Isabela Rodrigues Campos",
      "João Pedro Oliveira"
    ];
  }

  if (listaAlunos.length > 0) {
    sortearAluno();
    btnSortear.disabled = false;
    btnConfirmar.disabled = false;
  } else {
    nomeJogadorEl.textContent = "Nenhum aluno encontrado";
  }
}

function sortearAluno() {
  if (listaAlunos.length === 0) return;
  
  let novoJogador = jogadorAtual;
  // Sortear um novo nome diferente do atual
  while (novoJogador === jogadorAtual && listaAlunos.length > 1) {
    const randomIndex = Math.floor(Math.random() * listaAlunos.length);
    novoJogador = listaAlunos[randomIndex];
  }
  
  jogadorAtual = novoJogador;
  
  // Animação suave de troca (fade)
  nomeJogadorEl.style.opacity = 0;
  setTimeout(() => {
    nomeJogadorEl.textContent = jogadorAtual;
    nomeJogadorEl.style.opacity = 1;
  }, 300); // 300ms definido no css inline do transition
}

if (btnSortear) {
  btnSortear.addEventListener('click', sortearAluno);
}

if (btnConfirmar) {
  btnConfirmar.addEventListener('click', () => {
    // Salvar o nome do jogador no sessionStorage para a tela de quiz
    sessionStorage.setItem('jogadorAtual', jogadorAtual);
    window.location.href = 'quiz.html';
  });
}

// Iniciar leitura e sorteio se estiver na index
carregarAlunos();

// --- Passo 7: Lógica principal do quiz (quiz.html) ---

let perguntasQuiz = [];
let perguntasReserva = [];
let estado = {
  perguntaAtual: 0,
  pontosAcumulados: 0,
  ajudas: { colegas: 2, cartas: 2, pulo: 3 }
};

// Nível de dificuldade esperado para cada rodada (índice 0 = pergunta 1)
const DIFICULDADE_POR_RODADA = [
  "facil",   // rodada 1
  "facil",   // rodada 2
  "facil",   // rodada 3
  "facil",   // rodada 4
  "medio",   // rodada 5
  "medio",   // rodada 6
  "medio",   // rodada 7
  "medio",   // rodada 8
  "dificil", // rodada 9
  "dificil"  // rodada 10
];

// Funções de formatação e utilitários
function embaralharArray(array) {
  return array.sort(() => Math.random() - 0.5);
}

function embaralhar(array) {
  return [...array].sort(() => Math.random() - 0.5);
}

function selecionarPerguntasDoQuiz() {
  // Separar o banco por nível e embaralhar cada grupo
  const faceis   = embaralhar(bancoPerguntasGlobal.filter(p => p.dificuldade === "facil"));
  const medias   = embaralhar(bancoPerguntasGlobal.filter(p => p.dificuldade === "medio"));
  const dificeis = embaralhar(bancoPerguntasGlobal.filter(p => p.dificuldade === "dificil"));

  // Montar as 10 perguntas do quiz na ordem correta de dificuldade
  const perguntasDoQuiz = [
    ...faceis.slice(0, 4),   // rodadas 1–4: fáceis
    ...medias.slice(0, 4),   // rodadas 5–8: médias
    ...dificeis.slice(0, 2)  // rodadas 9–10: difíceis
  ];

  // Guardar as reservas separadas por nível para uso no Pulo
  estado.reserva = {
    facil:   faceis.slice(4),
    medio:   medias.slice(4),
    dificil: dificeis.slice(2)
  };

  // Registrar todos os IDs já em uso para não repetir
  estado.idsUsados = new Set(perguntasDoQuiz.map(p => p.id));

  return perguntasDoQuiz;
}

// 7.1 — Inicialização do quiz
function inicializarQuiz() {
  const quizNomeJogadorEl = document.getElementById('quiz-nome-jogador');
  if (!quizNomeJogadorEl) return; // Só executa se estiver no quiz.html

  // 1. Recuperar nome do jogador do sessionStorage
  const jogadorLocal = sessionStorage.getItem('jogadorAtual') || "Jogador Desconhecido";
  quizNomeJogadorEl.textContent = jogadorLocal;

  // 2. Selecionar 10 perguntas aleatórias e 3. Guardar as restantes
  if (typeof bancoPerguntasGlobal !== 'undefined') {
    perguntasQuiz = selecionarPerguntasDoQuiz();
  }

  // 4. Inicializar estado do jogo
  estado.perguntaAtual = 0;
  estado.pontosAcumulados = 0;
  estado.ajudas = { colegas: 2, cartas: 2, pulo: 3 };

  // 5. Renderizar a primeira pergunta
  renderizarPergunta();
}

// 7.2 — Cálculo de pontos por pergunta
function valorDaPergunta(indicePergunta) {
  return (indicePergunta + 1) * 0.5;
}

// 7.3 — Renderizar pergunta atual
function renderizarPergunta() {
  const perguntaObj = perguntasQuiz[estado.perguntaAtual];
  
  // 1. Exibir o texto da pergunta
  document.getElementById('texto-pergunta').textContent = perguntaObj.pergunta;

  // 2. Exibir as 4 alternativas como botões
  const letras = ['A', 'B', 'C', 'D'];
  for (let i = 0; i < 4; i++) {
    const btn = document.getElementById(`alt-${i}`);
    // Limpar estados anteriores (CSS classes, disabled, opacity)
    btn.className = "alternativa";
    btn.disabled = false;
    btn.style.opacity = 1;
    btn.style.pointerEvents = "auto";
    btn.textContent = `${letras[i]}) ${perguntaObj.alternativas[i].texto}`;
    // Guardar se é correta no dataset para facilitar
    btn.dataset.correta = perguntaObj.alternativas[i].correta;
  }

  // 3. Atualizar o texto "Valendo X.X Pontos"
  const valendo = valorDaPergunta(estado.perguntaAtual).toFixed(1).replace('.', ',');
  document.getElementById('texto-pontos').textContent = `Valendo ${valendo} Pontos na média`;

  // 4. Atualizar os cards de risco
  const ptsErrados = Math.round((estado.pontosAcumulados / 2) * 10) / 10;
  const ptsParar = estado.pontosAcumulados;
  const ptsAcertar = estado.pontosAcumulados + valorDaPergunta(estado.perguntaAtual);
  
  document.getElementById('card-errar').innerHTML = `ERRAR<br>${ptsErrados.toFixed(1).replace('.', ',')}`;
  document.getElementById('card-parar').innerHTML = `PARAR<br>${ptsParar.toFixed(1).replace('.', ',')}`;
  document.getElementById('card-acertar').innerHTML = `ACERTAR<br>${ptsAcertar.toFixed(1).replace('.', ',')}`;

  // 5. Atualizar os botões de ajuda
  atualizarBotoesAjuda(); 

  // Atualizar badge de dificuldade
  const nivel = DIFICULDADE_POR_RODADA[estado.perguntaAtual];
  const badge = document.getElementById('badge-dificuldade');
  const labels = { facil: '🟢 Fácil', medio: '🟡 Médio', dificil: '🔴 Difícil' };
  badge.textContent = labels[nivel];
  badge.className = `badge-dificuldade badge-${nivel}`;
}

function atualizarBotoesAjuda() {
  const btnColegas = document.getElementById('btn-ajuda-colegas');
  const btnCartas = document.getElementById('btn-ajuda-cartas');
  const btnPulo = document.getElementById('btn-ajuda-pulo');

  if (btnColegas) {
    btnColegas.textContent = `Colegas (${estado.ajudas.colegas})`;
    btnColegas.disabled = estado.ajudas.colegas <= 0;
  }
  if (btnCartas) {
    btnCartas.textContent = `Cartas (${estado.ajudas.cartas})`;
    btnCartas.disabled = estado.ajudas.cartas <= 0;
  }
  if (btnPulo) {
    btnPulo.textContent = `Pulo (${estado.ajudas.pulo})`;
    btnPulo.disabled = estado.ajudas.pulo <= 0;
  }
}

// 7.4 — Processar resposta do jogador
function responder(indiceAlternativaSelecionada) {
  // 1. Desabilitar todos os botões imediatamente
  for (let i = 0; i < 4; i++) {
    document.getElementById(`alt-${i}`).disabled = true;
  }

  const btnSelecionado = document.getElementById(`alt-${indiceAlternativaSelecionada}`);
  const isCorreta = btnSelecionado.dataset.correta === "true";

  // Encontrar o botão da alternativa correta real
  let idCorreta = -1;
  for (let i = 0; i < 4; i++) {
    if (document.getElementById(`alt-${i}`).dataset.correta === "true") {
      idCorreta = i;
      break;
    }
  }

  if (isCorreta) {
    // 3a. Se CORRETA
    btnSelecionado.classList.add('correta');
    estado.pontosAcumulados += valorDaPergunta(estado.perguntaAtual);

    if (estado.perguntaAtual === 9) { // era a última
      setTimeout(() => exibirResultado('vitoria', 5.0), 1000);
    } else {
      setTimeout(() => {
        estado.perguntaAtual++;
        renderizarPergunta();
      }, 1500);
    }
  } else {
    // 3b. Se ERRADA
    btnSelecionado.classList.add('errada');
    document.getElementById(`alt-${idCorreta}`).classList.add('correta'); // Revelar correta
    
    setTimeout(() => {
      const ptsErrados = Math.round((estado.pontosAcumulados / 2) * 10) / 10;
      exibirResultado('errar_pergunta', ptsErrados);
    }, 2000);
  }
}

// 7.5 — Cards de risco
function acaoErrar() {
  const ptsErrados = Math.round((estado.pontosAcumulados / 2) * 10) / 10;
  exibirResultado('errar_card', ptsErrados);
}

function acaoParar() {
  exibirResultado('parar', estado.pontosAcumulados);
}

// --- Passo 8: Ajudas ---

function ajudaColegas() {
  if (estado.ajudas.colegas <= 0) return;
  estado.ajudas.colegas--;
  atualizarBotoesAjuda();
  
  // Encontrar a correta e as erradas
  let corretaIdx = -1;
  const indicesErrados = [];
  for (let i = 0; i < 4; i++) {
    const btn = document.getElementById(`alt-${i}`);
    if (btn.dataset.correta === "true") {
      corretaIdx = i;
    } else {
      if (!btn.disabled) { // Considerar apenas as não eliminadas pelas cartas
        indicesErrados.push(i);
      }
    }
  }

  // A correta ganha entre 50% e 70%
  const pctCorreta = Math.floor(Math.random() * 21) + 50; 
  let restante = 100 - pctCorreta;
  
  const porcentagens = [];
  porcentagens[corretaIdx] = pctCorreta;

  // Distribuir o restante aleatoriamente entre as erradas ativas
  if (indicesErrados.length === 3) {
    const pct1 = Math.floor(Math.random() * (restante - 2)) + 1;
    restante -= pct1;
    const pct2 = Math.floor(Math.random() * (restante - 1)) + 1;
    const pct3 = restante - pct2;
    porcentagens[indicesErrados[0]] = pct1;
    porcentagens[indicesErrados[1]] = pct2;
    porcentagens[indicesErrados[2]] = pct3;
  } else if (indicesErrados.length === 2) {
    const pct1 = Math.floor(Math.random() * (restante - 1)) + 1;
    const pct2 = restante - pct1;
    porcentagens[indicesErrados[0]] = pct1;
    porcentagens[indicesErrados[1]] = pct2;
  } else if (indicesErrados.length === 1) {
    porcentagens[indicesErrados[0]] = restante;
  }

  // Adicionar ao botão
  for (let i = 0; i < 4; i++) {
    if (porcentagens[i] !== undefined) {
      const btn = document.getElementById(`alt-${i}`);
      const span = document.createElement('span');
      span.className = "colegas-pct";
      span.style.float = "right";
      span.style.color = "#03D92D";
      span.textContent = ` ${porcentagens[i]}%`;
      btn.appendChild(span);
    }
  }

  // Remover após 5 segundos
  setTimeout(() => {
    for (let i = 0; i < 4; i++) {
      const btn = document.getElementById(`alt-${i}`);
      const span = btn.querySelector('.colegas-pct');
      if (span) span.remove();
    }
  }, 5000);
}

function ajudaCartas() {
  if (estado.ajudas.cartas <= 0) return;
  estado.ajudas.cartas--;
  atualizarBotoesAjuda();

  // Criar overlay das cartas
  const overlay = document.createElement('div');
  overlay.style.position = 'fixed';
  overlay.style.top = '0'; overlay.style.left = '0';
  overlay.style.width = '100%'; overlay.style.height = '100%';
  overlay.style.backgroundColor = 'rgba(0,0,0,0.85)';
  overlay.style.display = 'flex';
  overlay.style.flexDirection = 'column';
  overlay.style.alignItems = 'center';
  overlay.style.justifyContent = 'center';
  overlay.style.zIndex = '1000';

  const titulo = document.createElement('h2');
  titulo.textContent = 'Sorteando uma carta...';
  titulo.style.color = '#ffffff';
  titulo.style.marginBottom = '30px';
  overlay.appendChild(titulo);

  const containerCartas = document.createElement('div');
  containerCartas.style.display = 'flex';
  containerCartas.style.gap = '20px';

  for(let i = 0; i < 4; i++) {
    const carta = document.createElement('div');
    carta.style.width = '100px';
    carta.style.height = '150px';
    carta.style.backgroundColor = '#2b2b2b';
    carta.style.border = '3px solid #03D92D';
    carta.style.borderRadius = '10px';
    containerCartas.appendChild(carta);
  }
  overlay.appendChild(containerCartas);
  document.body.appendChild(overlay);

  // Revelar após 1.5s
  setTimeout(() => {
    const cartaSorteada = Math.floor(Math.random() * 4); // 0 a 3
    titulo.textContent = cartaSorteada === 0 ? 'Sem sorte! Nenhuma eliminada.' : `Sorte! Eliminando ${cartaSorteada} errada(s).`;
    
    containerCartas.innerHTML = '';
    const cartaRevelada = document.createElement('div');
    cartaRevelada.style.width = '150px';
    cartaRevelada.style.height = '200px';
    cartaRevelada.style.backgroundColor = '#03D92D';
    cartaRevelada.style.color = '#1a1a1a';
    cartaRevelada.style.display = 'flex';
    cartaRevelada.style.alignItems = 'center';
    cartaRevelada.style.justifyContent = 'center';
    cartaRevelada.style.fontSize = '4rem';
    cartaRevelada.style.fontWeight = 'bold';
    cartaRevelada.style.borderRadius = '10px';
    cartaRevelada.textContent = cartaSorteada;
    containerCartas.appendChild(cartaRevelada);

    setTimeout(() => {
      document.body.removeChild(overlay);
      aplicarCartas(cartaSorteada);
    }, 2000);
  }, 1500);
}

function aplicarCartas(numEliminar) {
  if (numEliminar === 0) return;

  const indicesErrados = [];
  for (let i = 0; i < 4; i++) {
    const btn = document.getElementById(`alt-${i}`);
    if (btn.dataset.correta === "false" && !btn.disabled) {
      indicesErrados.push(i);
    }
  }

  embaralharArray(indicesErrados);

  for (let i = 0; i < numEliminar && i < indicesErrados.length; i++) {
    const btn = document.getElementById(`alt-${indicesErrados[i]}`);
    btn.classList.add('eliminada');
    // Para as cartas, opacidade e bloqueio são tratados pelo CSS (.eliminada)
  }
}

function ajudaPulo() {
  if (estado.ajudas.pulo <= 0) return;
  estado.ajudas.pulo--;

  const nivelAtual = DIFICULDADE_POR_RODADA[estado.perguntaAtual];

  // Determinar o nível da pergunta substituta
  // Fácil → substituta também é fácil (não há nível inferior)
  // Médio → substituta é fácil
  // Difícil → substituta é médio
  const nivelSubstituta = {
    facil:   "facil",
    medio:   "facil",
    dificil: "medio"
  }[nivelAtual];

  // Buscar uma pergunta disponível na reserva do nível substituto
  const reservaDoNivel = estado.reserva[nivelSubstituta];
  const substituta = reservaDoNivel.find(p => !estado.idsUsados.has(p.id));

  if (!substituta) {
    // Caso extremo: reserva esgotada para aquele nível
    // Exibir aviso e devolver o uso
    alert("Não há mais perguntas disponíveis para o Pulo neste nível!");
    estado.ajudas.pulo++;
    atualizarBotoesAjuda();
    return;
  }

  // Marcar a substituta como usada
  estado.idsUsados.add(substituta.id);

  // Remover a substituta da reserva para não ser sorteada de novo
  estado.reserva[nivelSubstituta] = reservaDoNivel.filter(p => p.id !== substituta.id);

  // Substituir a pergunta atual no array do quiz (sem avançar o índice)
  // DÚVIDA: O guia MD indica 'estado.perguntasDoQuiz', mas a variável correta e existente no projeto é 'perguntasQuiz'. Alterado para manter o projeto funcional.
  perguntasQuiz[estado.perguntaAtual] = substituta;

  // Re-renderizar a pergunta (função já existente no projeto)
  renderizarPergunta();
  atualizarBotoesAjuda();
}

// --- Passo 9: Telas de Resultado ---
function exibirResultado(tipo, pontos) {
  const areaPrincipal = document.getElementById('area-quiz-principal');
  const nome = sessionStorage.getItem('jogadorAtual') || "Jogador";
  const pontosFormatados = pontos.toFixed(1).replace('.', ',');

  let conteudoHTML = '';
  let estiloExtra = '';

  if (tipo === 'vitoria') {
    estiloExtra = 'background-color: #03D92D; color: #1a1a1a; animation: pulso 2s infinite; border-radius: 20px;';
    conteudoHTML = `
      <div style="font-size: 6rem; margin-bottom: 20px;">🏆</div>
      <h1 style="color: #1a1a1a; font-size: 4rem;">PARABÉNS, ${nome}!</h1>
      <h2 style="color: #1a1a1a; font-size: 3rem; margin-bottom: 20px;">VOCÊ SAIU DO BURACO!</h2>
      <p style="font-size: 2.5rem; margin-bottom: 40px; font-weight: bold;">Pontuação: ${pontosFormatados} pontos na média</p>
    `;
  } else if (tipo === 'errar_pergunta') {
    conteudoHTML = `
      <div style="font-size: 6rem; margin-bottom: 20px;">❌</div>
      <h1 style="color: #D90303; font-size: 4rem;">Que pena, ${nome}!</h1>
      <h2 style="font-size: 2.5rem; margin-bottom: 20px; color: #ffffff;">Você errou a questão.</h2>
      <p style="font-size: 2rem; margin-bottom: 40px; color: #ffffff;">Você levou: <span style="color: #D90303; font-weight: bold;">${pontosFormatados} pontos</span> (metade do acumulado)</p>
    `;
  } else if (tipo === 'parar') {
    conteudoHTML = `
      <div style="font-size: 6rem; margin-bottom: 20px;">🛑</div>
      <h1 style="color: #D9B703; font-size: 4rem;">${nome} decidiu parar!</h1>
      <p style="font-size: 2rem; margin-bottom: 40px; margin-top: 20px; color: #ffffff;">Você garantiu: <span style="color: #D9B703; font-weight: bold;">${pontosFormatados} pontos</span></p>
    `;
  } else if (tipo === 'errar_card') {
    conteudoHTML = `
      <div style="font-size: 6rem; margin-bottom: 20px;">⚠️</div>
      <h1 style="color: #D90303; font-size: 4rem;">${nome} aceitou o risco!</h1>
      <p style="font-size: 2rem; margin-bottom: 40px; margin-top: 20px; color: #ffffff;">Você levou: <span style="color: #D90303; font-weight: bold;">${pontosFormatados} pontos</span> (metade do acumulado)</p>
    `;
  }

  conteudoHTML += `
    <button class="btn" style="background-color: #2b2b2b; color: #03D92D; border-color: #03D92D; padding: 20px 40px; font-size: 2rem;" onclick="window.location.href='index.html'">Jogar Novamente</button>
  `;

  // Modificar o layout da area principal para centralizar a mensagem
  areaPrincipal.style.display = 'flex';
  areaPrincipal.style.flexDirection = 'column';
  areaPrincipal.style.alignItems = 'center';
  areaPrincipal.style.justifyContent = 'center';
  areaPrincipal.style.textAlign = 'center';
  
  if (estiloExtra) {
    areaPrincipal.style.cssText += estiloExtra;
  }

  // Esconder o nome do topo para focar no centro
  const topo = document.getElementById('quiz-nome-jogador');
  if(topo) topo.style.display = 'none';

  areaPrincipal.innerHTML = conteudoHTML;
}

// Inicializar automaticamente caso esteja na tela de quiz
if (document.getElementById('quiz-nome-jogador')) {
  inicializarQuiz();
}
