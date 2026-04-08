import React from 'react';
import { Brain, Trash2 } from 'lucide-react';
import { ThemeToggle, BackgroundType } from './ThemeToggle';

interface HeaderProps {
  theme: BackgroundType;
  onThemeChange: (theme: BackgroundType) => void;
  onClearChat: () => void;
}

export const Header: React.FC<HeaderProps> = ({ theme, onThemeChange, onClearChat }) => {
  return (
    <header className="fixed top-0 left-0 right-0 h-20 glass-panel border-b border-slate-200 flex items-center px-6 z-50 shadow-sm">
      <div className="flex items-center gap-4 max-w-5xl mx-auto w-full">
        <div className="relative">
          <div className="w-12 h-12 rounded-full bg-slate-950 flex items-center justify-center shadow-[0_0_15px_rgba(0,210,255,0.3)] overflow-hidden border-2 border-[#00d2ff]">
            <div className="absolute inset-0 bg-linear-to-br from-[#00d2ff]/20 to-[#9d50bb]/20 animate-pulse"></div>
            <Brain className="text-[#00d2ff] relative z-10 drop-shadow-[0_0_8px_rgba(0,210,255,0.8)]" size={28} />
          </div>
          <div className="absolute bottom-0 right-0 w-3.5 h-3.5 bg-emerald-500 border-2 border-white rounded-full shadow-sm"></div>
        </div>
        <div className="flex-1">
          <h1 className={`font-bold text-xl tracking-tight ${theme === 'white' ? 'text-[#003366]' : 'text-slate-100'}`}>MSU AI</h1>
          <div className="flex items-center gap-2">
            <span className="text-[11px] font-medium text-emerald-600">Online</span>
            <span className="text-[10px] text-slate-400">•</span>
            <span className="text-[10px] text-slate-400 font-medium">Last seen just now</span>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <button
            onClick={onClearChat}
            className={`p-2 rounded-xl transition-all duration-300 hover:scale-110 active:scale-95 flex items-center justify-center ${theme === 'white' ? 'bg-slate-100 text-slate-500 hover:bg-red-50 hover:text-red-500' : 'bg-slate-800 text-slate-400 hover:bg-slate-700 hover:text-white'}`}
            title="Clear Chat"
          >
            <Trash2 size={20} />
          </button>
          
          <ThemeToggle currentTheme={theme} onThemeChange={onThemeChange} />
          
          <div className="hidden sm:block ml-2">
            <a 
              href="https://www.maseno.ac.ke/" 
              target="_blank" 
              rel="noopener noreferrer"
              className={`px-3 py-1.5 rounded-full border transition-all ${theme === 'white' ? 'bg-slate-100 border-slate-200 text-slate-500 hover:bg-slate-200' : 'bg-slate-800 border-slate-700 text-slate-400 hover:bg-slate-700 hover:text-white'}`}
            >
              <span className="text-[10px] font-bold tracking-widest uppercase">Official Site</span>
            </a>
          </div>
        </div>
      </div>
    </header>
  );
};
