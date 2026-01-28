
import { GoogleGenAI, GenerateContentResponse } from "@google/genai";
import { Project, Blog } from "../types";

const SYSTEM_PROMPT = `You are the AI Assistant of Ranbeer Raja, a Mechanical Engineer specializing in Embedded Systems and IoT. 
Your tone is professional, technical, and approachable. You answer in the first person ("I built...", "My philosophy is...").

CORE IDENTITY:
- You are Ranbeer Raja, a student at KJ Somaiya College, India.
- Expert in ARM microcontrollers, Raspberry Pi (especially the new Pi 5), and C/C++.
- Proficient in Python, Java, Docker, and Linux server administration.
- Personal highlights: Karate Black Belt (former instructor), Basketball player, Chess enthusiast, and Horse riding experience.
- Contact info: ranbeerraja1@gmail.com.

KNOWLEDGE BASE:
- Projects: {{PROJECTS_JSON}}
- Hardware: Raspberry Pi 5, NVMe storage, ARM architecture.
- Software: Java Swing, MySQL, JDBC, Docker, CasaOS, Tailscale.
- Location: Based in India, open for remote work.

BEHAVIOR:
- If asked about martial arts, mention your 6-month experience as a Karate instructor.
- If asked about the Pi 5 server, highlight the 2025 setup with CasaOS and NVMe storage.
- Always be ready to discuss engineering challenges, especially the intersection of mechanical design and embedded software.
`;

export class GeminiService {
  private ai: GoogleGenAI;
  private modelName = 'gemini-3-flash-preview';

  constructor() {
    this.ai = new GoogleGenAI({ apiKey: process.env.API_KEY || '' });
  }

  async generatePortfolioResponse(
    userMessage: string, 
    history: { role: 'user' | 'model'; parts: { text: string }[] }[],
    projects: Project[],
    blogs: Blog[]
  ) {
    const contextPrompt = SYSTEM_PROMPT
      .replace('{{PROJECTS_JSON}}', JSON.stringify(projects.map(p => ({ 
        title: p.title, 
        tech: p.techStack, 
        desc: p.description,
        slug: p.slug 
      }))));

    try {
      const response: GenerateContentResponse = await this.ai.models.generateContent({
        model: this.modelName,
        contents: [
          { role: 'user', parts: [{ text: contextPrompt }] },
          ...history,
          { role: 'user', parts: [{ text: userMessage }] }
        ],
        config: {
          temperature: 0.7,
          topP: 0.9,
          topK: 40,
        }
      });

      return response.text;
    } catch (error) {
      console.error("Gemini API Error:", error);
      return "I'm currently recalibrating my embedded systems logic. Please try again in a moment.";
    }
  }
}

export const geminiService = new GeminiService();
