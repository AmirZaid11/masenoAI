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
    <div className="fixed bottom-8 left-0 right-0 px-4 sm:px-6 z-50 pointer-events-none">
      <div className="max-w-3xl mx-auto flex items-end gap-3 pointer-events-auto">
        <div className="flex-1 glass-capsule shadow-2xl border border-white/20 overflow-hidden flex items-end p-2 min-h-[56px] transition-all focus-within:ring-4 focus-within:ring-[#00d2ff]/10 focus-within:border-[#00d2ff]/30">
          <textarea
            ref={inputRef}
            value={text}
            onChange={(e) => setText(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Ask MSU AI anything..."
            className="flex-1 bg-transparent border-none focus:ring-0 resize-none py-2.5 px-4 text-[15px] max-h-[120px] outline-none text-slate-700 dark:text-slate-200 placeholder:text-slate-400"
            rows={1}
          />
        </div>
        
        <button
          onClick={handleSubmit}
          disabled={!text.trim() || isLoading}
          className={`
            w-14 h-14 rounded-full flex items-center justify-center shadow-2xl transition-all duration-300 shrink-0
            ${text.trim() 
              ? 'bg-linear-to-br from-[#00d2ff] to-[#9d50bb] hover:scale-105 active:scale-90 text-white shadow-[#00d2ff]/20' 
              : 'bg-white/40 dark:bg-slate-800/40 text-slate-300 cursor-not-allowed border border-white/10'
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
    </div>
  );
};
