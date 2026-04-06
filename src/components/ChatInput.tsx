import React, { useState, useRef, useEffect } from 'react';
import { Send, Sparkles } from 'lucide-react';

interface ChatInputProps {
  onSendMessage: (text: string) => void;
  isLoading: boolean;
}

export const ChatInput: React.FC<ChatInputProps> = ({ onSendMessage, isLoading }) => {
  const [text, setText] = useState('');
  const inputRef = useRef<HTMLTextAreaElement>(null);

  const handleSubmit = (e?: React.FormEvent) => {
    e?.preventDefault();
    if (text.trim() && !isLoading) {
      onSendMessage(text.trim());
      setText('');
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSubmit();
    }
  };

  useEffect(() => {
    if (inputRef.current) {
      inputRef.current.style.height = 'auto';
      inputRef.current.style.height = `${Math.min(inputRef.current.scrollHeight, 120)}px`;
    }
  }, [text]);

  return (
    <div className="fixed bottom-0 left-0 right-0 p-6 bg-gradient-to-t from-slate-50 via-slate-50/80 to-transparent z-50">
      <div className="max-w-3xl mx-auto flex items-end gap-3">
        <div className="flex-1 glass-panel rounded-2xl shadow-xl border border-white/40 overflow-hidden flex items-end p-3 min-h-[56px] transition-all focus-within:ring-2 focus-within:ring-[#003366]/20 focus-within:border-[#003366]/30">
          <textarea
            ref={inputRef}
            value={text}
            onChange={(e) => setText(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Ask MSU AI anything..."
            className="flex-1 bg-transparent border-none focus:ring-0 resize-none py-1.5 px-3 text-[15px] max-h-[120px] outline-none text-slate-700 placeholder:text-slate-400"
            rows={1}
          />
        </div>
        
        <button
          onClick={handleSubmit}
          disabled={!text.trim() || isLoading}
          className={`
            w-14 h-14 rounded-2xl flex items-center justify-center shadow-2xl transition-all duration-300
            ${text.trim() 
              ? 'bg-[#003366] hover:bg-[#004488] active:scale-90 text-[#FFD700]' 
              : 'bg-white text-slate-300 cursor-not-allowed border border-slate-100'
            }
          `}
        >
          {isLoading ? (
            <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
          ) : (
            <Send size={22} className={text.trim() ? 'animate-in fade-in zoom-in duration-300' : ''} />
          )}
        </button>
      </div>
      <div className="flex flex-col items-center mt-4 gap-1">
        <div className="flex items-center gap-1.5 opacity-60 hover:opacity-100 transition-opacity">
          <Sparkles size={10} className="text-[#003366]" />
          <span className="text-[9px] font-bold uppercase tracking-[0.2em] text-[#003366]">
            Verified by <a href="https://www.maseno.ac.ke/" target="_blank" rel="noopener noreferrer" className="underline decoration-[#003366]/30 hover:decoration-[#003366]">maseno.ac.ke</a>
          </span>
        </div>
        <div className="text-[9px] font-extrabold text-slate-500/60 uppercase tracking-[0.3em] mt-1">
          Developed by Ernest | Amina | Amina
        </div>
      </div>
    </div>
  );
};
