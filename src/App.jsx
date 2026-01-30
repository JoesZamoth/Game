import React, { useState, useEffect, useMemo } from 'react';
import { 
  Camera, BatteryFull, BatteryLow, MessageSquare, FileText, ChevronLeft, 
  ShieldCheck, BookOpen, Fingerprint, Cpu, Timer, Image as ImageIcon
} from 'lucide-react';
import { useGameStore } from './store';
import { generateResponse, generateImage, processDeduction } from './aiService';
import { LensNavigator } from './LensNavigator';

const ThriveStyles = ({ battery, act, npcTrust, stressLevel }) => (
  <style>{`
    @import url('https://fonts.googleapis.com/css2?family=JetBrains+Mono:wght@400;700&family=Inter:wght@400;900&display=swap');
    .app-container { 
      font-family: 'Inter', sans-serif; 
      background: #020202; 
      filter: grayscale(${stressLevel > 70 ? '100%' : (stressLevel > 40 ? '50%' : '0%')});
      transition: all 1s ease;
    }
    .terminal-font { font-family: 'JetBrains Mono', monospace; }
    .scanline-overlay {
      position: absolute; inset: 0; pointer-events: none;
      background: ${stressLevel > 70 ? 
        'repeating-linear-gradient(to bottom, rgba(255, 255, 255, 0.1), rgba(255, 255, 255, 0.1) 1px, transparent 1px, transparent 2px)' : 
        'repeating-linear-gradient(to bottom, rgba(212, 175, 55, 0.03), rgba(212, 175, 55, 0.03) 1px, transparent 1px, transparent 3px)'};
      z-index: 200; mix-blend-mode: overlay; 
      animation: ${stressLevel > 50 ? 'glitch-anim 0.1s infinite' : 'scanline-flicker 0.2s infinite alternate'};
    }
    @keyframes scanline-flicker { 0% { opacity: 0.02; } 100% { opacity: 0.05; } }
    @keyframes glitch-anim {
      0% { transform: translate(0); opacity: 0.1; }
      50% { transform: translate(-2px, 1px); opacity: 0.2; }
      100% { transform: translate(2px, -1px); opacity: 0.1; }
    }
    .message-ai { 
      background: #18181b; 
      color: #e4e4e7; 
      border-radius: 2px 12px 12px 12px; 
      border: 1px solid ${npcTrust < 30 ? '#450a0a' : '#d4af37'}; 
    }
    .message-user { background: #d4af37; color: #000; border-radius: 12px 2px 12px 12px; font-weight: 800; }
    .act-badge { 
      background: ${act === 3 ? '#ef4444' : '#d4af37'}; 
      color: #000; padding: 2px 8px; border-radius: 4px; font-size: 8px; font-weight: 900;
    }
    .stress-vignette {
      position: absolute; inset: 0; pointer-events: none;
      box-shadow: inset 0 0 ${stressLevel}px rgba(0,0,0,${stressLevel/100});
      z-index: 190;
    }
    .timeline-marker {
      position: relative;
      padding-left: 20px;
      border-left: 1px solid #d4af37;
    }
    .timeline-marker::before {
      content: '';
      position: absolute;
      left: -5px;
      top: 0;
      width: 9px;
      height: 9px;
      background: #d4af37;
      border-radius: 50%;
    }
    .no-scrollbar::-webkit-scrollbar { display: none; }
    .no-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }
  `}</style>
);

const StatusBar = ({ battery, time, act, stressLevel }) => (
  <div className="h-10 flex justify-between items-center px-6 text-[10px] font-black tracking-[0.2em] text-[#555] z-[150] bg-black border-b border-white/5 uppercase">
    <div className="flex items-center gap-4">
      <div className="flex items-center gap-1.5 text-[#d4af37]">
        <Timer size={10} />
        <span>{time}</span>
      </div>
      <div className="act-badge">ATO {act}</div>
    </div>
    <div className="flex items-center gap-3">
      <div className="flex items-center gap-1 text-blue-500/50">
        <span>STRESS</span>
        <span>{stressLevel}%</span>
      </div>
      <div className={`flex items-center gap-2 ${battery <= 15 ? 'text-red-600 animate-pulse' : ''}`}>
        <span>{Math.round(battery)}%</span>
        {battery > 20 ? <BatteryFull size={12} /> : <BatteryLow size={12} />}
      </div>
    </div>
  </div>
);

const AppIcon = ({ icon: Icon, label, onClick, highlighted }) => (
  <button onClick={onClick} className="flex flex-col items-center gap-2 group transition-all active:scale-90">
    <div className={`w-14 h-14 rounded-xl bg-[#0a0a0a] border ${highlighted ? 'border-[#d4af37] shadow-[0_0_20px_rgba(212,175,55,0.2)]' : 'border-white/5'} flex items-center justify-center text-[#d4af37] relative overflow-hidden`}>
      <Icon size={24} className="relative z-10" />
    </div>
    <span className="text-[8px] font-black text-[#444] group-hover:text-[#d4af37] uppercase tracking-widest">{label}</span>
  </button>
);

const LoadingOverlay = ({ progress, label }) => (
  <div className="absolute inset-0 z-[1000] bg-black/90 flex flex-col items-center justify-center p-12 text-center">
    <div className="w-full h-1 bg-white/5 rounded-full mb-8 overflow-hidden">
      <div className="h-full bg-[#d4af37] transition-all" style={{ width: `${progress}%` }} />
    </div>
    <span className="text-[10px] font-black uppercase tracking-[0.4em] text-[#d4af37] animate-pulse">{label}</span>
  </div>
);

const App = () => {
  const store = useGameStore();
  const [isPerformingAction, setIsPerformingAction] = useState(false);
  const [actionProgress, setActionProgress] = useState(0);
  const [actionLabel, setActionLabel] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const [chatInput, setChatInput] = useState("");

  const gameTime = useMemo(() => store.getFormattedTime(), [store.timeOffsetMs]);

  // Boot sequence
  useEffect(() => {
    if (store.screen === 'boot') {
      const bootSequence = async () => {
        for (let i = 0; i <= 100; i += 10) {
          store.setBootProgress(i);
          await new Promise(r => setTimeout(r, 100));
        }
        store.setBooting(false);
        store.setScreen('lock');
      };
      bootSequence();
    }
  }, [store.screen]);

  const performAction = async (minutes, batteryCost, label, stressImpact = 0) => {
    if (store.battery < batteryCost) return false;
    setIsPerformingAction(true);
    setActionLabel(label);
    setActionProgress(0);
    
    for (let i = 0; i <= 20; i++) {
      await new Promise(r => setTimeout(r, 50));
      setActionProgress(i * 5);
    }
    
    store.performAction(minutes, batteryCost, stressImpact);
    setIsPerformingAction(false);
    return true;
  };

  const handleSendMessage = async () => {
    if (!chatInput.trim()) return;
    
    const text = chatInput;
    setChatInput("");
    store.addMessage({ role: 'user', content: text });
    setIsTyping(true);
    
    await performAction(2, 1, "ENVIANDO MENSAGEM", 2);
    
    try {
      const aiReply = await generateResponse(text, store.messages, store);
      store.addMessage({ role: 'assistant', content: aiReply });
    } catch (err) { 
      store.addMessage({ role: 'assistant', content: "SISTEMA: Erro de sincronização neural." });
    } finally { 
      setIsTyping(false); 
    }
  };

  const handleDeduction = async () => {
    if (store.selectedEvidenceIds.length < 2) {
      store.addNarrative("SISTEMA: Selecione pelo menos 2 evidências para dedução.");
      return;
    }

    const selectedEvidence = store.evidence.filter(e => 
      store.selectedEvidenceIds.includes(e.id)
    );

    await performAction(5, 3, "PROCESSANDO DEDUÇÃO", 5);

    try {
      const result = await processDeduction(selectedEvidence, store);
      store.addDeduction(result);
      store.addNarrative(`DEDUÇÃO: ${result.hypothesis.substring(0, 80)}...`);
    } catch (err) {
      console.error("Erro na dedução:", err);
      store.addNarrative("SISTEMA: Falha ao processar dedução.");
    }
  };

  return (
    <div className="w-full h-screen flex items-center justify-center p-4 app-container overflow-hidden">
      <ThriveStyles 
        battery={store.battery} 
        act={store.act} 
        npcTrust={store.npcStates.central?.trust || 50} 
        stressLevel={store.stressLevel} 
      />
      
      <div className="w-full max-w-[400px] h-full max-h-[850px] bg-black rounded-[3rem] border-[8px] border-[#111] relative overflow-hidden flex flex-col">
        <div className="scanline-overlay" />
        <div className="stress-vignette" />
        
        {isPerformingAction && (
          <LoadingOverlay progress={actionProgress} label={actionLabel} />
        )}

        <StatusBar 
          battery={store.battery} 
          time={gameTime} 
          act={store.act} 
          stressLevel={store.stressLevel} 
        />
        
        <main className="flex-1 relative overflow-hidden">
          {/* BOOT SCREEN */}
          {store.screen === 'boot' && (
            <div className="h-full flex flex-col items-center justify-center bg-black">
              <ShieldCheck size={60} className="text-[#d4af37] mb-8 animate-pulse" />
              <span className="text-[8px] font-black uppercase tracking-[0.5em] text-[#333]">Thrive OS v4.0</span>
              <div className="w-32 h-1 bg-white/10 rounded-full mt-8 overflow-hidden">
                <div className="h-full bg-[#d4af37] transition-all" style={{ width: `${store.bootProgress}%` }} />
              </div>
            </div>
          )}

          {/* LOCK SCREEN */}
          {store.screen === 'lock' && (
            <div className="h-full flex flex-col items-center justify-center bg-black">
              <h1 className="text-7xl font-thin tracking-tighter mb-2 text-[#d4af37]">
                {gameTime.split(':')[0]}:{gameTime.split(':')[1]}
              </h1>
              <button 
                onClick={() => store.setScreen('home')} 
                className="mt-20 flex flex-col items-center gap-6 group"
              >
                <Fingerprint size={40} className="text-[#d4af37] animate-pulse" />
                <span className="text-[9px] uppercase text-[#444] font-black tracking-widest">
                  Acessar Sistema
                </span>
              </button>
            </div>
          )}

          {/* HOME SCREEN */}
          {store.screen === 'home' && (
            <div className="h-full p-10 grid grid-cols-3 gap-y-12 content-start pt-24">
              <AppIcon 
                icon={MessageSquare} 
                label="CENTRAL" 
                onClick={() => { store.setActiveApp('messenger'); store.setScreen('app'); }} 
              />
              <AppIcon 
                icon={Camera} 
                label="LENS" 
                onClick={() => { store.setActiveApp('lens'); store.setScreen('app'); }} 
              />
              <AppIcon 
                icon={BookOpen} 
                label="DIÁRIO" 
                onClick={() => { store.setActiveApp('journal'); store.setScreen('app'); }} 
              />
              <AppIcon 
                icon={Cpu} 
                label="DEDUÇÃO" 
                onClick={() => { store.setActiveApp('deduction'); store.setScreen('app'); }} 
                highlighted={store.selectedEvidenceIds.length > 0}
              />
              <AppIcon 
                icon={FileText} 
                label="ARQUIVOS" 
                onClick={() => { store.setActiveApp('files'); store.setScreen('app'); }} 
              />
              <AppIcon 
                icon={Timer} 
                label="TIMELINE" 
                onClick={() => { store.setActiveApp('timeline'); store.setScreen('app'); }} 
              />
            </div>
          )}

          {/* APP SCREEN */}
          {store.screen === 'app' && (
            <div className="absolute inset-0 z-[100] bg-[#050505] flex flex-col">
              <div className="h-14 border-b border-white/5 flex items-center px-4 justify-between bg-[#080808]">
                <button onClick={() => store.setScreen('home')} className="text-[#444] p-2">
                  <ChevronLeft size={24} />
                </button>
                <span className="text-[10px] font-black uppercase tracking-[0.3em] text-[#d4af37]">
                  {store.activeApp}
                </span>
                <div className="w-6 h-6 opacity-20"><ShieldCheck size={16} /></div>
              </div>
              
              <div className="flex-1 overflow-hidden">
                {/* TIMELINE APP */}
                {store.activeApp === 'timeline' && (
                  <div className="h-full flex flex-col terminal-font p-4 space-y-6 overflow-y-auto no-scrollbar">
                    <div className="p-4 bg-[#d4af37]/5 border border-[#d4af37]/20 rounded-lg mb-4">
                      <span className="text-[8px] font-black text-[#d4af37] uppercase block mb-2">
                        Linha do Tempo Ativa
                      </span>
                      <p className="text-[10px] text-white italic">
                        O tempo flui conforme você investiga. Eventos críticos ocorrerão em horários específicos.
                      </p>
                    </div>
                    {store.storyNarrative.map((event, i) => (
                      <div key={i} className="timeline-marker">
                        <p className="text-[10px] text-[#d4af37] font-black">
                          {event.match(/\[(.*?)\]/)?.[1] || "??:??"}
                        </p>
                        <p className="text-[11px] text-white leading-relaxed">
                          {event.replace(/\[.*?\]/, '')}
                        </p>
                      </div>
                    ))}
                  </div>
                )}

                {/* MESSENGER APP */}
                {store.activeApp === 'messenger' && (
                  <div className="flex flex-col h-full terminal-font p-4">
                    <div className="flex-1 overflow-y-auto space-y-4 no-scrollbar mb-4">
                      {store.messages.map((m, i) => (
                        <div key={i} className={`flex ${m.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                          <div className={`max-w-[85%] p-3 text-[11px] ${m.role === 'user' ? 'message-user' : 'message-ai'}`}>
                            {m.content}
                          </div>
                        </div>
                      ))}
                      {isTyping && (
                        <div className="flex justify-start">
                          <div className="max-w-[85%] p-3 text-[11px] message-ai">
                            <span className="animate-pulse">●●●</span>
                          </div>
                        </div>
                      )}
                    </div>
                    <div className="flex gap-2">
                      <input 
                        value={chatInput}
                        onChange={(e) => setChatInput(e.target.value)}
                        onKeyDown={(e) => { if(e.key === 'Enter') handleSendMessage(); }} 
                        placeholder="Comando..." 
                        className="flex-1 bg-black border border-[#222] rounded px-4 py-3 text-xs text-white outline-none focus:border-[#d4af37]" 
                      />
                      <button 
                        onClick={handleSendMessage}
                        className="px-4 bg-[#d4af37] text-black font-bold text-xs rounded hover:bg-[#c9a532]"
                      >
                        ENVIAR
                      </button>
                    </div>
                  </div>
                )}

                {/* LENS APP */}
                {store.activeApp === 'lens' && (
                  <LensNavigator 
                    locationId={store.currentLocationId}
                    onAngleChange={(angle) => {
                      store.setCameraAngle(angle);
                      // Verifica se há evidências neste ângulo
                      const evidenceAtAngle = store.evidence.find(
                        e => e.location === store.currentLocationId && 
                             e.angle === angle && 
                             !e.discovered
                      );
                      if (evidenceAtAngle) {
                        store.discoverEvidence(evidenceAtAngle.id);
                      }
                    }}
                    currentAngle={store.currentCameraAngle}
                    cameraImages={store.cameraAngles[store.currentLocationId]}
                  />
                )}

                {/* DEDUCTION APP */}
                {store.activeApp === 'deduction' && (
                  <div className="h-full flex flex-col p-4 overflow-y-auto no-scrollbar">
                    <div className="mb-4">
                      <h3 className="text-[10px] font-black text-[#d4af37] uppercase mb-2">
                        Evidências Descobertas
                      </h3>
                      <div className="space-y-2">
                        {store.evidence.filter(e => e.discovered).map(ev => (
                          <button
                            key={ev.id}
                            onClick={() => store.toggleEvidenceSelection(ev.id)}
                            className={`w-full p-3 rounded border text-left text-[10px] transition-all ${
                              store.selectedEvidenceIds.includes(ev.id)
                                ? 'bg-[#d4af37]/20 border-[#d4af37]'
                                : 'bg-[#111] border-white/10 hover:border-white/20'
                            }`}
                          >
                            <div className="font-bold text-white">{ev.name}</div>
                            <div className="text-[#888] text-[9px] mt-1">{ev.description}</div>
                          </button>
                        ))}
                      </div>
                    </div>

                    <button
                      onClick={handleDeduction}
                      disabled={store.selectedEvidenceIds.length < 2}
                      className="mt-auto py-3 bg-[#d4af37] text-black font-black text-xs rounded disabled:opacity-30 disabled:cursor-not-allowed"
                    >
                      PROCESSAR DEDUÇÃO ({store.selectedEvidenceIds.length}/3)
                    </button>

                    {store.deductions.length > 0 && (
                      <div className="mt-4">
                        <h3 className="text-[10px] font-black text-[#d4af37] uppercase mb-2">
                          Deduções Anteriores
                        </h3>
                        <div className="space-y-2">
                          {store.deductions.slice(0, 3).map((d, i) => (
                            <div key={i} className="p-3 bg-[#111] border border-white/10 rounded text-[10px]">
                              <div className="text-white">{d.hypothesis}</div>
                              <div className="text-[#888] text-[9px] mt-1">Status: {d.status}</div>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                )}

                {/* FILES APP */}
                {store.activeApp === 'files' && (
                  <div className="h-full p-4 overflow-y-auto no-scrollbar">
                    <h3 className="text-[10px] font-black text-[#d4af37] uppercase mb-4">
                      Arquivos Descobertos
                    </h3>
                    {store.evidence.filter(e => e.discovered && e.type === 'doc').length === 0 ? (
                      <p className="text-[#666] text-[10px] text-center mt-8">
                        Nenhum arquivo descoberto ainda
                      </p>
                    ) : (
                      <div className="space-y-2">
                        {store.evidence.filter(e => e.discovered && e.type === 'doc').map(ev => (
                          <div key={ev.id} className="p-3 bg-[#111] border border-white/10 rounded">
                            <div className="font-bold text-white text-[10px]">{ev.name}</div>
                            <div className="text-[#888] text-[9px] mt-1">{ev.detailedDescription}</div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                )}

                {/* JOURNAL APP */}
                {store.activeApp === 'journal' && (
                  <div className="h-full p-4 overflow-y-auto no-scrollbar">
                    <h3 className="text-[10px] font-black text-[#d4af37] uppercase mb-4">
                      Diário de Investigação
                    </h3>
                    <div className="space-y-4">
                      {store.storyNarrative.slice(-10).reverse().map((entry, i) => (
                        <div key={i} className="p-3 bg-[#111] border border-white/10 rounded text-[10px] text-white">
                          {entry}
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}
        </main>
      </div>
    </div>
  );
};

export default App;
