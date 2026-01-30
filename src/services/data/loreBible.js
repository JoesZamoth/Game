
/**
 * LORE BIBLE - THRIVEOS: TERRA SEM OLHOS
 * Este arquivo serve como a "Fonte da Verdade" para a IA.
 * Contém os fatos imutáveis que garantem que o jogo faça sentido.
 */

export const LORE_BIBLE = {
  PROJECT_NAME: "ThriveOS: Terra sem Olhos",
  SETTING: "Cidade de Nova Esperança, 2024. Estética Cyberpunk Noir.",
  
  // O GRANDE SEGREDO (O que a IA deve saber mas revelar aos poucos)
  THE_TRUTH_2009: {
    EVENT: "Explosão da Fábrica de Semicondutores Silva.",
    DATE: "15 de Março de 2009, às 14:23.",
    OFFICIAL_VERSION: "Curto-circuito acidental devido a tempestade.",
    REAL_VERSION: "A Silva Indústrias estava testando um protótipo de IA (Thrive v1) que superaqueceu os servidores. Para não perder os dados, Marcos Silva (pai) ordenou o bloqueio das saídas de emergência para evitar 'vazamento de propriedade intelectual' enquanto tentavam conter o sistema.",
    VICTIMS: "12 mortos, incluindo Maria Costa (mãe de Ana) e Arthur Mendes (pai de Clara).",
    COVER_UP: "O Detetive Eduardo (na época um novato) foi quem assinou o relatório final aceitando a versão de 'acidente' sob pressão e suborno, algo que ele bloqueou da memória.",
  },

  // PERSONAGENS
  CHARACTERS: {
    EDUARDO_ALVES: {
      ROLE: "Detetive Particular.",
      BACKSTORY: "Ex-policial que saiu da corporação após o caso de 2009. Ele sofre de lapsos de memória traumática. Ele não sabe que foi ele quem ajudou a encobrir o crime no passado.",
      MOTIVATION: "Redenção, embora ele não saiba exatamente do quê ainda.",
    },
    CLARA_MENDES: {
      ROLE: "Jornalista Investigativa (Desaparecida).",
      MOTIVATION: "Vingar o pai e expor a Silva Indústrias. Ela descobriu o envolvimento de Eduardo no encobrimento de 2009.",
    },
    OPERADOR_07: {
      ROLE: "Operador da Central Thrive.",
      PERSONALITY: "Humano, cínico, fuma enquanto fala, cansado. Ele gosta de Eduardo, mas teme pela vida de ambos.",
    },
    MARCOS_SILVA_JR: {
      ROLE: "CEO da Silva Indústrias.",
      PERSONALITY: "Sociopata corporativo. Ele quer recuperar o ThriveOS v4 porque ele contém os logs originais de 2009 que nunca foram apagados.",
    }
  },

  // ESTRUTURA DE CAPÍTULOS (A Rota Básica)
  CHAPTERS: [
    {
      ID: 1,
      TITLE: "O Eco do Silêncio",
      GOAL: "Descobrir que o desaparecimento de Clara está ligado a 2009.",
      KEY_EVIDENCE: ["Caderno de Clara", "Foto de Maria Costa"],
    },
    {
      ID: 2,
      TITLE: "Sombras na Mansão",
      GOAL: "Infiltrar-se digitalmente ou fisicamente na rede de Marcos Silva.",
    },
    {
      ID: 3,
      TITLE: "O Arquivo Morto",
      GOAL: "Eduardo descobre sua própria assinatura no relatório de 2009.",
    }
  ]
};
