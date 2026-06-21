import { GoogleGenerativeAI, GenerativeModel } from '@google/generative-ai';

interface WindowWithEnv extends Window {
  ENV?: { GEMINI_API_KEY?: string };
}

/**
 * Initializes the Google Gemini API. Checks Vite build env first, then runtime injected env.
 */
const apiKey = import.meta.env.VITE_GEMINI_API_KEY || ((window as unknown) as WindowWithEnv).ENV?.GEMINI_API_KEY || '';

// System instruction context so the model knows its role.
const SYSTEM_INSTRUCTION = `You are EcoAssist, a highly knowledgeable, friendly, and concise carbon footprint assistant. 
Your goal is to help users understand their carbon footprint, climate change, and sustainability.
Keep your answers brief, actionable, and formatted nicely. Do not use complex markdown that is hard to render, stick to simple text, bullet points, and short paragraphs.`;

let genAI: GoogleGenerativeAI | null = null;
let model: GenerativeModel | null = null;

if (apiKey) {
  genAI = new GoogleGenerativeAI(apiKey);
  // Using gemini-flash-latest for fast chat responses
  model = genAI.getGenerativeModel({ 
    model: "gemini-flash-latest",
    systemInstruction: SYSTEM_INSTRUCTION
  });
}

/**
 * Sends a prompt to the Google Gemini model and returns the text response.
 * @param {string} prompt - The user's input question.
 * @param {Array} history - Previous chat history for context.
 * @returns {Promise<string>} The AI's response text.
 */
export const askEcoAssistant = async (prompt: string, history: {role: string, parts: {text: string}[]}[] = []): Promise<string> => {
  if (!model) {
    return "Error: Gemini API key is missing. Please check your .env.local file.";
  }

  try {
    const chat = model.startChat({
      history: history,
      generationConfig: {
        maxOutputTokens: 1500,
        temperature: 0.7,
      },
    });

    const result = await chat.sendMessage(prompt);
    const response = await result.response;
    return response.text();
  } catch (error) {
    console.error("Gemini API Error:", error);
    return "Sorry, I am having trouble connecting to the network right now. Please try again later.";
  }
};
