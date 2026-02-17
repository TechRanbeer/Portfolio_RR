
import { GoogleGenAI, GenerateContentResponse } from "@google/genai";
import { Project, Blog } from "../types";
import { getEnv } from "./env";

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
    // Correctly using process.env.API_KEY directly for initialization as per SDK guidelines
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
          temperature: 0.7,
          topP: 0.95,
          topK: 64
        }
      });
      // Correct extraction of text property from GenerateContentResponse
      return response.text || "I couldn't generate a response.";
    } catch (error) {
      console.error("Gemini Error:", error);
      return "My cognitive engine is currently undergoing maintenance. Please try again shortly.";
    }
  }

  async generateTechnicalSummary(project: Project) {
    // Correctly using process.env.API_KEY directly for initialization as per SDK guidelines
    const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
    const prompt = `Write a high-level, 1-paragraph technical engineering abstract for: ${project.title}. Focus on system design and architectural challenges.`;
    
    try {
      const response = await ai.models.generateContent({ 
        model: this.modelName, 
        contents: prompt 
      });
      // Correct extraction of text property from GenerateContentResponse
      return response.text || "No summary available.";
    } catch (e) {
      return "Technical abstract currently unavailable.";
    }
  }
}

export const geminiService = new GeminiService();
