# 🎯 Guia de Desenvolvimento — Quiz de Recuperação Escolar

> **Para o agente de IA:** Leia este documento inteiro antes de começar. Execute cada passo na ordem indicada, confirmando a conclusão de cada um antes de avançar. Em caso de dúvida sobre alguma etapa, consulte o contexto descrito antes de tomar decisões.

---

## 📋 Visão Geral do Projeto

Aplicação web de quiz interativo voltada para alunos em recuperação escolar. Um aluno é sorteado aleatoriamente para jogar. Ele responde perguntas de múltipla escolha que valem pontos cumulativos na média. O jogo possui mecânicas de risco (Errar/Parar/Acertar) e ajudas (Colegas, Cartas, Pulo).

**Stack sugerida:** HTML + CSS + JavaScript puro (sem frameworks), ou React caso prefira. Tudo em arquivos locais, sem backend necessário.

**Paleta visual:**
- Fundo: tons de cinza (`#1a1a1a`, `#2b2b2b`, `#3a3a3a`)
- Destaque/acento: verde `#03D92D`
- Fontes: grandes, em negrito, legíveis à distância
- Fonte recomendada: `'Segoe UI'`, `Arial Black` ou similar de alto impacto

---

## 📁 Passo 1 — Criar a estrutura de arquivos do projeto

**Execute este passo antes de qualquer outro.**

Crie a seguinte estrutura de pastas e arquivos:

```
quiz-recuperacao/
├── index.html          → Página inicial (seleção de jogador)
├── quiz.html           → Página do quiz (perguntas)
├── style.css           → Estilos globais
├── app.js              → Lógica principal
├── perguntas.js        → Banco de perguntas
└── alunos.md           → Lista de alunos (será criado no próximo passo)
```

Após criar a estrutura, confirme que todos os arquivos existem antes de continuar.

---

## 📄 Passo 2 — Criar o arquivo `alunos.md`

Crie o arquivo `alunos.md` com o seguinte conteúdo de exemplo (o professor poderá editar depois):

```markdown
# Lista de Alunos em Recuperação

- Ana Clara Souza
- Bruno Henrique Lima
- Carla Mendes Rocha
- Diego Ferreira Santos
- Eduarda Pinto Alves
- Felipe Costa Ribeiro
- Gabriela Nunes Teixeira
- Henrique Barbosa Moraes
- Isabela Rodrigues Campos
- João Pedro Oliveira
```

> **Nota:** O sistema irá ler este arquivo e extrair os nomes da lista para o sorteio. O formato deve ser mantido: cada aluno em uma linha começando com `- `.

---

## 🗃️ Passo 3 — Criar o banco de perguntas em `perguntas.js`

Crie o arquivo `perguntas.js` com um array de objetos. Cada objeto representa uma pergunta e deve seguir **exatamente** esta estrutura:

```javascript
const bancoPerguntasGlobal = [
  {
    id: 1,
    pergunta: "Qual é o resultado de 2 + 2?",
    alternativas: [
      { texto: "3", correta: false },
      { texto: "4", correta: true },
      { texto: "5", correta: false },
      { texto: "6", correta: false }
    ]
  },
  // ... mais perguntas
];
```

**Regras obrigatórias do banco de perguntas:**
- Deve conter **no mínimo 20 perguntas** (para que o sistema possa sortear 10 por quiz e ainda ter reserva para o Pulo).
- Cada pergunta deve ter **exatamente 4 alternativas**.
- Cada pergunta deve ter **exatamente 1 alternativa com `correta: true`**.
- As perguntas devem ser de nível adequado para alunos em recuperação escolar (matemática, português, ciências, história — adapte ao contexto real).

Preencha com pelo menos 20 perguntas reais ou de exemplo antes de continuar.

---

## 🎨 Passo 4 — Criar o arquivo `style.css`

Crie o CSS global com as seguintes especificações visuais. Implemente **cada regra descrita abaixo**:

### Reset e base
```css
* {
  box-sizing: border-box;
  margin: 0;
  padding: 0;
}

body {
  background-color: #1a1a1a;
  color: #ffffff;
  font-family: 'Segoe UI', Arial, sans-serif;
  font-size: 20px;
  font-weight: bold;
  min-height: 100vh;
}
```

### Tipografia — fontes grandes e visíveis de longe
- Títulos principais (`h1`): mínimo `3rem`, negrito, cor `#03D92D`
- Subtítulos (`h2`): mínimo `2rem`, negrito, branco
- Texto de pergunta: `2rem` ou maior, branco, negrito
- Texto de alternativa: `1.5rem`, negrito
- Texto de apoio: `1.2rem`

### Botões padrão
```css
.btn {
  background-color: #2b2b2b;
  color: #ffffff;
  border: 3px solid #03D92D;
  border-radius: 10px;
  padding: 16px 32px;
  font-size: 1.5rem;
  font-weight: bold;
  cursor: pointer;
  transition: background-color 0.2s, transform 0.1s;
}

.btn:hover {
  background-color: #03D92D;
  color: #1a1a1a;
  transform: scale(1.04);
}

.btn:disabled {
  opacity: 0.4;
  cursor: not-allowed;
  transform: none;
}
```

### Alternativas (botões de resposta)
- Fundo cinza escuro por padrão
- Borda verde ao passar o mouse
- Ao ser clicada a correta: fundo verde `#03D92D`, texto preto
- Ao ser clicada a errada: fundo vermelho `#D90303`, texto branco
- Alternativas eliminadas pela ajuda: opacity 0.3, cursor bloqueado, borda cinza

### Cards de risco (Errar / Parar / Acertar)
Três cards lado a lado na parte inferior esquerda:
- **Errar**: fundo `#5a1a1a`, borda `#D90303`, mostra metade do valor acumulado
- **Parar**: fundo `#3a3a1a`, borda `#D9B703`, mostra valor acumulado atual
- **Acertar**: fundo `#1a3a1a`, borda `#03D92D`, mostra valor se acertar, **não é clicável**
- Cada card: largura equivalente, padding generoso, fonte grande

### Botões de ajuda
Três botões em linha:
- Cor de destaque verde quando disponível
- Cinza e desabilitado quando os usos acabarem
- Mostrar contador de usos restantes dentro do botão (ex: `Colegas (2)`)

---

## 🏠 Passo 5 — Criar a página inicial `index.html`

Esta é a tela de **seleção do jogador**. Implemente o seguinte layout e comportamento:

### Layout visual
- Fundo cinza escuro
- Título centralizado no topo: **"QUIZ DE RECUPERAÇÃO"** em verde `#03D92D`, fonte enorme
- Subtítulo: **"Selecione o Jogador"**, branco, fonte grande
- Card central com:
  - Nome do aluno sorteado em destaque (fonte mínima `3.5rem`, verde, negrito, centralizado)
  - Dois botões abaixo do nome, lado a lado:
    - **"🔄 Sortear Novamente"** — cinza com borda verde
    - **"✅ Confirmar Jogador"** — verde sólido com texto preto

### Comportamento (implementar em `app.js`)

1. **Ao carregar a página:**
   - Ler o conteúdo do arquivo `alunos.md`
   - Extrair os nomes (linhas que começam com `- `)
   - Sortear um nome aleatório
   - Exibir o nome sorteado no card central
   - Ativar os dois botões

2. **Botão "Sortear Novamente":**
   - Sortear um novo nome **diferente do atual** (evitar repetir imediatamente)
   - Atualizar o card com o novo nome
   - Adicionar uma animação suave de troca (fade ou slide)

3. **Botão "Confirmar Jogador":**
   - Salvar o nome do jogador selecionado no `sessionStorage` com a chave `jogadorAtual`
   - Redirecionar para `quiz.html`

> **Nota sobre leitura do `alunos.md`:** Como é uma aplicação local sem servidor, use `fetch('./alunos.md')` para ler o arquivo. Isso funciona se a página for servida (ex: extensão Live Server no VSCode). Alternativamente, embutir os nomes diretamente em `app.js` como fallback caso o fetch falhe.

---

## ❓ Passo 6 — Criar a página de quiz `quiz.html`

Esta é a tela principal do jogo. Toda a lógica será gerenciada por `app.js`.

### Layout da página de quiz

A tela é dividida em duas colunas principais:

```
┌─────────────────────────────────────────┐
│  [Nome do Jogador]              canto ↗ │
├──────────────────┬──────────────────────┤
│                  │                      │
│   PERGUNTA       │   A) Alternativa 1   │
│   (texto grande) │   B) Alternativa 2   │
│                  │   C) Alternativa 3   │
│                  │   D) Alternativa 4   │
│                  │                      │
├──────────────────┴──────────────────────┤
│ "Valendo X.X Pontos na média"           │
│ [Colegas (2)] [Cartas (2)] [Pulo (3)]   │
│ [ERRAR: 0,5] [PARAR: 1,0] [ACERTAR: 1,5]│
└─────────────────────────────────────────┘
```

**Detalhes de cada seção:**

- **Canto superior direito:** Nome do jogador (`sessionStorage.getItem('jogadorAtual')`), em verde, fonte grande
- **Lado esquerdo (coluna ~45%):** Texto da pergunta, fonte `2rem+`, branco, negrito
- **Lado direito (coluna ~55%):** As 4 alternativas como botões empilhados verticalmente, cada um com a letra (A, B, C, D) em destaque
- **Parte inferior esquerda, abaixo da pergunta:**
  - Linha: `"Valendo X.X Pontos na média"` — substituir X.X pelo valor da pergunta atual
  - Linha com os 3 botões de ajuda
  - Linha com os 3 cards de risco

---

## ⚙️ Passo 7 — Implementar a lógica principal em `app.js`

Implemente as seguintes funcionalidades **separadas em funções bem nomeadas**:

### 7.1 — Inicialização do quiz

```javascript
function inicializarQuiz() {
  // 1. Recuperar nome do jogador do sessionStorage
  // 2. Selecionar 10 perguntas aleatórias do bancoPerguntasGlobal (embaralhar e pegar as primeiras 10)
  // 3. Guardar as perguntas restantes (para o Pulo poder substituir)
  // 4. Inicializar estado do jogo:
  //    - perguntaAtual: 0 (índice 0 a 9)
  //    - pontosAcumulados: 0
  //    - ajudas: { colegas: 2, cartas: 2, pulo: 3 }
  // 5. Renderizar a primeira pergunta
}
```

### 7.2 — Cálculo de pontos por pergunta

A tabela de pontos é fixa:
- Pergunta 1 → 0.5 pontos
- Pergunta 2 → 1.0 ponto
- Pergunta 3 → 1.5 pontos
- ...
- Pergunta 10 → 5.0 pontos

```javascript
function valorDaPergunta(indicePergunta) {
  return (indicePergunta + 1) * 0.5;
}
```

### 7.3 — Renderizar pergunta atual

```javascript
function renderizarPergunta() {
  // 1. Exibir o texto da pergunta
  // 2. Exibir as 4 alternativas como botões (com letras A, B, C, D)
  // 3. Atualizar o texto "Valendo X.X Pontos na média"
  // 4. Atualizar os cards de risco:
  //    - ERRAR: mostra Math.round(pontosAcumulados / 2 * 10) / 10
  //            (se ainda não acumulou nada, mostra 0)
  //    - PARAR: mostra pontosAcumulados
  //    - ACERTAR: mostra pontosAcumulados + valorDaPergunta(perguntaAtual)
  // 5. Atualizar os botões de ajuda com usos restantes
}
```

### 7.4 — Processar resposta do jogador

```javascript
function responder(alternativaSelecionada) {
  // 1. Desabilitar todos os botões de alternativa imediatamente
  // 2. Verificar se a alternativa é correta
  // 3a. Se CORRETA:
  //     - Destacar em verde
  //     - Somar pontos: pontosAcumulados += valorDaPergunta(perguntaAtual)
  //     - Se era a última pergunta (índice 9):
  //         → Exibir tela de vitória: "🏆 Parabéns, você saiu do buraco!"
  //         → Mostrar pontuação total: 5.0
  //     - Se não era a última:
  //         → Após 1.5s, avançar para próxima pergunta
  // 3b. Se ERRADA:
  //     - Destacar em vermelho
  //     - Revelar a correta em verde
  //     - Após 2s, exibir tela de fim de jogo com pontos parciais (metade do acumulado)
}
```

### 7.5 — Cards de risco: Errar e Parar

```javascript
function acaoErrar() {
  // Chamada quando o jogador clica em "ERRAR" (aceitar o risco)
  // Isso significa: o jogo encerra, o jogador leva metade do que acumulou
  // Exibir tela de resultado com: "Você levou X pontos (metade do acumulado)"
  // ATENÇÃO: "Errar" aqui é o CARD de risco, não a resposta errada.
  // O nome pode ser confuso — revisar com o professor se necessário.
  // SUGESTÃO: renomear para "Arriscar" na UI para maior clareza.
}

function acaoParar() {
  // O jogador desiste e leva o que acumulou até agora
  // Exibir tela de resultado com: "Você levou X pontos"
}
```

> ⚠️ **Atenção ao card "ERRAR":** Pelo enunciado, clicar em "Errar" encerra o jogo e o jogador leva **metade** do valor acumulado. Isso representa aceitar o risco da pergunta atual sem respondê-la. O card "Acertar" apenas exibe o potencial, sem ser clicável.

---

## 🆘 Passo 8 — Implementar os três tipos de ajuda

### 8.1 — Ajuda dos Colegas (máx. 2 usos)

```javascript
function ajudaColegas() {
  if (estado.ajudas.colegas <= 0) return;
  estado.ajudas.colegas--;
  
  // Exibir um modal ou área de destaque na tela com:
  // "📣 Os colegas estão votando..."
  // Simular uma votação: gerar porcentagens aleatórias para cada alternativa,
  // mas com tendência a favorecer a resposta correta (ex: 50-70% para a correta,
  // o restante distribuído aleatoriamente entre as erradas).
  // Exibir as porcentagens ao lado de cada alternativa por ~5 segundos.
  // Após isso, as porcentagens somem e o jogador escolhe normalmente.
  
  atualizarBotoesAjuda();
}
```

### 8.2 — Ajuda das Cartas (máx. 2 usos)

```javascript
function ajudaCartas() {
  if (estado.ajudas.cartas <= 0) return;
  estado.ajudas.cartas--;
  
  // 1. Exibir animação de 4 quadrados virados para baixo (numerados internamente 0,1,2,3)
  // 2. Sortear aleatoriamente qual carta o jogador "tira" (0, 1, 2 ou 3)
  // 3. Revelar o número da carta com animação (flip ou fade)
  // 4. Aplicar o efeito correspondente:
  //    - Carta 0: nenhuma alternativa é eliminada, exibir mensagem "Sem sorte desta vez!"
  //    - Carta 1: eliminar 1 alternativa errada (desabilitar e reduzir opacidade)
  //    - Carta 2: eliminar 2 alternativas erradas
  //    - Carta 3: eliminar 3 alternativas erradas (sobra apenas a correta habilitada)
  // 5. As alternativas eliminadas ficam com opacity: 0.3 e pointer-events: none
  
  atualizarBotoesAjuda();
}
```

**Como eliminar alternativas erradas:**
- Identificar quais alternativas têm `correta: false`
- Embaralhar esse subconjunto
- Desabilitar as primeiras N delas (conforme o número da carta)

### 8.3 — Pulo (máx. 3 usos)

```javascript
function ajudaPulo() {
  if (estado.ajudas.pulo <= 0) return;
  estado.ajudas.pulo--;
  
  // 1. Remover a pergunta atual da lista de perguntas do quiz
  // 2. Selecionar uma pergunta aleatória do banco de reserva
  //    (perguntas que não estão no quiz atual e ainda não foram usadas)
  // 3. Inserir a nova pergunta no lugar da atual (mesmo índice)
  // 4. Re-renderizar a pergunta (mesmos pontos, mesmo índice)
  // IMPORTANTE: o índice NÃO avança — é a mesma "rodada", mas com pergunta diferente
  // IMPORTANTE: a pergunta pulada não volta ao banco ativo (não pode ser sorteada de novo neste quiz)
  
  atualizarBotoesAjuda();
}
```

---

## 🏆 Passo 9 — Telas de resultado

Crie uma função `exibirResultado(tipo, pontos)` que substitui o conteúdo principal da tela por:

### Vitória (acertou todas as 10)
```
🏆 PARABÉNS, [NOME]!
VOCÊ SAIU DO BURACO!
Pontuação: 5.0 pontos na média

[Jogar Novamente]
```
- Fundo com destaque verde, animação de confete ou pulso (CSS)

### Fim por resposta errada
```
❌ Que pena, [NOME]!
Você errou a questão.
Você levou: X.X pontos (metade do acumulado)

[Jogar Novamente]
```

### Fim por escolher "Parar"
```
🛑 [NOME] decidiu parar!
Você garantiu: X.X pontos

[Jogar Novamente]
```

### Fim por escolher "Errar" (arriscar e encerrar)
```
⚠️ [NOME] aceitou o risco!
Você levou: X.X pontos (metade do acumulado)

[Jogar Novamente]
```

O botão **"Jogar Novamente"** deve redirecionar para `index.html`.

---

## 🔁 Passo 10 — Revisar e testar o fluxo completo

Após implementar tudo, execute os seguintes testes manuais **na ordem**:

1. **Abrir `index.html`** → verificar se um nome aparece automaticamente
2. **Clicar "Sortear Novamente"** várias vezes → confirmar que nomes diferentes aparecem
3. **Confirmar um jogador** → verificar se redireciona para `quiz.html` e o nome aparece no canto
4. **Responder a primeira pergunta corretamente** → verificar se avança para a segunda e os pontos sobem
5. **Responder uma pergunta errada** → verificar tela de fim de jogo com metade dos pontos
6. **Testar ajuda Colegas** → verificar se mostra porcentagens e decrementa o contador
7. **Testar ajuda Cartas** → verificar animação e eliminação de alternativas
8. **Testar Pulo** → verificar se a pergunta muda sem avançar o índice
9. **Testar "Parar"** → verificar tela com pontos acumulados
10. **Chegar até a pergunta 10 e acertar** → verificar mensagem de vitória

---

## 📌 Observações Finais para o Agente

- **Não use frameworks pesados.** HTML/CSS/JS puro é suficiente e facilita a edição pelo professor.
- **Comentários no código:** Comente todas as funções principais em português para facilitar manutenção.
- **Responsividade:** O projeto será exibido em projetor ou TV na sala de aula. Priorize fontes grandes e elementos bem espaçados. Não precisa ser mobile-first.
- **Sem backend:** Toda a lógica roda no navegador. Use `sessionStorage` para passar dados entre páginas.
- **Arquivo `alunos.md`:** O professor editará este arquivo para adicionar/remover alunos. Mantenha o formato simples com `- Nome Completo` por linha.
- **Perguntas:** O professor irá substituir as perguntas de exemplo pelas perguntas reais das matérias em recuperação. Mantenha o formato do array bem documentado.
- **Acessibilidade visual:** Contraste alto (verde sobre cinza escuro), sem animações que distraiam desnecessariamente, texto sempre legível a pelo menos 3 metros de distância.
