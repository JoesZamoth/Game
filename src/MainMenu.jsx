// src/MainMenu.jsx (Direto na pasta src)
import React, { useState } from 'react';
import { RotateCcw, Settings, HardDrive, Terminal } from 'lucide-react';
// MUDANÇA AQUI: Agora usamos ./store porque estão na mesma pasta
import { useGameStore } from './store';

export const MainMenu = () => {
  const { resetGame, continueGame, evidence } = useGameStore();
  const [showOptions, setShowOptions] = useState(false);

  // Se já descobriu alguma evidência, consideramos que tem save game
  const hasSaveGame = evidence && evidence.some(e => e.discovered);

  const handleNewGame = () => {
    if (hasSaveGame) {
      if (confirm("ATENÇÃO: Iniciar um novo jogo apagará todo o progresso atual. Tem certeza?")) {
        resetGame();
      }
    } else {
      resetGame();
    }
  };

  if (showOptions) {
    return (
      <div className="fixed inset-0 bg-black flex items-center justify-center text-[#d4af37] font-mono z-50">
        <div className="w-96 border border-[#d4af37]/30 p-8 rounded bg-zinc-900/90 backdrop-blur-md shadow-[0_0_30px_rgba(212,175,55,0.2)]">
          <h2 className="text-xl mb-6 border-b border-[#d4af37]/30 pb-2 flex items-center gap-2">
            <Settings size={20} /> CONFIGURAÇÕES
          </h2>
          
          <div className="space-y-6">
            <div className="space-y-2">
              <div className="flex justify-between items-center text-sm">
                <span>ÁUDIO DO SISTEMA</span>
                <span className="text-xs text-zinc-500">80%</span>
              </div>
              <input type="range" className="w-full h-1 bg-zinc-800 rounded-lg appearance-none cursor-pointer accent-[#d4af37]" />
            </div>

            <div className="pt-4 border-t border-zinc-800 text-xs text-zinc-500 flex justify-between">
              <span>VERSÃO DO KERNEL</span>
              <span>v4.0.1-b</span>
            </div>
          </div>

          <button 
            onClick={() => setShowOptions(false)}
            className="mt-8 w-full py-3 border border-[#d4af37] hover:bg-[#d4af37] hover:text-black transition-all font-bold tracking-widest text-sm"
          >
            VOLTAR
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="h-screen w-screen bg-black relative overflow-hidden flex flex-col items-center justify-center font-mono select-none">
      
      {/* Background Visuals */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-zinc-900/40 via-black to-black"></div>
      
      {/* Main Content */}
      <div className="z-10 flex flex-col items-center w-full max-w-lg px-6">
        
        {/* Logo */}
        <div className="mb-12 text-center relative group cursor-default">
          <h1 className="text-6xl md:text-8xl font-black text-transparent bg-clip-text bg-gradient-to-b from-[#d4af37] to-[#8a6d1f] tracking-tighter glitch-text mb-2">
            THRIVE
          </h1>
          <div className="flex items-center justify-center gap-3 text-[#d4af37] opacity-60 text-xs tracking-[0.5em] uppercase">
            <span className="w-2 h-2 bg-[#d4af37] rounded-full animate-pulse"></span>
            Terra Sem Olhos
            <span className="w-2 h-2 bg-[#d4af37] rounded-full animate-pulse"></span>
          </div>
        </div>

        {/* Menu Buttons */}
        <div className="w-full space-y-4">
          
          <button
            onClick={continueGame}
            disabled={!hasSaveGame}
            className={`w-full group relative px-8 py-5 border transition-all duration-300 flex items-center justify-between
              ${hasSaveGame 
                ? 'border-[#d4af37]/30 hover:bg-[#d4af37]/5 hover:border-[#d4af37] cursor-pointer text-[#d4af37]' 
                : 'border-zinc-900 text-zinc-700 cursor-not-allowed opacity-50'}`}
          >
            <span className="text-lg tracking-widest flex items-center gap-4 font-bold">
              <HardDrive size={18} /> CONTINUAR
            </span>
            {hasSaveGame && <span className="text-[10px] bg-[#d4af37]/10 px-2 py-1 rounded border border-[#d4af37]/20">CAP. 1</span>}
          </button>

          <button
            onClick={handleNewGame}
            className="w-full group relative px-8 py-5 border border-[#d4af37]/30 hover:bg-[#d4af37] hover:text-black hover:border-[#d4af37] transition-all duration-300 text-[#d4af37]"
          >
            <span className="text-lg tracking-widest flex items-center gap-4 font-bold">
              <RotateCcw size={18} /> NOVO JOGO
            </span>
          </button>

          <button
            onClick={() => setShowOptions(true)}
            className="w-full group relative px-8 py-5 border border-transparent hover:border-zinc-700 text-zinc-500 hover:text-zinc-300 transition-all duration-300"
          >
            <span className="text-sm tracking-widest flex items-center gap-4">
              <Settings size={16} /> SISTEMA
            </span>
          </button>
        </div>

        {/* Footer Info */}
        <div className="mt-16 text-center">
           <p className="text-zinc-800 text-[10px] uppercase tracking-widest mb-2 flex items-center justify-center gap-2">
             <Terminal size={10} /> Secure Connection Established
           </p>
        </div>

      </div>
    </div>
  );
};