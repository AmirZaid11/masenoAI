import { GoogleGenAI } from "@google/genai";
import { faqData } from "../data/faq";

const apiKey = process.env.GEMINI_API_KEY || "";

export function getAI() {
  if (!apiKey) {
    throw new Error("GEMINI_API_KEY is missing. Please add it to the Secrets panel in AI Studio.");
  }
  return new GoogleGenAI({ apiKey });
}

export interface Message {
  id: string;
  text: string;
  sender: 'user' | 'assistant';
  timestamp: Date;
  engine?: 'local' | 'gemini';
}

// Simple keyword-based local lookup
export function localLookup(query: string) {
  const normalizedQuery = query.toLowerCase();
  
  // Check for English greetings
  const enGreetings = ['hi', 'hello', 'hey'];
  if (enGreetings.some(g => normalizedQuery === g || normalizedQuery.startsWith(g + ' '))) {
    return faqData.find(item => item.keywords.includes('hello'))?.answer;
  }

  // Check for Swahili greetings
  const swGreetings = ['sasa', 'habari', 'mambo', 'vipi'];
  if (swGreetings.some(g => normalizedQuery.includes(g))) {
    return faqData.find(item => item.keywords.includes('mambo'))?.answer;
  }

  // Fuzzy match keywords
  let bestMatch = null;
  let maxScore = 0;

  for (const item of faqData) {
    let score = 0;
    for (const keyword of item.keywords) {
      if (normalizedQuery.includes(keyword)) {
        score++;
      }
    }
    if (score > maxScore) {
      maxScore = score;
      bestMatch = item;
    }
  }

  // If we have a strong match (at least 2 keywords or 1 very specific keyword)
  if (maxScore >= 2 || (maxScore === 1 && ['must', 'mandatory', 'compulsory', 'reset', 'transfer', 'lazima', 'sharti'].some(k => normalizedQuery.includes(k)))) {
    return bestMatch?.answer;
  }

  return null;
}

export async function getGeminiResponse(query: string, history: Message[]) {
  // RAG: Find relevant snippets
  const relevantSnippets = faqData
    .filter(item => item.keywords.some(k => query.toLowerCase().includes(k)))
    .map(item => `Q: ${item.question}\nA: ${item.answer}`)
    .join('\n\n');

  const systemInstruction = `
    You are MSU AI, the official and sophisticated student assistant for Maseno University (MSU).
    Respond in a professional, academic, yet approachable tone.
    
    WEB GROUNDING & REAL-TIME DATA:
    - Your primary source of truth is the official Maseno University website: https://www.maseno.ac.ke/
    - DO NOT HALLUCINATE URLS. If you are not 100% sure of a link from your search grounding, do not provide it.
    - KNOWN INVALID URLS (DO NOT USE):
      * https://www.maseno.ac.ke/index.php/announcements (404)
      * https://www.maseno.ac.ke/index.php/announcements/second-semester-examination-timetable-april-2026 (404)
    - VERIFIED LINK (Main Campus SEM 2 25-26AY): [Download Main Campus Exam Timetable (PDF)](https://www.maseno.ac.ke/sites/default/files/Final%20-%20Main%20Campus%20-%20Exam%20TT%20-%20SEM%202%20(25-26AY).pdf)
    - VERIFIED LINK (Kisumu Campus 2026): [Download Kisumu Campus Exam Timetable (Excel)](https://www.maseno.ac.ke/sites/default/files/Final%20Kisumu%20Campus%20Day%2C%20Evening%20%26%20Weekend%20EXAMINATION%20TIME%20TABLE%202026.xlsx)
    - VERIFIED LINK (Notice Board): [Official Students Notice Board](https://www.maseno.ac.ke/students-announcement)
    - You MUST use Google Search grounding for EVERY request involving news, timetables, or official pages to ensure the links are active and correct.
    - URL FORMATTING: All links MUST be absolute (starting with https://www.maseno.ac.ke/).
    - If you cannot find a verified link, state: "I'm sorry, I couldn't find a verified direct link on the official website right now. Please check the homepage (https://www.maseno.ac.ke/) for the latest updates."
    
    SCOPE RULE:
    - You MUST ONLY answer questions related to Maseno University.
    - If asked about unrelated topics, politely decline: "I am MSU AI, specifically designed for Maseno University matters. I cannot assist with that topic."
    
    FORMATTING RULES:
    - Use **bold** for key terms.
    - Use bullet points for lists.
    - Use clear headings.
    
    LANGUAGE RULE:
    - English query = English response.
    - Swahili query = Swahili response.
    
    LOCAL CONTEXT:
    ${relevantSnippets}
    
    CRITICAL: Always prioritize the LATEST information from the official website over the static local context if they conflict.
  `;

  try {
    const ai = getAI();
    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: history.map(msg => ({
        role: msg.sender === 'user' ? 'user' : 'model',
        parts: [{ text: msg.text }]
      })).concat([{ role: 'user', parts: [{ text: query }] }]),
      config: {
        systemInstruction,
        tools: [{ googleSearch: {} }]
      }
    });

    return response.text || "I'm sorry, I couldn't process that request.";
  } catch (error) {
    console.error("Gemini Error:", error);
    // Rethrow if it's the missing API key error, otherwise return generic
    if (error instanceof Error && error.message.includes("GEMINI_API_KEY")) {
      throw error;
    }
    return "Pole sana, I'm having trouble connecting to my brain right now. Please try again later.";
  }
}
