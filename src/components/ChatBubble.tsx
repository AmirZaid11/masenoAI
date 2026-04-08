import React from 'react';
import { motion } from 'motion/react';
import { Message } from '../lib/grok';
import ReactMarkdown from 'react-markdown';
import { Smile, Brain } from 'lucide-react';
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
      initial={{ opacity: 0, y: 20, scale: 0.98 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      className={`flex w-full mb-6 gap-3 ${isUser ? 'flex-row-reverse' : 'flex-row'}`}
    >
      <div className={`
        w-10 h-10 rounded-xl flex items-center justify-center shrink-0 shadow-lg relative overflow-hidden
        ${isUser ? 'bg-linear-to-tr from-amber-400 to-orange-500 text-white' : 'bg-slate-950 text-[#00d2ff] border border-[#00d2ff]/30'}
      `}>
        {!isUser && <div className="absolute inset-0 bg-linear-to-br from-[#00d2ff]/10 to-[#9d50bb]/10"></div>}
        {isUser ? <Smile size={24} className="relative z-10" /> : <Brain size={24} className="relative z-10 drop-shadow-[0_0_5px_rgba(0,210,255,0.5)]" />}
      </div>

      <div className={`
        relative max-w-[85%] px-6 py-4 transition-all duration-300
        ${isUser 
          ? 'bubble-cloud font-user bg-[#003366] text-white' 
          : `bubble-oval font-assistant ${isDark ? 'bg-slate-800 text-white' : 'bg-white text-slate-800'} shadow-sm border border-black/5`
        }
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
          <div className="w-8 h-8 rounded-full bg-slate-100 border border-slate-200 flex items-center justify-center shrink-0 mb-1 shadow-sm">
            <Bot size={18} className="text-[#003366]" />
          </div>
        )}

        <div className={`
          relative px-5 py-3.5
          ${isUser 
            ? 'bubble-cloud bg-linear-to-br from-[#00d2ff] to-[#9d50bb] font-user text-white' 
            : `bubble-oval ${backgroundType === 'white' ? 'bg-[#f8fafc]' : 'bg-slate-800'} font-assistant assistant-glow`
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
