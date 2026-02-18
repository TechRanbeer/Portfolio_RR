
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
       * Gemini API multi-turn history must strictly start with a 'user' turn.
       * We filter the provided history to strip leading assistant greetings
       * and ensure valid alternating turn order.
       */
      let chatHistory = [...history].filter(h => h.parts[0].text.trim() !== "");
      
      // Trim history until it starts with a 'user' turn to avoid 400 Bad Request errors
      while (chatHistory.length > 0 && chatHistory[0].role !== 'user') {
        chatHistory.shift();
      }
      
      // Maintain context while optimizing for latency and token cost
      chatHistory = chatHistory.slice(-8);

      // Using the dedicated Chat API for superior turn management and state consistency
      const chat = ai.chats.create({
        model: this.modelName,
        config: {
          systemInstruction: contextPrompt,
          temperature: 0.25,
          topP: 0.9,
          topK: 40,
          maxOutputTokens: 1024
        },
        history: chatHistory
      });

      // sendMessage handles the runtime injection of the new user prompt into the session history
      const response: GenerateContentResponse = await chat.sendMessage({
        message: userMessage
      });

      return response.text || "PROTOCOL_NULL: Re-query signal.";
    } catch (error) {
      console.error("AI_INFERENCE_FAULT:", error);
      return "SIGNAL_LOST: Connection to the engineering core experienced a high-latency timeout or validation fault. Ensure history starts with a user turn.";
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
