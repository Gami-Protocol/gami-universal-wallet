import React from 'react';
import { useApp } from '../context/AppContext';
import { Sun, Moon } from 'lucide-react';

export const ThemeToggle = () => {
  const { darkMode, toggleDarkMode } = useApp();

  return (
    <button
      data-testid="theme-toggle"
      onClick={toggleDarkMode}
      className="w-9 h-9 rounded-xl flex items-center justify-center"
      style={{
        background: darkMode ? 'rgba(255,255,255,0.06)' : 'rgba(110,60,251,0.1)',
        border: '1px solid rgba(255,255,255,0.08)',
      }}
    >
      {darkMode ? (
        <Sun size={16} style={{ color: '#A78BFA' }} />
      ) : (
        <Moon size={16} style={{ color: '#6E3CFB' }} />
      )}
    </button>
  );
};

export default ThemeToggle;
