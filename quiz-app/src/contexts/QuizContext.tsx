import React, {
  createContext,
  useContext,
  useMemo,
  useState,
  useCallback,
  useEffect,
  ReactNode,
} from 'react';
import { Question } from '../types';

/**
 * Контекст состояния приложения тестирования.
 */
interface QuizContextType {
  /** Все загруженные вопросы */
  allQuestions: Question[];
  /** Текущая страница пагинации (начинается с 1) */
  currentPage: number;
  /** Функция установки текущей страницы */
  setCurrentPage: React.Dispatch<React.SetStateAction<number>>;
  /** Строка поискового запроса */
  searchQuery: string;
  /** Функция установки поискового запроса */
  setSearchQuery: React.Dispatch<React.SetStateAction<string>>;
  /** Флаг загрузки данных */
  isLoading: boolean;
  /** Сообщение об ошибке (если есть) */
  errorMessage: string | null;
  /** Вопросы, отфильтрованные по поисковому запросу */
  filteredQuestions: Question[];
  /** Общее количество страниц после фильтрации */
  totalPages: number;
  /** Количество вопросов на одной странице */
  itemsPerPage: number;
  /** Обработчик изменения страницы */
  handlePageChange: (page: number) => void;
  /** Показать ошибку с сообщением (автоскрытие через 5 сек) */
  showError: (message: string) => void;
  /** Закрыть ошибку вручную */
  closeError: () => void;
  /** Повторная попытка загрузки вопросов */
  retryLoad: () => void;
}

/** Контекст викторины. */
const QuizContext = createContext<QuizContextType | undefined>(undefined);

/** Ключ для хранения кэша вопросов в localStorage. */
const CACHE_KEY = 'quiz-app-questions';
/** Время жизни кэша в миллисекундах (24 часа). */
const CACHE_TTL = 24 * 60 * 60 * 1000; // 24 часа

/**
 * Загружает вопросы из кэша localStorage или с сервера.
 * Использует TTL 24 часа для инвалидации кэша.
 *
 * @returns Промис с массивом вопросов.
 * @throws Ошибка при неудачной загрузке.
 */
async function loadQuestions(): Promise<Question[]> {
  const cached = localStorage.getItem(CACHE_KEY);
  if (cached) {
    try {
      const { data, timestamp } = JSON.parse(cached);
      if (Date.now() - timestamp < CACHE_TTL) {
        console.log('Используем кэшированные вопросы');
        return data;
      }
    } catch (e) {
      console.warn('Ошибка чтения кэша', e);
    }
  }
  // Загрузка с сервера
  try {
    const response = await fetch('/questions.json');
    if (!response.ok) throw new Error(`HTTP ${response.status}`);
    const data = await response.json();
    // Сохраняем в кэш
    localStorage.setItem(
      CACHE_KEY,
      JSON.stringify({
        data,
        timestamp: Date.now(),
      })
    );
    console.log('Вопросы загружены и сохранены в кэш');
    return data;
  } catch (error) {
    console.error('Ошибка загрузки вопросов:', error);
    throw error;
  }
}

/** Свойства провайдера контекста викторины. */
interface QuizProviderProps {
  children: ReactNode;
}

/**
 * Провайдер контекста викторины.
 * Управляет состоянием вопросов, фильтрацией, пагинацией и загрузкой.
 */
export const QuizProvider: React.FC<QuizProviderProps> = ({ children }) => {
  const [allQuestions, setAllQuestions] = useState<Question[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [searchQuery, setSearchQuery] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const itemsPerPage = 20;

  // Загрузка вопросов при монтировании
  useEffect(() => {
    setIsLoading(true);
    loadQuestions()
      .then(data => {
        setAllQuestions(data);
        setErrorMessage(null);
      })
      .catch(error => {
        console.error('Error loading questions:', error);
        showError('Не удалось загрузить вопросы. Проверьте подключение к интернету.');
      })
      .finally(() => setIsLoading(false));
  }, []);

  const filteredQuestions = useMemo(() => {
    return allQuestions.filter(q => {
      const query = searchQuery.toLowerCase().trim();
      if (!query) return true;
      return (
        q.question.toLowerCase().includes(query) ||
        q.correct_answers.some((ans: string) => ans.toLowerCase().includes(query))
      );
    });
  }, [allQuestions, searchQuery]);

  const totalPages = Math.ceil(filteredQuestions.length / itemsPerPage);

  const handlePageChange = useCallback(
    (page: number) => {
      if (page >= 1 && page <= totalPages) {
        setCurrentPage(page);
        window.scrollTo({ top: 0, behavior: 'smooth' });
      }
    },
    [totalPages]
  );

  const showError = useCallback((message: string) => {
    setErrorMessage(message);
    setTimeout(() => {
      setErrorMessage(null);
    }, 5000);
  }, []);

  const closeError = useCallback(() => {
    setErrorMessage(null);
  }, []);

  const retryLoad = useCallback(() => {
    setIsLoading(true);
    setErrorMessage(null);
    loadQuestions()
      .then(data => {
        setAllQuestions(data);
      })
      .catch(error => {
        console.error('Error retrying load:', error);
        showError('Не удалось загрузить вопросы. Проверьте подключение к интернету.');
      })
      .finally(() => setIsLoading(false));
  }, [showError]);

  const value: QuizContextType = {
    allQuestions,
    currentPage,
    setCurrentPage,
    searchQuery,
    setSearchQuery,
    isLoading,
    errorMessage,
    filteredQuestions,
    totalPages,
    itemsPerPage,
    handlePageChange,
    showError,
    closeError,
    retryLoad,
  };

  return <QuizContext.Provider value={value}>{children}</QuizContext.Provider>;
};

/**
 * Хук для использования контекста викторины.
 * @returns Контекст викторины.
 * @throws Ошибка, если хук используется вне QuizProvider.
 */
export const useQuiz = () => {
  const context = useContext(QuizContext);
  if (context === undefined) {
    throw new Error('useQuiz must be used within a QuizProvider');
  }
  return context;
};

export { loadQuestions };
