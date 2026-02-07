# 🎮 ThriveOS: Terra sem Olhos

![Status do Projeto](https://img.shields.io/badge/Status-Em_Desenvolvimento-yellow)
![Licença](https://img.shields.io/badge/License-MIT-blue)

> **"A verdade é apenas um arquivo corrompido esperando para ser restaurado."**

Uma experiência de **Simulação / RPG interativo** desenvolvida sobre o ecossistema fictício *ThriveOS*. Ambientado na cidade distópica de *Nova Esperança* (2024), o jogo combina exploração de cenários, estética Cyberpunk Noir e uma narrativa procedural alimentada por Inteligência Artificial.

## 📸 Preview

<div align="center">
  <img src="https://via.placeholder.com/800x450?text=Preview+do+ThriveOS" alt="Preview do Jogo" />
</div>

## 🚀 Funcionalidades Principais

* **🕵️‍♂️ Investigação Imersiva:** Interface que simula um sistema operacional futurista (ThriveOS v4.0), com apps de mensagens, arquivos e lentes de realidade aumentada.
* **🤖 Narrativa via IA (Gemini):** O `aiService` integra o Google Gemini para gerar respostas dinâmicas dos NPCs e deduções lógicas baseadas nas evidências coletadas.
* **🗺️ Exploração LENS:** Navegação por cenários (como o Escritório da Clara ou a Fábrica) usando um navegador de ângulos de câmera.
* **🧠 Sistema de Dedução:** Mecânica para conectar pistas (evidências) e gerar hipóteses sobre o mistério central.
* **⚡ Design Reativo:** Interface estilizada com **Tailwind CSS**, apresentando animações de *scanlines*, efeitos de *glitch* e paleta de cores "Gold/Carbon".

## 🛠️ Tecnologias Utilizadas

* **Core:** [React 18](https://react.dev/)
* **Build Tool:** [Vite](https://vitejs.dev/)
* **Estilização:** [Tailwind CSS](https://tailwindcss.com/)
* **IA Generativa:** [Google Gemini API](https://ai.google.dev/)
* **Ícones:** [Lucide React](https://lucide.dev/)
* **Gerenciamento de Estado:** Zustand / Context API (via `store.js`)

## 📋 Pré-requisitos

Antes de começar, certifique-se de ter instalado:
* [Node.js](https://nodejs.org/) (Versão 18 ou superior)
* Gerenciador de pacotes (npm, yarn ou pnpm)
* Uma chave de API do **Google Gemini** (necessária para os recursos de IA).

## ⚙️ Instalação e Configuração

1.  **Clone o repositório:**
    ```bash
    git clone [https://github.com/JoesZamoth/Game.git](https://github.com/JoesZamoth/Game.git)
    cd Game
    ```

2.  **Instale as dependências:**
    ```bash
    npm install
    npm install openai python-dotenv
    ```

3.  **Configuração de Variáveis de Ambiente:**
    * Duplique o arquivo `.env example` e renomeie-o para `.env`.
    * Adicione sua chave da API do Gemini:
    ```env
    VITE_GEMINI_API_KEY=sua_chave_aqui
    ```

4.  **Inicie o ambiente de desenvolvimento:**
    ```bash
    npm run dev
    ```

5.  **Acesse o jogo:**
    Abra o navegador em `http://localhost:5173` (ou a porta indicada no terminal).

## 📁 Estrutura do Projeto

```bash
src/
├── components/      # Componentes de UI (LENS, Modais, etc.)
├── data/            # "Lore Bible" e arquivos Markdown com a história
├── services/        # Integração com APIs (aiService.js)
├── styles/          # Configurações globais de CSS
├── App.jsx          # Orquestrador principal da interface
├── main.jsx         # Ponto de entrada React
├── store.js         # Gerenciamento de estado global (Game Store)
└── terra_sem_olhos...jsx # Protótipos e lógicas de cenário

```

## 🎮 Como Jogar / Personalizar

O jogo é **Data-Driven**. A narrativa e os NPCs são definidos nos arquivos dentro de `src/data/`.

* **Adicionar NPCs:** Edite `src/data/ThriveOS_NPCs_Completos.md`.
* **Alterar a História:** Modifique a `LORE_BIBLE` em `src/data/loreBible.js`. O motor de IA lerá esses arquivos para manter a coerência das respostas.

## 🧪 Comandos Úteis

```bash
# Rodar linter e verificação de tipos
npm run lint

# Build para produção
npm run build

# Visualizar o build de produção localmente
npm run preview

```

## 🤝 Contribuindo

Contribuições são bem-vindas! Siga os passos:

1. Faça um **Fork** do projeto.
2. Crie uma Branch para sua feature (`git checkout -b feature/IncrivelFeature`).
3. Faça o Commit (`git commit -m 'Add: Incrível Feature'`).
4. Faça o Push (`git push origin feature/IncrivelFeature`).
5. Abra um **Pull Request**.

## 📝 Licença

Este projeto está sob a licença **MIT**. Veja o arquivo [LICENSE](https://www.google.com/search?q=LICENSE) para mais detalhes.

---

<div align="center">
Desenvolvido com ❤️ e ☕ por <a href="https://www.google.com/search?q=https://github.com/JoesZamoth">JoesZamoth</a>
</div>

```

```

