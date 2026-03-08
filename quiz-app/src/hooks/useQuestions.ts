import { useState, useEffect } from 'react';
import { Question } from '../types';
import { loadQuestions } from '../contexts/QuizContext';

/**
 * Хук для загрузки вопросов.
 * Использует кэширование и обработку ошибок.
 *
 * @returns Объект с вопросами, состоянием загрузки и ошибкой.
 */
export const useQuestions = () => {
  const [questions, setQuestions] = useState<Question[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchQuestions = async () => {
      try {
        setLoading(true);
        const data = await loadQuestions();
        setQuestions(data);
        setError(null);
      } catch (err) {
        console.error('Failed to load questions:', err);
        setError('Не удалось загрузить вопросы. Проверьте подключение к интернету.');
      } finally {
        setLoading(false);
      }
    };

    fetchQuestions();
  }, []);

  return { questions, loading, error };
};
