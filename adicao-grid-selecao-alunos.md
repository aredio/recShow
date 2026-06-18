# ➕ Adição ao Projeto — Grid de Seleção Manual de Alunos

> **Para o agente de IA:** O projeto base já foi implementado conforme o `guia-quiz-recuperacao.md`, e a adição de níveis de dificuldade (`adicao-niveis-dificuldade.md`) também já foi aplicada. Este documento descreve uma **nova adição** ao código existente. Leia todo o documento antes de começar. Execute cada passo na ordem, confirmando com `✅ Passo X concluído` antes de avançar.
>
> **Não reescreva o que já existe.** Apenas modifique e adicione o que está descrito aqui.

---

## 📋 Contexto da Adição

Atualmente, ao abrir `index.html`, o sistema já sorteia um nome automaticamente e mostra direto a tela de "nome sorteado / sortear novamente / confirmar jogador".

Essa adição muda o fluxo inicial: agora a **primeira coisa exibida** é uma **grid com todos os alunos do `alunos.md`**, permitindo seleção manual. O sorteio aleatório passa a ser uma opção, acionada por um botão abaixo da grid — e ao usá-lo, aparece a tela de sorteio já existente (nome sorteado / sortear novamente / confirmar), com um botão extra para voltar à grid.

### Resumo do novo fluxo

```
┌─────────────────────────────────────┐
│         TELA 1: GRID DE ALUNOS       │
│  (substitui a tela inicial atual)    │
│                                       │
│  [Nome 1] [Nome 2] [Nome 3] [Nome 4] │
│  [Nome 5] [Nome 6] [Nome 7] [Nome 8] │
│              ...                     │
│                                       │
│      [ 🎲 Sortear Jogador ]          │
└───────────────┬───────────────────────┘
                │
   clicou em um nome OU clicou em "Sortear Jogador"
                │
                ▼
┌─────────────────────────────────────┐
│   TELA 2: CONFIRMAÇÃO (já existe,    │
│   só ganha um botão novo)            │
│                                       │
│         [Nome Selecionado]           │
│                                       │
│  [🔄 Sortear Novamente] (só aparece  │
│   se chegou aqui via sorteio)        │
│  [✅ Confirmar Jogador]              │
│  [📋 Escolher na Lista de Jogadores] │
└───────────────────────────────────────┘
```

**Regras de comportamento confirmadas:**
- Clicar em um nome na grid leva **direto** para a Tela 2, com aquele nome já selecionado, pronto para confirmar.
- O botão **"Sortear Novamente"** só faz sentido no contexto de sorteio aleatório — mantenha-o visível sempre, mas não há problema em usá-lo mesmo vindo da grid (ele simplesmente sorteia um novo nome aleatório a partir daquele ponto).
- O botão **"Escolher na Lista de Jogadores"** sempre volta para a Tela 1 (grid).
- A grid deve marcar visualmente os alunos que **já jogaram nesta sessão** (ex: já foram confirmados e completaram ou encerraram um quiz).

---

## 🗃️ Passo A — Reestruturar `index.html` com duas telas (grid + confirmação)

Atualmente `index.html` provavelmente tem uma única tela com o nome sorteado. Vamos transformar isso em **duas seções**, exibidas/ocultadas via JavaScript (sem precisar de uma nova página).

Adicione ao `index.html`, substituindo o conteúdo principal atual por duas `<section>`:

```html
<!-- TELA 1: Grid de seleção -->
<section id="tela-grid" class="tela-ativa">
  <h1>QUIZ DE RECUPERAÇÃO</h1>
  <h2>Selecione o Jogador</h2>

  <div id="grid-alunos" class="grid-alunos">
    <!-- Os botões de cada aluno serão inseridos aqui via JavaScript -->
  </div>

  <button id="btn-sortear-jogador" class="btn btn-destaque">
    🎲 Sortear Jogador
  </button>
</section>

<!-- TELA 2: Confirmação (conteúdo já existente, mantenha o que já tem) -->
<section id="tela-confirmacao" class="tela-oculta">
  <h1>QUIZ DE RECUPERAÇÃO</h1>

  <div class="card-jogador">
    <p id="nome-jogador-selecionado" class="nome-destaque"></p>

    <div class="botoes-confirmacao">
      <button id="btn-sortear-novamente" class="btn">🔄 Sortear Novamente</button>
      <button id="btn-confirmar-jogador" class="btn btn-primario">✅ Confirmar Jogador</button>
    </div>

    <button id="btn-escolher-lista" class="btn btn-secundario">
      📋 Escolher na Lista de Jogadores
    </button>
  </div>
</section>
```

> Se o `index.html` atual já tem IDs diferentes para os elementos da tela de confirmação, **mantenha os IDs já existentes** e apenas envolva o conteúdo na `<section id="tela-confirmacao">`, adicionando o novo botão `btn-escolher-lista`.

---

## 🎨 Passo B — Estilizar a grid em `style.css`

Adicione ao final do `style.css`:

```css
/* Controle de exibição das telas */
.tela-oculta {
  display: none;
}

.tela-ativa {
  display: block;
}

/* Grid de alunos */
.grid-alunos {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));
  gap: 16px;
  margin: 32px 0;
  max-width: 1100px;
}

.aluno-card {
  background-color: #2b2b2b;
  border: 3px solid #3a3a3a;
  border-radius: 12px;
  padding: 20px;
  font-size: 1.4rem;
  font-weight: bold;
  color: #ffffff;
  cursor: pointer;
  text-align: center;
  transition: background-color 0.2s, border-color 0.2s, transform 0.1s;
}

.aluno-card:hover {
  border-color: #03D92D;
  background-color: #353535;
  transform: scale(1.03);
}

/* Aluno que já jogou nesta sessão */
.aluno-card.ja-jogou {
  opacity: 0.5;
  border-color: #555555;
  position: relative;
}

.aluno-card.ja-jogou::after {
  content: "✔ Já jogou";
  display: block;
  margin-top: 8px;
  font-size: 0.9rem;
  color: #03D92D;
  font-weight: bold;
}

.aluno-card.ja-jogou:hover {
  border-color: #03D92D;
  opacity: 0.8;
}

/* Botão de destaque (sortear) */
.btn-destaque {
  background-color: #03D92D;
  color: #1a1a1a;
  font-size: 1.6rem;
  padding: 18px 40px;
}

.btn-destaque:hover {
  background-color: #ffffff;
}

.btn-secundario {
  background-color: transparent;
  border: 2px solid #888888;
  color: #cccccc;
  margin-top: 20px;
}

.btn-secundario:hover {
  border-color: #03D92D;
  color: #03D92D;
  background-color: transparent;
}

.botoes-confirmacao {
  display: flex;
  gap: 16px;
  justify-content: center;
  margin: 24px 0;
}
```

> **Nota:** mesmo um aluno marcado como "já jogou" continua **clicável** — a marcação é apenas visual, não bloqueia a seleção.

---

## ⚙️ Passo C — Lógica em `app.js`: renderizar a grid e controlar navegação entre telas

### C.1 — Estado de controle de quem já jogou

Adicione (ou complemente, se já existir um objeto de estado) uma estrutura para rastrear os alunos que já jogaram nesta sessão:

```javascript
// Conjunto de nomes que já completaram ou encerraram um quiz nesta sessão.
// Usa sessionStorage para persistir entre a tela de confirmação, o quiz e o retorno à grid.
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
```

> **Importante:** a marcação de "já jogou" deve ocorrer ao final de uma partida (vitória, derrota, ou ao parar) — **não** apenas ao confirmar o jogador. Isso será tratado no Passo E.

### C.2 — Renderizar a grid de alunos

```javascript
function renderizarGridAlunos(listaDeNomes) {
  const grid = document.getElementById('grid-alunos');
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
```

### C.3 — Selecionar manualmente (clique direto na grid)

```javascript
function selecionarJogadorManualmente(nome) {
  // Define o nome selecionado e leva direto para a tela de confirmação,
  // sem disparar um novo sorteio.
  exibirTelaConfirmacao(nome);
}
```

### C.4 — Função para alternar entre as telas

```javascript
function exibirTelaGrid() {
  document.getElementById('tela-grid').classList.remove('tela-oculta');
  document.getElementById('tela-grid').classList.add('tela-ativa');

  document.getElementById('tela-confirmacao').classList.remove('tela-ativa');
  document.getElementById('tela-confirmacao').classList.add('tela-oculta');

  // Re-renderizar a grid para refletir possíveis atualizações de "já jogou"
  renderizarGridAlunos(listaDeAlunosGlobal);
}

function exibirTelaConfirmacao(nome) {
  document.getElementById('nome-jogador-selecionado').textContent = nome;

  document.getElementById('tela-confirmacao').classList.remove('tela-oculta');
  document.getElementById('tela-confirmacao').classList.add('tela-ativa');

  document.getElementById('tela-grid').classList.remove('tela-ativa');
  document.getElementById('tela-grid').classList.add('tela-oculta');
}
```

> **Atenção:** `listaDeAlunosGlobal` deve ser a variável já existente no projeto que guarda os nomes extraídos do `alunos.md` (criada no Passo 5 do guia original). Se o nome da variável no seu código for diferente, ajuste as referências acima para usar o nome correto já existente — não crie uma variável duplicada.

### C.5 — Ajustar a inicialização da página

Localize o código que hoje roda ao carregar `index.html` (provavelmente faz o sorteio automático e exibe a tela de confirmação direto). Ajuste para:

```javascript
function inicializarPaginaInicial() {
  // 1. Ler alunos.md e popular listaDeAlunosGlobal (lógica já existente, não recriar)
  // 2. Em vez de sortear e exibir a tela de confirmação automaticamente:
  exibirTelaGrid();
}
```

A tela de confirmação só deve aparecer após:
- clique em um nome da grid, **ou**
- clique no botão "Sortear Jogador"

### C.6 — Botão "Sortear Jogador" (abaixo da grid)

```javascript
document.getElementById('btn-sortear-jogador').addEventListener('click', () => {
  const nomeSorteado = sortearNomeAleatorio(listaDeAlunosGlobal); // função de sorteio já existente
  exibirTelaConfirmacao(nomeSorteado);
});
```

> Reaproveite a função de sorteio aleatório já existente no projeto (criada no Passo 5 do guia original). Não duplicar lógica.

### C.7 — Botão "Sortear Novamente" (já existente, sem mudanças de lógica)

Mantenha o comportamento já implementado: sorteia um novo nome diferente do atual e atualiza `#nome-jogador-selecionado`. Nenhuma alteração necessária aqui além de garantir que ele continua funcionando dentro da `tela-confirmacao`.

### C.8 — Botão "Escolher na Lista de Jogadores" (novo)

```javascript
document.getElementById('btn-escolher-lista').addEventListener('click', () => {
  exibirTelaGrid();
});
```

---

## ⚙️ Passo D — Confirmar jogador (sem mudanças de lógica, apenas revisão)

O botão "Confirmar Jogador" já existente deve continuar funcionando exatamente como antes: salva o nome em `sessionStorage` (`jogadorAtual`) e redireciona para `quiz.html`. Nenhuma alteração de comportamento é necessária neste botão — apenas confirme que ele está dentro da `tela-confirmacao` e funcionando após a reestruturação do HTML.

---

## ⚙️ Passo E — Marcar aluno como "já jogou" ao final da partida

Esta etapa acontece em `quiz.html` / `app.js`, na função que exibe os resultados finais (vitória, derrota por erro, parar, ou arriscar — todas já existentes conforme o guia original, seção "Telas de resultado").

Em **cada um dos quatro casos de fim de jogo**, adicione a chamada para marcar o aluno como já jogado:

```javascript
function exibirResultado(tipo, pontos) {
  // ... lógica já existente que monta a tela de resultado ...

  // ADICIONAR: marcar o jogador atual como "já jogou" nesta sessão
  const nomeJogador = sessionStorage.getItem('jogadorAtual');
  marcarAlunoComoJaJogou(nomeJogador);
}
```

Se a função `exibirResultado` no projeto atual tiver branches separados por tipo (vitória/derrota/parar/arriscar) em vez de uma função única, adicione a mesma chamada em **cada um desses pontos de saída**, garantindo que todo final de partida marque o aluno.

---

## ✅ Passo F — Testar a adição

Execute os seguintes testes manuais para confirmar que tudo funciona:

1. Abrir `index.html` → confirmar que a **grid aparece primeiro**, com todos os nomes do `alunos.md`, e **nenhum sorteio automático** ocorre.
2. Clicar diretamente em um nome da grid → confirmar que vai para a tela de confirmação com aquele nome já preenchido.
3. Na tela de confirmação, clicar em "Sortear Novamente" → confirmar que troca para outro nome aleatório.
4. Clicar em "Escolher na Lista de Jogadores" → confirmar que volta para a grid.
5. Na grid, clicar no botão "🎲 Sortear Jogador" (abaixo da grid) → confirmar que vai para a tela de confirmação com um nome aleatório.
6. Confirmar um jogador e completar um quiz (vitória, derrota, ou parar) → voltar para `index.html` e confirmar que aquele aluno aparece **marcado como "já jogou"** na grid.
7. Confirmar que um aluno marcado como "já jogou" **ainda pode ser selecionado normalmente** (a marcação não bloqueia o clique).
8. Recarregar a página (F5) sem fechar a aba → confirmar que a marcação de "já jogou" persiste (pois usa `sessionStorage`).
9. Fechar a aba e abrir novamente → confirmar que a marcação de "já jogou" é resetada (comportamento esperado do `sessionStorage`, que dura apenas pela sessão da aba).
