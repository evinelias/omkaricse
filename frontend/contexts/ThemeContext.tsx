import React, { createContext, useState, useEffect, useContext, ReactNode } from 'react';

type Theme = 'light' | 'dark';

interface ThemeContextType {
  theme: Theme;
  toggleTheme: () => void;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

const getInitialTheme = (): Theme => {
  // This function is safe to run on the client-side
  if (typeof window !== 'undefined') {
    const savedTheme = localStorage.getItem('theme');
    // Default to light unless 'dark' is explicitly set
    if (savedTheme === 'dark') {
      return 'dark';
    }
    return 'light';
  }
  // Default for server-side rendering or non-browser environments
  return 'light';
};

export const ThemeProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  // Use the lazy initializer function to set the state only once
  const [theme, setTheme] = useState<Theme>(getInitialTheme);

  useEffect(() => {
    // This effect now runs after the initial state is correctly set,
    // and whenever the theme state changes.
    const root = window.document.documentElement;
    
    if (theme === 'dark') {
      root.classList.add('dark');
    } else {
      root.classList.remove('dark');
    }
    
    // Persist the theme choice in localStorage
    localStorage.setItem('theme', theme);
  }, [theme]);

  const toggleTheme = () => {
    setTheme((prevTheme) => (prevTheme === 'light' ? 'dark' : 'light'));
  };
  
  return (
    <ThemeContext.Provider value={{ theme, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = (): ThemeContextType => {
  const context = useContext(ThemeContext);
  if (context === undefined) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
};