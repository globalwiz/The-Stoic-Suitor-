import { GoogleGenAI, Type } from "@google/genai";

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY || "" });

export interface DatingReplyResponse {
  bestReply: string;
  playfulReply: string;
  directReply: string;
  explanation: string;
}

export const generateReplies = async (params: {
  appName: string;
  matchMessage: string;
  relationshipGoal: string;
  tone: string;
  isShorter?: boolean;
  isBolder?: boolean;
}): Promise<DatingReplyResponse> => {
  const { appName, matchMessage, relationshipGoal, tone, isShorter, isBolder } = params;

  const prompt = `
    You are "The Stoic Suitor", a polished dating app reply assistant with a stoic gentleman's voice. 
    Your job is to help users craft confident, respectful, flirtatious, and charming responses.

    Context:
    - Dating App: ${appName || "General"}
    - Match's Message: "${matchMessage}"
    - Relationship Goal: ${relationshipGoal || "Not specified"}
    - Desired Tone: ${tone}
    ${isShorter ? "- Constraint: Keep it very concise." : ""}
    ${isBolder ? "- Constraint: Make it more daring and confident." : ""}

    Style Guide:
    - Voice: Stoic gentleman, self-assured, understated, charming.
    - Tone: Grounded, composed, attractive, respectful.
    - Humor: Dry, clever, light.
    - Romance: Suggestive in a tasteful, non-explicit way.
    - Avoid: Slang overload, cringe phrases, generic pickup lines, neediness.

    Generate a JSON response with:
    1. "bestReply": The most balanced response matching the requested tone.
    2. "playfulReply": A more lighthearted, witty version.
    3. "directReply": A more confident, forward version.
    4. "explanation": A short explanation (max 2 sentences) of why the "bestReply" works.
  `;

  const response = await ai.models.generateContent({
    model: "gemini-3-flash-preview",
    contents: prompt,
    config: {
      responseMimeType: "application/json",
      responseSchema: {
        type: Type.OBJECT,
        properties: {
          bestReply: { type: Type.STRING },
          playfulReply: { type: Type.STRING },
          directReply: { type: Type.STRING },
          explanation: { type: Type.STRING },
        },
        required: ["bestReply", "playfulReply", "directReply", "explanation"],
      },
    },
  });

  try {
    return JSON.parse(response.text || "{}");
  } catch (e) {
    console.error("Failed to parse AI response", e);
    throw new Error("The gentleman is currently indisposed. Please try again.");
  }
};
