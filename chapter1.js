
/**
 * Capítulo 1: O Eco do Silêncio
 * Local: Escritório da Clara
 * Objetivo: Encontrar pistas sobre o paradeiro de Clara e sua investigação sobre a Silva Indústrias.
 */

export const CHAPTER_1_DATA = {
  id: 1,
  title: "O Eco do Silêncio",
  locationId: "office_clara",
  introNarrative: [
    "SISTEMA: Localização confirmada. Escritório de Clara Mendes.",
    "SISTEMA: Eduardo, o ar aqui está pesado. O cheiro de café frio e papel velho domina o ambiente.",
    "DIRETRIZ: Use o LENS para identificar anomalias. Clara não sairia sem levar seus arquivos mais importantes... a menos que não tivesse escolha."
  ],
  evidence: [
    {
      id: 'ev_clara_notebook',
      name: 'Caderno de Anotações',
      type: 'doc',
      description: 'Um caderno de capa preta, gasto nas bordas.',
      detailedDescription: 'Análise de Caligrafia: Escrita apressada. A última página menciona: "Eles sabem do acidente de 2009. Marcos não vai deixar isso sair. Preciso de provas físicas."',
      tags: ['SILVA INDÚSTRIAS', 'ACIDENTE', 'AMEAÇA'],
      location: 'office_clara'
    },
    {
      id: 'ev_shattered_photo',
      name: 'Foto Porta-Retrato Quebrado',
      type: 'image',
      description: 'Uma foto de Clara com uma mulher mais velha.',
      detailedDescription: 'Análise Visual: O vidro foi quebrado por um impacto direto. A mulher na foto é Maria Costa, mãe de Ana, morta no acidente de 2009. Clara e Ana compartilham uma perda que a cidade tentou esquecer.',
      tags: ['ANA COSTA', 'MARIA COSTA', 'ACIDENTE 2009'],
      location: 'office_clara'
    },
    {
      id: 'ev_hidden_usb',
      name: 'Pendrive Criptografado',
      type: 'tech',
      description: 'Encontrado atrás do fundo falso de uma gaveta.',
      detailedDescription: 'Status: Proteção de nível militar. Requer o app DECRYPT para acessar o conteúdo. Etiqueta física: "PROJETO THRIVE - NÃO ABRIR".',
      tags: ['TECNOLOGIA', 'THRIVE', 'SEGREDOS'],
      location: 'office_clara'
    }
  ],
  npcInteractions: {
    central: [
      {
        trigger: 'start',
        text: "Eduardo, foque no essencial. O tempo é um recurso escasso e a bateria deste dispositivo não é eterna. O que você vê?"
      },
      {
        trigger: 'found_notebook',
        text: "Silva Indústrias... Clara estava cutucando um ninho de vespas. Marcos Silva tem conexões que vão além desta cidade."
      }
    ],
    ana: [
      {
        trigger: 'first_contact',
        text: "Eduardo? É a Ana. Você já chegou no escritório dela? Por favor, me diga que encontrou algo. Eu não durmo há dois dias."
      }
    ]
  }
};
