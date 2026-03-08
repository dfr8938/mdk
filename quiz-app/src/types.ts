/**
 * Вопрос теста с вариантами ответов и правильными ответами.
 */
export interface Question {
  /** Уникальный идентификатор вопроса */
  id: string;
  /** Текст вопроса */
  question: string;
  /** Массив всех вариантов ответов */
  answers: string[];
  /** Массив текстов правильных ответов (подмножество answers) */
  correct_answers: string[];
  /** Индексы правильных ответов в массиве answers (нумерация с 0) */
  correct_indices: number[];
}

// Расширение глобального объекта Window для Workbox
declare global {
  interface Window {
    workbox?: {
      addEventListener: (event: string, callback: (event: any) => void) => void;
      register: () => Promise<void>;
    };
  }
}
