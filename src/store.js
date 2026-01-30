import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';

// --- MANTENHA AS SUAS CONSTANTES (INITIAL_BATTERY, EVIDENCE_DB, ETC) AQUI ---
// (Estou usando as mesmas que você enviou para não quebrar nada)
const INITIAL_BATTERY = 88;
const START_TIME_STRING = "21:55";

const INITIAL_CHAT_HISTORY = [
  { role: "system", content: "THRIVE OS v4.0 // CONEXÃO SEGURA ESTABELECIDA" },
  { 
    role: "assistant", 
    content: "Eduardo? Tá na escuta? É o 07. Finalmente essa porcaria de sinal estabilizou. Escuta, você tá no escritório da Clara agora. O lugar tá uma zona, mas não perde tempo. Usa o LENS pra navegar e ver o que a perícia deixou passar. Eu tô de olho nos logs aqui, qualquer coisa me dá um grito." 
  }
];

const EVIDENCE_DB = [
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

export const useGameStore = create(
  persist(
    (set, get) => ({
      // ==================== ESTADO DO SISTEMA ====================
      battery: INITIAL_BATTERY,
      screen: 'menu', // <--- MUDANÇA: Começa no Menu
      activeApp: null,
      isCharging: false,
      timeOffsetMs: 0,
      isConnected: true,
      isBooting: true,
      bootProgress: 0,
      stressLevel: 15,
      
      // ==================== ESTADO NARRATIVO ====================
      act: 1, 
      chapter: 1, 
      gameState: 'intro', 
      currentLocationId: 'office_clara',
      playerCharacter: 'analytical', 
      
      // ==================== EMOÇÕES ====================
      npcStates: {
        central: { trust: 50, fear: 10, guilt: 0, defensiveness: 10 },
        ana: { trust: 30, fear: 50, guilt: 30, defensiveness: 60 },
      },
      
      // ==================== DADOS DO CASO ====================
      messages: INITIAL_CHAT_HISTORY, 
      evidence: EVIDENCE_DB.map(e => ({ 
        ...e, 
        discovered: false,
        layers: [], 
        metadata: {} 
      })), 
      storyNarrative: [
        "[21:55] SISTEMA: Eduardo, você está no escritório de Clara Mendes.",
        "[21:56] OBJETIVO: Encontrar pistas sobre o paradeiro dela.",
        "[21:57] DICA: Use o LENS para escanear o ambiente."
      ],
      proceduralAssets: {},
      cameraAngles: {}, 
      currentCameraAngle: 'north',
      
      // ==================== DEDUÇÃO ====================
      selectedEvidenceIds: [],
      deductions: [], 
      
      // ==================== AÇÕES DO SISTEMA ====================
      setScreen: (screen) => set({ screen }),
      setActiveApp: (app) => set({ activeApp: app }),
      setConnection: (isConnected) => set({ isConnected }),
      setBooting: (isBooting) => set({ isBooting }),
      setBootProgress: (progress) => set({ bootProgress: progress }),
      
      performAction: (minutes, batteryCost, stressImpact = 0) => set((state) => {
        const newBattery = Math.max(0, state.battery - batteryCost);
        const newTimeOffset = state.timeOffsetMs + (minutes * 60 * 1000);
        const newStress = Math.min(100, Math.max(0, state.stressLevel + stressImpact));
        return { battery: newBattery, timeOffsetMs: newTimeOffset, stressLevel: newStress };
      }),

      updateBattery: (amount) => set((state) => ({
        battery: Math.min(100, Math.max(0, state.battery + amount))
      })),
      
      addMessage: (msg) => set((state) => ({ 
        messages: [...state.messages, msg] 
      })),
      
      discoverEvidence: (id) => set((state) => {
        const updatedEvidence = state.evidence.map(e => 
          e.id === id ? { ...e, discovered: true } : e
        );
        const evidence = state.evidence.find(e => e.id === id);
        const newNarrative = evidence 
          ? `[${get().getFormattedTime()}] EVIDÊNCIA: ${evidence.name} descoberta.`
          : null;
        
        return { 
          evidence: updatedEvidence,
          storyNarrative: newNarrative 
            ? [...state.storyNarrative, newNarrative]
            : state.storyNarrative
        };
      }),

      addEvidence: (ev) => set((state) => {
        const exists = state.evidence.some(e => e.id === ev.id || e.title === ev.title);
        if (exists) return state;
        return { 
          evidence: [...state.evidence, { ...ev, discovered: true }],
          storyNarrative: [...state.storyNarrative, `[${get().getFormattedTime()}] NOVA EVIDÊNCIA: ${ev.name}`]
        };
      }),

      addDeduction: (deduction) => set((state) => ({
        deductions: [deduction, ...state.deductions],
        selectedEvidenceIds: [],
        storyNarrative: [...state.storyNarrative, `[${get().getFormattedTime()}] DEDUÇÃO: ${deduction.hypothesis.substring(0, 50)}...`]
      })),

      toggleEvidenceSelection: (id) => set((state) => ({
        selectedEvidenceIds: state.selectedEvidenceIds.includes(id)
          ? state.selectedEvidenceIds.filter(sid => sid !== id)
          : [...state.selectedEvidenceIds, id]
      })),

      addNarrative: (text) => set((state) => ({
        storyNarrative: [...state.storyNarrative, `[${get().getFormattedTime()}] ${text}`]
      })),

      setCharging: (isCharging) => set({ isCharging }),

      updateLocation: (locId, asset) => set((state) => ({
        currentLocationId: locId,
        proceduralAssets: asset ? { ...state.proceduralAssets, [locId]: asset } : state.proceduralAssets,
        currentCameraAngle: 'north',
        storyNarrative: [...state.storyNarrative, `[${get().getFormattedTime()}] LOCALIZAÇÃO: Movido para ${locId}`]
      })),

      setCameraAngle: (angle) => set({ currentCameraAngle: angle }),

      loadChapterAssets: (locationId, assets) => set((state) => ({
        cameraAngles: { ...state.cameraAngles, [locationId]: assets }
      })),

      getFormattedTime: () => {
        const state = get();
        const baseTime = new Date(`2024-01-01 ${START_TIME_STRING}`);
        const currentTime = new Date(baseTime.getTime() + state.timeOffsetMs);
        return currentTime.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' });
      },

      // ==================== RESET / MENU ====================
      resetGame: () => {
        localStorage.removeItem('thrive-os-storage'); // Limpa o save
        set({
          battery: INITIAL_BATTERY,
          screen: 'boot', // <--- Vai para o Boot ao resetar
          isBooting: true,
          bootProgress: 0,
          activeApp: null,
          act: 1,
          chapter: 1,
          messages: INITIAL_CHAT_HISTORY,
          evidence: EVIDENCE_DB.map(e => ({ ...e, discovered: false })),
          deductions: [],
          selectedEvidenceIds: [],
          timeOffsetMs: 0,
          proceduralAssets: {},
          cameraAngles: {},
          stressLevel: 15,
          storyNarrative: [
            "[21:55] SISTEMA: Eduardo, você está no escritório de Clara Mendes.",
            "[21:56] OBJETIVO: Encontrar pistas sobre o paradeiro dela.",
            "[21:57] DICA: Use o LENS para escanear o ambiente."
          ]
        });
      },
      
      continueGame: () => {
         // Apenas muda a tela para onde o jogador parou (ou desktop se estiver indefinido)
         set({ screen: 'desktop' }); 
      }
    }),
    {
      name: 'thrive-os-storage',
      storage: createJSONStorage(() => localStorage),
      // IMPORTANTE: Não salvamos 'screen' para sempre cair no menu ao recarregar a página
      partialize: (state) => ({
        battery: state.battery,
        act: state.act,
        chapter: state.chapter,
        gameState: state.gameState,
        currentLocationId: state.currentLocationId,
        npcStates: state.npcStates,
        messages: state.messages,
        evidence: state.evidence,
        storyNarrative: state.storyNarrative,
        proceduralAssets: state.proceduralAssets,
        cameraAngles: state.cameraAngles,
        deductions: state.deductions,
        timeOffsetMs: state.timeOffsetMs,
        stressLevel: state.stressLevel
      }),
    }
  )
);