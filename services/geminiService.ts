
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
    // The API key is obtained exclusively from process.env.API_KEY per project protocols.
    const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

    // SURGICAL CONTEXT: Only send essential technical headers for maximum speed
    const projectsSummary = projects.slice(0, 15).map(p => 
      `NODE: ${p.title}\nPROTOCOLS: ${p.techStack.join(', ')}\nABSTRACT: ${p.description}\nARCH: ${p.architectureImpact || 'SECURE_VOID'}`
    ).join('\n\n');

    const contextPrompt = SYSTEM_PROMPT.replace('{{PROJECTS_SUMMARY}}', projectsSummary);

    try {
      /**
       * CRITICAL ARCHITECTURAL REQUIREMENT: 
       * Gemini API multi-turn history must strictly alternate roles: user, model, user, model...
       * The history passed to chats.create MUST end with a 'model' turn because 
       * the next 'user' turn is provided via sendMessage().
       */
      let chatHistory = [...history].filter(h => h.parts[0].text.trim() !== "");
      
      // 1. Ensure history starts with 'user'
      while (chatHistory.length > 0 && chatHistory[0].role !== 'user') {
        chatHistory.shift();
      }
      
      // 2. The provided 'userMessage' is often already at the end of 'history' in React state.
      // We must pop it off if it exists to ensure chatHistory ends with a 'model' turn.
      if (chatHistory.length > 0 && chatHistory[chatHistory.length - 1].role === 'user') {
        chatHistory.pop();
      }

      // 3. Ensure the history is strictly alternating (double check)
      const validHistory = [];
      for (let i = 0; i < chatHistory.length; i++) {
        if (i === 0) {
          if (chatHistory[i].role === 'user') validHistory.push(chatHistory[i]);
        } else {
          if (chatHistory[i].role !== validHistory[validHistory.length - 1].role) {
            validHistory.push(chatHistory[i]);
          }
        }
      }

      // Maintain context while optimizing for latency
      const finalHistory = validHistory.slice(-6);

      // Initialize Chat session
      const chat = ai.chats.create({
        model: this.modelName,
        config: {
          systemInstruction: contextPrompt,
          temperature: 0.3,
          topP: 0.95,
          maxOutputTokens: 1024
        },
        history: finalHistory
      });

      // sendMessage correctly appends the new user turn to the validated history
      const response: GenerateContentResponse = await chat.sendMessage({
        message: userMessage
      });

      return response.text || "PROTOCOL_NULL: Re-query signal.";
    } catch (error: any) {
      console.error("AI_INFERENCE_FAULT:", error);
      // Detailed logging for production debugging
      if (error?.message?.includes('400')) {
        return "SIGNAL_VALIDATION_FAULT: The engineering core rejected the turn order. Retrying sequence...";
      }
      return "SIGNAL_LOST: Connection to the engineering core failed. Please re-initiate sequence.";
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
