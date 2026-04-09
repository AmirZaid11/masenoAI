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
  replyTo?: {
    id: string;
    text: string;
    sender: string;
  };
}

// Simple keyword-based local lookup with improved scoring
function getRelevantSnippets(query: string): string[] {
  const queryLower = query.toLowerCase();
  const queryWords = queryLower.split(/\s+/).filter(w => w.length > 3);
  
  if (queryWords.length === 0) return [];

  const genericWords = ['maseno', 'university', 'please', 'help', 'info'];

  const scoredFacts = faqData.map(item => {
    let score = 0;
    
    // Check keywords
    item.keywords.forEach(kw => {
      if (queryLower.includes(kw)) {
        // Boost score for specific keywords, lower for generic ones
        score += genericWords.includes(kw) ? 1 : 10;
      }
    });

    // Boost if question contains specific terms
    if (queryLower.includes('school') && item.category === 'schools') score += 20;
    if (queryLower.includes('email') && item.category === 'contact') score += 20;
    if (queryLower.includes('emergency') && item.category === 'contact') score += 20;

    return { item, score };
  });

  // Sort and filter low scores
  return scoredFacts
    .filter(f => f.score > 5)
    .sort((a, b) => b.score - a.score)
    .slice(0, 3)
    .map(f => f.item.answer);
}

const systemInstruction = `You are the Official Maseno University Student Assistant, developed by Ernest, Amina, and Amina. You are specifically programmed to help students navigate Maseno University academic and campus matters with ease.

CORE DIRECTIVE:
1. BE PROACTIVE: Do not just redirect students to the notice board. If you have the data, provide it immediately.
2. DIRECTNESS: If asked for a specific piece of information like an email or phone number, provide ONLY that information or a very short, minimalist sentence. Use markdown bolding for the key data.
3. ACCURACY & RESEARCH: If asked about CURRENT university leadership (like the Vice-Chancellor), events, or personnel, you MUST check the web for real-time information. Do not rely on outdated internal data for people.
4. TONE: Be helpful, professional, and supportive ("We love you, Comrade!").

Context from University Database:
{CONTEXT}

Remember: Simplify the student's task. If the answer is in the context, use it. If it's about current leadership or news, verify online first. Always be concise.`;

export async function getGrokResponse(userMessage: string, chatHistory: Message[]) {
  const snippets = getRelevantSnippets(userMessage);
  const context = snippets.length > 0 ? snippets.join("\n---\n") : "No specific local data found.";

  const fullPrompt = systemInstruction.replace("{CONTEXT}", context);

  // Convert chat history to Puter format for contextual memory
  // We take the last 10 messages to maintain context without hitting token limits
  const history = chatHistory.slice(-10).map(msg => ({
    role: msg.sender === 'assistant' ? 'assistant' : 'user',
    content: msg.text
  }));

  try {
    const response = await puter.ai.chat([
      ...history,
      { role: 'user', content: `Context from database:\n${context}\n\nUser Question: ${userMessage}` }
    ], {
      system_message: fullPrompt,
      model: 'gpt-4o-mini',
      stream: false
    });

    if (response && response.message && response.message.content) {
      return response.message.content;
    }
    
    // Handle alternative response formats
    if (typeof response === 'string') return response;
    if (response.content) return response.content;
    
    return "I'm having trouble connecting to my brain right now. Please try again or check the official Maseno website.";
  } catch (error) {
    console.error("Puter AI Error:", error);
    throw new Error("Unable to reach the AI engine. Please verify your connection.");
  }
}
