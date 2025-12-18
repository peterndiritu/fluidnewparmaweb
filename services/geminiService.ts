
import { GoogleGenAI } from "@google/genai";

// Initialize Gemini Client using the provided API key from environment variables
const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

export interface SearchResult {
  text: string;
  sources: Array<{ title: string; uri: string }>;
}

/**
 * Generates text response using Gemini 3 Flash with Google Search Grounding.
 * @param prompt The user's question or prompt
 * @returns Object containing text response and grounding metadata
 */
export const generateTextWithSearch = async (prompt: string): Promise<SearchResult> => {
  try {
    // Calling generateContent with the correct model and Google Search tool
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: prompt,
      config: {
        tools: [{ googleSearch: {} }],
      },
    });

    // Accessing text as a property of the response object
    const text = response.text || "No response generated.";
    const groundingChunks = response.candidates?.[0]?.groundingMetadata?.groundingChunks || [];
    
    // Extract sources from grounding metadata chunks
    const sources = groundingChunks
      .map((chunk: any) => {
        if (chunk.web) {
          return { title: chunk.web.title || "Source", uri: chunk.web.uri || "#" };
        }
        return null;
      })
      .filter((source: any) => source !== null);

    return { text, sources };

  } catch (error) {
    console.error("Error generating text with search:", error);
    return { text: "An error occurred while fetching the response.", sources: [] };
  }
};
