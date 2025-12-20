import { GoogleGenAI, Type } from "@google/genai";

// Initialize Gemini Client using the provided API key from environment variables
const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

export interface SearchResult {
  text: string;
  sources: Array<{ title: string; uri: string }>;
}

export interface TransactionRiskAnalysis {
  riskLevel: 'LOW' | 'MEDIUM' | 'HIGH';
  score: number;
  summary: string;
  warnings: string[];
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

/**
 * Simulates and analyzes transaction risk using Gemini.
 * Acts as a pre-signing security layer.
 */
export const analyzeTransactionRisk = async (
  amount: string,
  symbol: string,
  contractAddress: string,
  chain: string
): Promise<TransactionRiskAnalysis> => {
  try {
    const prompt = `
      Act as a sophisticated blockchain transaction simulator and security auditor.
      The user is about to sign a transaction with the following details:
      
      - Action: Presale Contribution / Token Transfer
      - Amount: ${amount} ${symbol}
      - Network: ${chain}
      - Destination Contract: ${contractAddress}
      
      Perform a simulated audit.
      1. Assess the risk of this transaction (Presale contracts are high risk by default if unverified).
      2. Generate a safety score (0 = scam, 100 = verified safe).
      3. Identify potential warnings (e.g., "High gas fees possible", "Smart contract unverified", "Irreversible transaction").
      
      Return a JSON object:
      {
        "riskLevel": "LOW" | "MEDIUM" | "HIGH",
        "score": number,
        "summary": "brief analysis string",
        "warnings": ["warning 1", "warning 2"]
      }
    `;

    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            riskLevel: { type: Type.STRING, enum: ["LOW", "MEDIUM", "HIGH"] },
            score: { type: Type.INTEGER },
            summary: { type: Type.STRING },
            warnings: { type: Type.ARRAY, items: { type: Type.STRING } }
          }
        }
      }
    });

    const text = response.text || "{}";
    const result = JSON.parse(text);
    
    return {
        riskLevel: result.riskLevel || "MEDIUM",
        score: result.score || 50,
        summary: result.summary || "Simulated analysis complete. Proceed with caution.",
        warnings: result.warnings || ["Always verify the contract address."]
    };

  } catch (error) {
    console.error("Error analyzing transaction:", error);
    return {
      riskLevel: "MEDIUM",
      score: 80,
      summary: "AI Audit unavailable. Standard blockchain risks apply.",
      warnings: ["Connection to AI auditor timed out."]
    };
  }
};