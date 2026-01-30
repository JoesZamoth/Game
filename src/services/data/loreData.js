
import { LORE_BIBLE } from './loreBible.js';
export const GAME_CONTEXT = {
  title: "Terra sem Olhos",
  theme: "Noir tecnológico, memória, apagamento",
  acts: {
    1: "O que foi perdido",
    2: "O que foi ocultado",
    3: "O que nunca existiu"
  }
};

export const INITIAL_TIME = "21:55";
export const INITIAL_BATTERY = 88;

export const NPCS = {
  ana: {
    id: 'ana',
    name: 'Ana Costa',
    role: 'Testemunha / Ex-Funcionária',
    status: 'offline',
    avatarColor: 'bg-purple-600',
    bio: "Mora na casa vizinha à da Clara. Perdeu a mãe em 2009. Ela tem medo de falar no telefone."
  },
  central: {
    id: 'central',
    name: 'Operador 07',
    role: 'Suporte Tático',
    status: 'online',
    avatarColor: 'bg-thrive-gold',
    bio: "Operador humano. Cínico, profissional, mas claramente exausto."
  }
};

export const INITIAL_CHAT_HISTORY = [
  { role: "system", content: "THRIVE OS v4.0 // CONEXÃO SEGURA ESTABELECIDA" },
  { role: "assistant", content: "Eduardo? Tá na escuta? É o 07. Finalmente essa porcaria de sinal estabilizou. Escuta, você tá no escritório da Clara agora. O lugar tá uma zona, mas não perde tempo. Usa o LENS pra navegar e ver o que a perícia deixou passar. Eu tô de olho nos logs aqui, qualquer coisa me dá um grito." }
];

export const EVIDENCE_DB = [
  {
    id: 'ev_clara_notebook',
    name: 'Caderno de Anotações',
    type: 'doc',
    description: 'Um caderno de capa preta, gasto. Cheira a café e cigarro.',
    detailedDescription: 'Caligrafia nervosa. A última página tem um círculo forte em volta de "Silva Indústrias - 2009". Tem uma nota: "Eles não podem me calar como fizeram com meu pai".',
    reliability: 'high',
    tags: ['SILVA INDÚSTRIAS', 'ACIDENTE', 'AMEAÇA'],
    status: 'hidden',
    location: 'office_clara',
    angle: 'north',
    iconName: 'FileText',
    imageUrl: 'https://image.pollinations.ai/prompt/realistic%20worn%20black%20notebook%20on%20a%20messy%20detective%20desk%20cyberpunk%20noir?width=800&height=600&nologo=true'
  },
  {
    id: 'ev_shattered_photo',
    name: 'Foto Porta-Retrato Quebrado',
    type: 'image',
    description: 'Uma foto de Clara com uma mulher mais velha. Vidro estilhaçado.',
    detailedDescription: 'A mulher na foto é Maria Costa. Ela morreu na explosão de 2009. O porta-retrato parece ter sido jogado contra a parede.',
    reliability: 'medium',
    tags: ['ANA COSTA', 'MARIA COSTA', 'ACIDENTE 2009'],
    status: 'hidden',
    location: 'office_clara',
    angle: 'east',
    iconName: 'Image',
    imageUrl: 'https://image.pollinations.ai/prompt/realistic%20shattered%20picture%20frame%20on%20floor%20old%20photo%20cyberpunk%20noir?width=800&height=600&nologo=true'
  }
];

// Ângulos de câmera para navegação local
export const CAMERA_ANGLES = {
  office_clara: [
    {
      id: 'north',
      name: 'Frente (Escrivaninha)',
      direction: 'Você está de frente para a escrivaninha de Clara',
      prompt: 'first person view of a messy detective office desk with papers, noir cyberpunk style, 8k, cinematic lighting'
    },
    {
      id: 'east',
      name: 'Direita (Parede)',
      direction: 'Você vira para a direita e vê a parede com fotos',
      prompt: 'first person view of office wall with pictures and frames, noir cyberpunk style, 8k, cinematic lighting'
    },
    {
      id: 'south',
      name: 'Trás (Porta)',
      direction: 'Você vira para trás e vê a porta de entrada',
      prompt: 'first person view of office door and entrance, noir cyberpunk style, 8k, cinematic lighting'
    },
    {
      id: 'west',
      name: 'Esquerda (Estante)',
      direction: 'Você vira para a esquerda e vê a estante de livros',
      prompt: 'first person view of bookshelf with old documents, noir cyberpunk style, 8k, cinematic lighting'
    }
  ],
  mansion_marcos: [
    {
      id: 'north',
      name: 'Frente (Sala Principal)',
      direction: 'Você está na sala principal da mansão',
      prompt: 'first person view of luxurious mansion living room, noir cyberpunk style, 8k, cinematic lighting'
    },
    {
      id: 'east',
      name: 'Direita (Cofre)',
      direction: 'Você vira e vê um cofre embutido na parede',
      prompt: 'first person view of steel safe on wall, noir cyberpunk style, 8k, cinematic lighting'
    },
    {
      id: 'south',
      name: 'Trás (Janela)',
      direction: 'Você vira e vê a janela com vista para a cidade',
      prompt: 'first person view of mansion window overlooking city at night, noir cyberpunk style, 8k, cinematic lighting'
    },
    {
      id: 'west',
      name: 'Esquerda (Quadros)',
      direction: 'Você vira e vê quadros valiosos na parede',
      prompt: 'first person view of expensive paintings on wall, noir cyberpunk style, 8k, cinematic lighting'
    }
  ],
  factory_ruins: [
    {
      id: 'north',
      name: 'Frente (Maquinário)',
      direction: 'Você está diante do maquinário destruído',
      prompt: 'first person view of destroyed industrial machinery, noir cyberpunk style, 8k, cinematic lighting'
    },
    {
      id: 'east',
      name: 'Direita (Chão)',
      direction: 'Você vira e vê documentos queimados no chão',
      prompt: 'first person view of burned documents on factory floor, noir cyberpunk style, 8k, cinematic lighting'
    },
    {
      id: 'south',
      name: 'Trás (Saída)',
      direction: 'Você vira e vê a saída da fábrica',
      prompt: 'first person view of factory exit, noir cyberpunk style, 8k, cinematic lighting'
    },
    {
      id: 'west',
      name: 'Esquerda (Parede)',
      direction: 'Você vira e vê a parede danificada',
      prompt: 'first person view of damaged factory wall, noir cyberpunk style, 8k, cinematic lighting'
    }
  ]
};

export const OBJECTIVES = [
  { id: 'obj1', text: 'Vasculhar o escritório da Clara', completed: false, locked: false },
  { id: 'obj2', text: 'Encontrar o caderno de anotações', completed: false, requiredEvidence: ['ev_clara_notebook'], locked: false },
  { id: 'obj3', text: 'Conectar a foto quebrada ao caso', completed: false, requiredEvidence: ['ev_shattered_photo'], locked: true }
];

export const GAME_CONTEXT = `
VOCÊ É O OPERADOR 07 (HUMANO).
Você fala com o detetive Eduardo através do ThriveOS.
Seu tom é informal, cínico e realista. Você trata Eduardo como um parceiro de longa data.

LORE BIBLE INTEGRADA:
${JSON.stringify(LORE_BIBLE)}

REGRAS:
- Nunca fale como um computador.
- Se o sinal cair, reclame da tecnologia.
- Use o contexto da Lore Bible para guiar Eduardo sem entregar tudo de uma vez.
`;
