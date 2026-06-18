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
    inicializarSplash();
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
    pararTodosOsSons();
    // Salvar o nome do jogador no sessionStorage para a tela de quiz
    sessionStorage.setItem('jogadorAtual', jogadorAtual);
    window.location.href = 'quiz.html';
  });
}

// Conjunto de nomes que já completaram ou encerraram um quiz nesta sessão.
function obterAlunosQueJaJogaram() {
  const dados = sessionStorage.getItem('alunosQueJaJogaram');
  return dados ? JSON.parse(dados) : [];
}

function marcarAlunoComoJaJogou(nome) {
  const lista = obterAlunosQueJaJogaram();
  if (!lista.includes(nome)) {
    lista.push(nome);
    sessionStorage.setItem('alunosQueJaJogaram', JSON.stringify(lista));
  }
}

// Conjunto de IDs de perguntas já utilizadas nesta sessão
function obterPerguntasUsadasSessao() {
  const dados = sessionStorage.getItem('perguntasUsadasSessao');
  return dados ? JSON.parse(dados) : [];
}

function adicionarPerguntasUsadasSessao(ids) {
  const lista = obterPerguntasUsadasSessao();
  ids.forEach(id => {
    if (!lista.includes(id)) lista.push(id);
  });
  sessionStorage.setItem('perguntasUsadasSessao', JSON.stringify(lista));
}

// Lógica do Ranking do Dia
function adicionarAoRanking(nome, pontos) {
  const rankingStr = sessionStorage.getItem('rankingDoDia');
  let ranking = rankingStr ? JSON.parse(rankingStr) : [];
  ranking.push({ nome, pontos, tempo: Date.now() });
  sessionStorage.setItem('rankingDoDia', JSON.stringify(ranking));
}

function renderizarRanking() {
  const container = document.getElementById('ranking-container');
  if (!container) return;

  const rankingStr = sessionStorage.getItem('rankingDoDia');
  if (!rankingStr) {
    container.classList.add('tela-oculta');
    return;
  }

  let ranking = JSON.parse(rankingStr);
  if (ranking.length === 0) {
    container.classList.add('tela-oculta');
    return;
  }

  // Ordenar por pontos (decrescente) e por tempo (crescente para empate)
  ranking.sort((a, b) => {
    if (b.pontos !== a.pontos) {
      return b.pontos - a.pontos;
    }
    return a.tempo - b.tempo;
  });

  container.classList.remove('tela-oculta');

  let tbodyHTML = '';
  ranking.forEach((r, index) => {
    let posicao = index + 1;
    if (posicao === 1) posicao = '🥇';
    else if (posicao === 2) posicao = '🥈';
    else if (posicao === 3) posicao = '🥉';

    const pontosFormatados = Number(r.pontos).toLocaleString('pt-BR', { minimumFractionDigits: 1, maximumFractionDigits: 2 });

    tbodyHTML += `
      <tr>
        <td class="col-posicao">${posicao}</td>
        <td class="col-nome">${r.nome}</td>
        <td class="col-pontos">${pontosFormatados} pts</td>
      </tr>
    `;
  });

  container.innerHTML = `
    <h2 class="ranking-titulo">Ranking do Dia</h2>
    <table class="ranking-table">
      <thead>
        <tr>
          <th>Pos</th>
          <th>Jogador</th>
          <th>Pontuação</th>
        </tr>
      </thead>
      <tbody>
        ${tbodyHTML}
      </tbody>
    </table>
  `;
}

function renderizarGridAlunos(listaDeNomes) {
  const grid = document.getElementById('grid-alunos');
  if (!grid) return;
  grid.innerHTML = ''; // limpar antes de renderizar

  const jaJogaram = obterAlunosQueJaJogaram();

  listaDeNomes.forEach(nome => {
    const card = document.createElement('button');
    card.className = 'aluno-card';
    card.textContent = nome;

    if (jaJogaram.includes(nome)) {
      card.classList.add('ja-jogou');
    }

    card.addEventListener('click', () => {
      selecionarJogadorManualmente(nome);
    });

    grid.appendChild(card);
  });
}

function selecionarJogadorManualmente(nome) {
  // DÚVIDA: O guia não mandava atualizar jogadorAtual aqui, mas a tela 2 usa essa variável para salvar. Adicionado para funcionar.
  jogadorAtual = nome;
  exibirTelaConfirmacao(nome);
}

function exibirTelaGrid() {
  const telaGrid = document.getElementById('tela-grid');
  const telaConf = document.getElementById('tela-confirmacao');
  if (!telaGrid || !telaConf) return;

  telaGrid.classList.remove('tela-oculta');
  telaGrid.classList.add('tela-ativa');

  telaConf.classList.remove('tela-ativa');
  telaConf.classList.add('tela-oculta');

  // Re-renderizar a grid para refletir possíveis atualizações de "já jogou"
  renderizarGridAlunos(listaAlunos);
  
  // Renderizar ranking se houver dados
  renderizarRanking();
}

function exibirTelaConfirmacao(nome) {
  document.getElementById('nome-jogador').textContent = nome;

  const telaGrid = document.getElementById('tela-grid');
  const telaConf = document.getElementById('tela-confirmacao');
  if (!telaGrid || !telaConf) return;

  telaConf.classList.remove('tela-oculta');
  telaConf.classList.add('tela-ativa');

  telaGrid.classList.remove('tela-ativa');
  telaGrid.classList.add('tela-oculta');

  if (btnSortear) btnSortear.disabled = false;
  if (btnConfirmar) btnConfirmar.disabled = false;
}

const btnSortearJogador = document.getElementById('btn-sortear-jogador');
if (btnSortearJogador) {
  btnSortearJogador.addEventListener('click', () => {
    sortearAluno(); // função de sorteio já existente
    exibirTelaConfirmacao(jogadorAtual);
  });
}

const btnEscolherLista = document.getElementById('btn-escolher-lista');
if (btnEscolherLista) {
  btnEscolherLista.addEventListener('click', () => {
    exibirTelaGrid();
  });
}

function inicializarSplash() {
  tocarSom('inicio'); // tenta tocar em loop (autoplay pode ser bloqueado)

  let audioDesbloqueado = false;

  const avancar = (e) => {
    // Se o autoplay falhou, o primeiro clique apenas desbloqueia o áudio
    if (typeof sons !== 'undefined' && sons.inicio && sons.inicio.paused && !audioDesbloqueado) {
      tocarSom('inicio');
      audioDesbloqueado = true;
      const instrucao = document.querySelector('.splash-instrucao');
      if (instrucao) {
        instrucao.textContent = "Áudio ativado! Clique novamente para começar";
      }
      return; // não avança a tela ainda
    }

    // O som 'inicio' continua tocando na grid, será parado apenas ao confirmar o jogador
    document.removeEventListener('keydown', avancar);
    const telaSplash = document.getElementById('tela-splash');
    if (telaSplash) {
      telaSplash.removeEventListener('click', avancar);
      telaSplash.classList.add('tela-oculta');
      telaSplash.classList.remove('tela-ativa');
    }

    exibirTelaGrid(); // função já existente da adição da grid de alunos
  };

  const telaSplash = document.getElementById('tela-splash');
  if (telaSplash) {
    telaSplash.addEventListener('click', avancar);
  }
  document.addEventListener('keydown', avancar);
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
  const usadasSessao = new Set(obterPerguntasUsadasSessao());
  
  // Filtrar o banco para remover as que já foram na sessão
  let bancoDisponivel = bancoPerguntasGlobal.filter(p => !usadasSessao.has(p.id));
  
  // Se não houver perguntas suficientes, limpamos o histórico global e recomeçamos
  const qFacil = bancoDisponivel.filter(p => p.dificuldade === "facil");
  const qMedio = bancoDisponivel.filter(p => p.dificuldade === "medio");
  const qDificil = bancoDisponivel.filter(p => p.dificuldade === "dificil");
  
  if (qFacil.length < 15 || qMedio.length < 10 || qDificil.length < 5) {
    sessionStorage.removeItem('perguntasUsadasSessao');
    bancoDisponivel = bancoPerguntasGlobal;
  }

  // Separar o banco disponível por nível e embaralhar cada grupo
  const faceis   = embaralhar(bancoDisponivel.filter(p => p.dificuldade === "facil"));
  const medias   = embaralhar(bancoDisponivel.filter(p => p.dificuldade === "medio"));
  const dificeis = embaralhar(bancoDisponivel.filter(p => p.dificuldade === "dificil"));

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

  // Registrar todos os IDs já em uso para não repetir no mesmo jogo
  estado.idsUsados = new Set(perguntasDoQuiz.map(p => p.id));
  
  // Registrar globalmente essas 10 para as próximas partidas da mesma sessão
  adicionarPerguntasUsadasSessao(Array.from(estado.idsUsados));

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
  return 0.5;
}

// 7.3 — Renderizar pergunta atual
function renderizarPergunta() {
  iniciarCicloDePergunta();
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
  const ptsErrados = estado.pontosAcumulados / 2;
  const ptsParar = estado.pontosAcumulados;
  const ptsAcertar = estado.pontosAcumulados + valorDaPergunta(estado.perguntaAtual);
  
  // Formatar para mostrar até 2 casas decimais, substituindo o ponto por vírgula
  const formatarPontos = (pts) => Number(pts).toLocaleString('pt-BR', { minimumFractionDigits: 1, maximumFractionDigits: 2 });
  
  document.getElementById('card-errar').innerHTML = `ERRAR<br>${formatarPontos(ptsErrados)}`;
  document.getElementById('card-parar').innerHTML = `PARAR<br>${formatarPontos(ptsParar)}`;
  document.getElementById('card-acertar').innerHTML = `ACERTAR<br>${formatarPontos(ptsAcertar)}`;

  // 5. Atualizar os botões de ajuda
  atualizarBotoesAjuda(); 

  // Atualizar badge de dificuldade
  const nivel = DIFICULDADE_POR_RODADA[estado.perguntaAtual];
  const badge = document.getElementById('badge-dificuldade');
  const labels = { facil: '🟢 Fácil', medio: '🟡 Médio', dificil: '🔴 Difícil' };
  badge.textContent = labels[nivel];
  badge.className = `badge-dificuldade badge-${nivel}`;

  // 6. Atualizar a barra de progresso
  atualizarBarraDeProgresso(10, estado.perguntaAtual);
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

function atualizarBarraDeProgresso(total, atual) {
  const container = document.getElementById('barra-progresso');
  if (!container) return;
  
  // Limpar e criar as bolinhas apenas se estiver vazio
  if (container.children.length === 0) {
    for (let i = 0; i < total; i++) {
      const bolinha = document.createElement('div');
      bolinha.className = 'bolinha-progresso';
      bolinha.id = `bolinha-${i}`;
      container.appendChild(bolinha);
    }
  }

  // Atualizar estado de cada bolinha
  for (let i = 0; i < total; i++) {
    const bolinha = document.getElementById(`bolinha-${i}`);
    if (!bolinha) continue;

    bolinha.className = 'bolinha-progresso'; // Resetar classes
    
    if (i < atual) {
      bolinha.classList.add('respondida');
    } else if (i === atual) {
      bolinha.classList.add('atual');
    }
  }
}

// 7.4 — Processar resposta do jogador
function responder(indiceAlternativaSelecionada) {
  pararTrilha();
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

    // Mudar a bolinha da pergunta atual para verde imediatamente
    const bolinhaAtual = document.getElementById(`bolinha-${estado.perguntaAtual}`);
    if (bolinhaAtual) {
      bolinhaAtual.classList.remove('atual');
      bolinhaAtual.classList.add('respondida');
    }

    const proximaPergunta = () => {
      if (typeof sons !== 'undefined' && sons.acertou) sons.acertou.onended = null;
      if (estado.perguntaAtual === 9) { // era a última
        exibirResultado('vitoria', 5.0);
      } else {
        estado.perguntaAtual++;
        renderizarPergunta();
      }
    };

    if (typeof sons !== 'undefined' && sons.acertou) {
      sons.acertou.onended = proximaPergunta;
      tocarSom('acertou');
      
      // Fallback de segurança (em caso de falha no áudio)
      setTimeout(() => {
        if (sons.acertou.onended === proximaPergunta) proximaPergunta();
      }, 5000);
    } else {
      tocarSom('acertou');
      setTimeout(proximaPergunta, 1500);
    }
  } else {
    // 3b. Se ERRADA
    tocarSom('errou');
    btnSelecionado.classList.add('errada');
    document.getElementById(`alt-${idCorreta}`).classList.add('correta'); // Revelar correta
    
    setTimeout(() => {
      tocarSom('parou');
      const ptsErrados = estado.pontosAcumulados / 2;
      exibirResultado('errar_pergunta', ptsErrados);
    }, 2000);
  }
}

// 7.5 — Cards de risco
function acaoErrar() {
  pararTrilha();
  tocarSom('errou');
  const ptsErrados = estado.pontosAcumulados / 2;
  exibirResultado('errar_card', ptsErrados);
}

function acaoParar() {
  pararTrilha();
  tocarSom('parou');
  exibirResultado('parar', estado.pontosAcumulados);
}

// --- Passo 8: Ajudas ---

function ajudaColegas() {
  if (estado.ajudas.colegas <= 0) return;
  pararTrilha();
  tocarSom('ajuda');
  estado.ajudas.colegas--;
  atualizarBotoesAjuda();

  // Criar overlay do popup
  const overlay = document.createElement('div');
  overlay.style.position = 'fixed';
  overlay.style.top = '0'; 
  overlay.style.left = '0';
  overlay.style.width = '100%'; 
  overlay.style.height = '100%';
  overlay.style.backgroundColor = 'rgba(0,0,0,0.6)'; // fundo semi-transparente para ainda ver a pergunta
  overlay.style.display = 'flex';
  overlay.style.justifyContent = 'center';
  overlay.style.alignItems = 'flex-start'; // alinhar no topo
  overlay.style.paddingTop = '50px'; // dar um espaço do topo
  overlay.style.zIndex = '1000';

  const modal = document.createElement('div');
  modal.style.backgroundColor = '#2b2b2b';
  modal.style.border = '4px solid #03D92D';
  modal.style.borderRadius = '15px';
  modal.style.padding = '30px';
  modal.style.textAlign = 'center';
  modal.style.maxWidth = '700px';
  modal.style.boxShadow = '0 10px 30px rgba(0,0,0,0.8)';

  const texto = document.createElement('h2');
  texto.textContent = "Sigam as instruções e levantem as mãos pra ajudar o colega!";
  texto.style.color = '#ffffff';
  texto.style.marginBottom = '25px';
  texto.style.fontSize = '2.2rem';

  const btnPronto = document.createElement('button');
  btnPronto.textContent = "Pronto";
  btnPronto.className = "btn"; 
  btnPronto.style.backgroundColor = "#03D92D";
  btnPronto.style.color = "#1a1a1a";
  btnPronto.style.fontSize = "1.5rem";
  btnPronto.style.padding = "10px 40px";

  btnPronto.onclick = () => {
    document.body.removeChild(overlay);
  };

  modal.appendChild(texto);
  modal.appendChild(btnPronto);
  overlay.appendChild(modal);
  document.body.appendChild(overlay);
}

function ajudaCartas() {
  if (estado.ajudas.cartas <= 0) return;
  pararTrilha();
  tocarSom('cartas');
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
    if (cartaSorteada === 0) {
      tocarSom('errou');
    } else {
      tocarSom('certo');
    }
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
  
  // Desabilitar as alternativas imediatamente para evitar cliques enquanto o áudio toca
  for (let i = 0; i < 4; i++) {
    const btn = document.getElementById(`alt-${i}`);
    if (btn) btn.disabled = true;
  }

  pararTrilha();
  estado.ajudas.pulo--;
  atualizarBotoesAjuda();

  const nivelAtual = DIFICULDADE_POR_RODADA[estado.perguntaAtual];

  // Determinar o nível da pergunta substituta
  const nivelSubstituta = {
    facil:   "facil",
    medio:   "facil",
    dificil: "medio"
  }[nivelAtual];

  // Buscar uma pergunta disponível na reserva do nível substituto
  const reservaDoNivel = estado.reserva[nivelSubstituta];
  const substituta = reservaDoNivel.find(p => !estado.idsUsados.has(p.id));

  if (!substituta) {
    alert("Não há mais perguntas disponíveis para o Pulo neste nível!");
    estado.ajudas.pulo++;
    atualizarBotoesAjuda();
    
    // Reabilitar as alternativas não eliminadas
    for (let i = 0; i < 4; i++) {
      const btn = document.getElementById(`alt-${i}`);
      if (btn && !btn.classList.contains('eliminada')) btn.disabled = false;
    }
    
    // Voltar a tocar a trilha, já que o pulo falhou
    tocarSom('trilha');
    return;
  }

  // Marcar a substituta como usada no jogo atual e na sessão global
  estado.idsUsados.add(substituta.id);
  adicionarPerguntasUsadasSessao([substituta.id]);

  // Remover a substituta da reserva para não ser sorteada de novo
  estado.reserva[nivelSubstituta] = reservaDoNivel.filter(p => p.id !== substituta.id);

  const executarPulo = () => {
    if (typeof sons !== 'undefined' && sons.pulo) sons.pulo.onended = null;
    
    // Substituir a pergunta atual no array do quiz (sem avançar o índice)
    perguntasQuiz[estado.perguntaAtual] = substituta;

    // Re-renderizar a pergunta (função já existente no projeto)
    renderizarPergunta();
  };

  if (typeof sons !== 'undefined' && sons.pulo) {
    sons.pulo.onended = executarPulo;
    tocarSom('pulo');
    
    // Fallback de segurança (em caso de falha no áudio)
    setTimeout(() => {
      if (sons.pulo.onended === executarPulo) executarPulo();
    }, 5000);
  } else {
    tocarSom('pulo');
    setTimeout(executarPulo, 1500);
  }
}

// --- Passo 9: Telas de Resultado ---
function exibirResultado(tipo, pontos) {
  // ADICIONAR: marcar o jogador atual como "já jogou" nesta sessão
  const nomeJogador = sessionStorage.getItem('jogadorAtual');
  if (nomeJogador && typeof marcarAlunoComoJaJogou === 'function') {
    marcarAlunoComoJaJogou(nomeJogador);
    adicionarAoRanking(nomeJogador, pontos);
  }

  const areaPrincipal = document.getElementById('area-quiz-principal');
  const nome = sessionStorage.getItem('jogadorAtual') || "Jogador";
  const pontosFormatados = Number(pontos).toLocaleString('pt-BR', { minimumFractionDigits: 1, maximumFractionDigits: 2 });

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
    <button class="btn" style="background-color: #2b2b2b; color: #03D92D; border-color: #03D92D; padding: 20px 40px; font-size: 2rem;" onclick="pararTodosOsSons(); window.location.href='index.html'">Jogar Novamente</button>
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

// Inicializar caso esteja na tela de quiz
if (document.getElementById('quiz-nome-jogador')) {
  const overlay = document.getElementById('overlay-iniciar-quiz');
  if (overlay) {
    overlay.addEventListener('click', () => {
      overlay.style.display = 'none';
      inicializarQuiz();
    });
  } else {
    inicializarQuiz();
  }
}
