import { GAME_CONTEXT, SCENARIO_DESCRIPTIONS, INITIAL_CHAT_HISTORY } from './loreData';
import React, { useState, useEffect } from "react";

// URL da imagem que o detetive vê (Substitua por sua imagem real depois)
const SCENE_IMAGE_URL = "https://images.unsplash.com/photo-1415604934674-561df9abf539?q=80&w=1000&auto=format&fit=crop";

export default function ThriveOSPrototype() {
  const [battery, setBattery] = useState(87);
  const [screen, setScreen] = useState("lock"); // lock, home, lens, files, recorder, gallery
  const [time, setTime] = useState("21:55");
  
  // 1. ESTADO DA GALERIA (Armazena as fotos tiradas)
  const [galleryPhotos, setGalleryPhotos] = useState([]);

  useEffect(() => {
    const interval = setInterval(() => {
      setBattery((b) => (b > 0 ? b - 1 : 0));
    }, 8000);
    return () => clearInterval(interval);
  }, []);

  // 2. FUNÇÃO PARA SALVAR FOTO (Passada para o Lens)
  const handleSavePhoto = (photoData) => {
    const newPhoto = {
      id: Date.now(),
      src: photoData.image,
      location: photoData.location || "Local Desconhecido",
      timestamp: new Date().toLocaleTimeString(),
    };
    setGalleryPhotos((prev) => [newPhoto, ...prev]);
  };

  return (
    <div className="w-full h-screen flex items-center justify-center bg-black text-white font-sans">
      <div className="w-[360px] h-[720px] rounded-2xl bg-gradient-to-b from-zinc-900 to-black shadow-2xl border border-zinc-700 overflow-hidden relative flex flex-col">
        
        <StatusBar battery={battery} />
        
        {/* Área de Conteúdo dos Apps */}
        <div className="flex-1 relative overflow-hidden">
            {screen === "lock" && <LockScreen time={time} onUnlock={() => setScreen("home")} />}
            {screen === "home" && <HomeScreen onOpen={(app) => setScreen(app)} />}
            
            {/* Passamos a função savePhoto para o Lens */}
            {screen === "lens" && (
                <LensApp 
                    onBack={() => setScreen("home")} 
                    onSavePhoto={handleSavePhoto} 
                />
            )}
            
            {/* Passamos as fotos para a Galeria */}
            {screen === "gallery" && (
                <GalleryApp 
                    onBack={() => setScreen("home")} 
                    photos={galleryPhotos} 
                />
            )}
            
            {screen === "files" && <FilesApp onBack={() => setScreen("home")} />}
            {screen === "recorder" && <RecorderApp onBack={() => setScreen("home")} />}
        </div>
      </div>
    </div>
  );
}

/* --- COMPONENTES DE SISTEMA --- */

function StatusBar({ battery }) {
  return (
    <div className="flex justify-between items-center px-4 py-2 text-xs text-zinc-300 bg-black/40 z-50">
      <span>ThriveOS 4.0</span>
      <span>{battery}%</span>
    </div>
  );
}

function LockScreen({ time, onUnlock }) {
  return (
    <div className="flex flex-col items-center justify-center h-full bg-zinc-900" onClick={onUnlock}>
      <div className="text-6xl font-light text-white">{time}</div>
      <div className="mt-4 text-zinc-400 text-sm animate-pulse">Toque para desbloquear</div>
    </div>
  );
}

function HomeScreen({ onOpen }) {
  return (
    <div className="grid grid-cols-3 gap-6 p-6 mt-10">
      <AppIcon icon="📷" label="LENS" onClick={() => onOpen("lens")} />
      <AppIcon icon="📂" label="ARQUIVOS" onClick={() => onOpen("files")} />
      <AppIcon icon="🎙️" label="GRAVADOR" onClick={() => onOpen("recorder")} />
      <AppIcon icon="🖼️" label="GALERIA" onClick={() => onOpen("gallery")} />
    </div>
  );
}

function AppIcon({ icon, label, onClick }) {
  return (
    <button onClick={onClick} className="flex flex-col items-center gap-2 group">
      <div className="w-14 h-14 bg-zinc-800 rounded-xl flex items-center justify-center text-2xl border border-zinc-700 group-hover:bg-zinc-700 transition-colors shadow-lg">
        {icon}
      </div>
      <span className="text-xs text-zinc-300 group-hover:text-white">{label}</span>
    </button>
  );
}

function AppScreen({ title, onBack, children, className = "" }) {
  return (
    <div className={`h-full flex flex-col bg-zinc-900 ${className}`}>
      <div className="flex items-center justify-between px-4 py-3 border-b border-zinc-800 bg-zinc-900/90 backdrop-blur z-20">
        <button onClick={onBack} className="text-zinc-400 hover:text-white text-lg">←</button>
        <span className="text-sm font-medium tracking-widest">{title}</span>
        <div className="w-4"></div> {/* Espaçador para centralizar título */}
      </div>
      <div className="flex-1 overflow-y-auto relative">{children}</div>
    </div>
  );
}

/* --- APLICATIVOS --- */

// 3. APP LENS (Câmera com visor e captura)
function LensApp({ onBack, onSavePhoto }) {
  const [isScanning, setIsScanning] = useState(false);
  const [flash, setFlash] = useState(false);

  const handleShutter = () => {
    setIsScanning(true);
    
    // Simula processamento
    setTimeout(() => {
      // Flash da tela
      setFlash(true);
      setTimeout(() => setFlash(false), 200);

      setIsScanning(false);
      
      // Salva a foto
      if (onSavePhoto) {
        onSavePhoto({
          image: SCENE_IMAGE_URL,
          location: "Cena do Crime - Relógio"
        });
      }
    }, 2000);
  };

  return (
    <div className="h-full w-full bg-black relative flex flex-col font-mono overflow-hidden">
      {/* Imagem de Fundo (Visão do Detetive) */}
      <div className="absolute inset-0 z-0">
        <img 
          src={SCENE_IMAGE_URL} 
          alt="Visão do Detetive" 
          className="w-full h-full object-cover opacity-60" 
        />
        {/* Filtro Verde Digital */}
        <div className="absolute inset-0 bg-green-900/30 mix-blend-overlay pointer-events-none"></div>
        {/* Scanlines / Ruído */}
        <div className="absolute inset-0 bg-[url('https://upload.wikimedia.org/wikipedia/commons/7/76/Scanlines_pattern.png')] opacity-10 pointer-events-none"></div>
      </div>

      {/* Interface UI Sobreposta */}
      <div className="relative z-10 flex flex-col h-full justify-between pointer-events-none">
        {/* Topo */}
        <div className="flex justify-between p-4 pt-12 bg-gradient-to-b from-black/80 to-transparent pointer-events-auto">
            <button onClick={onBack} className="text-green-500 font-bold">✕ SAIR</button>
            <span className="text-green-500 text-xs tracking-widest animate-pulse">● REC [AI:ON]</span>
        </div>

        {/* Mira Central */}
        <div className="absolute inset-0 flex items-center justify-center">
            <div className={`w-64 h-64 border border-green-500/50 relative transition-all duration-300 ${isScanning ? 'border-green-400 bg-green-500/10 scale-95' : ''}`}>
                <div className="absolute top-0 left-0 w-2 h-2 border-t-2 border-l-2 border-green-500"></div>
                <div className="absolute top-0 right-0 w-2 h-2 border-t-2 border-r-2 border-green-500"></div>
                <div className="absolute bottom-0 left-0 w-2 h-2 border-b-2 border-l-2 border-green-500"></div>
                <div className="absolute bottom-0 right-0 w-2 h-2 border-b-2 border-r-2 border-green-500"></div>
                
                {isScanning && (
                    <div className="absolute inset-0 flex items-center justify-center">
                        <span className="text-green-400 font-bold bg-black/50 px-2">ANALISANDO...</span>
                    </div>
                )}
            </div>
        </div>

        {/* Controles Inferiores */}
        <div className="p-8 pb-12 flex justify-center bg-gradient-to-t from-black/90 to-transparent pointer-events-auto">
            <button 
                onClick={handleShutter}
                disabled={isScanning}
                className="w-16 h-16 rounded-full border-2 border-white/50 flex items-center justify-center group active:scale-95 transition-all"
            >
                <div className={`w-14 h-14 bg-white rounded-full transition-all ${isScanning ? 'scale-75 bg-red-500' : 'group-hover:bg-zinc-200'}`}></div>
            </button>
        </div>
      </div>

      {/* Efeito de Flash Branco ao tirar foto */}
      {flash && <div className="absolute inset-0 bg-white z-50 animate-fadeOut"></div>}
    </div>
  );
}

// 4. APP GALERIA (Visualiza as fotos salvas)
function GalleryApp({ onBack, photos }) {
  return (
    <AppScreen title="GALERIA" onBack={onBack}>
      {photos.length === 0 ? (
        <div className="flex flex-col items-center justify-center h-full text-zinc-500 gap-2">
          <span className="text-4xl">🖼️</span>
          <p className="text-sm">Nenhuma evidência capturada.</p>
        </div>
      ) : (
        <div className="grid grid-cols-2 gap-2 p-2">
          {photos.map((photo) => (
            <div key={photo.id} className="aspect-square bg-zinc-800 rounded overflow-hidden relative group border border-zinc-700">
              <img src={photo.src} alt="Evidence" className="w-full h-full object-cover opacity-80" />
              <div className="absolute bottom-0 w-full bg-black/80 p-1">
                <p className="text-[10px] text-zinc-300 truncate">{photo.location}</p>
                <p className="text-[9px] text-zinc-500">{photo.timestamp}</p>
              </div>
            </div>
          ))}
        </div>
      )}
    </AppScreen>
  );
}

function FilesApp({ onBack }) {
  return (
    <AppScreen title="ARQUIVOS" onBack={onBack}>
      <ul className="text-sm text-zinc-300 space-y-1 p-2">
        <FileItem title="Relógio Parado" type="TEMPO" />
        <FileItem title="Duas Xícaras" type="VISITA" />
        <FileItem title="Log da Fechadura" type="ACESSO" />
      </ul>
    </AppScreen>
  );
}

function FileItem({ title, type }) {
    return (
        <li className="flex items-center gap-3 p-3 bg-zinc-800/50 rounded hover:bg-zinc-800 cursor-pointer border border-zinc-800 hover:border-zinc-600 transition-colors">
            <span className="text-xl">📄</span>
            <div className="flex flex-col">
                <span className="text-zinc-200">{title}</span>
                <span className="text-[10px] text-zinc-500 uppercase tracking-wider">{type}</span>
            </div>
        </li>
    )
}

function RecorderApp({ onBack }) {
  return (
    <AppScreen title="GRAVADOR" onBack={onBack}>
       <div className="flex flex-col items-center justify-center h-64 gap-4">
            <div className="w-full h-16 bg-zinc-800 flex items-center justify-center rounded">
                <div className="flex gap-1 h-8 items-end">
                    {[...Array(10)].map((_, i) => (
                        <div key={i} className="w-1 bg-red-500 animate-pulse" style={{height: `${Math.random() * 100}%`}}></div>
                    ))}
                </div>
            </div>
            <p className="text-sm text-zinc-300 italic text-center px-4">"Morna. Alguém esteve aqui há minutos."</p>
       </div>
    </AppScreen>
  );
}
