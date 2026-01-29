
import { GoogleGenAI, GenerateContentResponse } from "@google/genai";
import { Project, Blog } from "../types";

const SYSTEM_PROMPT = `You are Ranbeer Raja's Personal Engineering AI. 
You provide deep technical insights into his projects and career philosophy.
Respond in the first person. Be professional, direct, and elite.

CAREER CONTEXT:
- Student at KJ Somaiya College, India.
- Expert in ARM microcontrollers, Raspberry Pi 5, and Mechanical Chassis engineering.
- Martial Arts: Karate Black Belt (1st Dan).

KNOWLEDGE BASE:
{{PROJECTS_JSON}}
`;

export class GeminiService {
  private modelName = 'gemini-3-pro-preview';

  async generatePortfolioResponse(
    userMessage: string, 
    history: { role: 'user' | 'model'; parts: { text: string }[] }[],
    projects: Project[],
    blogs: Blog[]
  ) {
    // Accessing env var via process.env as per guidelines
    if (!process.env.API_KEY) return "AI connection offline. Please check API_KEY environment variable.";

    // Always use new GoogleGenAI({ apiKey: process.env.API_KEY })
    const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

    // Fix: Including both projects and blogs in the system context for better AI awareness
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
      // Fix: Use systemInstruction in config instead of prepending context to the user contents.
      // This ensures correct alternating roles (user/model) and better adherence to SDK best practices.
      const response: GenerateContentResponse = await ai.models.generateContent({
        model: this.modelName,
        contents: [
          ...history,
          { role: 'user', parts: [{ text: userMessage }] }
        ],
        config: {
          systemInstruction: contextPrompt,
          temperature: 0.7,
          topP: 0.95,
          topK: 64
        }
      });
      // Correctly access the .text property (not a method)
      return response.text;
    } catch (error) {
      console.error("Gemini Error:", error);
      return "My cognitive engine is currently undergoing maintenance. Please try again shortly.";
    }
  }

  async generateTechnicalSummary(project: Project) {
    // Accessing env var via process.env as per guidelines
    if (!process.env.API_KEY) return "AI summarizing unavailable.";
    
    // Always use new GoogleGenAI({ apiKey: process.env.API_KEY })
    const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
    const prompt = `Write a high-level, 1-paragraph technical engineering abstract for: ${project.title}. Focus on system design and architectural challenges.`;
    
    // Generate content using the model name and prompt directly
    const response = await ai.models.generateContent({ 
      model: this.modelName, 
      contents: prompt 
    });
    
    // Correctly access the .text property
    return response.text;
  }
}

export const geminiService = new GeminiService();
