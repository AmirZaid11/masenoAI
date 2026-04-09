import React, { useState, useRef, useEffect, useMemo } from 'react';
import { Header } from './components/Header';
import { ChatBubble } from './components/ChatBubble';
import { ChatInput } from './components/ChatInput';
import { Message, getGrokResponse } from './lib/grok';
import { motion, AnimatePresence } from 'motion/react';
import { BackgroundType } from './components/ThemeToggle';
import { ArrowDown, Info, X } from 'lucide-react';

export default function App() {
  const [theme, setTheme] = useState<BackgroundType>('white');
  const [showScrollFAB, setShowScrollFAB] = useState(false);
  const [showToast, setShowToast] = useState(true);
  
  const [isVoiceEnabled, setIsVoiceEnabled] = useState(false);
  const [isOnline, setIsOnline] = useState(navigator.onLine);
  const [lastOnlineTime, setLastOnlineTime] = useState<Date | null>(null);
  const [replyingToMessage, setReplyingToMessage] = useState<Message | null>(null);
  
  const welcomeMessage: Message = {
    id: 'welcome',
    text: "### Welcome to MSU AI (V1.0 Lite) 👋\n\nDeveloped by **Ernest, Amina, and Amina** to help you navigate Maseno with ease. \n\n**Ask me about:**\n📅 Exams | 💰 Fees | 🏠 Hostels | 📝 Units\n\n⚠️ *Under development—verify critical info.*\n\n**We love you, Comrade!** How can I help?",
    sender: 'assistant',
    timestamp: new Date()
  };

  const [messages, setMessages] = useState<Message[]>([welcomeMessage]);
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const scrollContainerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => {
      setIsOnline(false);
      setLastOnlineTime(new Date());
    };

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

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

  const handleScroll = () => {
    if (!scrollContainerRef.current) return;
    const { scrollTop, scrollHeight, clientHeight } = scrollContainerRef.current;
    const isAtBottom = scrollHeight - scrollTop - clientHeight < 100;
    setShowScrollFAB(!isAtBottom);
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const speak = (text: string) => {
    if (!isVoiceEnabled) return;
    
    // Cancel any ongoing speech
    window.speechSynthesis.cancel();
    
    // Remove markdown/formatting for cleaner speech
    const cleanText = text.replace(/[#*`_~]/g, '').replace(/\[([^\]]+)\]\([^\)]+\)/g, '$1');
    
    const utterance = new SpeechSynthesisUtterance(cleanText);
    utterance.rate = 1.1;
    utterance.pitch = 1.0;
    window.speechSynthesis.speak(utterance);
  };

  const handleSendMessage = async (text: string) => {
    window.speechSynthesis.cancel();

    const userMessage: Message = {
      id: Date.now().toString(),
      text,
      sender: 'user',
      timestamp: new Date(),
      replyTo: replyingToMessage ? {
        id: replyingToMessage.id,
        text: replyingToMessage.text,
        sender: replyingToMessage.sender
      } : undefined
    };

    setMessages(prev => [...prev, userMessage]);
    setReplyingToMessage(null); // Clear reply state
    setIsLoading(true);

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
      if (isVoiceEnabled) {
        speak(chatAnswer);
      }
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

  const handleClearChat = () => {
    setMessages([welcomeMessage]);
  };

  return (
    <div 
      data-theme={theme === 'white' ? 'light' : 'dark'}
      className={`min-h-screen flex flex-col transition-colors duration-500 overflow-hidden ${theme === 'black' ? 'bg-black-plain text-white' : theme === 'white' ? 'bg-white-plain text-slate-800' : ''}`}
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
      
      <Header 
        theme={theme} 
        onThemeChange={setTheme} 
        onClearChat={handleClearChat}
        isVoiceEnabled={isVoiceEnabled}
        onVoiceToggle={() => setIsVoiceEnabled(!isVoiceEnabled)}
        isOnline={isOnline}
        lastOnlineTime={lastOnlineTime}
      />
      
      <main 
        ref={scrollContainerRef}
        onScroll={handleScroll}
        className="flex-1 pt-24 pb-32 px-4 overflow-y-auto w-full relative z-10 scroll-smooth"
      >
        <div className="max-w-4xl mx-auto w-full">
          <AnimatePresence mode="popLayout">
            {messages.map((msg) => (
              <ChatBubble 
                key={msg.id} 
                message={msg} 
                backgroundType={theme} 
                onReply={() => setReplyingToMessage(msg)}
              />
            ))}
          </AnimatePresence>
          
          {isLoading && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="flex justify-start mb-4"
            >
              <div className={`px-4 py-2 rounded-2xl rounded-tl-none bubble-border shadow-sm flex items-center gap-1 ${theme === 'black' || theme === 'galaxy' ? 'bg-slate-800' : 'bg-[#9A97C2]'}`}>
                <span className="w-1.5 h-1.5 bg-black/40 rounded-full animate-bounce"></span>
                <span className="w-1.5 h-1.5 bg-black/40 rounded-full animate-bounce [animation-delay:0.2s]"></span>
                <span className="w-1.5 h-1.5 bg-black/40 rounded-full animate-bounce [animation-delay:0.4s]"></span>
              </div>
            </motion.div>
          )}
          
          <div ref={messagesEndRef} />
        </div>
      </main>

      {/* Floating Action Elements */}
      <AnimatePresence>
        {showScrollFAB && (
          <motion.button
            initial={{ opacity: 0, scale: 0.5, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.5, y: 20 }}
            onClick={scrollToBottom}
            className={`fixed bottom-28 right-8 z-50 w-12 h-12 rounded-full flex items-center justify-center fab-shadow transition-colors ${theme === 'white' ? 'bg-white text-[#003366]' : 'bg-slate-800 text-white border border-white/10'}`}
          >
            <ArrowDown size={24} />
          </motion.button>
        )}

        {showToast && (
          <motion.div
            initial={{ opacity: 0, y: -20, x: '-50%' }}
            animate={{ opacity: 1, y: 0, x: '-50%' }}
            exit={{ opacity: 0, y: -20, x: '-50%' }}
            className="fixed top-24 left-1/2 z-50 w-[90%] max-w-md"
          >
            <div className={`glass-panel p-4 rounded-2xl shadow-2xl border border-white/20 flex items-start gap-4 ${theme === 'white' ? 'bg-white/90' : 'bg-slate-900/90 text-white'}`}>
              <div className="w-10 h-10 rounded-xl bg-orange-100 flex items-center justify-center shrink-0">
                <Info size={20} className="text-orange-500" />
              </div>
              <div className="flex-1">
                <h4 className="font-bold text-sm">Maseno AI Assistant</h4>
                <p className="text-xs opacity-70 mt-0.5">Under implementation. Verify critical info with official university portals.</p>
              </div>
              <button onClick={() => setShowToast(false)} className="p-1 hover:bg-black/5 rounded-lg transition-colors">
                <X size={16} />
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="fixed bottom-0 left-0 right-0 z-50">
        <ChatInput 
          onSendMessage={handleSendMessage} 
          isLoading={isLoading} 
          replyingTo={replyingToMessage}
          onCancelReply={() => setReplyingToMessage(null)}
        />
      </div>
    </div>
  );
}
