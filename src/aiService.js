
// src/aiService.js - Motor de IA Humanizado com Pré-carregamento de Capítulo
import { GAME_CONTEXT, CAMERA_ANGLES } from './data/loreData.js';

const GEMINI_API_KEY = import.meta.env?.VITE_GEMINI_API_KEY;
const GEMINI_IMAGE_KEY = import.meta.env?.VITE_GEMINI_IMAGE_KEY || GEMINI_API_KEY;

/**
 * Contexto dinâmico que evolui com base nas descobertas do jogador
 */
function buildDynamicContext(gameState) {
  const discoveredEvidence = gameState.evidence?.filter(e => e.discovered) || [];
  const deductionCount = gameState.deductions?.length || 0;
  
  let contextLayer = GAME_CONTEXT;
  
  if (discoveredEvidence.length > 0) {
    contextLayer += `\n\nEVIDENCIA DESCOBERTA:\n${discoveredEvidence.map(e => `- ${e.name}: ${e.description}`).join('\n')}`;
  }
  
  if (deductionCount > 0) {
    contextLayer += `\n\nEDUARDO JA SABE:\n- ${gameState.deductions?.slice(0, 3).map(d => d.hypothesis).join('\n- ')}`;
  }
  
  return contextLayer;
}

async function callAI(prompt, systemPrompt = GAME_CONTEXT) {
  if (!GEMINI_API_KEY) {
    console.warn("VITE_GEMINI_API_KEY não configurada. Usando modo de simulação local.");
    return "OPERADOR 07: Eduardo, o sinal tá uma porcaria aqui, mas eu tô te vendo. Continua vasculhando o escritório, deve ter mais coisa escondida por aí.";
  }

  const GEMINI_URL = `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${GEMINI_API_KEY}`;

  try {
    const response = await fetch(GEMINI_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        contents: [
          { role: "user", parts: [{ text: `System: ${systemPrompt}\n\nUser: ${prompt}` }] }
        ],
        generationConfig: { temperature: 0.85, maxOutputTokens: 400 }
      })
    });

    if (!response.ok) throw new Error("Erro na API de IA");
    const data = await response.json();
    return data.candidates[0].content.parts[0].text;
  } catch (error) {
    console.error("Erro na IA:", error);
    return "OPERADOR 07: Droga, Eduardo! O sinal caiu de vez. Tenta se virar aí enquanto eu reseto essa antena maldita.";
  }
}

/**
 * Gerador de imagem via Gemini API com fallback para Pollinations
 */
export async function generateImage(prompt) {
  const fullPrompt = `${prompt}, ultra realistic, 8k, cinematic lighting, detective noir photography, grainy film style, original artwork`;
  
  try {
    const seed = Math.floor(Math.random() * 1000000);
    const encodedPrompt = encodeURIComponent(fullPrompt);
    return `https://image.pollinations.ai/prompt/${encodedPrompt}?seed=${seed}&width=1024&height=768&nologo=true&model=flux`;
    
  } catch (error) {
    console.error("Erro na geração de imagem:", error);
    return "https://via.placeholder.com/1024x768/000000/d4af37?text=ERRO+DE+SINCRONIZACAO+VISUAL";
  }
}

/**
 * Pré-carrega todas as imagens de um capítulo/cenário
 * Retorna um mapa de { angle: imageUrl }
 */
export async function preloadChapterAssets(locationId) {
  const angles = CAMERA_ANGLES[locationId] || [];
  const assets = {};
  
  for (const angle of angles) {
    try {
      const imageUrl = await generateImage(angle.prompt);
      assets[angle.id] = imageUrl;
      // Pequeno delay para evitar rate limiting
      await new Promise(r => setTimeout(r, 500));
    } catch (error) {
      console.error(`Erro ao pré-carregar ângulo ${angle.id}:`, error);
      assets[angle.id] = "https://via.placeholder.com/1024x768/000000/d4af37?text=ERRO";
    }
  }
  
  return assets;
}

export async function generateProceduralContent(type, context) {
  const { locationId } = context;
  if (type === 'scenario_image') {
    const visualPrompt = `realistic dark interior of ${locationId}, messy detective office, cyberpunk noir, volumetric lighting, high detail, original artwork`;
    return await generateImage(visualPrompt);
  }
  return null;
}

export async function processDeduction(selectedEvidence, gameState) {
  const evidenceData = selectedEvidence.map(e => `${e.name}: ${e.detailedDescription || e.description}`).join("\n");
  const dynamicContext = buildDynamicContext(gameState);
  
  const prompt = `Eduardo está analisando isso:\n${evidenceData}\n\nComo Operador 07, dê um palpite realista e noir sobre o que isso significa, sem ser óbvio demais. Seja conciso e misterioso.`;
  
  const hypothesis = await callAI(prompt, dynamicContext);
  return { hypothesis, status: 'analisada', path: 'systemic' };
}

export async function generateResponse(userQuery, history, gameState) {
  const dynamicContext = buildDynamicContext(gameState);
  const systemPrompt = `${dynamicContext}\n\nEduardo perguntou: ${userQuery}`;
  return await callAI(userQuery, systemPrompt);
}
