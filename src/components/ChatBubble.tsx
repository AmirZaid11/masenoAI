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
      `}>
        <div className="flex flex-col">
          <div className={`markdown-body text-[15px] leading-relaxed ${isUser ? 'text-white/95' : isDark ? 'text-slate-100' : 'text-slate-700'}`}>
            <ReactMarkdown
              components={{
                a: ({ node, ...props }) => (
                  <a 
                    {...props} 
                    target="_blank" 
                    rel="noopener noreferrer" 
                    className={`${isUser ? 'text-amber-300 underline' : 'text-blue-500'} hover:opacity-80 font-bold`}
                  />
                )
              }}
            >
              {message.text}
            </ReactMarkdown>
          </div>
          <div className={`flex items-center gap-2 mt-2 pt-2 border-t ${isUser ? 'border-white/10' : 'border-slate-100/10'}`}>
            <span className={`text-[10px] font-medium ${isUser ? 'text-white/40' : 'text-slate-400'}`}>
              {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
            </span>
            {!isUser && message.engine && (
              <span className={`text-[9px] font-bold uppercase tracking-widest px-2 py-0.5 rounded-full ${isDark ? 'bg-slate-700 text-slate-300' : 'bg-slate-100 text-slate-500'}`}>
                {message.engine}
              </span>
            )}
          </div>
        </div>
      </div>
    </motion.div>
  );
};
