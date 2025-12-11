import React from 'react';
import { useTheme } from '../../contexts/ThemeContext';
import { Sun, Moon } from 'lucide-react';

const ThemeSwitcher: React.FC<{ className?: string }> = ({ className }) => {
  const { theme, toggleTheme } = useTheme();

  return (
    <button
      onClick={toggleTheme}
      className={`w-10 h-10 rounded-full flex items-center justify-center focus:outline-none focus:ring-2 focus:ring-amber-400 transition-all duration-300 ${className}`}
      aria-label="Toggle theme"
    >
      <div className="relative w-6 h-6">
        {/* Sun Icon */}
        <Sun
          className={`absolute inset-0 w-6 h-6 text-amber-300 transition-all duration-300 ease-in-out transform ${
            theme === 'light' ? 'rotate-0 scale-100 opacity-100' : 'rotate-90 scale-0 opacity-0'
          }`}
          strokeWidth={2}
        />
        {/* Moon Icon */}
        <Moon
          className={`absolute inset-0 w-6 h-6 text-blue-300 transition-all duration-300 ease-in-out transform ${
            theme === 'dark' ? 'rotate-0 scale-100 opacity-100' : '-rotate-90 scale-0 opacity-0'
          }`}
          strokeWidth={2}
        />
      </div>
    </button>
  );
};

export default ThemeSwitcher;