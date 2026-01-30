// src/services/aiService.js
import { GAME_CONTEXT, CAMERA_ANGLES } from "../data/loreData.js";

const GEMINI_API_KEY = import.meta.env?.VITE_GEMINI_API_KEY;

/* =========================
   CONTEXTO DINÂMICO
========================= */
function buildDynamicContext(gameState = {}) {
  const discoveredEvidence = gameState.evidence?.filter(e => e.discovered) || [];
  const deductions = gameState.deductions || [];

  let context = `${GAME_CONTEXT}`;

  if (discoveredEvidence.length) {
    context += `\n\nEVIDÊNCIAS:\n` +
      discoveredEvidence.map(e => `- ${e.name}: ${e.description}`).join("\n");
  }

  if (deductions.length) {
    context += `\n\nHIPÓTESES ATUAIS:\n` +
      deductions.slice(0, 3).map(d => `- ${d.hypothesis}`).join("\n");
  }

  return context;
}

/* =========================
   CHAMADA IA (COM FALLBACK)
========================= */
async function callAI(prompt, systemContext) {
  if (!GEMINI_API_KEY) {
    return "CENTRAL: Sinal instável. Continue investigando. A cena ainda não falou tudo.";
  }

  try {
    const res = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${GEMINI_API_KEY}`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          contents: [{
            role: "user",
            parts: [{ text: `Sistema:\n${systemContext}\n\nUsuário:\n${prompt}` }]
          }],
          generationConfig: {
            temperature: 0.8,
            maxOutputTokens: 400
          }
        })
      }
    );

    const data = await res.json();
    return data?.candidates?.[0]?.content?.parts?.[0]?.text
      || "CENTRAL: Resposta corrompida.";

  } catch {
    return "CENTRAL: Comunicação perdida. Use seus próprios critérios.";
  }
}

/* =========================
   IMAGEM PROCEDURAL
========================= */
export async function generateImage(prompt) {
  const seed = Math.floor(Math.random() * 999999);
  return `https://image.pollinations.ai/prompt/${encodeURIComponent(
    `${prompt}, cinematic noir, grain, low light, realistic`
  )}?seed=${seed}&width=1024&height=768&nologo=true`;
}

/* =========================
   PRÉ-CARREGAMENTO DE CENA
========================= */
export async function preloadChapterAssets(locationId) {
  const angles = CAMERA_ANGLES?.[locationId] || [];
  const assets = {};

  for (const angle of angles) {
    assets[angle.id] = await generateImage(angle.prompt);
    await new Promise(r => setTimeout(r, 400));
  }

  return assets;
}

/* =========================
   CONTEÚDO PROCEDURAL LOCAL
========================= */
export async function generateProceduralContent(areaId, store) {
  return {
    narrative: `[${store?.getFormattedTime?.() ?? "??:??"}] Algo neste local foi alterado.`,
    evidence: {
      id: crypto.randomUUID(),
      name: "Fragmento Corrompido",
      description: "Dados incompletos recuperados do ambiente.",
      discovered: true
    }
  };
}

/* =========================
   PROCESSAMENTO DE DEDUÇÃO
========================= */
export async function processDeduction(selectedEvidence, gameState) {
  if (selectedEvidence.length < 2) {
    return {
      hypothesis: "Dados insuficientes para qualquer conclusão.",
      status: "incompleta"
    };
  }

  const context = buildDynamicContext(gameState);
  const evidenceText = selectedEvidence
    .map(e => `${e.name}: ${e.description}`)
    .join("\n");

  const prompt = `Analise essas evidências:\n${evidenceText}\n\nForneça uma hipótese noir, contida e realista.`;

  const hypothesis = await callAI(prompt, context);

  return {
    hypothesis,
    status: "analisada",
    path: "sistêmica"
  };
}

/* =========================
   DIÁLOGO COM A CENTRAL
========================= */
export async function generateResponse(userText, history, gameState) {
  const context = buildDynamicContext(gameState);
  return await callAI(userText, context);
}
