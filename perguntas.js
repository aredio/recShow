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
  {
    id: 2,
    pergunta: "Quanto é 5 x 6?",
    alternativas: [
      { texto: "25", correta: false },
      { texto: "30", correta: true },
      { texto: "35", correta: false },
      { texto: "40", correta: false }
    ]
  },
  {
    id: 3,
    pergunta: "Qual é a raiz quadrada de 64?",
    alternativas: [
      { texto: "6", correta: false },
      { texto: "7", correta: false },
      { texto: "8", correta: true },
      { texto: "9", correta: false }
    ]
  },
  {
    id: 4,
    pergunta: "Quanto é 10% de 200?",
    alternativas: [
      { texto: "10", correta: false },
      { texto: "20", correta: true },
      { texto: "30", correta: false },
      { texto: "40", correta: false }
    ]
  },
  {
    id: 5,
    pergunta: "Quantos minutos tem uma hora?",
    alternativas: [
      { texto: "30 minutos", correta: false },
      { texto: "45 minutos", correta: false },
      { texto: "60 minutos", correta: true },
      { texto: "90 minutos", correta: false }
    ]
  },
  {
    id: 6,
    pergunta: "Qual é o sinônimo de 'rápido'?",
    alternativas: [
      { texto: "Lento", correta: false },
      { texto: "Veloz", correta: true },
      { texto: "Pesado", correta: false },
      { texto: "Triste", correta: false }
    ]
  },
  {
    id: 7,
    pergunta: "Qual é o plural de 'cidadão'?",
    alternativas: [
      { texto: "Cidadões", correta: false },
      { texto: "Cidadãos", correta: true },
      { texto: "Cidadães", correta: false },
      { texto: "Cidadãs", correta: false }
    ]
  },
  {
    id: 8,
    pergunta: "A palavra 'pássaro' é acentuada por ser uma:",
    alternativas: [
      { texto: "Oxítona", correta: false },
      { texto: "Paroxítona", correta: false },
      { texto: "Proparoxítona", correta: true },
      { texto: "Monossílaba", correta: false }
    ]
  },
  {
    id: 9,
    pergunta: "Qual destas palavras é um verbo?",
    alternativas: [
      { texto: "Mesa", correta: false },
      { texto: "Correr", correta: true },
      { texto: "Feliz", correta: false },
      { texto: "Azul", correta: false }
    ]
  },
  {
    id: 10,
    pergunta: "Quem é o autor do livro 'Dom Casmurro'?",
    alternativas: [
      { texto: "Monteiro Lobato", correta: false },
      { texto: "Machado de Assis", correta: true },
      { texto: "José de Alencar", correta: false },
      { texto: "Jorge Amado", correta: false }
    ]
  },
  {
    id: 11,
    pergunta: "Qual é o planeta mais próximo do Sol?",
    alternativas: [
      { texto: "Vênus", correta: false },
      { texto: "Marte", correta: false },
      { texto: "Mercúrio", correta: true },
      { texto: "Terra", correta: false }
    ]
  },
  {
    id: 12,
    pergunta: "Qual é o principal gás utilizado pelas plantas na fotossíntese?",
    alternativas: [
      { texto: "Oxigênio", correta: false },
      { texto: "Nitrogênio", correta: false },
      { texto: "Gás Carbônico", correta: true },
      { texto: "Hélio", correta: false }
    ]
  },
  {
    id: 13,
    pergunta: "A água entra em estado gasoso a partir de quantos graus Celsius (ao nível do mar)?",
    alternativas: [
      { texto: "50°C", correta: false },
      { texto: "80°C", correta: false },
      { texto: "100°C", correta: true },
      { texto: "120°C", correta: false }
    ]
  },
  {
    id: 14,
    pergunta: "O que o coração bombeia para todo o corpo humano?",
    alternativas: [
      { texto: "Água", correta: false },
      { texto: "Sangue", correta: true },
      { texto: "Ar", correta: false },
      { texto: "Suor", correta: false }
    ]
  },
  {
    id: 15,
    pergunta: "Qual o maior órgão do corpo humano?",
    alternativas: [
      { texto: "Fígado", correta: false },
      { texto: "Cérebro", correta: false },
      { texto: "Coração", correta: false },
      { texto: "Pele", correta: true }
    ]
  },
  {
    id: 16,
    pergunta: "Quem é reconhecido como o descobridor do Brasil em 1500?",
    alternativas: [
      { texto: "Pedro Álvares Cabral", correta: true },
      { texto: "Cristóvão Colombo", correta: false },
      { texto: "Vasco da Gama", correta: false },
      { texto: "Dom Pedro I", correta: false }
    ]
  },
  {
    id: 17,
    pergunta: "Em que ano ocorreu a Independência do Brasil?",
    alternativas: [
      { texto: "1500", correta: false },
      { texto: "1822", correta: true },
      { texto: "1889", correta: false },
      { texto: "1930", correta: false }
    ]
  },
  {
    id: 18,
    pergunta: "Qual foi o primeiro presidente do Brasil?",
    alternativas: [
      { texto: "Getúlio Vargas", correta: false },
      { texto: "Dom Pedro II", correta: false },
      { texto: "Deodoro da Fonseca", correta: true },
      { texto: "Prudente de Morais", correta: false }
    ]
  },
  {
    id: 19,
    pergunta: "Qual é a atual capital do Brasil?",
    alternativas: [
      { texto: "Rio de Janeiro", correta: false },
      { texto: "São Paulo", correta: false },
      { texto: "Salvador", correta: false },
      { texto: "Brasília", correta: true }
    ]
  },
  {
    id: 20,
    pergunta: "Quem pintou a famosa obra 'Mona Lisa'?",
    alternativas: [
      { texto: "Vincent van Gogh", correta: false },
      { texto: "Pablo Picasso", correta: false },
      { texto: "Leonardo da Vinci", correta: true },
      { texto: "Michelangelo", correta: false }
    ]
  }
];
