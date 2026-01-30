import React, { useState } from 'react';
import { ChevronLeft, ChevronRight, ZoomIn, ZoomOut, Compass } from 'lucide-react';
import { CAMERA_ANGLES } from "./data/loreData.js";

export const LensNavigator = ({ locationId, onAngleChange, currentAngle, cameraImages }) => {
  const [isZoomed, setIsZoomed] = useState(false);
  
  const angles = CAMERA_ANGLES[locationId] || [];
  const currentAngleData = angles.find(a => a.id === currentAngle);
  
  // Tenta pegar a imagem gerada pela IA, senão usa um placeholder bonito
  const currentImage = cameraImages?.[currentAngle] || `https://placehold.co/1024x768/050505/d4af37?text=CARREGANDO+VISUAL...`;

  const handleNextAngle = () => {
    const currentIndex = angles.findIndex(a => a.id === currentAngle);
    const nextIndex = (currentIndex + 1) % angles.length;
    onAngleChange(angles[nextIndex].id);
  };

  const handlePrevAngle = () => {
    const currentIndex = angles.findIndex(a => a.id === currentAngle);
    const prevIndex = (currentIndex - 1 + angles.length) % angles.length;
    onAngleChange(angles[prevIndex].id);
  };

  return (
    <div className="h-full flex flex-col bg-black relative overflow-hidden">
      {/* Viewport Principal */}
      <div className="flex-1 relative overflow-hidden flex items-center justify-center bg-gradient-to-b from-black via-black to-zinc-900">
        
        {/* Imagem do Cenário */}
        <div className={`w-full h-full transition-transform duration-700 ease-out ${isZoomed ? 'scale-150' : 'scale-100'}`}>
            <img
              src={currentImage}
              alt={currentAngleData?.name || 'Cenário'}
              className="w-full h-full object-cover opacity-90 hover:opacity-100 transition-opacity"
            />
        </div>

        {/* Overlay de Vignette (Atmosfera Noir) */}
        <div className="absolute inset-0 pointer-events-none bg-[radial-gradient(circle,transparent_40%,rgba(0,0,0,0.8))]" />
        <div className="absolute inset-0 pointer-events-none bg-gradient-to-t from-black/80 via-transparent to-black/40" />

        {/* Indicador de Ângulo Atual */}
        <div className="absolute top-6 left-6 bg-black/60 backdrop-blur-md px-4 py-3 rounded-xl border border-white/10 flex items-center gap-3 shadow-lg">
          <Compass size={18} className="text-[#d4af37] animate-[spin_10s_linear_infinite]" />
          <div>
              <p className="text-[10px] font-black uppercase tracking-widest text-[#d4af37]">
                {currentAngleData?.name || 'SINAL PERDIDO'}
              </p>
              <p className="text-[9px] text-zinc-500 font-mono">CAM-0{angles.findIndex(a => a.id === currentAngle) + 1}</p>
          </div>
        </div>

        {/* Controles de Zoom */}
        <div className="absolute bottom-24 right-6 flex flex-col gap-3">
          <button
            onClick={() => setIsZoomed(!isZoomed)}
            className="w-10 h-10 rounded-full bg-black/60 border border-white/10 hover:border-[#d4af37] text-white hover:text-[#d4af37] transition-all flex items-center justify-center backdrop-blur-md shadow-lg"
          >
            {isZoomed ? <ZoomOut size={16} /> : <ZoomIn size={16} />}
          </button>
        </div>

        {/* Mira Central (Retícula) */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 pointer-events-none opacity-30">
          <div className="w-12 h-12 border border-[#d4af37] rounded-full flex items-center justify-center">
             <div className="w-1 h-1 bg-[#d4af37] rounded-full" />
          </div>
        </div>
      </div>

      {/* Barra de Navegação */}
      <div className="h-20 bg-black border-t border-white/10 flex items-center justify-between px-6 z-10 relative">
        <button
          onClick={handlePrevAngle}
          className="w-12 h-12 rounded-full border border-zinc-800 hover:border-[#d4af37] flex items-center justify-center text-zinc-500 hover:text-[#d4af37] transition-all active:scale-95 bg-zinc-900"
        >
          <ChevronLeft size={20} />
        </button>

        <div className="flex gap-2">
          {angles.map((angle) => (
            <button
              key={angle.id}
              onClick={() => onAngleChange(angle.id)}
              className={`h-1.5 rounded-full transition-all duration-300 ${
                angle.id === currentAngle
                  ? 'bg-[#d4af37] w-8 shadow-[0_0_10px_#d4af37]'
                  : 'bg-zinc-800 w-2 hover:bg-zinc-600'
              }`}
            />
          ))}
        </div>

        <button
          onClick={handleNextAngle}
          className="w-12 h-12 rounded-full border border-zinc-800 hover:border-[#d4af37] flex items-center justify-center text-zinc-500 hover:text-[#d4af37] transition-all active:scale-95 bg-zinc-900"
        >
          <ChevronRight size={20} />
        </button>
      </div>
    </div>
  );
};