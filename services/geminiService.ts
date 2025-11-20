import { GoogleGenAI } from "@google/genai";
import { Asset, AIAnalysisType } from "../types";
import { GEMINI_MODEL_FLASH } from "../constants";

// Initialize Gemini Client
// Note: process.env.API_KEY is assumed to be injected by the environment.
const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

export const getPortfolioAnalysis = async (assets: Asset[], type: AIAnalysisType): Promise<string> => {
  const portfolioSummary = assets.map(a => 
    `${a.amount} ${a.symbol} ($${(a.amount * a.price).toFixed(2)})`
  ).join(', ');

  const totalValue = assets.reduce((acc, curr) => acc + (curr.amount * curr.price), 0);

  let prompt = "";
  let systemInstruction = "You are MoonBot, a cynical, meme-loving crypto degen AI assistant. You speak in crypto slang (WAGMI, NGMI, HODL, FUD, Rekt, Diamond Hands). Keep it short, punchy, and entertaining.";

  switch (type) {
    case AIAnalysisType.ROAST:
      prompt = `Roast this crypto portfolio specifically. Be harsh but funny. Tell them why they are NGMI (Not Gonna Make It) or why their bags are heavy. Total Value: $${totalValue}. Holdings: ${portfolioSummary}.`;
      break;
    case AIAnalysisType.HYPE:
      prompt = `Hype up this portfolio! Tell them why they are going to the moon. Use lots of rocket emojis. Validate their bias. Total Value: $${totalValue}. Holdings: ${portfolioSummary}.`;
      break;
    case AIAnalysisType.PREDICTION:
      prompt = `Give a wild, speculative prediction for one of these coins based on 'astrology' or 'vibes'. Don't give actual financial advice, make it sound like a mystic vision. Holdings: ${portfolioSummary}.`;
      break;
  }

  try {
    const response = await ai.models.generateContent({
      model: GEMINI_MODEL_FLASH,
      contents: prompt,
      config: {
        systemInstruction: systemInstruction,
        temperature: 1.2, // High temperature for creative/crazy output
      }
    });

    return response.text || "Err... disconnected from the blockchain. Try again.";
  } catch (error) {
    console.error("Gemini API Error:", error);
    return "System error: The whales are manipulating the API. Try again later.";
  }
};
