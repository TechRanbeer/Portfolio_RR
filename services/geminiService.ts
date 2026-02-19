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
  // FIX: 'gemini-3-flash-preview' does not exist. Using a valid model name.
  private modelName = 'gemini-2.0-flash';

  private getClient() {
    // FIX: process.env does not work in Vite. Must use import.meta.env.
    // Ensure your .env file has: VITE_API_KEY=your_key_here
    const apiKey = import.meta.env.VITE_API_KEY;
    if (!apiKey) {
      throw new Error("VITE_API_KEY is not defined. Check your .env file.");
    }
    return new GoogleGenAI({ apiKey });
  }

  async generatePortfolioResponse(
    userMessage: string,
    history: { role: 'user' | 'model'; parts: { text: string }[] }[],
    projects: Project[],
    blogs: Blog[]
  ): Promise<string> {
    const ai = this.getClient();

    const projectsSummary = projects.slice(0, 15).map(p =>
      `NODE: ${p.title}\nPROTOCOLS: ${p.techStack.join(', ')}\nABSTRACT: ${p.description}\nARCH: ${(p as any).architectureImpact || 'SECURE_VOID'}`
    ).join('\n\n');

    const contextPrompt = SYSTEM_PROMPT.replace('{{PROJECTS_SUMMARY}}', projectsSummary);

    try {
      // Clean history: remove empty entries
      let chatHistory = [...history].filter(h => h.parts[0]?.text?.trim() !== "");

      // Ensure history starts with 'user'
      while (chatHistory.length > 0 && chatHistory[0].role !== 'user') {
        chatHistory.shift();
      }

      // The current userMessage is already appended to React state before this call,
      // so it appears at the end of history. Remove it to avoid duplication —
      // sendMessage() will append it as the new user turn.
      if (chatHistory.length > 0 && chatHistory[chatHistory.length - 1].role === 'user') {
        chatHistory.pop();
      }

      // Enforce strict alternating role order required by Gemini API
      const validHistory: typeof chatHistory = [];
      for (const entry of chatHistory) {
        const lastRole = validHistory[validHistory.length - 1]?.role;
        if (entry.role !== lastRole) {
          validHistory.push(entry);
        }
      }

      // Keep last 6 turns for context without bloating the request
      const finalHistory = validHistory.slice(-6);

      const chat = ai.chats.create({
        model: this.modelName,
        config: {
          systemInstruction: contextPrompt,
          temperature: 0.3,
          topP: 0.95,
          maxOutputTokens: 1024,
        },
        history: finalHistory,
      });

      const response: GenerateContentResponse = await chat.sendMessage({
        message: userMessage,
      });

      return response.text || "PROTOCOL_NULL: Re-query signal.";
    } catch (error: any) {
      console.error("AI_INFERENCE_FAULT:", error);
      if (error?.message?.includes('400')) {
        return "SIGNAL_VALIDATION_FAULT: The engineering core rejected the request. Please try again.";
      }
      if (error?.message?.includes('VITE_API_KEY')) {
        return "CONFIG_FAULT: API key is missing. Ensure VITE_API_KEY is set in your .env file.";
      }
      return "SIGNAL_LOST: Connection to the engineering core failed. Please re-initiate sequence.";
    }
  }

  async generateTechnicalSummary(project: Project): Promise<string> {
    const ai = this.getClient();
    const prompt = `Perform a high-level technical audit and synthesis for the system node: ${project.title}. 
    Focus exclusively on architectural integrity and scalability. Provide a formal abstract.`;

    try {
      const response = await ai.models.generateContent({
        model: this.modelName,
        contents: prompt,
        config: { temperature: 0.1 },
      });
      return response.text || "TECHNICAL_ABSTRACT_UNAVAILABLE";
    } catch (e) {
      console.error("SYNTHESIS_FAULT:", e);
      return "SYNTHESIS_FAULT: Manual override required.";
    }
  }
}

export const geminiService = new GeminiService();