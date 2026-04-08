import React from 'react';
import { motion } from 'motion/react';
import { Message } from '../lib/grok';
import ReactMarkdown from 'react-markdown';
import { Bot, User, CheckCheck } from 'lucide-react';
import { BackgroundType } from './ThemeToggle';

interface ChatBubbleProps {
  message: Message;
  backgroundType?: BackgroundType;
}

export const ChatBubble: React.FC<ChatBubbleProps> = ({ message, backgroundType }) => {
  const isUser = message.sender === 'user';
  const isDark = backgroundType === 'black' || backgroundType === 'galaxy';
  
  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 15, scale: 0.95 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      className={`flex flex-col ${isUser ? 'items-end' : 'items-start'} mb-6 max-w-[85%] ${isUser ? 'ml-auto' : 'mr-auto'}`}
    >
      {!isUser && (
        <div className="flex items-center gap-2 mb-1.5 ml-2">
          <span className="text-[10px] font-bold text-slate-400 tracking-widest uppercase">Assistant</span>
          {message.engine === 'ai' && (
            <span className="px-1.5 py-0.5 rounded-md bg-emerald-100 text-emerald-600 text-[8px] font-bold uppercase tracking-tighter">AI Powered</span>
          )}
        </div>
      )}

      <div className="flex gap-3 items-end group">
        {!isUser && (
          <div className="w-8 h-8 rounded-full bg-slate-950 border border-[#00d2ff]/30 flex items-center justify-center shrink-0 mb-1 shadow-lg relative overflow-hidden">
             <div className="absolute inset-0 bg-linear-to-br from-[#00d2ff]/10 to-[#9d50bb]/10 animate-pulse"></div>
             <Bot size={18} className="text-[#00d2ff] relative z-10" />
          </div>
        )}

        <div className={`
          relative px-5 py-3.5
          ${isUser 
            ? 'bubble-cloud bg-linear-to-br from-[#00d2ff] to-[#9d50bb] font-user text-white' 
            : `bubble-oval ${isDark ? 'bg-slate-800 text-white' : 'bg-white text-slate-800'} font-assistant assistant-glow`
          }
        `}>
          <div className="markdown-body text-sm sm:text-base">
            <ReactMarkdown>{message.text}</ReactMarkdown>
          </div>
          
          <div className={`mt-2 text-[9px] ${isUser ? 'text-white/60' : 'text-slate-400'} flex items-center gap-1.5`}>
            {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
            {isUser && <CheckCheck size={12} className="text-white/80" />}
          </div>
        </div>

        {isUser && (
          <div className="w-8 h-8 rounded-full bg-emerald-100 border border-emerald-200 flex items-center justify-center shrink-0 mb-1 shadow-sm group-hover:scale-110 transition-transform">
            <span className="text-lg">😊</span>
          </div>
        )}
      </div>
    </motion.div>
  );
};
