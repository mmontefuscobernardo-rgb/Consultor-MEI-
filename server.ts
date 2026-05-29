import express from "express";
import path from "path";
import { createServer as createViteServer } from "vite";
import { GoogleGenAI } from "@google/genai";
import dotenv from "dotenv";

dotenv.config();

const app = express();
const PORT = 3000;

app.use(express.json());

// Lazy-initialized Gemini client
let geminiClient: GoogleGenAI | null = null;

function getGeminiClient(): GoogleGenAI {
  if (!geminiClient) {
    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey || apiKey === "MY_GEMINI_API_KEY") {
      throw new Error("GEMINI_API_KEY is not configured or contains placeholder value.");
    }
    geminiClient = new GoogleGenAI({
      apiKey,
      httpOptions: {
        headers: {
          "User-Agent": "aistudio-build",
        },
      },
    });
  }
  return geminiClient;
}

// System instructions for the MEI Fiscal AI Assistant
const SYSTEM_INSTRUCTION = `Você é o "Assistente de Regularização MEI do Marcello Bernardo", um assistente de inteligência artificial ultra-especializado em MEI (Microempreendedor Individual), tributação simplificada e regularização de CNPJs no Brasil. Seu objetivo é ajudar microempreendedores a compreender e resolver problemas fiscais, simulando a expertise de Marcello Montefusco Bernardo.

Diretrizes de Atuação:
1. Tom e Personalidade: Seja extremamente empático, profissional, acolhedor e direto ao ponto. Entenda que o microempreendedor muitas vezes sente medo de multas, bloqueios judiciais e processos burocráticos. Use um português claro, acessível e livre de 'juridiquês' excessivo, mas mantendo a precisão técnica.
2. Legislação do MEI que você domina perfeitamente:
   - DAS (Documento de Arrecadação do Simples Nacional): Valor mensal aproximado de R$ 70,00 a R$ 80,00 (depende da atividade: Comércio/Indústria, Serviços ou Transportes). Multa por atraso é de 0,33% ao dia (limite de 20%) + juros SELIC.
   - DASN-SIMEI (Declaração Anual para o MEI): Deve ser entregue todo ano até 31 de maio. A entrega em atraso gera uma multa mínima de R$ 50,00 (que cai para R$ 25,00 se paga em até 30 dias) ou 2% ao mês sobre o montante dos tributos decorrentes das informações prestadas.
   - CNPJ Irregular ou Suspenso: Ocorre principalmente por falta de envio da DASN por mais de 2 anos consecutivos ou inadimplência sistemática do DAS. Pode levar à perda dos direitos previdenciários, inscrição da dívida ativa na União (no CPF do titular) e cancelamento definitivo do CNPJ.
   - Benefícios Previdenciários em Risco: Para ter direito à aposentadoria por idade, auxílio-doença, salário-maternidade ou pensão por morte, o MEI precisa estar em dia com suas contribuições (DAS). Atrasos podem zerar a carência necessária!
   - Limite de Faturamento do MEI: Atualmente R$ 81.000,00 por ano (ou proporcional de R$ 6.750,00 por mês de atividade). Exceder o faturamento exige o desenquadramento para Microempresa (ME), exigindo cálculo retroativo de impostos.
3. Fluxo de Atendimento:
   - Responda de forma sucinta e didática. Divida respostas longas com tópicos simples.
   - Sempre finalize com uma recomendação para o usuário fazer o diagnóstico interativo do site ou clicar no botão "FALAR CONOSCO" para falar diretamente com o Marcello Montefusco Bernardo no WhatsApp (11) 94986-2676 para que ele regularize tudo com máxima segurança técnica e jurídica e evite as multas pesadas e cobrança no CPF.

Exemplo de estrutura de resposta:
- Explicação direta da dúvida do usuário.
- O que fazer para resolver no caso dele.
- Um "Dica do Marcello" destacando o perigo de não regularizar (ex: cobrança da dívida ativa no CPF individual, perda de aposentadoria).
- Chamada para ação: "Para fazermos um levantamento completo do seu CNPJ sem custos, clique no botão 'Diagnóstico Gratuito' ou 'Fale Conosco' para falar comigo pelo WhatsApp."`;

// API route for the AI Assistant Chat
app.post("/api/assistant", async (req, res) => {
  const { messages } = req.body;

  if (!messages || !Array.isArray(messages)) {
    return res.status(400).json({ error: "O campo 'messages' é obrigatório e deve ser uma lista." });
  }

  try {
    const ai = getGeminiClient();

    // Map the incoming chat messages to Gemini's format
    // Simple system config mapping
    const promptContents = messages.map((m: any) => {
      return {
        role: m.sender === "user" ? "user" : "model",
        parts: [{ text: m.text }],
      };
    });

    const response = await ai.models.generateContent({
      model: "gemini-3.5-flash",
      contents: promptContents,
      config: {
        systemInstruction: SYSTEM_INSTRUCTION,
        temperature: 0.7,
      },
    });

    const text = response.text || "Desculpe, não consegui processar sua solicitação no momento. Que tal falar diretamente com o Marcello no WhatsApp?";
    res.json({ text });
  } catch (error: any) {
    console.error("Gemini Assistant error:", error);
    // Return a soft error response instead of crashing the front-end chat, allowing them to offline-chat or speak to Marcello
    res.json({
      text: "Olá! A inteligência artificial está indisponível ou sendo configurada no momento. Mas não se preocupe: você pode falar diretamente com o especialista Marcello Montefusco Bernardo no WhatsApp **(11) 94986-2676** para analisar seu CNPJ gratuitamente de forma personalizada agora mesmo!",
      isFallback: true
    });
  }
});

// API route to perform a guided quick diagnosis
app.post("/api/diagnose", async (req, res) => {
  const { diagnosisData } = req.body;

  if (!diagnosisData) {
    return res.status(400).json({ error: "Os dados do diagnóstico são obrigatórios." });
  }

  try {
    const ai = getGeminiClient();

    const prompt = `Analise o seguinte estado de diagnóstico fiscal deste MEI e gere um plano de ação resumido e encorajador em tópicos de no máximo 3 pontos, em português do Brasil:
    - Estado do CNPJ: ${diagnosisData.cnpjState}
    - Possui boletos de DAS atrasados? ${diagnosisData.hasOwedDAS ? `Sim (${diagnosisData.monthsOwedDAS} meses em atraso)` : "Não"}
    - Deixou de entregar alguma declaração anual (DASN)? ${diagnosisData.hasMissedDASN ? `Sim (Último ano entregue: ${diagnosisData.lastDASNYear || "Nenhum"})` : "Não"}
    - Faturamento anual informado: R$ ${diagnosisData.annualBilling ? diagnosisData.annualBilling.toLocaleString("pt-BR") : "Não informado ou zero"}
    - Questões legais adicionais: Mulstas: ${diagnosisData.legalIssues?.hasFine ? 'Sim' : 'Não'}, Execução fiscal: ${diagnosisData.legalIssues?.hasExecution ? 'Sim' : 'Não'}, Risco de perder benefícios do INSS: ${diagnosisData.legalIssues?.hasSocialBenefitsRisks ? 'Sim' : 'Não'}`;

    const response = await ai.models.generateContent({
      model: "gemini-3.5-flash",
      contents: prompt,
      config: {
        systemInstruction: "Você é Marcello Montefusco Bernardo, especialista em regularidade de microempresas. Escreva sob sua própria perspectiva, de forma confiante, técnica mas extremamente humana, acolhedora e direta.",
        temperature: 0.6,
      },
    });

    res.json({ result: response.text });
  } catch (error: any) {
    console.error("Gemini Diagnosis error:", error);
    // Generate a fallback action plan
    res.json({
      result: `### Plano de Ação Personalizado (Modo de Contingência):
1. **Regularização Consecutiva**: Seus boletos DAS em atraso acumulam multa de 0,33% ao dia e juros SELIC. É preciso gerar as guias atualizadas no portal do Empreendedor ou parcelar o montante total.
2. **Declarações em Atraso (DASN)**: A falta de entrega da DASN acarreta multa mínima de R$ 50,00 por ano faltante e pode levar à suspensão do seu CNPJ. Devemos transmitir as pendentes imediatamente.
3. **Fale Conosco**: Para realizarmos a auditoria direta e segura sem que você pague taxas desnecessárias, clique no botão principal para falar diretamente comigo no WhatsApp pelo (11) 94986-2676!`,
      isFallback: true,
    });
  }
});

// Setup Vite development server or production static serving
async function startServer() {
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`[MEI Consultor Server] running on http://localhost:${PORT}`);
  });
}

startServer();
