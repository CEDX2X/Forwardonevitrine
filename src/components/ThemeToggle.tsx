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
  const isLight = theme === 'light';

  return (
    <div className={`flex flex-col items-center select-none ${className}`}>
      {/* Horizontal Pill Toggle Switch */}
      <button
        onClick={onToggleTheme}
        type="button"
        aria-label="Basculer Mode Jour / Nuit"
        className={`relative flex items-center justify-between w-16 h-8 rounded-full p-1 cursor-pointer transition-all duration-200 focus:outline-none border shadow-inner ${
          isLight
            ? 'bg-slate-100 border-slate-300/80'
            : 'bg-[#0d0d2e] border-white/20'
        }`}
        title={isLight ? 'Passer en Mode Nuit' : 'Passer en Mode Jour'}
      >
        {/* Sun Icon (Left) */}
        <Sun className={`w-4 h-4 z-10 transition-colors ml-0.5 ${isLight ? 'text-amber-500' : 'text-slate-500'}`} />
        
        {/* Moon Icon (Right) */}
        <Moon className={`w-4 h-4 z-10 transition-colors mr-0.5 ${!isLight ? 'text-indigo-300' : 'text-slate-400'}`} />

        {/* Sliding White Circle Knob */}
        <div
          className={`absolute top-1 bottom-1 w-6 h-6 rounded-full shadow-md transform transition-transform duration-200 flex items-center justify-center ${
            isLight
              ? 'translate-x-0 bg-white border border-amber-200'
              : 'translate-x-8 bg-slate-900 border border-slate-700'
          }`}
        >
          {isLight ? (
            <Sun className="w-3.5 h-3.5 text-amber-500 fill-amber-400" />
          ) : (
            <Moon className="w-3.5 h-3.5 text-indigo-300 fill-indigo-300" />
          )}
        </div>
      </button>

      {/* Label: "Mode Auto/Manuel" */}
      <div className={`mt-0.5 px-2 py-0.5 rounded-md border text-[9px] font-semibold shadow-2xs whitespace-nowrap ${
        isLight
          ? 'bg-slate-100 border-slate-300 text-slate-800'
          : 'bg-[#141446]/90 border-white/20 text-slate-300'
      }`}>
        Mode Auto/Manuel
      </div>
    </div>
  );
};
