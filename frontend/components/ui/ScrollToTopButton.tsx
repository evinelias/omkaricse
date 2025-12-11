import React, { useState, useEffect } from 'react';
import { ChevronUp } from 'lucide-react';
import { useTheme } from '../../contexts/ThemeContext';

const ScrollToTopButton: React.FC = () => {
  const [isVisible, setIsVisible] = useState(false);
  const { theme } = useTheme();

  const toggleVisibility = () => {
    if (window.scrollY > 300) {
      setIsVisible(true);
    } else {
      setIsVisible(false);
    }
  };

  const scrollToTop = () => {
    window.scrollTo(0, 0);
  };

  useEffect(() => {
    window.addEventListener('scroll', toggleVisibility);
    return () => {
      window.removeEventListener('scroll', toggleVisibility);
    };
  }, []);

  const bgColor = theme === 'light' ? 'bg-blue-600 hover:bg-blue-700' : 'bg-amber-500 hover:bg-amber-400';
  const textColor = theme === 'light' ? 'text-white' : 'text-slate-900';

  return (
    <button
      onClick={scrollToTop}
      aria-label="Scroll to top"
      className={`p-3 rounded-full shadow-lg transition-all duration-300 transform ${bgColor} ${textColor} ${isVisible ? 'opacity-100 scale-100' : 'opacity-0 scale-90 pointer-events-none'} hover:scale-110 focus:outline-none focus:ring-2 focus:ring-offset-2 ${theme === 'light' ? 'focus:ring-blue-500' : 'focus:ring-amber-500'}`}
    >
      <ChevronUp className="w-6 h-6" />
    </button>
  );
};

export default ScrollToTopButton;