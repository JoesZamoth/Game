// src/aiService.js - VERSÃO UNIFICADA E ROBUSTA
import { GAME_CONTEXT, CAMERA_ANGLES } from "./data/loreData.js";

/* =========================
   ⚙️ CONFIGURAÇÃO & CONSTANTES
========================= */
// Lê do .env ou usa valores padrão ultra-compatíveis
const GEMINI_API_KEY = import.meta.env?.VITE_GEMINI_API_KEY;
const GEMINI_MODEL = import.meta.env?.VITE_GEMINI_MODEL || 'gemini-pro'; // Mudado para 'pro' por estabilidade
const ENABLE_IMAGEN = true; 

const CONFIG = {
  maxRetries: 2, // Reduzido para falhar mais rápido e ir pro fallback
  retryDelay: 1000,
  timeout: 25000,
  maxCacheSize: 100,
  
  // Estilo visual padrão para manter consistência
  visualStyle: "cyberpunk noir style, dark atmosphere, cinematic lighting, realistic 8k, detective office aesthetic, gold and black palette, unreal engine 5 render, detailed textures"
};

/* =========================
   💾 SISTEMA DE CACHE
========================= */
class SmartCache {
  constructor(maxSize) {
    this.cache = new Map();
    this.maxSize = maxSize;
  }

  get(key) { return this.cache.get(key); }
  
  set(key, value, ttl = 300000) { // 5 min padrão
    if (this.cache.size >= this.maxSize) this.cache.delete(this.cache.keys().next().value);
    this.cache.set(key, { data: value, expiry: Date.now() + ttl });
  }

  isValid(key) {
    const item = this.cache.get(key);
    return item && Date.now() < item.expiry;
  }
  
  clear() { this.cache.clear(); }
}

const textCache = new SmartCache(CONFIG.maxCacheSize);
const imageCache = new SmartCache(50); 

const wait = (ms) => new Promise(resolve => setTimeout(resolve, ms));

/* =========================
   🌐 FETCH COM RESILIÊNCIA
========================= */
async function fetchWithRetry(url, options, retries = CONFIG.maxRetries) {
  for (let i = 0; i < retries; i++) {
    try {
      const response = await fetch(url, options);
      
      // Se for erro 404 (Modelo não encontrado), não adianta tentar de novo
      if (response.status === 404) throw new Error("MODEL_NOT_FOUND");
      
      if (response.ok) return response;
      
      if (response.status === 429) { // Rate limit (muitos pedidos)
        await wait(CONFIG.retryDelay * (i + 1));
        continue;
      }
      
      throw new Error(`HTTP ${response.status}`);
    } catch (err) {
      if (err.message === "MODEL_NOT_FOUND") throw err; // Repassa erro fatal
      if (i === retries - 1) throw err;
      await wait(CONFIG.retryDelay);
    }
  }
}

/* =========================
   🧠 CONTEXTO & TEXTO (Gemini)
========================= */
function buildDynamicContext(gameState = {}) {
  const evidence = gameState.evidence?.filter(e => e.discovered) || [];
  const deductions = gameState.deductions || [];
  
  let context = GAME_CONTEXT;
  
  if (evidence.length) {
    context += `\n\n[SISTEMA] EVIDÊNCIAS NO INVENTÁRIO:\n${evidence.map(e => `- ${e.name}: ${e.description}`).join("\n")}`;
  }
  if (deductions.length) {
    context += `\n\n[SISTEMA] HIPÓTESES JÁ FORMULADAS:\n${deductions.slice(0, 3).map(d => `- ${d.hypothesis}`).join("\n")}`;
  }
  
  return context;
}

async function callAI(prompt, systemContext) {
  if (!GEMINI_API_KEY) return "SISTEMA: [ERRO CRÍTICO] Chave de API não configurada. Verifique o arquivo .env";

  const cacheKey = `text_${prompt.slice(0, 30)}_${systemContext.length}`;
  if (textCache.isValid(cacheKey)) return textCache.get(cacheKey).data;

  try {
    const response = await fetchWithRetry(
      `https://generativelanguage.googleapis.com/v1beta/models/${GEMINI_MODEL}:generateContent?key=${GEMINI_API_KEY}`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          contents: [{ role: "user", parts: [{ text: `CONTEXTO DO JOGO:\n${systemContext}\n\nJOGADOR:\n${prompt}` }] }],
          generationConfig: { temperature: 0.7, maxOutputTokens: 350 }
        })
      }
    );

    const data = await response.json();
    const result = data.candidates?.[0]?.content?.parts?.[0]?.text || "SISTEMA: [DADOS CORROMPIDOS] Não foi possível decodificar a resposta.";
    
    textCache.set(cacheKey, result);
    return result;

  } catch (error) {
    console.error("Erro IA:", error);
    if (error.message === "MODEL_NOT_FOUND") {
      return `SISTEMA: Erro de Configuração. O modelo '${GEMINI_MODEL}' não está disponível para sua chave. Tente usar 'gemini-pro' no .env.`;
    }
    return "OPERADOR 07: [SINAL FRACO] Eduardo, estou perdendo a conexão... Tente de novo.";
  }
}

/* =========================
   🎨 GERAÇÃO DE IMAGEM (Híbrido Inteligente)
========================= */
export async function generateImage(prompt) {
  const cacheKey = `img_${prompt}`;
  if (imageCache.isValid(cacheKey)) return imageCache.get(cacheKey).data;

  // 1. TENTATIVA: Google Imagen (Se configurado)
  if (ENABLE_IMAGEN && GEMINI_API_KEY) {
    try {
      // Tenta usar o modelo configurado ou um fallback comum
      const model = import.meta.env?.VITE_IMAGEN_MODEL || 'imagen-3.0-generate-001';
      
      const response = await fetch(
        `https://generativelanguage.googleapis.com/v1beta/models/${model}:predict?key=${GEMINI_API_KEY}`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            instances: [{ prompt: `${prompt}, ${CONFIG.visualStyle}` }],
            parameters: { sampleCount: 1 }
          })
        }
      );
      
      if (response.ok) {
        const data = await response.json();
        if (data.predictions?.[0]?.bytesBase64Encoded) {
          const url = `data:image/png;base64,${data.predictions[0].bytesBase64Encoded}`;
          imageCache.set(cacheKey, url, 3600000); // 1 hora
          return url;
        }
      }
    } catch (e) {
      console.warn("Imagen indisponível, mudando para Pollinations.");
    }
  }

  // 2. FALLBACK SEGURO: Pollinations.ai (Gratuito e sempre funciona)
  const seed = Math.floor(Math.random() * 99999);
  const safePrompt = encodeURIComponent(`${prompt} ${CONFIG.visualStyle}`);
  // Usamos nologo=true e model=flux para melhor qualidade
  const url = `https://image.pollinations.ai/prompt/${safePrompt}?width=1024&height=768&seed=${seed}&nologo=true&model=flux`;
  
  imageCache.set(cacheKey, url, 1800000); // 30 min
  return url;
}

/* =========================
   📦 EXPORTAÇÕES (API DO JOGO)
========================= */

// 1. Chat
export async function generateResponse(userQuery, history, gameState) {
  const dynamicContext = buildDynamicContext(gameState);
  
  // Constrói um mini-histórico para a IA ter contexto da conversa recente
  let conversation = "";
  if (history && history.length > 0) {
    conversation = history.slice(-3).map(m => `${m.role === 'user' ? 'EDUARDO' : 'OPERADOR'}: ${m.text}`).join("\n");
  }
  
  const fullPrompt = `${conversation}\nEDUARDO: ${userQuery}\nOPERADOR:`;
  return await callAI(fullPrompt, dynamicContext);
}

// 2. Dedução
export async function processDeduction(evidenceList, gameState) {
  const evidenceText = evidenceList.map(e => `${e.name}: ${e.description}`).join("\n");
  const prompt = `Analise estas evidências combinadas e crie uma hipótese Noir curta e misteriosa sobre o que aconteceu:\n${evidenceText}`;
  
  const hypothesis = await callAI(prompt, buildDynamicContext(gameState));
  return { hypothesis, status: 'analisada', path: 'systemic' };
}

// 3. Conteúdo Procedural (Simples)
export async function generateProceduralContent(type) {
  return generateImage("Cenário investigativo escuro e misterioso");
}

// 4. Preloader de Câmeras (Carregamento de Imagens)
export async function preloadChapterAssets(locationId, onProgress) {
  const angles = CAMERA_ANGLES?.[locationId] || [];
  const assets = {};
  
  console.log(`📸 Carregando câmeras para: ${locationId}`);

  for (let i = 0; i < angles.length; i++) {
    const angle = angles[i];
    
    // Prompt otimizado para cenários
    const prompt = `first person view inside a ${locationId} room, looking ${angle.name}, cyberpunk noir atmosphere, detailed environment`;
    
    // Gera a imagem (o cache evita recarregar se já existir)
    assets[angle.id] = await generateImage(prompt);
    
    // Notifica progresso
    if (onProgress) {
      onProgress({
        current: i + 1,
        total: angles.length,
        percentage: Math.round(((i + 1) / angles.length) * 100)
      });
    }
    
    // Pequeno delay para não engasgar a UI
    await wait(50); 
  }
  
  return assets;
}