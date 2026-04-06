import React, { useState, useRef, useEffect } from 'react';
import { Header } from './components/Header';
import { ChatBubble } from './components/ChatBubble';
import { ChatInput } from './components/ChatInput';
import { Message, localLookup, getGeminiResponse } from './lib/gemini';
import { motion, AnimatePresence } from 'motion/react';

export default function App() {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      text: "### Welcome to MSU AI 👋\n\nI am your **Official Maseno University Student Assistant**. I have real-time access to university announcements, timetables, and academic resources.\n\nHow can I assist you today? You can ask me about:\n- 📅 **Exam Timetables** & Download Links\n- 💰 **Fees** & Payment Procedures\n- 🏠 **Hostel** Booking & Registration\n- 📝 **Course Registration** (Units)\n\n*How can I help you navigate MSU today?*",
      sender: 'assistant',
      timestamp: new Date(),
      engine: 'local'
    }
  ]);
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSendMessage = async (text: string) => {
    const userMessage: Message = {
      id: Date.now().toString(),
      text,
      sender: 'user',
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setIsLoading(true);

    // 1. Local Lookup
    const localAnswer = localLookup(text);
    
    if (localAnswer) {
      // Simulate a small delay for "Elite" feel
      setTimeout(() => {
        const assistantMessage: Message = {
          id: (Date.now() + 1).toString(),
          text: localAnswer,
          sender: 'assistant',
          timestamp: new Date(),
          engine: 'local'
        };
        setMessages(prev => [...prev, assistantMessage]);
        setIsLoading(false);
      }, 600);
      return;
    }

    // 2. Gemini RAG
    try {
      const geminiAnswer = await getGeminiResponse(text, messages);
      const assistantMessage: Message = {
        id: (Date.now() + 1).toString(),
        text: geminiAnswer,
        sender: 'assistant',
        timestamp: new Date(),
        engine: 'gemini'
      };
      
      setMessages(prev => [...prev, assistantMessage]);
    } catch (error) {
      const errorMessage: Message = {
        id: (Date.now() + 1).toString(),
        text: error instanceof Error ? error.message : "An unexpected error occurred.",
        sender: 'assistant',
        timestamp: new Date(),
        engine: 'gemini'
      };
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      
      <main className="flex-1 pt-20 pb-24 px-4 overflow-y-auto max-w-4xl mx-auto w-full">
        <AnimatePresence initial={false}>
          {messages.map((msg) => (
            <ChatBubble key={msg.id} message={msg} />
          ))}
        </AnimatePresence>
        
        {isLoading && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="flex justify-start mb-4"
          >
            <div className="bg-[#9A97C2] px-4 py-2 rounded-lg rounded-tl-none bubble-border shadow-sm flex items-center gap-1">
              <span className="w-1.5 h-1.5 bg-black/40 rounded-full animate-bounce"></span>
              <span className="w-1.5 h-1.5 bg-black/40 rounded-full animate-bounce [animation-delay:0.2s]"></span>
              <span className="w-1.5 h-1.5 bg-black/40 rounded-full animate-bounce [animation-delay:0.4s]"></span>
            </div>
          </motion.div>
        )}
        
        <div ref={messagesEndRef} />
      </main>

      <ChatInput onSendMessage={handleSendMessage} isLoading={isLoading} />
    </div>
  );
}
