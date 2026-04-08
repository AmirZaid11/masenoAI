import React from 'react';
import { Sun, Moon, Sparkles } from 'lucide-react';

export type BackgroundType = 'white' | 'black' | 'galaxy';

interface ThemeToggleProps {
  currentTheme: BackgroundType;
  onThemeChange: (theme: BackgroundType) => void;
}

export const ThemeToggle: React.FC<ThemeToggleProps> = ({ currentTheme, onThemeChange }) => {
  return (
    <div className="flex items-center gap-1 bg-slate-100 p-1 rounded-full border border-slate-200 shadow-inner">
      <button
        onClick={() => onThemeChange('white')}
        className={`p-1.5 rounded-full transition-all ${currentTheme === 'white' ? 'bg-white shadow-sm text-amber-500 scale-110' : 'text-slate-400 hover:text-slate-600'}`}
        title="Plain White"
      >
        <Sun size={16} />
      </button>
      <button
        onClick={() => onThemeChange('black')}
        className={`p-1.5 rounded-full transition-all ${currentTheme === 'black' ? 'bg-black shadow-sm text-white scale-110' : 'text-slate-400 hover:text-slate-600'}`}
        title="Plain Black"
      >
        <Moon size={16} />
      </button>
      <button
        onClick={() => onThemeChange('galaxy')}
        className={`p-1.5 rounded-full transition-all ${currentTheme === 'galaxy' ? 'bg-slate-950 shadow-sm text-[#00d2ff] scale-110' : 'text-slate-400 hover:text-slate-600'}`}
        title="Animated Galaxy"
      >
        <Sparkles size={16} />
      </button>
    </div>
  );
};
