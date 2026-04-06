import React from 'react';
import { motion } from 'motion/react';
import { Message } from '../lib/gemini';
import ReactMarkdown from 'react-markdown';
import { User, Brain } from 'lucide-react';

interface ChatBubbleProps {
  message: Message;
}

export const ChatBubble: React.FC<ChatBubbleProps> = ({ message }) => {
  const isUser = message.sender === 'user';
  
  return (
    <motion.div
      initial={{ opacity: 0, y: 20, scale: 0.98 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      className={`flex w-full mb-6 gap-3 ${isUser ? 'flex-row-reverse' : 'flex-row'}`}
    >
      <div className={`
        w-10 h-10 rounded-xl flex items-center justify-center shrink-0 shadow-lg relative overflow-hidden
        ${isUser ? 'bg-[#003366] text-white' : 'bg-slate-950 text-[#00d2ff] border border-[#00d2ff]/30'}
      `}>
        {!isUser && <div className="absolute inset-0 bg-gradient-to-br from-[#00d2ff]/10 to-[#9d50bb]/10"></div>}
        {isUser ? <User size={20} /> : <Brain size={20} className="relative z-10 drop-shadow-[0_0_5px_rgba(0,210,255,0.5)]" />}
      </div>

      <div className={`
        relative max-w-[80%] px-5 py-3 rounded-2xl
        ${isUser 
          ? 'bubble-3d-user text-white rounded-tr-none' 
          : 'bubble-3d-assistant text-slate-800 rounded-tl-none'
        }
      `}>
        <div className="flex flex-col">
          <div className={`markdown-body text-[15px] leading-relaxed ${isUser ? 'text-white/95' : 'text-slate-700'}`}>
            <ReactMarkdown
              components={{
                a: ({ node, ...props }) => (
                  <a 
                    {...props} 
                    target="_blank" 
                    rel="noopener noreferrer" 
                    className="text-blue-500 hover:underline font-bold"
                  />
                )
              }}
            >
              {message.text}
            </ReactMarkdown>
          </div>
          <div className={`flex items-center gap-2 mt-2 pt-2 border-t ${isUser ? 'border-white/10' : 'border-slate-100'}`}>
            <span className={`text-[10px] font-medium ${isUser ? 'text-white/40' : 'text-slate-400'}`}>
              {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
            </span>
            {!isUser && message.engine && (
              <span className="text-[9px] font-bold uppercase tracking-widest px-2 py-0.5 rounded-full bg-slate-100 text-slate-500 border border-slate-200">
                {message.engine}
              </span>
            )}
          </div>
        </div>
      </div>
    </motion.div>
  );
};
