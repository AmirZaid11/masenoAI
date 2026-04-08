import React, { useState, useRef, useEffect, useMemo } from 'react';
import { Header } from './components/Header';
import { ChatBubble } from './components/ChatBubble';
import { ChatInput } from './components/ChatInput';
import { Message, localLookup, getGrokResponse } from './lib/grok';
import { motion, AnimatePresence } from 'motion/react';
import { BackgroundType } from './components/ThemeToggle';

export default function App() {
  const [theme, setTheme] = useState<BackgroundType>('white');
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

  // Generate galaxy stars
  const stars = useMemo(() => {
    return Array.from({ length: 150 }).map((_, i) => ({
      id: i,
      size: Math.random() * 2 + 1,
      left: Math.random() * 100,
      top: Math.random() * 100,
      duration: Math.random() * 50 + 50,
      delay: Math.random() * -100
    }));
  }, []);

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

    // 2. AI Response
    try {
      const chatAnswer = await getGrokResponse(text, messages);
      const assistantMessage: Message = {
        id: (Date.now() + 1).toString(),
        text: chatAnswer,
        sender: 'assistant',
        timestamp: new Date(),
        engine: 'ai'
      };
      
      setMessages(prev => [...prev, assistantMessage]);
    } catch (error) {
      const errorMessage: Message = {
        id: (Date.now() + 1).toString(),
        text: error instanceof Error ? error.message : "An unexpected error occurred.",
        sender: 'assistant',
        timestamp: new Date()
      };
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div 
      data-theme={theme === 'white' ? 'light' : 'dark'}
      className={`min-h-screen flex flex-col transition-colors duration-500 ${theme === 'black' ? 'bg-black-plain text-white' : theme === 'white' ? 'bg-white-plain text-slate-800' : ''}`}
    >
      {theme === 'galaxy' && (
        <div className="bg-galaxy">
          <div className="galaxy-stars">
            {stars.map(star => (
              <div
                key={star.id}
                className="star"
                style={{
                  width: `${star.size}px`,
                  height: `${star.size}px`,
                  left: `${star.left}%`,
                  top: `${star.top}%`,
                  animationDuration: `${star.duration}s`,
                  animationDelay: `${star.delay}s`
                }}
              />
            ))}
          </div>
        </div>
      )}
      
      <Header theme={theme} onThemeChange={setTheme} />
      
      <main className="flex-1 pt-24 pb-24 px-4 overflow-y-auto max-w-4xl mx-auto w-full relative z-10">
        <AnimatePresence initial={false}>
          {messages.map((msg) => (
            <ChatBubble key={msg.id} message={msg} backgroundType={theme} />
          ))}
        </AnimatePresence>
        
        {isLoading && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="flex justify-start mb-4"
          >
            <div className={`px-4 py-2 rounded-2xl rounded-tl-none bubble-border shadow-sm flex items-center gap-1 ${theme === 'black' ? 'bg-slate-800' : 'bg-[#9A97C2]'}`}>
              <span className="w-1.5 h-1.5 bg-black/40 rounded-full animate-bounce"></span>
              <span className="w-1.5 h-1.5 bg-black/40 rounded-full animate-bounce [animation-delay:0.2s]"></span>
              <span className="w-1.5 h-1.5 bg-black/40 rounded-full animate-bounce [animation-delay:0.4s]"></span>
            </div>
          </motion.div>
        )}
        
        <div ref={messagesEndRef} />
        
        <p className="disclaimer-text mt-8 opacity-50">
          Developer Notice: This AI is still under implementation. Some responses may not be 100% accurate.
        </p>
      </main>

      <div className="fixed bottom-0 left-0 right-0 z-50">
        <ChatInput onSendMessage={handleSendMessage} isLoading={isLoading} />
      </div>
    </div>
  );
}

