// audio.js — Módulo central de controle de áudio do jogo

const sons = {
  inicio:   new Audio('media/inicio.mp3'),
  pergunta: new Audio('media/pergunta.mp3'),
  trilha:   new Audio('media/trilha.mp3'),
  acertou:  new Audio('media/acertou.mp3'),
  errou:    new Audio('media/errou.mp3'),
  parou:    new Audio('media/parou.mp3'),
  ajuda:    new Audio('media/ajuda.mp3'),
  cartas:   new Audio('media/cartas.mp3'),
  certo:    new Audio('media/certo.mp3'),
  pulo:     new Audio('media/pulo.mp3'),
};

sons.inicio.loop = true;
sons.trilha.loop = true;

/**
 * Toca um som do zero (reinicia se já estiver tocando).
 */
function tocarSom(nome) {
  const audio = sons[nome];
  if (!audio) {
    console.warn(`Som "${nome}" não encontrado.`);
    return;
  }
  audio.currentTime = 0;
  audio.play().catch(err => console.warn(`Não foi possível tocar "${nome}":`, err));
}

/**
 * Para um som específico e reseta para o início.
 */
function pararSom(nome) {
  const audio = sons[nome];
  if (!audio) return;
  audio.pause();
  audio.currentTime = 0;
}

/**
 * Para todos os sons (usado em transições de tela).
 */
function pararTodosOsSons() {
  Object.keys(sons).forEach(nome => pararSom(nome));
}

/**
 * Toca pergunta.mp3 e, quando ele terminar, inicia trilha.mp3 em loop.
 * Deve ser chamado sempre que uma pergunta nova é exibida (incluindo trocas via Pulo).
 */
function iniciarCicloDePergunta() {
  pararSom('trilha'); // garantir que não haja sobreposição de uma trilha anterior
  tocarSom('pergunta');

  sons.pergunta.onended = () => {
    tocarSom('trilha');
  };
}

/**
 * Interrompe a trilha de fundo (chamado ao responder ou usar qualquer ajuda).
 */
function pararTrilha() {
  pararSom('trilha');
}
