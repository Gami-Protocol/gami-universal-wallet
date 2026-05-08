import React from 'react';
import { useApp } from '../context/AppContext';
import { Sun, Moon } from 'lucide-react';

export default function ThemeToggle() {
  const { darkMode, toggleDarkMode } = useApp();
  return (
    <button
      data-testid="theme-toggle"
      onClick={toggleDarkMode}
      className="w-8 h-8 flex items-center justify-center"
      style={{
        background: 'var(--gami-card)',
        border: '2px solid var(--gami-border)',
        boxShadow: '2px 2px 0px var(--gami-deep)',
        cursor: 'pointer',
      }}
    >
      {darkMode ? <Sun size={14} color="#F59E0B" /> : <Moon size={14} color="#6E3CFB" />}
    </button>
  );
}
