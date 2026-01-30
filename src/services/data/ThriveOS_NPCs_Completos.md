# ThriveOS v4.0 - Fichas Completas de NPCs
## Personagens Profundos com 5 Camadas de Densidade

---

## SUMÃRIO

1. [Sistema de ConstruÃ§Ã£o de NPCs](#1-sistema-de-construÃ§Ã£o-de-npcs)
2. [Ana Costa - Ficha Completa](#2-ana-costa-ficha-completa)
3. [Marcos Silva - Ficha Completa](#3-marcos-silva-ficha-completa)
4. [Pedro Costa - Ficha Completa](#4-pedro-costa-ficha-completa)
5. [Clara Mendes - Ficha Completa](#5-clara-mendes-ficha-completa)
6. [Julia Ferreira - Ficha Completa](#6-julia-ferreira-ficha-completa)
7. [Dona Marta - Ficha Completa](#7-dona-marta-ficha-completa)
8. [Eduardo Alves - Ficha Completa](#8-eduardo-alves-ficha-completa)
9. [Rede de RelaÃ§Ãµes](#9-rede-de-relaÃ§Ãµes)
10. [Ãrvore de DiÃ¡logos](#10-Ã¡rvore-de-diÃ¡logos)

---

## 1. SISTEMA DE CONSTRUÃ‡ÃƒO DE NPCs

### 1.1 Template Unificado

```javascript
class NPC {
  // â”â”â” IDENTIDADE BÃSICA â”â”â”
  id: string
  nome_completo: string
  apelido: string
  idade: number
  ocupacao: string
  onde_mora: string

  // â”â”â” APARÃŠNCIA (para fotos/descriÃ§Ãµes) â”â”â”
  descricao_fisica: string
  foto_perfil: string

  // â”â”â” STATS EMOCIONAIS (0-100, invisÃ­veis) â”â”â”
  confianca_eduardo: number        // Quanto confia no detetive
  medo: number                     // Medo geral (consequÃªncias, descoberta)
  culpa: number                    // Peso da consciÃªncia
  estresse: number                 // PressÃ£o da investigaÃ§Ã£o
  defensividade: number            // QuÃ£o defensivo estÃ¡
  cooperacao: number               // Vontade de ajudar
  suspeita_de_eduardo: number      // Desconfia das intenÃ§Ãµes dele

  // â”â”â” ESTADOS NARRATIVOS â”â”â”
  segredos: [
    {
      id: string,
      descricao: string,
      revelado: boolean,
      requisito_para_revelar: string,
      camada: 1-5  // Qual camada narrativa
    }
  ]

  mentiras_contadas: [
    {
      sobre: string,
      mentira: string,
      verdade: string,
      descoberta: boolean
    }
  ]

  alibi: {
    declarado: string,
    real: string,
    verificavel: boolean,
    confirmado: boolean
  }

  bloqueado: boolean               // NÃ£o responde mais
  disponivel: boolean              // Online/acessÃ­vel
  horario_disponivel: [inicio, fim]  // Ex: [9, 22] (9h Ã s 22h)

  // â”â”â” RELAÃ‡Ã•ES COM OUTROS NPCs â”â”â”
  relacoes: {
    [npc_id]: {
      tipo: "amigo" | "inimigo" | "amante" | "rival" | "famÃ­lia" | "neutro",
      intensidade: number,  // 0-100
      segredo_compartilhado: boolean,
      historia: string
    }
  }

  // â”â”â” CONEXÃƒO COM CLARA â”â”â”
  relacao_com_clara: {
    tipo: string,
    intensidade: number,
    ultima_vez_viu: timestamp,
    ultimo_contato: timestamp,
    sentimento: string  // amor, Ã³dio, medo, inveja, etc
  }

  // â”â”â” MOTIVAÃ‡ÃƒO E OBJETIVOS â”â”â”
  motivacao_principal: string
  objetivo_na_investigacao: string  // O que quer alcanÃ§ar
  maior_medo: string
  maior_desejo: string

  // â”â”â” PASSADO â”â”â”
  conexao_acidente_fabrica: string
  trauma_pessoal: string
  segredo_familia: string

  // â”â”â” GAMEPLAY â”â”â”
  primeira_interacao: timestamp
  ultima_interacao: timestamp
  total_mensagens: number
  total_interrogatorios: number
  nivel_revelacao: number  // 0-5 (camadas reveladas)
  pistas_fornecidas: string[]

  // â”â”â” ARCOS NARRATIVOS â”â”â”
  arco_capitulos: {
    cap1: string,  // Estado do NPC neste capÃ­tulo
    cap2: string,
    // ... atÃ© cap10
  }

  final_possivel: {
    alta_confianca: string,
    baixa_confianca: string,
    se_acusado: string,
    se_inocentado: string
  }
}
```

### 1.2 Regras de CoerÃªncia

```
PARA CADA NPC:

âœ“ MotivaÃ§Ã£o deve ser clara e consistente
âœ“ Segredos revelados em ordem de camada
âœ“ Mentiras tÃªm razÃ£o de existir
âœ“ RelaÃ§Ãµes com outros NPCs sÃ£o bidirecionais
âœ“ Stats afetam TODAS as interaÃ§Ãµes
âœ“ Arco narrativo tem inÃ­cio, meio e fim
âœ“ Final coerente com escolhas do jogador
```

---

## 2. ANA COSTA - FICHA COMPLETA

### 2.1 Identidade BÃ¡sica

```
NOME COMPLETO: Ana Paula Costa
APELIDO: Ana
IDADE: 32 anos
OCUPAÃ‡ÃƒO: Professora de MatemÃ¡tica (ensino mÃ©dio)
           + Freelancer em TI (desenvolvimento web)
ONDE MORA: Apartamento 204, EdifÃ­cio Primavera
           (ao lado da casa de Clara)

APARÃŠNCIA:
- Cabelos castanhos, curtos
- Ã“culos de grau
- Estilo casual (jeans, camisetas bÃ¡sicas)
- Sempre com notebook na bolsa

PERSONALIDADE:
- Introvertida, mas assertiva quando necessÃ¡rio
- Racional, lÃ³gica
- Guarda segredos bem
- Protetora com quem ama
- TendÃªncia a manipular situaÃ§Ãµes "pelo bem maior"
```

### 2.2 Stats Iniciais

```javascript
ana = {
  confianca_eduardo: 50,      // Neutra, mas cooperativa
  medo: 45,                   // Medo moderado (segredos)
  culpa: 65,                  // Culpa alta (manipulaÃ§Ã£o)
  estresse: 70,               // Muito estressada (Clara + Pedro)
  defensividade: 30,          // Baixa inicialmente
  cooperacao: 75,             // Alta (contratou Eduardo!)
  suspeita_de_eduardo: 20     // Baixa (confia nele... por ora)
}
```

### 2.3 Camadas de Profundidade

#### CAMADA 1: SUPERFÃCIE (100% dos jogadores)

```
INFORMAÃ‡ÃƒO PÃšBLICA:

"Ana Costa, 32, professora.
 Melhor amiga de Clara.
 Ãšltima pessoa a vÃª-la antes do desaparecimento."

DEPOIMENTO INICIAL:
"Clara Ã© minha melhor amiga hÃ¡ 10 anos.
 No dia 23, ela passou aqui de manhÃ£.
 Parecia normal... talvez um pouco distraÃ­da.
 Saiu por volta das 14h.
 Nunca mais a vi."

ÃLIBI:
"Estava dando aula online das 15h Ã s 17h.
 Tenho registro de presenÃ§a dos alunos."

APARENTE MOTIVAÃ‡ÃƒO:
Encontrar a amiga
```

#### CAMADA 2: INVESTIGÃVEL (60% dos jogadores)

```
SEGREDO #1: Caso com Pedro
Revelado: ApÃ³s encontrar foto/mensagem
"Eu e Pedro... temos um relacionamento.
 Clara descobriu semana passada.
 Ficou furiosa. Disse que eu traÃ­ minha prÃ³pria famÃ­lia."

MENTIRA #1: HorÃ¡rio que viu Clara
Primeira versÃ£o: "14h"
Segunda versÃ£o: "14h30... acho"
Verdade: "NÃ£o sei ao certo. Estava nervosa."

CONEXÃƒO COM CLARA:
- Amigas desde 2014
- Clara foi quem apresentou Pedro a Ana
- Clara se sentiu traÃ­da pelo caso

MOTIVAÃ‡ÃƒO REAL (parcial):
Medo que segredo do caso vaze
Culpa por ter magoado Clara
```

#### CAMADA 3: ESCONDIDO (30% dos jogadores)

```
SEGREDO #2: ConexÃ£o com Acidente da FÃ¡brica
"Minha mÃ£e morreu no acidente de 2009.
 Ela trabalhava na fÃ¡brica de Marcos.
 Nunca houve investigaÃ§Ã£o sÃ©ria.
 FamÃ­lia de Marcos abafou tudo."

SEGREDO #3: Clara ia expor escÃ¢ndalo
"Clara descobriu documentos que provam
 negligÃªncia da famÃ­lia Silva no acidente.
 Ia publicar. Marcos a ameaÃ§ou."

MOTIVAÃ‡ÃƒO PROFUNDA:
- JustiÃ§a pela mÃ£e
- ProteÃ§Ã£o a Clara
- VinganÃ§a contra famÃ­lia Silva

HABILIDADE OCULTA:
Ana tem conhecimento avanÃ§ado de TI
Sabe hackear, manipular sistemas
Tem acesso a ferramentas forenses
```

#### CAMADA 4: OCULTO (10% dos jogadores)

```
SEGREDO #4: Ana contratou Eduardo
"Fui eu quem pediu para te designarem esse caso.
 Preciso de alguÃ©m competente.
 AlguÃ©m que nÃ£o esteja sob influÃªncia dos Silva."

SEGREDO #5: ManipulaÃ§Ã£o do ThriveOS
"Tenho acesso root ao sistema.
 Plantei algumas pistas... direcionei vocÃª.
 NÃ£o inventei nada! SÃ³... guiei."

SEGREDO #6: Gravidez
"Estou grÃ¡vida de Pedro.
 NinguÃ©m sabe. Nem ele.
 Clara descobriu. Foi nossa Ãºltima discussÃ£o.
 Ela disse que eu estava destruindo a famÃ­lia."

VERDADEIRA MOTIVAÃ‡ÃƒO:
- Proteger futuro filho
- Eliminar ameaÃ§a da famÃ­lia Silva
- Usar investigaÃ§Ã£o para expor Marcos
- Se Clara estava no caminho... (ambÃ­guo)
```

#### CAMADA 5: META (5% dos jogadores)

```
SEGREDO #7: Papel na Meta-Narrativa
Ana representa o "observador que intervÃ©m"

QuestÃµes filosÃ³ficas:
- Ela estÃ¡ ajudando ou manipulando?
- Fins justificam meios?
- Conhecimento da verdade dÃ¡ direito de moldar investigaÃ§Ã£o?

TWIST META:
Em New Game+, Ana "lembra" da run anterior
"Eduardo... vocÃª parece diferente dessa vez.
 Como se soubesse coisas que nÃ£o deveria."

FINAL AMBÃGUO:
Ana pode ser:
a) HeroÃ­na que buscava justiÃ§a
b) Manipuladora que usou Eduardo
c) VÃ­tima de circunstÃ¢ncias
d) Todas as anteriores
```

### 2.4 RelaÃ§Ãµes com Outros NPCs

```javascript
ana.relacoes = {
  clara: {
    tipo: "amiga",  // era
    intensidade: 90,
    segredo_compartilhado: true,
    historia: "Melhores amigas hÃ¡ 10 anos. Clara a apoiou apÃ³s
               morte da mÃ£e. Ana ajudou Clara a superar fim de
               relacionamento com Marcos. VÃ­nculo profundo, mas
               recentemente abalado por caso com Pedro."
  },

  pedro: {
    tipo: "amante",
    intensidade: 75,
    segredo_compartilhado: true,
    historia: "Cunhado de Ana (irmÃ£o do ex-marido dela).
               Caso comeÃ§ou hÃ¡ 6 meses. PaixÃ£o intensa.
               Pedro nÃ£o sabe da gravidez ainda."
  },

  marcos: {
    tipo: "inimigo",
    intensidade: 85,
    segredo_compartilhado: false,
    historia: "Ana culpa famÃ­lia Silva pela morte da mÃ£e.
               Marcos nÃ£o sabe da raiva dela (ainda).
               Ana quer vÃª-lo pagar pelo acidente."
  },

  julia: {
    tipo: "amiga",  // superficial
    intensidade: 40,
    segredo_compartilhado: false,
    historia: "Conhecidas do trabalho. Julia nÃ£o confia muito
               em Ana (intuiÃ§Ã£o). Ana usa Julia para informaÃ§Ãµes."
  },

  dona_marta: {
    tipo: "famÃ­lia",  // vizinha prÃ³xima
    intensidade: 60,
    segredo_compartilhado: true,
    historia: "Marta era amiga da mÃ£e de Ana. Sabe da dor dela.
               Ã‰ confidente. Marta apoia vinganÃ§a de Ana sutilmente."
  }
}
```

### 2.5 Arco Narrativo por CapÃ­tulo

```
CAP 1: PREOCUPAÃ‡ÃƒO
- Ana reporta desaparecimento de Clara
- Cooperativa, mas nervosa
- Esconde caso com Pedro

CAP 2: REVELAÃ‡ÃƒO PARCIAL
- Caso com Pedro descoberto
- Ana fica defensiva
- ConfianÃ§a pode aumentar OU diminuir

CAP 3: CONFLITO INTERNO
- Ana revela conexÃ£o com acidente
- Pede ajuda de Eduardo
- Oferece informaÃ§Ãµes em troca de confianÃ§a

CAP 4: MANIPULAÃ‡ÃƒO
- Pistas plantadas comeÃ§am a aparecer
- Ana nega envolvimento (mente)
- Estresse dela aumenta

CAP 5: CONFRONTO
- Eduardo pode confrontÃ¡-la sobre manipulaÃ§Ã£o
- Ana pode confessar OU dobrar a aposta
- RelaÃ§Ã£o define rumo da investigaÃ§Ã£o

CAP 6-7: ALIANÃ‡A OU RUPTURA
- Se confianÃ§a alta: Ana se torna aliada crucial
- Se confianÃ§a baixa: Ana bloqueia Eduardo

CAP 8: VERDADE REVELADA
- Ana confessa ser quem contratou Eduardo
- Revela gravidez (se confianÃ§a >70)
- MotivaÃ§Ãµes expostas

CAP 9: CONSEQUÃŠNCIAS
- Escolhas de Eduardo afetam futuro de Ana
- Ana enfrenta famÃ­lia Silva OU foge

CAP 10: FINAL DE ANA
- Alta confianÃ§a: Ana encontra paz, novo comeÃ§o
- Baixa confianÃ§a: Ana desaparece ou Ã© presa
- AmbÃ­guo: Ana conseguiu o que queria, mas a que custo?
```

### 2.6 Ãrvore de DiÃ¡logos - Exemplo

```
â”â”â” PRIMEIRO INTERROGATÃ“RIO (Cap 1) â”â”â”

EDUARDO: "Quando viu Clara pela Ãºltima vez?"

ANA: "No dia 23, de manhÃ£. Ela passou aqui."

  [A] "Que horas exatamente?"
      â†’ Ana: "Por volta das 14h."
      â†’ [Anotar horÃ¡rio]

  [B] "Como ela estava?"
      â†’ Ana: "Normal... talvez distraÃ­da."
      â†’ [A1] "DistraÃ­da como?"
          â†’ Ana: "NÃ£o sei explicar. Pensativa."
      â†’ [A2] "Isso Ã© normal para ela?"
          â†’ Ana: "Ã€s vezes. Clara pensa muito."

  [C] "VocÃªs conversaram sobre algo especÃ­fico?"
      â†’ Ana: "Nada importante. CafÃ©, o dia..."
      â†’ SE (jogador tem pista sobre discussÃ£o):
          [C1] "Tenho informaÃ§Ã£o de que vocÃªs discutiram."
              â†’ Ana: [Defensiva] "Quem disse isso?!"
              â†’ defensividade +20
              â†’ confianca -10

â”â”â” SEGUNDO INTERROGATÃ“RIO (Cap 2) â”â”â”

EDUARDO: "VocÃª mencionou 14h antes. Tem certeza?"

IF (confianca < 40):
  ANA: "Sim. Por quÃª?"
  â†’ NÃ£o muda histÃ³ria

ELSE IF (confianca >= 40 && < 70):
  ANA: "Acho que sim... talvez 14h30?"
  â†’ MemÃ³ria falha natural

ELSE IF (confianca >= 70):
  ANA: [Suspira] "NÃ£o tenho certeza, Eduardo.
        Estava nervosa naquele dia.
        Pode ter sido 14h, 14h30... nÃ£o lembro."
  â†’ Honestidade

â”â”â” CONFRONTO SOBRE CASO (Cap 3) â”â”â”

SE jogador descobriu caso com Pedro:

EDUARDO: [Mostrar evidÃªncia]

ANA: [SilÃªncio. Olha para baixo]

  [A] "Por que nÃ£o me contou?"
      â†’ Ana: "Porque nÃ£o Ã© relevante!"
      â†’ defensividade +15

  [B] "Clara sabia?"
      â†’ Ana: [Voz tremendo] "Ela... descobriu."
      â†’ RevelaÃ§Ã£o importante
      â†’ confianca +10

  [C] "Isso te dÃ¡ motivo."
      â†’ Ana: "MOTIVO?! VocÃª acha que EU...?!"
      â†’ Ana.bloqueado = true (temporÃ¡rio)
      â†’ confianca -30
```

### 2.7 Finais PossÃ­veis de Ana

```
FINAL A: REDENÃ‡ÃƒO (confianca > 80)
"Ana expÃµe escÃ¢ndalo da famÃ­lia Silva.
 Marcos Ã© preso por negligÃªncia no acidente de 2009.
 Ana ganha guarda do filho.
 Clara... bem, a verdade sobre Clara veio Ã  tona.
 Ana nÃ£o Ã© mais a mesma, mas encontrou paz."

FINAL B: FUGA (confianca 40-60)
"Ana desaparece antes do final da investigaÃ§Ã£o.
 Deixa carta para Eduardo:
 'Obrigada por tentar. Mas algumas verdades
  nÃ£o devem ser reveladas. Cuide-se.'
 Nunca mais foi vista."

FINAL C: PRISÃƒO (confianca < 30)
"EvidÃªncias sugerem envolvimento de Ana no
 desaparecimento de Clara. Eduardo a entrega.