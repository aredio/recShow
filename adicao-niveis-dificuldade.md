# ➕ Adição ao Projeto — Níveis de Dificuldade nas Perguntas

> **Para o agente de IA:** O projeto base já foi implementado conforme o `guia-quiz-recuperacao.md`. Este documento descreve uma **adição** a ser feita no código existente. Leia todo o documento antes de começar. Execute cada passo na ordem, confirmando com `✅ Passo X concluído` antes de avançar.
>
> **Não reescreva o que já existe.** Apenas modifique e adicione o que está descrito aqui.

---

## 📋 Contexto da Adição

Cada pergunta do banco passará a ter um campo `dificuldade` com três valores possíveis: `"facil"`, `"medio"` ou `"dificil"`. Esse campo vai controlar:

1. **Quais perguntas aparecem em cada rodada** — as 4 primeiras sempre fáceis, as 4 seguintes médias, as 2 últimas difíceis.
2. **O comportamento da ajuda Pulo** — ao pular, a pergunta substituta vem de um nível inferior ao da pergunta atual.

---

## 🗃️ Passo A — Adicionar o campo `dificuldade` em todas as perguntas do `perguntas.js`

Abra o arquivo `perguntas.js` e adicione o campo `dificuldade` a **cada objeto** do array `bancoPerguntasGlobal`. O campo deve vir logo após o `id`:

```javascript
// ANTES:
{
  id: 1,
  pergunta: "Texto da pergunta...",
  alternativas: [ ... ]
}

// DEPOIS:
{
  id: 1,
  dificuldade: "facil", // "facil" | "medio" | "dificil"
  pergunta: "Texto da pergunta...",
  alternativas: [ ... ]
}
```

**Distribuição obrigatória do banco após a edição:**
- Mínimo de **12 perguntas** com `dificuldade: "facil"`
- Mínimo de **12 perguntas** com `dificuldade: "medio"`
- Mínimo de **6 perguntas** com `dificuldade: "dificil"`

Essa margem garante que o Pulo sempre encontre uma pergunta substituta disponível em qualquer nível.

Se o banco atual tiver menos de 30 perguntas no total, acrescente novas perguntas até atingir a distribuição mínima acima, seguindo o mesmo formato já existente.

Após editar, confirme que **nenhuma pergunta ficou sem o campo `dificuldade`** antes de continuar.

---

## ⚙️ Passo B — Adicionar constante de mapeamento em `app.js`

No início do arquivo `app.js`, logo após as declarações de variáveis de estado existentes, adicione a seguinte constante:

```javascript
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
```

Não altere nenhuma outra variável ou função neste momento.

---

## ⚙️ Passo C — Modificar `inicializarQuiz()` para selecionar perguntas por nível

Localize a função `inicializarQuiz()` (ou a parte do código onde as 10 perguntas do quiz são sorteadas aleatoriamente do banco) e **substitua apenas a lógica de seleção de perguntas** pelo código abaixo. Todo o restante da função deve permanecer igual.

```javascript
// SUBSTITUIR apenas o trecho que seleciona as perguntas do banco.
// O restante de inicializarQuiz() (salvar jogador, zerar pontos, etc.) não muda.

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
```

Chame `selecionarPerguntasDoQuiz()` dentro de `inicializarQuiz()` no lugar onde antes as perguntas eram sorteadas.

> ⚠️ Se a função `embaralhar()` ainda não existir no projeto, crie-a:
> ```javascript
> function embaralhar(array) {
>   return [...array].sort(() => Math.random() - 0.5);
> }
> ```

---

## ⚙️ Passo D — Modificar `ajudaPulo()` para respeitar o nível inferior

Localize a função `ajudaPulo()` (ou o bloco equivalente que trata o Pulo) e **substitua apenas a lógica de seleção da pergunta substituta**. A lógica de decrementar o contador de usos e re-renderizar a tela não muda.

```javascript
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
  estado.perguntasDoQuiz[estado.perguntaAtual] = substituta;

  // Re-renderizar a pergunta (função já existente no projeto)
  renderizarPergunta();
  atualizarBotoesAjuda();
}
```

---

## 🎨 Passo E — Adicionar badge visual de dificuldade na tela do quiz

### No `quiz.html`

Dentro da área da pergunta (coluna esquerda), adicione um elemento badge logo acima do texto da pergunta:

```html
<span id="badge-dificuldade" class="badge-dificuldade"></span>
```

### No `style.css`

Adicione ao final do arquivo:

```css
.badge-dificuldade {
  display: inline-block;
  padding: 4px 16px;
  border-radius: 20px;
  border: 2px solid;
  font-size: 1rem;
  font-weight: bold;
  letter-spacing: 2px;
  text-transform: uppercase;
  margin-bottom: 12px;
}

.badge-facil   { color: #03D92D; border-color: #03D92D; }
.badge-medio   { color: #D9B703; border-color: #D9B703; }
.badge-dificil { color: #D90303; border-color: #D90303; }
```

### Em `app.js`, dentro de `renderizarPergunta()`

Adicione ao final da função, antes de qualquer `return`:

```javascript
// Atualizar badge de dificuldade
const nivel = DIFICULDADE_POR_RODADA[estado.perguntaAtual];
const badge = document.getElementById('badge-dificuldade');
const labels = { facil: '🟢 Fácil', medio: '🟡 Médio', dificil: '🔴 Difícil' };
badge.textContent = labels[nivel];
badge.className = `badge-dificuldade badge-${nivel}`;
```

---

## ✅ Passo F — Testar a adição

Execute os seguintes testes manuais para confirmar que tudo funciona:

1. Iniciar um quiz e verificar se o badge exibe **🟢 Fácil** nas rodadas 1 a 4.
2. Avançar até a rodada 5 e verificar se o badge muda para **🟡 Médio**.
3. Avançar até a rodada 9 e verificar se o badge muda para **🔴 Difícil**.
4. Na rodada 1 (fácil), usar o Pulo e confirmar que a pergunta substituta tem `dificuldade: "facil"`.
5. Na rodada 5 (médio), usar o Pulo e confirmar que a pergunta substituta tem `dificuldade: "facil"`.
6. Na rodada 9 (difícil), usar o Pulo e confirmar que a pergunta substituta tem `dificuldade: "medio"`.
7. Verificar que o índice da rodada **não avança** ao usar o Pulo — a pontuação em jogo deve permanecer a mesma.
8. Confirmar que o fluxo completo de 10 perguntas ainda funciona normalmente (vitória, derrota, parar).
