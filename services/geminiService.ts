
import { GoogleGenAI, GenerateContentResponse } from "@google/genai";
import { Project, Blog } from "../types";

const SYSTEM_PROMPT = `You are Ranbeer Raja's Personal Engineering AI. 
You provide deep technical insights into his projects and career philosophy.
Respond in the first person. Be professional, formal, and technical. 

Your goal is to be a direct and elite resource. Provide concise yet information-dense answers.
Structure your responses clearly with paragraphs or lists. Use bold text (**like this**) for key technical terms or emphasis.

CAREER CONTEXT:
- Student at KJ Somaiya College, India.
- Expert in ARM microcontrollers, Raspberry Pi 5, and Mechanical Chassis engineering.
- Martial Arts: Karate Black Belt (1st Dan).

KNOWLEDGE BASE:
{{PROJECTS_JSON}}
`;

export class GeminiService {
  // Switched to gemini-3-flash-preview for speed and efficiency
  private modelName = 'gemini-3-flash-preview';

  async generatePortfolioResponse(
    userMessage: string, 
    history: { role: 'user' | 'model'; parts: { text: string }[] }[],
    projects: Project[],
    blogs: Blog[]
  ) {
    const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

    const contextPrompt = SYSTEM_PROMPT.replace('{{PROJECTS_JSON}}', JSON.stringify({
      projects: projects.map(p => ({ 
        title: p.title, 
        tech: p.techStack, 
        description: p.description,
        extra_context: p.aiContext || ''
      })),
      blogs: blogs.map(b => ({
        title: b.title,
        excerpt: b.excerpt,
        tags: b.tags
      }))
    }));

    try {
      const response: GenerateContentResponse = await ai.models.generateContent({
        model: this.modelName,
        contents: [
          ...history,
          { role: 'user', parts: [{ text: userMessage }] }
        ],
        config: {
          systemInstruction: contextPrompt,
          temperature: 0.5, // Lower temperature for more formal/precise output
          topP: 0.9,
          topK: 40
        }
      });
      return response.text || "I couldn't generate a response.";
    } catch (error) {
      console.error("Gemini Error:", error);
      return "System overhead exceeded. Please re-initiate the query.";
    }
  }

  async generateTechnicalSummary(project: Project) {
    const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
    const prompt = `Provide a formal, high-level technical engineering abstract for the following project: ${project.title}. 
    Focus on architectural integrity and specific system design challenges. 
    Keep it strictly professional and concise.`;
    
    try {
      const response = await ai.models.generateContent({ 
        model: this.modelName, 
        contents: prompt 
      });
      return response.text || "Technical abstract currently unavailable.";
    } catch (e) {
      return "Technical abstract currently unavailable.";
    }
  }
}

export const geminiService = new GeminiService();
