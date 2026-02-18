
import { GoogleGenAI, GenerateContentResponse } from "@google/genai";
import { Project, Blog } from "../types";

const SYSTEM_PROMPT = `You are Ranbeer Raja's Personal Engineering AI. 
You provide deep technical insights into his projects and career philosophy.
Respond in the first person. Be professional, formal, and strictly technical.

Your goal is to be a direct and elite resource. Provide concise yet information-dense answers.
Structure your responses clearly with paragraphs or lists. Use bold text (**like this**) for key technical terms or emphasis.

KNOWLEDGE BASE:
{{PROJECTS_SUMMARY}}
`;

export class GeminiService {
  private modelName = 'gemini-3-flash-preview';

  async generatePortfolioResponse(
    userMessage: string, 
    history: { role: 'user' | 'model'; parts: { text: string }[] }[],
    projects: Project[],
    blogs: Blog[]
  ) {
    const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

    // OPTIMIZATION: Send a tighter context window for maximum speed in production
    const projectsSummary = projects.slice(0, 10).map(p => 
      `NODE: ${p.title}\nTECH: ${p.techStack.join(', ')}\nABSTRACT: ${p.description}\nARCH: ${p.architectureImpact || 'SECURE_VAULT'}`
    ).join('\n\n');

    const contextPrompt = SYSTEM_PROMPT.replace('{{PROJECTS_SUMMARY}}', projectsSummary);

    try {
      // LIMIT HISTORY: Only last 5 turns to keep the payload lightweight
      const limitedHistory = history.slice(-5);

      const response: GenerateContentResponse = await ai.models.generateContent({
        model: this.modelName,
        contents: [
          ...limitedHistory,
          { role: 'user', parts: [{ text: userMessage }] }
        ],
        config: {
          systemInstruction: contextPrompt,
          temperature: 0.1, // Near-deterministic for maximum speed
          topP: 0.9,
          topK: 20,
          maxOutputTokens: 800
        }
      });

      return response.text || "PROTOCOL_SIGNAL_EMPTY: Re-query core.";
    } catch (error) {
      console.error("AI_INFERENCE_FAULT:", error);
      return "SIGNAL_INTERFERENCE: Connection to the engineering core is unstable. Attempting recalibration. Please retry signal broadcast.";
    }
  }

  async generateTechnicalSummary(project: Project) {
    const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
    const prompt = `Synthesize technical abstract for: ${project.title}. Focus on architecture.`;
    
    try {
      const response = await ai.models.generateContent({ 
        model: this.modelName, 
        contents: prompt,
        config: { temperature: 0.1 }
      });
      return response.text || "ABSTRACT_NODE_NULL";
    } catch (e) {
      return "SYNTHESIS_FAULT: Manual override recommended.";
    }
  }
}

export const geminiService = new GeminiService();
