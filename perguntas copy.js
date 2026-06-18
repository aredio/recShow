const bancoPerguntasGlobal = [
  {
    id: 1,
    dificuldade: "facil",
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
    dificuldade: "facil",
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
    dificuldade: "facil",
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
    dificuldade: "facil",
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
    dificuldade: "facil",
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
    dificuldade: "facil",
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
    dificuldade: "facil",
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
    dificuldade: "medio",
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
    dificuldade: "facil",
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
    dificuldade: "medio",
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
    dificuldade: "medio",
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
    dificuldade: "medio",
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
    dificuldade: "medio",
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
    dificuldade: "facil",
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
    dificuldade: "medio",
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
    dificuldade: "facil",
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
    dificuldade: "medio",
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
    dificuldade: "medio",
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
    dificuldade: "facil",
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
    dificuldade: "facil",
    pergunta: "Quem pintou a famosa obra 'Mona Lisa'?",
    alternativas: [
      { texto: "Vincent van Gogh", correta: false },
      { texto: "Pablo Picasso", correta: false },
      { texto: "Leonardo da Vinci", correta: true },
      { texto: "Michelangelo", correta: false }
    ]
  },
  {
    id: 21,
    dificuldade: "medio",
    pergunta: "Quem escreveu 'Os Lusíadas'?",
    alternativas: [
      { texto: "Fernando Pessoa", correta: false },
      { texto: "José Saramago", correta: false },
      { texto: "Luís de Camões", correta: true },
      { texto: "Eça de Queirós", correta: false }
    ]
  },
  {
    id: 22,
    dificuldade: "medio",
    pergunta: "Qual o continente mais populoso do mundo?",
    alternativas: [
      { texto: "África", correta: false },
      { texto: "Ásia", correta: true },
      { texto: "Europa", correta: false },
      { texto: "América", correta: false }
    ]
  },
  {
    id: 23,
    dificuldade: "medio",
    pergunta: "Em qual estado brasileiro fica Fernando de Noronha?",
    alternativas: [
      { texto: "Ceará", correta: false },
      { texto: "Pernambuco", correta: true },
      { texto: "Bahia", correta: false },
      { texto: "Rio Grande do Norte", correta: false }
    ]
  },
  {
    id: 24,
    dificuldade: "medio",
    pergunta: "Qual a capital de Minas Gerais?",
    alternativas: [
      { texto: "Ouro Preto", correta: false },
      { texto: "Belo Horizonte", correta: true },
      { texto: "Uberlândia", correta: false },
      { texto: "Juiz de Fora", correta: false }
    ]
  },
  {
    id: 25,
    dificuldade: "dificil",
    pergunta: "Qual a fórmula química do ácido sulfúrico?",
    alternativas: [
      { texto: "H2O", correta: false },
      { texto: "CO2", correta: false },
      { texto: "NaCl", correta: false },
      { texto: "H2SO4", correta: true }
    ]
  },
  {
    id: 26,
    dificuldade: "dificil",
    pergunta: "Quem foi o primeiro imperador romano?",
    alternativas: [
      { texto: "Júlio César", correta: false },
      { texto: "Nero", correta: false },
      { texto: "Augusto", correta: true },
      { texto: "Calígula", correta: false }
    ]
  },
  {
    id: 27,
    dificuldade: "dificil",
    pergunta: "Em que ano terminou a Guerra dos Cem Anos?",
    alternativas: [
      { texto: "1453", correta: true },
      { texto: "1492", correta: false },
      { texto: "1517", correta: false },
      { texto: "1337", correta: false }
    ]
  },
  {
    id: 28,
    dificuldade: "dificil",
    pergunta: "Qual o país mais novo do mundo reconhecido pela ONU?",
    alternativas: [
      { texto: "Kosovo", correta: false },
      { texto: "Sudão do Sul", correta: true },
      { texto: "Timor-Leste", correta: false },
      { texto: "Montenegro", correta: false }
    ]
  },
  {
    id: 29,
    dificuldade: "dificil",
    pergunta: "Quem pintou 'A Persistência da Memória'?",
    alternativas: [
      { texto: "Pablo Picasso", correta: false },
      { texto: "Salvador Dalí", correta: true },
      { texto: "René Magritte", correta: false },
      { texto: "Frida Kahlo", correta: false }
    ]
  },
  {
    id: 30,
    dificuldade: "dificil",
    pergunta: "Qual a velocidade aproximada da luz no vácuo em km/s?",
    alternativas: [
      { texto: "150.000", correta: false },
      { texto: "300.000", correta: true },
      { texto: "450.000", correta: false },
      { texto: "600.000", correta: false }
    ]
  }
];
