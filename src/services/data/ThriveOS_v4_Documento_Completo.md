# ThriveOS v4.0 – Terra sem Olhos
## Documento de Design Completo do Jogo de Investigação Diegética

---

## SUMÁRIO

1. [Visão Geral do Projeto](#1-visão-geral-do-projeto)
2. [Conceito Narrativo](#2-conceito-narrativo)
3. [Princípios Fundamentais](#3-princípios-fundamentais)
4. [Arquitetura do Sistema Operacional](#4-arquitetura-do-sistema-operacional)
5. [Aplicativos Centrais](#5-aplicativos-centrais)
6. [Sistema de Bateria e Ritmo Narrativo](#6-sistema-de-bateria-e-ritmo-narrativo)
7. [Mecânicas de Investigação](#7-mecânicas-de-investigação)
8. [Sistema de Dedução](#8-sistema-de-dedução)
9. [Estrutura Narrativa](#9-estrutura-narrativa)
10. [Design de Interface](#10-design-de-interface)
11. [Integração com IA](#11-integração-com-ia)
12. [Minigames e Puzzles](#12-minigames-e-puzzles)
13. [Progressão e Checkpoints](#13-progressão-e-checkpoints)
14. [Sistema de Salvamento](#14-sistema-de-salvamento)
15. [Exemplo de Fluxo Investigativo](#15-exemplo-de-fluxo-investigativo)
16. [Especificações Técnicas](#16-especificações-técnicas)

---

## 1. VISÃO GERAL DO PROJETO

### 1.1 Conceito Central

**Terra sem Olhos** é um jogo narrativo de investigação psicológica que ocorre **inteiramente dentro de uma simulação de smartphone corporativo**. Não existe personagem visível, mundo 2D ou 3D tradicional.

- **O smartphone É o jogo**
- **O jogador É o detetive**
- **O sistema operacional É a interface narrativa**

### 1.2 Objetivos de Design

- Proporcionar experiência de investigação profunda e imersiva
- Criar narrativa não-linear baseada em memórias fragmentadas
- Eliminar clichês do gênero policial
- Oferecer múltiplas interpretações sem verdade absoluta
- Simular autenticamente o processo investigativo

### 1.3 Público-Alvo

Jogadores que apreciam:
- Mistério e investigação psicológica
- Narrativas não-lineares e ambíguas
- Puzzles lógicos e dedução
- Experiências imersivas e experimentais
- Jogos como *Duskwood*, *Simulacra*, *Her Story*, *Telling Lies*

### 1.4 Plataformas

- **PC** (Windows, macOS, Linux)
- **Mobile** (iOS, Android)
- Interface 100% adaptada para simular smartphone

---

## 2. CONCEITO NARRATIVO

### 2.1 Premissa

O detetive **Eduardo** é chamado para investigar o desaparecimento misterioso de **Clara**, uma mulher reservada em uma pequena cidade marcada por segredos antigos. Os vestígios da investigação se apresentam em **fragmentos de memória** dos moradores e registros pessoais esquecidos – diários, fotografias, gravações.

### 2.2 Estrutura Narrativa

#### Narrativa Não-Linear
- História se desenrola por flashbacks e cenas fora de ordem cronológica
- Cada fragmento de memória revela parte do enigma sem conclusão definitiva
- Inspiração em *What Remains of Edith Finch*

#### Fragmentação e Ambiguidade
- Memórias não são claras nem completas
- Algumas se contradizem, levantando dúvidas sobre veracidade
- O leitor/jogador monta o quebra-cabeça com peças aparentemente de histórias diferentes

#### Interatividade Emocional
- Ênfase em escolhas e dilemas morais (inspiração em *Heavy Rain*)
- Eduardo dividido entre seguir pistas e confrontar seu próprio passado obscuro

### 2.3 Personagens Principais

#### Eduardo (O Detetive / O Jogador)
- Atormentado por lembranças confusas do próprio passado
- Durante investigação, confronta segredos familiares
- Questões existenciais sobre culpa e redenção

#### Clara (A Desaparecida)
- Figura enigmática conhecida apenas por fragmentos
- Cartas e diários revelam vida repleta de contradições
- Personalidade complexa espelha medos e segredos da cidade

#### Testemunhas e Moradores
- Cada NPC traz memória singular
- Pistas entrelaçadas com narrativas pessoais
- Depoimentos carregados de simbolismo e emoção
- Nunca formam narrativa completa

### 2.4 Elementos Inovadores

- **Memórias como Prova**: recordações, registros pessoais e sonhos formam rede de pistas
- **Ambiente e Atmosfera**: cenário chuvoso, cinzento e opressivo (inspiração *Heavy Rain*)
- **Dilemas Morais e Identitários**: dúvida sobre própria inocência
- **Final Aberto**: múltiplas perguntas sem resposta definitiva

---

## 3. PRINCÍPIOS FUNDAMENTAIS

### 3.1 Princípios de Design

1. **Interface 100% Diegética**
   - Tudo acontece dentro do smartphone simulado
   - Sem quebra de imersão
   - Estilo *Duskwood* / *Simulacra*

2. **Nenhuma Pista Existe Sem Ação do Jogador**
   - Evidências só aparecem após interação consciente
   - Não há coleta automática
   - Investigação ativa, não passiva

3. **Nenhuma Dedução Aponta para Verdade Única**
   - Todas as pistas geram múltiplas interpretações
   - Vários suspeitos interligados
   - Jogador constrói sua própria verdade

4. **Progressão Bloqueada por Checkpoints Investigativos**
   - Critérios claros para avançar
   - Impede avanço prematuro
   - Garante engajamento com pistas

5. **Ritmo Narrativo Controlado**
   - Sistema de bateria regula tempo
   - Momentos forçados de reflexão
   - Atmosfera psicológica mantida

6. **Estética Corporativa Sóbria**
   - Paleta preto + dourado
   - Visual profissional e minimalista
   - Coerência com identidade de OS investigativo

---

## 4. ARQUITETURA DO SISTEMA OPERACIONAL

### 4.1 Simulação Completa de Smartphone

O **ThriveOS v4.0** simula autenticamente um smartphone corporativo:

#### Elementos de Sistema
- ✅ Tela de ligar/desligar
- ✅ Tela de bloqueio com PIN/senha
- ✅ Barra de status fixa (hora, bateria, sinal)
- ✅ Notificações push
- ✅ Tela inicial com ícones de apps
- ✅ Comportamento realista de aplicativos

#### Personalização Limitada
- Papel de parede permitido (dentro da identidade visual)
- Apps críticos bloqueados por segurança corporativa
- Cores e temas dentro de paleta aprovada
- Ícones padronizados

### 4.2 Comportamento Dinâmico do Sistema

#### Estado do Mundo
- Arquivos surgem ou desaparecem dinamicamente
- Conversas cessam abruptamente
- Dados podem ser corrompidos
- Contatos bloqueados ou liberados conforme progressão

#### Bloqueios Contextuais
- Acesso antecipado a contatos impedido
- Arquivos trancados até requisitos cumpridos
- Funcionalidades desbloqueadas por capítulos

---

## 5. APLICATIVOS CENTRAIS

### 5.1 MENSAGENS (Chat Corporativo)

#### Funcionalidades
- Comunicação com NPCs em tempo simulado
- Delays realistas entre mensagens
- Indicador "digitando..."
- Mensagens podem ser apagadas por NPCs
- Suporte a mensagens de áudio
- Sistema de escolhas controladas

#### Mecânicas
```
FLUXO DE CONVERSA:
1. Jogador seleciona contato
2. Histórico de mensagens carrega
3. Se NPC disponível → opções de resposta aparecem
4. Jogador escolhe resposta
5. NPC reage após delay simulado
6. Novas informações podem desbloquear pistas
```

#### Comportamento dos NPCs
- Cada NPC tem personalidade e ritmo próprios
- Alguns respondem rápido, outros demoram
- Mensagens podem vir fora de horário comercial
- NPCs podem iniciar conversas espontaneamente
- Podem enviar fotos, áudios, documentos

#### Estados de Conversa
- 🟢 Ativo/disponível
- 🟡 Ausente/demora para responder
- 🔴 Bloqueado/não responde mais
- ⚫ Conversa encerrada (narrativamente)

---

### 5.2 GRAVADOR INTELIGENTE

#### Funcionalidades
- Gravação de interrogatórios
- Gravação de reflexões do detetive
- Transcrição automática por IA
- Sistema de legendas
- Marcação de trechos importantes
- Exportação para Galeria/Arquivos

#### Mecânicas
```
FLUXO DE GRAVAÇÃO:
1. Jogador inicia gravação
2. Áudio capturado (simulado ou real)
3. IA transcreve em tempo real
4. Jogador pode pausar e marcar trechos
5. Trechos marcados geram:
   - Reflexões internas
   - Insumos para Sistema de Dedução
   - Notas automáticas no Bloco
```

#### Análise de Gravações
- Palavras-chave automaticamente destacadas
- Contradições entre depoimentos sinalizadas
- Possibilidade de comparar múltiplas gravações
- Exportar trechos específicos

#### Interface
```
┌─────────────────────────────┐
│ 🎙️ GRAVADOR INTELIGENTE     │
├─────────────────────────────┤
│                             │
│  [●] REC  00:03:47         │
│                             │
│  ━━━━━━●━━━━━━━━━━━        │
│                             │
│  📝 Transcrição:            │
│  "...e então ela disse que  │
│  nunca tinha visto aquele   │
│  homem antes..."            │
│                             │
│  [⭐ Marcar] [⏸️ Pausar]     │
└─────────────────────────────┘
```

---

### 5.3 LENS (Câmera Analítica)

#### Funcionalidades
- Captura de imagens de pistas físicas
- Análise por IA
- Sugestão de tags
- Levantamento de hipóteses não-conclusivas
- Integração com Sistema de Dedução

#### Mecânicas
```
FLUXO DE ANÁLISE:
1. Jogador fotografa cena/objeto
2. LENS processa imagem
3. IA identifica elementos visuais
4. Gera laudo inconclusivo com possibilidades
5. Jogador pode adicionar tags manuais
6. Foto arquivada na Galeria
```

#### Tipos de Análise
- 🔍 Objetos e itens
- 🧪 Possíveis substâncias
- 📐 Medidas e proporções
- 🎨 Cores e padrões
- 📝 Textos e escritas
- 👤 Pessoas (quando aplicável)

#### Exemplo de Laudo
```
┌─────────────────────────────┐
│ 📷 LENS - Análise #047      │
├─────────────────────────────┤
│                             │
│ [IMAGEM: Xícara quebrada]   │
│                             │
│ ELEMENTOS DETECTADOS:       │
│ • Cerâmica fragmentada      │
│ • Possível resíduo líquido  │
│ • Marca de batom (bordô)    │
│                             │
│ HIPÓTESES:                  │
│ ⚠️ Objeto quebrado com força │
│ ⚠️ Líquido ainda fresco (?)  │
│ ⚠️ Uso recente confirmado    │
│                             │
│ Tags: #xícara #cena_cozinha │
│       #possível_luta        │
└─────────────────────────────┘
```

---

### 5.4 DECRYPT (Forense)

#### Funcionalidades
- Descriptografar celulares de vítimas/suspeitos
- Abrir backups protegidos
- Desbloquear pastas com senha
- Recuperar arquivos deletados
- Análise de metadados

#### Mecânicas
```
FLUXO DE DESCRIPTOGRAFIA:
1. Jogador seleciona arquivo/dispositivo
2. Sistema identifica tipo de proteção
3. Minigame/puzzle de quebra de senha
4. Sucesso → arquivo liberado
5. Arquivos podem vir:
   - Incompletos
   - Corrompidos
   - Fragmentados
6. Conteúdo adicionado a Galeria/Arquivos
```

#### Interface Estilo Terminal
```
┌─────────────────────────────┐
│ 🔓 DECRYPT v4.0             │
├─────────────────────────────┤
│                             │
│ > Analisando: backup_clara_ │
│   2024_11_03.enc            │
│                             │
│ > Tipo: AES-256             │
│ > Status: PROTEGIDO         │
│                             │
│ > Iniciar quebra? [S/N]     │
│                             │
│ [████████░░] 82%            │
│                             │
│ > 3 arquivos recuperados    │
│ > 1 arquivo corrompido      │
│                             │
└─────────────────────────────┘
```

#### Tipos de Conteúdo Descriptografado
- 📱 Mensagens antigas
- 📷 Fotos deletadas
- 📄 Documentos ocultos
- 🎵 Gravações de áudio
- 📅 Calendários e agendas
- 🌐 Histórico de navegação

---

### 5.5 BLOCO DE NOTAS / DIÁRIO

#### Funcionalidades
- Diário investigativo manual
- Registros livres do jogador
- Classificação por tipo/capítulo
- Anexar evidências (fotos, áudios, trechos)
- Timeline visual
- Sistema de tags

#### Mecânicas
```
FLUXO DE ANOTAÇÃO:
1. Jogador abre Bloco de Notas
2. Cria nova entrada ou edita existente
3. Pode anexar evidências
4. Adiciona tags e categorias
5. Sistema sugere conexões com outras notas
6. Usado como base para Sistema de Dedução
```

#### Categorias de Notas
- 🔴 Suspeitos
- 🟡 Testemunhas
- 🔵 Locais
- 🟢 Objetos/Evidências
- 🟣 Teorias
- ⚪ Reflexões Pessoais

#### Interface
```
┌─────────────────────────────┐
│ 📓 DIÁRIO INVESTIGATIVO     │
├─────────────────────────────┤
│                             │
│ [+ Nova Nota]               │
│                             │
│ 📌 Clara - Última vez vista │
│    23/04 - Cap. 2           │
│    #suspeita #testemunha    │
│                             │
│ 📌 Xícara quebrada na cozinha│
│    23/04 - Cap. 2           │
│    #evidência #cena         │
│                             │
│ 📌 Eduardo reflete sobre... │
│    24/04 - Cap. 3           │
│    #reflexão #passado       │
│                             │
└─────────────────────────────┘
```

---

### 5.6 GALERIA / ARQUIVOS

#### Funcionalidades
- Centraliza todas evidências coletadas
- Fotos do LENS
- Áudios do Gravador
- Documentos descriptografados
- Capturas de conversas
- Metadados sempre visíveis

#### Organização
```
ESTRUTURA DE ARQUIVOS:
📁 Galeria
  ├─ 📷 Fotos
  │   ├─ Cap. 1
  │   ├─ Cap. 2
  │   └─ Cap. 3
  ├─ 🎙️ Gravações
  ├─ 📄 Documentos
  ├─ 💬 Conversas
  └─ 🔍 Análises LENS
```

#### Filtros Disponíveis
- Por tipo (foto, áudio, documento)
- Por capítulo/ato
- Por tag
- Por data
- Por relevância (IA sugere)

#### Metadados Exibidos
- Data/hora de captura
- Localização (se aplicável)
- Tags associadas
- Notas relacionadas
- Status de análise

---

### 5.7 SISTEMA DE DEDUÇÃO

#### Funcionalidades
- Conectar 2-3 pistas
- Gerar reflexões do detetive
- Levantar hipóteses
- Nunca gera certezas absolutas
- Conta para checkpoints de progressão

#### Mecânicas
```
FLUXO DE DEDUÇÃO:
1. Jogador seleciona pistas (2-3)
2. Sistema analisa combinação
3. Se combinação válida → reflexão gerada
4. Exemplo:
   - Xícara quebrada (foto)
   - Faca na pia (foto)
   - Depoimento sobre discussão (áudio)
   → "Será que a arma foi lavada após o confronto?"
5. Hipótese adicionada ao Diário
6. Pode desbloquear novos caminhos
```

#### Tipos de Dedução
- ✅ **Confirmada**: múltiplas evidências convergem
- ⚠️ **Provável**: evidências sugerem, mas não confirmam
- ❓ **Especulativa**: baseada em suposição
- ❌ **Refutada**: contradita por nova evidência