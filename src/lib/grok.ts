import { faqData } from "../data/faq";

declare global {
  const puter: any;
}

export interface Message {
  id: string;
  text: string;
  sender: 'user' | 'assistant';
  timestamp: Date;
  engine?: 'local' | 'grok' | 'ai';
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

export async function getGrokResponse(query: string, history: Message[]) {
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
    - DO NOT HALLUCINATE URLS. If you are not 100% sure of a link, do not provide it.
    - VERIFIED LINK (Main Campus SEM 2 25-26AY): [Download Main Campus Exam Timetable (PDF)](https://www.maseno.ac.ke/sites/default/files/Final%20-%20Main%20Campus%20-%20Exam%20TT%20-%20SEM%202%20(25-26AY).pdf)
    - VERIFIED LINK (Kisumu Campus 2026): [Download Kisumu Campus Exam Timetable (Excel)](https://www.maseno.ac.ke/sites/default/files/Final%20Kisumu%20Campus%20Day%2C%20Evening%20%26%20Weekend%20EXAMINATION%20TIME%20TABLE%202026.xlsx)
    - VERIFIED LINK (Notice Board): [Official Students Notice Board](https://www.maseno.ac.ke/students-announcement)
    - All links MUST be absolute (starting with https://www.maseno.ac.ke/).

    SCOPE RULE:
    - You MUST ONLY answer questions related to Maseno University.
    - If asked about unrelated topics, politely decline: "I am MSU AI, specifically designed for Maseno University matters. I cannot assist with that topic."

    PRACTICALITY & DIRECTNESS RULE:
    - Your job is to SIMPLIFY the student's work.
    - If they ask for a number (e.g., Ambulance), FIND IT and give it directly.
    - DO NOT just tell them to "check the notice board." Only use "Refer official notice board" as a secondary citation or link at the end of a helpful response.
    - Be proactive. If you have the data in your training/web knowledge, provide it immediately.

    FORMATTING RULES:
    - Use **bold** for key terms.
    - Use bullet points for lists.
    - Use clear headings.

    LANGUAGE RULE:
    - English query = English response.
    - Swahili query = Swahili response.

    LOCAL CONTEXT:
    ${relevantSnippets}

    WEB RESEARCH & SOCIAL MEDIA:
    - You are authorized to use your web search capabilities to check for real-time announcements, news, and social media trends (X, Facebook, Instagram) related to Maseno University.
    - Always prioritize the LATEST information from the official university social media handles or the official website over static context.
    - If you perform a web lookup, mention it: "Based on my real-time check of MSU's latest announcements..."

    CRITICAL: Always prioritize accuracy and official sources.
  `;

  const messages = [
    { role: "system", content: systemInstruction },
    ...history.map(msg => ({
      role: msg.sender === 'user' ? 'user' : 'assistant',
      content: msg.text
    })),
    { role: "user", content: query }
  ];

  try {
    if (typeof puter === 'undefined') {
      throw new Error("Puter.js library not loaded. Please check your connection.");
    }

    const response = await puter.ai.chat(messages, {
      model: 'gpt-4o-mini'
    });
    
    // Puter's ai.chat can return a direct string or a message object
    if (typeof response === 'string') {
      return response;
    }
    
    return response?.message?.content || response?.content || "I'm sorry, I couldn't process that request.";
  } catch (error) {
    console.error("AI Error:", error);
    return "Pole sana, I'm having trouble connecting to my brain right now. Please try again later.";
  }
}
