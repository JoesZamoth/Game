
import { OpenAI } from 'openai';

const client = new OpenAI();

async function testGemini() {
  console.log("Testando conexão com Gemini via SDK OpenAI...");
  try {
    const response = await client.chat.completions.create({
      model: "gpt-4.1-mini", // Usando o modelo disponível no ambiente
      messages: [
        { role: "system", content: "Você é um assistente de teste." },
        { role: "user", content: "Olá, responda com 'CONECTADO'." }
      ],
    });

    console.log("Resposta da IA:", response.choices[0].message.content);
  } catch (error) {
    console.error("Erro ao conectar com a IA:", error);
  }
}

testGemini();
