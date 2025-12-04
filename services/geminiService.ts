import { GoogleGenAI } from "@google/genai";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

export const getPlanetFact = async (planetName: string): Promise<string> => {
  try {
    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: `Tell me a fascinating, scientific, yet brief (under 50 words) fact about the planet ${planetName} that most people don't know. Keep it engaging.`,
    });
    return response.text || `Could not retrieve data for ${planetName}.`;
  } catch (error) {
    console.error("Gemini API Error:", error);
    return "Gemini is currently offline or unreachable.";
  }
};