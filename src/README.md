🎮 ThriveOS – Game

Uma experiência de Simulação / RPG interativo desenvolvida sobre o ecossistema ThriveOS.
O jogo combina exploração de cenários com um sistema de narrativa baseado em eventos e NPCs alimentados por dados estruturados.

📸 Preview

Adicione aqui um GIF ou screenshot do jogo em funcionamento para chamar atenção dos usuários no GitHub!

Demo do Jogo

🚀 Funcionalidades Principais

Exploração de Cenários: Navegação por mapas do ecossistema ThriveOS.

Engine de NPCs: Sistema que interpreta arquivos .md para gerar diálogos e eventos.

Eventos Interativos: Acionados por interações do jogador, alterando o estado do mundo.

Sistema de Inventário: Gestão básica de itens coletados.

Design Moderno: Interface responsiva e estilizada com Tailwind CSS.

Arquitetura Modular: Facilita a adição de novos mapas e NPCs sem alterar o código principal.

🛠️ Tecnologias Utilizadas

React 18 – Biblioteca para interface

Vite – Build tool ultra-rápida

Tailwind CSS – Estilização utilitária

TypeScript – Tipagem estática

Lucide React – Iconografia moderna

📋 Pré-requisitos

Antes de começar, certifique-se de ter instalado:

Node.js (Versão 18 ou superior)

Gerenciador de pacotes (npm, yarn ou pnpm)

⚙️ Instalação e Configuração

Clone o repositório:

git clone https://github.com/JoesZamoth/Game.git
cd Game


Instale as dependências:

npm install


Inicie o ambiente de desenvolvimento:

npm run dev


Acesse o jogo no navegador no link fornecido pelo Vite (geralmente http://localhost:5173).

📁 Estrutura do Projeto
├── public/              # Assets estáticos (imagens, SFX, BGM)
├── src/
│   ├── components/      # Componentes UI (Menus, Modais, HUD)
│   ├── data/            # Arquivos .md com NPCs e eventos
│   ├── hooks/           # Lógica de estado e mecânicas de jogo
│   ├── styles/          # Configurações globais de Tailwind e CSS
│   ├── types/           # Definições de interfaces TypeScript
│   ├── App.tsx          # Orquestrador principal
│   └── main.tsx         # Ponto de entrada
├── vite.config.ts       # Configurações do Vite
└── tsconfig.json        # Configurações do TypeScript

🎮 Mecânicas e Personalização
Adicionar Novos Conteúdos

O jogo é data-driven. Para adicionar NPCs ou eventos:

Navegue até src/data/

Siga o padrão dos arquivos existentes (ThriveOS_NPCs_Completos.md)

O motor do jogo processará automaticamente os dados para o contexto do RPG

🧪 Testes

Para verificar o projeto antes de deploy:

# Verificar erros de tipagem
npm run type-check

# Build de produção
npm run build

🤝 Contribuindo

Faça um fork do projeto

Crie uma branch para sua feature:

git checkout -b feature/nova-feature


Faça commit das alterações:

git commit -m 'Add: Nova funcionalidade'


Faça push para a branch:

git push origin feature/nova-feature


Abra um Pull Request

📝 Licença

Este projeto está sob a licença MIT. Veja o arquivo LICENSE para mais detalhes.

Desenvolvido com ❤️ por JoesZamoth
