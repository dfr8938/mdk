import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';

type Theme = 'light' | 'dark';

/** Контекст темы приложения. */
interface ThemeContextType {
  /** Текущая тема (light/dark). */
  theme: Theme;
  /** Устанавливает тему напрямую. */
  setTheme: (theme: Theme) => void;
  /** Переключает тему на противоположную. */
  toggleTheme: () => void;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

/** Ключ для хранения темы в localStorage. */
const THEME_STORAGE_KEY = 'quiz-app-theme';

/**
 * Получает сохранённую тему из localStorage.
 * Если сохранённой темы нет или она некорректна, возвращает 'light'.
 */
function getStoredTheme(): Theme {
  const stored = localStorage.getItem(THEME_STORAGE_KEY);
  if (stored === 'light' || stored === 'dark') {
    return stored;
  }
  // По умолчанию светлая тема
  return 'light';
}

/** Свойства провайдера темы. */
interface ThemeProviderProps {
  children: ReactNode;
}

/**
 * Провайдер контекста темы.
 * Управляет темой приложения, сохранением в localStorage и применением CSS-классов.
 */
export const ThemeProvider: React.FC<ThemeProviderProps> = ({ children }) => {
  const [theme, setTheme] = useState<Theme>(getStoredTheme);

  // Сохраняем тему в localStorage
  useEffect(() => {
    localStorage.setItem(THEME_STORAGE_KEY, theme);
  }, [theme]);

  // Применяем класс темы к body для глобальных стилей
  useEffect(() => {
    const body = document.body;
    body.classList.remove('theme-light', 'theme-dark', 'theme-auto');
    body.classList.add(`theme-${theme}`);
  }, [theme]);

  const toggleTheme = () => {
    setTheme(prev => (prev === 'light' ? 'dark' : 'light'));
  };

  const value: ThemeContextType = {
    theme,
    setTheme,
    toggleTheme,
  };

  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>;
};

/**
 * Хук для использования контекста темы.
 * @returns Контекст темы.
 * @throws Ошибка, если хук используется вне ThemeProvider.
 */
export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (context === undefined) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
};
