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
    <button
      onClick={onToggleTheme}
      type="button"
      aria-label="Basculer Mode Jour / Nuit"
      className={`w-10 h-10 flex items-center justify-center rounded-full cursor-pointer transition-all duration-200 border shadow-md ${
        theme === 'light'
          ? 'bg-amber-50 border-amber-200 text-amber-500 hover:bg-amber-100'
          : 'bg-slate-800 border-slate-700 text-indigo-400 hover:bg-slate-700'
      } ${className}`}
      title={theme === 'light' ? 'Passer en Mode Nuit (Sombre)' : 'Passer en Mode Jour (Clair)'}
    >
      {theme === 'light' ? (
        <Sun className="w-5 h-5" />
      ) : (
        <Moon className="w-5 h-5" />
      )}
    </button>
  );
};
