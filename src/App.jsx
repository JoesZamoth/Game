// src/App.jsx - VERSÃO UNIFICADA E APRIMORADA
import React, { useState, useEffect, useRef, useMemo } from 'react';
import { 
  Camera, MessageSquare, FileText, Battery, BatteryLow, BatteryFull,
  Wifi, ChevronLeft, Send, ShieldAlert, Cpu, Timer, Fingerprint, 
  ShieldCheck, BookOpen, Lock
} from 'lucide-react';
import { useGameStore } from './store';
import { MainMenu } from './MainMenu'; 
import { LensNavigator } from './LensNavigator';
import { generateResponse, processDeduction } from './aiService';

/* =========================================
   ESTILOS GLOBAIS E UTILITÁRIOS (CSS-in-JS)
   ========================================= */
const GlobalStyles = ({ stressLevel }) => (
  <style>{`
    @import url('https://fonts.googleapis.com/css2?family=JetBrains+Mono:wght@400;700&family=Inter:wght@400;900&display=swap');
    
    .app-container { font-family: 'Inter', sans-serif; }
    .terminal-font { font-family: 'JetBrains Mono', monospace; }
    
    /* Efeito de Scanline Dinâmico */
    .scanline-overlay {
      position: absolute; inset: 0; pointer-events: none; z-index: 50;
      background: repeating-linear-gradient(
        to bottom,
        rgba(0, 0, 0, 0),
        rgba(0, 0, 0, 0) 2px,
        rgba(212, 175, 55, 0.05) 2px,
        rgba(212, 175, 55, 0.05) 4px
      );
      mix-blend-mode: overlay;
      animation: flicker 0.2s infinite;
    }

    /* Vinheta de Stress (Visão de Túnel) */
    .stress-vignette {
      position: absolute; inset: 0; pointer-events: none; z-index: 40;
      background: radial-gradient(circle, transparent 60%, rgba(0,0,0, ${stressLevel / 100}));
      transition: background 1s ease;
    }

    /* Scrollbar Personalizada */
    .no-scrollbar::-webkit-scrollbar { display: none; }
    .custom-scroll::-webkit-scrollbar { width: 4px; }
    .custom-scroll::-webkit-scrollbar-track { background: #111; }
    .custom-scroll::-webkit-scrollbar-thumb { background: #333; border-radius: 2px; }
    .custom-scroll::-webkit-scrollbar-thumb:hover { background: #d4af37; }

    /* Animações */
    @keyframes flicker { 0% { opacity: 0.8; } 50% { opacity: 0.9; } 100% { opacity: 0.8; } }
    @keyframes boot-load { 0% { width: 0; } 100% { width: 100%; } }
  `}</style>
);

/* =========================================
   COMPONENTES DE UI
   ========================================= */
const StatusBar = ({ battery, time, stress }) => (
  <div className="h-10 bg-black border-b border-white/10 flex items-center justify-between px-5 text-[10px] font-bold tracking-widest text-zinc-500 z-50 select-none">
    <div className="flex items-center gap-4">
      <span className="text-[#d4af37] flex items-center gap-1.5">
        <Wifi size={12} /> {time}
      </span>
    </div>
    <div className="flex items-center gap-3">
       <span className={`${stress > 50 ? 'text-red-500 animate-pulse' : 'text-blue-500/60'}`}>
         STRESS {stress}%
       </span>
       <div className={`flex items-center gap-1 ${battery < 20 ? 'text-red-500' : 'text-zinc-400'}`}>
         {battery}% {battery > 20 ? <BatteryFull size={14} /> : <BatteryLow size={14} />}
       </div>
    </div>
  </div>
);

const AppIcon = ({ icon: Icon, label, onClick, alert, disabled }) => (
  <button 
    onClick={disabled ? null : onClick}
    disabled={disabled}
    className={`flex flex-col items-center gap-2 group transition-all duration-200 ${disabled ? 'opacity-30 grayscale cursor-not-allowed' : 'active:scale-95'}`}
  >
    <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-zinc-800 to-zinc-900 border border-white/5 group-hover:border-[#d4af37]/50 shadow-lg flex items-center justify-center relative overflow-hidden">
      <div className="absolute inset-0 bg-[#d4af37]/0 group-hover:bg-[#d4af37]/5 transition-colors" />
      <Icon size={28} className="text-zinc-400 group-hover:text-[#d4af37] transition-colors relative z-10" />
      {alert && <span className="absolute top-2 right-2 w-2 h-2 bg-[#d4af37] rounded-full animate-pulse shadow-[0_0_8px_#d4af37]" />}
    </div>
    <span className="text-[9px] font-black tracking-wider text-zinc-500 group-hover:text-[#d4af37] uppercase">
      {label}
    </span>
  </button>
);

const LoadingOverlay = ({ text }) => (
  <div className="absolute inset-0 bg-black/90 z-[100] flex flex-col items-center justify-center p-8 backdrop-blur-sm">
    <div className="w-64 h-1 bg-zinc-800 rounded-full overflow-hidden mb-4">
      <div className="h-full bg-[#d4af37] animate-[boot-load_2s_ease-in-out_infinite]" />
    </div>
    <span className="text-[10px] text-[#d4af37] font-mono animate-pulse">{text}</span>
  </div>
);

/* =========================================
   APPS INTERNOS
   ========================================= */
const MessengerApp = ({ messages, onSend, isTyping }) => {
  const [input, setInput] = useState('');
  const endRef = useRef(null);

  useEffect(() => { endRef.current?.scrollIntoView({ behavior: 'smooth' }); }, [messages, isTyping]);

  return (
    <div className="flex flex-col h-full bg-[#050505]">
      <div className="flex-1 overflow-y-auto p-4 space-y-4 custom-scroll">
        {messages.map((msg, i) => (
          <div key={i} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
            <div className={`max-w-[85%] p-3 rounded-lg text-xs leading-relaxed border ${
              msg.role === 'user' 
                ? 'bg-[#d4af37] text-black border-[#d4af37] font-medium rounded-tr-none' 
                : 'bg-zinc-900 text-zinc-200 border-zinc-800 rounded-tl-none'
            }`}>
              {msg.content}
            </div>
          </div>
        ))}
        {isTyping && <div className="text-zinc-600 text-[10px] pl-2 animate-pulse">● ● ●</div>}
        <div ref={endRef} />
      </div>
      <div className="p-3 bg-black border-t border-zinc-800 flex gap-2">
        <input 
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && (onSend(input), setInput(''))}
          placeholder="Digite sua mensagem..."
          className="flex-1 bg-zinc-900 border border-zinc-700 rounded px-3 text-xs text-white focus:border-[#d4af37] outline-none transition-colors"
        />
        <button onClick={() => { onSend(input); setInput(''); }} className="p-2 bg-[#d4af37] rounded text-black hover:bg-[#b5952f] transition-colors">
          <Send size={16} />
        </button>
      </div>
    </div>
  );
};

const DeductionApp = ({ evidence, deductions, onDeduce, selectedIds, toggleSelect }) => {
  const discovered = evidence.filter(e => e.discovered);
  
  return (
    <div className="h-full flex flex-col p-4 bg-[#080808] overflow-hidden">
      <div className="flex-1 overflow-y-auto custom-scroll space-y-4">
        {/* Lista de Evidências */}
        <section>
          <h3 className="text-[10px] text-[#d4af37] font-black uppercase tracking-widest mb-3 flex items-center gap-2">
            <Fingerprint size={12} /> Evidências ({discovered.length})
          </h3>
          <div className="grid gap-2">
            {discovered.length === 0 && <p className="text-zinc-600 text-xs italic">Nenhuma pista encontrada.</p>}
            {discovered.map(ev => (
              <button 
                key={ev.id}
                onClick={() => toggleSelect(ev.id)}
                className={`w-full text-left p-3 rounded border transition-all ${
                  selectedIds.includes(ev.id) 
                    ? 'bg-[#d4af37]/10 border-[#d4af37] shadow-[0_0_10px_rgba(212,175,55,0.1)]' 
                    : 'bg-zinc-900 border-zinc-800 hover:border-zinc-600'
                }`}
              >
                <div className="text-xs text-zinc-200 font-bold">{ev.name}</div>
                <div className="text-[10px] text-zinc-500 mt-1 truncate">{ev.description}</div>
              </button>
            ))}
          </div>
        </section>

        {/* Lista de Hipóteses */}
        {deductions.length > 0 && (
          <section className="pt-4 border-t border-zinc-800">
             <h3 className="text-[10px] text-[#d4af37] font-black uppercase tracking-widest mb-3 flex items-center gap-2">
              <Cpu size={12} /> Hipóteses ({deductions.length})
            </h3>
            <div className="space-y-2">
              {deductions.map((d, i) => (
                <div key={i} className="p-3 bg-black border border-zinc-800 rounded text-xs text-zinc-300">
                  <span className="text-[#d4af37] font-bold">DEDUÇÃO:</span> {d.hypothesis}
                </div>
              ))}
            </div>
          </section>
        )}
      </div>

      <div className="pt-4 mt-auto border-t border-zinc-800">
        <button 
          onClick={onDeduce}
          disabled={selectedIds.length < 2}
          className="w-full py-3 bg-[#d4af37] text-black font-bold text-xs rounded uppercase tracking-wider hover:bg-[#c9a532] disabled:opacity-50 disabled:cursor-not-allowed transition-all"
        >
          {selectedIds.length < 2 ? "Selecione 2+ Pistas" : "Processar Dedução"}
        </button>
      </div>
    </div>
  );
};

const FilesApp = ({ evidence }) => (
  <div className="h-full bg-[#050505] p-4 overflow-y-auto custom-scroll">
    <h3 className="text-[10px] text-[#d4af37] font-black uppercase tracking-widest mb-4 flex items-center gap-2 border-b border-[#d4af37]/20 pb-2">
      <FileText size={12} /> Banco de Dados
    </h3>
    <div className="grid grid-cols-2 gap-3">
      {evidence.filter(e => e.discovered).map(ev => (
        <div key={ev.id} className="aspect-square bg-zinc-900 border border-zinc-800 rounded p-3 flex flex-col justify-between hover:border-[#d4af37]/50 transition-colors group">
          <div className="w-full h-24 bg-black rounded overflow-hidden relative">
            {ev.imageUrl ? (
              <img src={ev.imageUrl} className="w-full h-full object-cover opacity-60 group-hover:opacity-100 transition-opacity" alt={ev.name} />
            ) : (
              <div className="w-full h-full flex items-center justify-center text-zinc-700"><FileText size={24} /></div>
            )}
          </div>
          <span className="text-[10px] font-bold text-zinc-400 group-hover:text-white truncate mt-2">{ev.name}</span>
        </div>
      ))}
      {evidence.filter(e => e.discovered).length === 0 && (
        <p className="col-span-2 text-center text-zinc-600 text-xs py-10">Nenhum arquivo encontrado.</p>
      )}
    </div>
  </div>
);

const TimelineApp = ({ narrative }) => (
  <div className="h-full bg-[#050505] p-4 overflow-y-auto custom-scroll terminal-font">
    <h3 className="text-[10px] text-[#d4af37] font-black uppercase tracking-widest mb-6 flex items-center gap-2">
      <Timer size={12} /> Registro de Eventos
    </h3>
    <div className="relative border-l border-zinc-800 ml-2 space-y-6 pb-4">
      {narrative.slice().reverse().map((entry, i) => {
        const timeMatch = entry.match(/\[(.*?)\]/);
        const time = timeMatch ? timeMatch[1] : "LOG";
        const content = entry.replace(/\[.*?\]/, '').trim();
        return (
          <div key={i} className="pl-6 relative">
            <span className="absolute -left-[5px] top-1 w-2.5 h-2.5 rounded-full bg-[#050505] border border-[#d4af37]" />
            <span className="text-[10px] text-[#d4af37] font-bold block mb-1">{time}</span>
            <p className="text-[11px] text-zinc-300 leading-relaxed">{content}</p>
          </div>
        );
      })}
    </div>
  </div>
);

/* =========================================
   COMPONENTE PRINCIPAL (APP)
   ========================================= */
const App = () => {
  const store = useGameStore();
  const [isTyping, setIsTyping] = useState(false);
  const [loadingAction, setLoadingAction] = useState(null);

  const gameTime = useMemo(() => store.getFormattedTime(), [store.timeOffsetMs]);

  // Sequência de Boot (Simulada)
  useEffect(() => {
    if (store.screen === 'boot') {
      let progress = 0;
      const interval = setInterval(() => {
        progress += Math.floor(Math.random() * 15);
        if (progress >= 100) {
          clearInterval(interval);
          store.setScreen('lock'); // Vai para a Lock Screen após o boot
        }
        store.setBootProgress(Math.min(progress, 100));
      }, 200);
      return () => clearInterval(interval);
    }
  }, [store.screen]);

  // Lógica de Mensagens
  const handleSendMessage = async (text) => {
    if (!text.trim()) return;
    store.addMessage({ role: 'user', content: text });
    setIsTyping(true);
    
    // Simula tempo de processamento
    await performAction(1, 1, "ENVIANDO DADOS..."); 

    try {
      const response = await generateResponse(text, store.messages, store);
      store.addMessage({ role: 'assistant', content: response });
    } catch (e) {
      store.addMessage({ role: 'system', content: "ERRO: Falha na conexão neural." });
    } finally {
      setIsTyping(false);
    }
  };

  // Lógica de Dedução
  const handleDeduction = async () => {
    const selectedEvs = store.evidence.filter(e => store.selectedEvidenceIds.includes(e.id));
    await performAction(5, 3, "PROCESSANDO LÓGICA...", 5);
    
    const result = await processDeduction(selectedEvs, store);
    store.addDeduction(result);
    store.addNarrative(`NOVA HIPÓTESE: ${result.hypothesis}`);
  };

  // Utilitário de Ação (gasta bateria/tempo)
  const performAction = async (minutes, batteryCost, label, stress = 0) => {
    setLoadingAction(label);
    await new Promise(r => setTimeout(r, 1500)); // Delay visual
    store.performAction(minutes, batteryCost, stress);
    setLoadingAction(null);
  };

  // --- ROTEAMENTO DE TELAS ---

  if (store.screen === 'menu') return <MainMenu />;

  return (
    <div className="w-full h-screen bg-[#111] flex items-center justify-center p-4 overflow-hidden app-container">
      <GlobalStyles stressLevel={store.stressLevel} />
      
      {/* MOLDURA DO DISPOSITIVO */}
      <div className="w-full max-w-[400px] h-full max-h-[850px] bg-black rounded-[2.5rem] border-[6px] border-[#1a1a1a] relative overflow-hidden flex flex-col shadow-2xl ring-1 ring-white/10">
        
        <div className="scanline-overlay" />
        <div className="stress-vignette" />
        
        {loadingAction && <LoadingOverlay text={loadingAction} />}

        {/* --- TELA: BOOT --- */}
        {store.screen === 'boot' && (
          <div className="flex-1 bg-black flex flex-col items-center justify-center p-8 font-mono text-green-500">
            <ShieldCheck size={48} className="mb-6 animate-pulse text-[#d4af37]" />
            <div className="w-full text-xs space-y-2 mb-8 opacity-70">
              <p>{`> BIOS_CHECK......... OK`}</p>
              <p>{`> MEMORY............. ${store.bootProgress * 10}MB OK`}</p>
              <p>{`> LOADING KERNEL..... ${store.bootProgress}%`}</p>
            </div>
            <div className="w-full h-1 bg-zinc-800 rounded">
              <div className="h-full bg-[#d4af37]" style={{ width: `${store.bootProgress}%` }} />
            </div>
          </div>
        )}

        {/* --- TELA: LOCK SCREEN --- */}
        {store.screen === 'lock' && (
          <div className="flex-1 bg-black flex flex-col items-center justify-center relative">
            <div className="absolute inset-0 bg-[url('https://image.pollinations.ai/prompt/cyberpunk%20city%20rain%20wallpaper%20dark?width=400&height=850&nologo=true')] opacity-30 bg-cover bg-center mix-blend-overlay" />
            <div className="z-10 text-center">
              <h1 className="text-6xl font-thin text-white tracking-tighter mb-2">{gameTime}</h1>
              <p className="text-[10px] uppercase tracking-[0.4em] text-[#d4af37] mb-12">Sexta-Feira, 13 Out</p>
              <button 
                onClick={() => store.setScreen('home')}
                className="group flex flex-col items-center gap-4 animate-bounce"
              >
                <Fingerprint size={48} className="text-zinc-600 group-hover:text-[#d4af37] transition-colors" />
                <span className="text-[9px] font-bold text-zinc-600 uppercase tracking-widest">Desbloquear</span>
              </button>
            </div>
          </div>
        )}

        {/* --- TELA: SISTEMA OPERACIONAL (Home & Apps) --- */}
        {(store.screen === 'home' || store.screen === 'app') && (
          <>
            <StatusBar battery={store.battery} time={gameTime} stress={store.stressLevel} />
            
            <main className="flex-1 relative overflow-hidden bg-[#0a0a0a]">
              
              {/* DESKTOP (ÍCONES) */}
              {store.screen === 'home' && (
                <div className="h-full p-8 flex flex-col">
                  <div className="grid grid-cols-2 gap-x-6 gap-y-10 mt-12">
                    <AppIcon 
                      icon={MessageSquare} label="Central" 
                      onClick={() => { store.setActiveApp('messenger'); store.setScreen('app'); }} 
                      alert={store.messages.length > 0 && store.messages[store.messages.length-1].role === 'assistant'}
                    />
                    <AppIcon 
                      icon={Camera} label="Lens" 
                      onClick={() => { store.setActiveApp('lens'); store.setScreen('app'); }} 
                    />
                    <AppIcon 
                      icon={Cpu} label="Dedução" 
                      onClick={() => { store.setActiveApp('deduction'); store.setScreen('app'); }}
                      disabled={store.evidence.filter(e => e.discovered).length === 0}
                    />
                    <AppIcon 
                      icon={FileText} label="Arquivos" 
                      onClick={() => { store.setActiveApp('files'); store.setScreen('app'); }} 
                    />
                    <AppIcon 
                      icon={Timer} label="Timeline" 
                      onClick={() => { store.setActiveApp('timeline'); store.setScreen('app'); }} 
                    />
                    <AppIcon 
                      icon={ShieldAlert} label="Sistema" disabled 
                    />
                  </div>
                  
                  <div className="mt-auto bg-zinc-900/50 border border-white/5 p-4 rounded-xl">
                    <h4 className="text-[9px] uppercase text-zinc-500 font-bold mb-1">Missão Atual</h4>
                    <p className="text-xs text-[#d4af37] leading-tight">Investigar o escritório de Clara Mendes e encontrar pistas sobre o desaparecimento.</p>
                  </div>
                </div>
              )}

              {/* JANELA DE APLICATIVO ABERTA */}
              {store.screen === 'app' && (
                <div className="absolute inset-0 z-20 bg-[#050505] flex flex-col">
                  {/* Barra de Título do App */}
                  <div className="h-14 border-b border-white/5 bg-[#080808] flex items-center justify-between px-4 shrink-0">
                    <button onClick={() => store.setScreen('home')} className="p-2 -ml-2 text-zinc-400 hover:text-white transition-colors">
                      <ChevronLeft />
                    </button>
                    <span className="text-xs font-black uppercase tracking-[0.2em] text-[#d4af37]">{store.activeApp}</span>
                    <div className="w-8 h-8 opacity-0"></div>
                  </div>

                  {/* Conteúdo do App */}
                  <div className="flex-1 overflow-hidden relative">
                    {store.activeApp === 'lens' && (
                      <LensNavigator 
                        locationId={store.currentLocationId}
                        currentAngle={store.currentCameraAngle}
                        onAngleChange={store.setCameraAngle}
                        cameraImages={store.cameraAngles[store.currentLocationId]}
                      />
                    )}
                    
                    {store.activeApp === 'messenger' && (
                      <MessengerApp 
                        messages={store.messages} 
                        onSend={handleSendMessage} 
                        isTyping={isTyping} 
                      />
                    )}

                    {store.activeApp === 'deduction' && (
                      <DeductionApp 
                        evidence={store.evidence}
                        deductions={store.deductions}
                        selectedIds={store.selectedEvidenceIds}
                        toggleSelect={store.toggleEvidenceSelection}
                        onDeduce={handleDeduction}
                      />
                    )}

                    {store.activeApp === 'files' && <FilesApp evidence={store.evidence} />}
                    
                    {store.activeApp === 'timeline' && <TimelineApp narrative={store.storyNarrative} />}
                  </div>
                </div>
              )}
            </main>

            {/* BARRA INFERIOR (Home Indicator) */}
            <div className="h-6 bg-black flex items-center justify-center shrink-0 z-50">
              <div className="w-32 h-1 bg-zinc-800 rounded-full" />
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default App;