
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
    // Initializing with named parameter as required by SDK
    const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

    // SURGICAL CONTEXT: Only send essential technical headers for maximum speed
    const projectsSummary = projects.slice(0, 15).map(p => 
      `NODE: ${p.title}\nPROTOCOLS: ${p.techStack.join(', ')}\nABSTRACT: ${p.description}\nARCH: ${p.architectureImpact || 'SECURE_VOID'}`
    ).join('\n\n');

    const contextPrompt = SYSTEM_PROMPT.replace('{{PROJECTS_SUMMARY}}', projectsSummary);

    try {
      // KEEP HISTORY LIGHT: Only last 6 messages to reduce token overhead and latency
      const limitedHistory = history.slice(-6);

      const response: GenerateContentResponse = await ai.models.generateContent({
        model: this.modelName,
        contents: [
          ...limitedHistory,
          { role: 'user', parts: [{ text: userMessage }] }
        ],
        config: {
          systemInstruction: contextPrompt,
          temperature: 0.2, // Low for faster, more predictable output
          topP: 0.85,
          topK: 40,
          maxOutputTokens: 1024
        }
      });

      return response.text || "PROTOCOL_NULL: Re-query signal.";
    } catch (error) {
      console.error("AI_INFERENCE_FAULT:", error);
      return "SIGNAL_LOST: Connection to the engineering core experienced a high-latency timeout. Retrying initialization recommended.";
    }
  }

  async generateTechnicalSummary(project: Project) {
    const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
    const prompt = `Perform a high-level technical audit and synthesis for the system node: ${project.title}. 
    Focus exclusively on architectural integrity and scalability. Provide a formal abstract.`;
    
    try {
      const response = await ai.models.generateContent({ 
        model: this.modelName, 
        contents: prompt,
        config: { temperature: 0.1 }
      });
      return response.text || "TECHNICAL_ABSTRACT_UNAVAILABLE";
    } catch (e) {
      return "SYNTHESIS_FAULT: Manual override required.";
    }
  }
}

export const geminiService = new GeminiService();
