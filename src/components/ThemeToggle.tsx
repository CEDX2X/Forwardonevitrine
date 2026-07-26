import React from 'react';
import { Sun, Moon } from 'lucide-react';

interface ThemeToggleProps {
  theme: 'light' | 'dark';
  onToggleTheme: () => void;
  className?: string;
}

export const ThemeToggle: React.FC<ThemeToggleProps> = ({
  theme,
  onToggleTheme,
  className = ''
}) => {
  return (
    <div className={`flex flex-col items-center select-none ${className}`}>
      {/* Horizontal Pill Toggle Switch */}
      <button
        onClick={onToggleTheme}
        type="button"
        aria-label="Basculer Mode Jour / Nuit"
        className={`relative flex items-center justify-between w-14 h-7 rounded-full p-1 cursor-pointer transition-all duration-200 shadow-inner focus:outline-none border ${
          theme === 'light'
            ? 'bg-amber-50 border-amber-200'
            : 'bg-slate-800 border-slate-700'
        }`}
        title={theme === 'light' ? 'Passer en Mode Nuit (Sombre)' : 'Passer en Mode Jour (Clair)'}
      >
        {/* Sun Icon */}
        <Sun className={`w-3.5 h-3.5 z-10 transition-colors ${theme === 'light' ? 'text-amber-500' : 'text-slate-500'}`} />
        
        {/* Moon Icon */}
        <Moon className={`w-3.5 h-3.5 z-10 transition-colors ${theme === 'dark' ? 'text-indigo-400' : 'text-slate-400'}`} />

        {/* Sliding Knob */}
        <div
          className={`absolute top-0.5 bottom-0.5 w-6 h-6 rounded-full shadow-md transform transition-transform duration-200 flex items-center justify-center ${
            theme === 'light'
              ? 'translate-x-0 bg-white border border-amber-300'
              : 'translate-x-7 bg-slate-900 border border-indigo-500'
          }`}
        >
          <span className="text-[10px] leading-none">
            {theme === 'light' ? '☀️' : '🌙'}
          </span>
        </div>
      </button>

      {/* French Label as required by user prompt: "Mode Auto/Manuel" */}
      <div className={`mt-0.5 px-1.5 py-0.2 rounded border text-[9px] font-semibold shadow-2xs whitespace-nowrap ${
        theme === 'light'
          ? 'bg-slate-100 border-slate-300 text-slate-800'
          : 'bg-slate-800 border-slate-700 text-slate-200'
      }`}>
        Mode Auto/Manuel
      </div>
    </div>
  );
};
