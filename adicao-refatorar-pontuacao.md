# ➕ Adição ao Projeto — Refatorar Pontuação (0.3 por pergunta, total 3.0)

> **Para o agente de IA:** O projeto já está implementado com todas as adições anteriores (níveis de dificuldade, grid de seleção, splash e áudio). Este documento descreve uma **refatoração pontual**: o valor de cada pergunta muda de progressão `0.5, 1.0, 1.5 ... 5.0` para `0.3, 0.6, 0.9 ... 3.0`. Leia todo o documento antes de começar. Execute cada passo na ordem, confirmando com `✅ Passo X concluído` antes de avançar.
>
> **Não reescreva lógica que não está relacionada à pontuação.** Apenas ajuste os valores e textos descritos aqui, preservando toda a estrutura de funções já existente.

---

## 📋 Contexto da Refatoração

A tabela de pontos por pergunta muda de:

| Pergunta | Valor antigo | Valor novo |
|---|---|---|
| 1 | 0.5 | 0.3 |
| 2 | 1.0 | 0.6 |
| 3 | 1.5 | 0.9 |
| 4 | 2.0 | 1.2 |
| 5 | 2.5 | 1.5 |
| 6 | 3.0 | 1.8 |
| 7 | 3.5 | 2.1 |
| 8 | 4.0 | 2.4 |
| 9 | 4.5 | 2.7 |
| 10 | 5.0 | 3.0 |

Essa mudança afeta:
- A função que calcula o valor de cada pergunta (`valorDaPergunta`).
- O texto "Valendo X Pontos na média" exibido durante o quiz.
- Os três cards de risco: **Errar** (mostra metade do acumulado), **Parar** (mostra o acumulado), **Acertar** (mostra o que teria se acertasse a pergunta atual).
- A mensagem final de vitória, que hoje cita "5.0 pontos" e deve passar a citar "3.0 pontos".
- Qualquer lugar do código ou da UI que tenha o valor "5.0" ou "0.5" fixado como texto relacionado à pontuação máxima ou ao incremento por pergunta.

---

## ⚙️ Passo A — Atualizar a função `valorDaPergunta()`

Localize a função já existente em `app.js`:

```javascript
// ANTES:
function valorDaPergunta(indicePergunta) {
  return (indicePergunta + 1) * 0.5;
}
```

Substitua **apenas o multiplicador**, mantendo a mesma estrutura da função:

```javascript
// DEPOIS:
function valorDaPergunta(indicePergunta) {
  return (indicePergunta + 1) * 0.3;
}
```

> **Importante:** como `0.3 * n` pode gerar imprecisões de ponto flutuante em JavaScript (ex: `0.3 * 3 = 0.8999999999999999`), adicione um arredondamento para evitar exibir valores quebrados na tela:

```javascript
function valorDaPergunta(indicePergunta) {
  const valor = (indicePergunta + 1) * 0.3;
  return Math.round(valor * 10) / 10; // arredonda para 1 casa decimal
}
```

---

## ⚙️ Passo B — Revisar todos os cálculos que dependem de `pontosAcumulados`

Os cálculos abaixo já usam `valorDaPergunta()` ou `pontosAcumulados` indiretamente — como a lógica em si **não muda**, eles devem funcionar automaticamente após o Passo A. Ainda assim, **revise cada um** para garantir que nenhum valor fixo (0.5, 5.0, etc.) tenha sido escrito diretamente no lugar de uma chamada de função:

### B.1 — Card "Errar" (metade do acumulado)

Confirme que o cálculo continua sendo uma divisão por 2 sobre o valor acumulado, sem nenhum número fixo:

```javascript
const valorErrar = Math.round(pontosAcumulados / 2 * 10) / 10;
```

### B.2 — Card "Parar" (acumulado total)

```javascript
const valorParar = pontosAcumulados;
```

### B.3 — Card "Acertar" (acumulado + valor da pergunta atual)

```javascript
const valorAcertar = pontosAcumulados + valorDaPergunta(estado.perguntaAtual);
```

Como esses três cálculos **dependem de `valorDaPergunta()`**, que já foi corrigida no Passo A, eles devem refletir os novos valores automaticamente. **Apenas confirme** que nenhum desses trechos tem `0.5` ou qualquer constante de pontuação escrita diretamente — se encontrar, substitua pela chamada de função correspondente.

---

## 📝 Passo C — Atualizar textos fixos na interface

Procure no código (HTML e JS) por **textos estáticos** que mencionem a pontuação máxima ou o incremento por pergunta, e atualize:

### C.1 — Mensagem de vitória

Localize a tela de vitória (criada no Passo 9 do guia original) e atualize o texto fixo:

```
ANTES: "Pontuação: 5.0 pontos na média"
DEPOIS: "Pontuação: 3.0 pontos na média"
```

Se o valor já for inserido dinamicamente via `pontosAcumulados` (e não escrito como texto fixo "5.0"), nenhuma mudança é necessária — apenas confirme que está correto.

### C.2 — Texto "Valendo X Pontos na média"

Esse texto já deve estar usando a variável dinâmica de `valorDaPergunta()`. Confirme que não há um valor fixo escrito ali e que ele exibirá corretamente `0.3`, `0.6`, `0.9` etc. conforme a pergunta avança.

### C.3 — Outras menções textuais

Faça uma busca geral no projeto pelos textos `"5.0"`, `"5,0"`, `"0.5"` e `"0,5"` fora de comentários de código, para garantir que nenhuma menção solta (ex: em algum parágrafo explicativo, badge, ou tooltip) ficou com o valor antigo.

---

## ✅ Passo D — Testar a refatoração

Execute os seguintes testes manuais para confirmar que tudo funciona:

1. Iniciar um quiz e verificar que a primeira pergunta exibe **"Valendo 0.3 Pontos na média"**.
2. Acertar a primeira pergunta e confirmar que a segunda exibe **"Valendo 0.6 Pontos na média"**.
3. Continuar acertando e confirmar a progressão completa: `0.3, 0.6, 0.9, 1.2, 1.5, 1.8, 2.1, 2.4, 2.7, 3.0`.
4. Em qualquer ponto do jogo, verificar os três cards:
   - **Acertar** mostra o acumulado + valor da pergunta atual (corretamente arredondado).
   - **Parar** mostra exatamente o acumulado atual.
   - **Errar** mostra a metade do acumulado atual (arredondado).
5. Errar uma pergunta após acumular alguns pontos e confirmar que o valor final exibido é a metade correta (ex: acumulado 1.5 → recebe 0.75, mas como o sistema arredonda para 1 casa decimal, deve mostrar 0.8 ou 0.7 dependendo da regra de arredondamento já existente — confirme que está consistente).
6. Acertar todas as 10 perguntas e confirmar que a tela de vitória mostra **"Pontuação: 3.0 pontos na média"**.
7. Clicar em "Parar" em diferentes momentos do jogo e confirmar que o valor exibido corresponde exatamente ao acumulado até aquele ponto.
8. Verificar visualmente que nenhum texto na aplicação ainda menciona "5.0" ou "0.5" como referência de pontuação.
