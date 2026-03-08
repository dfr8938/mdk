// Автор: Denis Frolov <d.fr8938@gmail.com/>
import { useEffect, useMemo, useState, lazy, Suspense } from 'react';
import styled from 'styled-components';
import { fadeIn } from './styles/animations';
import Header from './components/layout/Header';
import SearchBar from './components/features/SearchBar';
import QuestionCard from './components/features/QuestionCard';
import { UpdateToast } from './components/features/UpdateToast';
import { useQuiz } from './contexts/QuizContext';

// Ленивая загрузка не критичных компонентов
const Pagination = lazy(() => import('./components/features/Pagination'));
const ScrollToTopButton = lazy(() => import('./components/features/ScrollToTopButton'));

const Root = styled.div`
  max-width: 1400px;
  margin: 0 auto;
  padding: 2rem;
  background-color: var(--color-card-bg);
  animation: ${fadeIn} 0.6s ease-out;
  @media (max-width: 768px) {
    padding: 1.5rem;
  }
  @media (max-width: 576px) {
    padding: 1rem;
  }
  @media (max-width: 400px) {
    padding: 0.75rem;
  }
`;

const AppContainer = styled.div`
  display: flex;
  flex-direction: column;
  min-height: 100vh;
`;

const CardsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 1.5rem;
  margin-bottom: 2rem;
  @media (max-width: 1200px) {
    grid-template-columns: repeat(4, 1fr);
  }
  @media (max-width: 992px) {
    grid-template-columns: repeat(3, 1fr);
  }
  @media (max-width: 768px) {
    grid-template-columns: repeat(2, 1fr);
    gap: 1.2rem;
  }
  @media (max-width: 576px) {
    grid-template-columns: 1fr;
    gap: 1rem;
  }
`;

const Footer = styled.footer`
  margin-top: auto;
  color: var(--color-subtitle);
  font-size: 0.9rem;
  padding-top: 1.5rem;
  border-top: 1px solid var(--color-border);
  text-align: center;
  @media (max-width: 576px) {
    font-size: 0.85rem;
    padding-top: 1.2rem;
  }
`;

const Spinner = styled.div`
  display: inline-block;
  width: 3rem;
  height: 3rem;
  border: 4px solid var(--color-border);
  border-radius: 50%;
  border-top-color: var(--color-primary);
  animation: spin 1s ease-in-out infinite;
  @keyframes spin {
    to {
      transform: rotate(360deg);
    }
  }
`;

const LoadingContainer = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: var(--color-bg);
  display: flex;
  align-items: center;
  justify-content: center;
  flex-direction: column;
  gap: 1.5rem;
  z-index: 1000;
  color: var(--color-text);
  font-size: 1.2rem;
`;

const ErrorNotification = styled.div`
  position: fixed;
  top: 1rem;
  right: 1rem;
  background-color: var(--color-error-bg);
  color: white;
  padding: 1rem 1.5rem;
  border-radius: 8px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.2);
  z-index: 2000;
  display: flex;
  align-items: center;
  justify-content: space-between;
  max-width: 400px;
  animation: ${fadeIn} 0.3s ease-out;
  @media (max-width: 576px) {
    top: 0.5rem;
    right: 0.5rem;
    left: 0.5rem;
    max-width: none;
  }
`;

const ErrorMessage = styled.span`
  flex-grow: 1;
  margin-right: 1rem;
`;

const RetryButton = styled.button`
  background: rgba(255, 255, 255, 0.2);
  border: 1px solid rgba(255, 255, 255, 0.4);
  color: white;
  font-size: 0.85rem;
  cursor: pointer;
  padding: 0.4rem 0.8rem;
  border-radius: 4px;
  margin-right: 0.5rem;
  transition: background 0.2s;
  &:hover {
    background: rgba(255, 255, 255, 0.3);
  }
  &:active {
    transform: scale(0.98);
  }
`;

const CloseButton = styled.button`
  background: transparent;
  border: none;
  color: white;
  font-size: 1.2rem;
  cursor: pointer;
  padding: 0;
  width: 1.5rem;
  height: 1.5rem;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 50%;
  &:hover {
    background-color: rgba(255, 255, 255, 0.2);
  }
`;

function App() {
  const {
    allQuestions,
    isLoading,
    errorMessage,
    currentPage,
    setCurrentPage,
    searchQuery,
    setSearchQuery,
    filteredQuestions,
    totalPages,
    itemsPerPage,
    handlePageChange,
    closeError,
    retryLoad,
  } = useQuiz();

  const [showScrollButton, setShowScrollButton] = useState(false);

  // Сброс страницы на 1 при изменении поискового запроса
  useEffect(() => {
    setCurrentPage(1);
  }, [searchQuery, setCurrentPage]);

  // Отслеживание прокрутки для кнопки "Наверх"
  useEffect(() => {
    const handleScroll = () => {
      setShowScrollButton(window.scrollY > 400);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Управление с клавиатуры: стрелки для пагинации
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Игнорируем, если фокус в поле ввода или textarea
      if (e.target instanceof HTMLInputElement || e.target instanceof HTMLTextAreaElement) {
        return;
      }
      if (e.key === 'ArrowLeft') {
        e.preventDefault();
        handlePageChange(currentPage - 1);
      } else if (e.key === 'ArrowRight') {
        e.preventDefault();
        handlePageChange(currentPage + 1);
      }
    };
    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [currentPage, handlePageChange]);

  // Вычисление вопросов для текущей страницы
  const displayQuestions = useMemo(() => {
    const start = (currentPage - 1) * itemsPerPage;
    const end = start + itemsPerPage;
    return filteredQuestions.slice(start, end);
  }, [filteredQuestions, currentPage, itemsPerPage]);

  if (isLoading) {
    return (
      <LoadingContainer aria-live="polite" aria-busy="true">
        <Spinner />
        <div>Загрузка вопросов...</div>
      </LoadingContainer>
    );
  }

  if (allQuestions.length === 0) {
    return (
      <LoadingContainer aria-live="polite" aria-busy="true">
        <div style={{ color: 'var(--color-error-bg)', fontSize: '1.1rem', marginBottom: '1rem' }}>
          Не удалось загрузить вопросы. Проверьте подключение к интернету.
        </div>
        <RetryButton
          onClick={retryLoad}
          style={{ background: 'var(--color-primary)', border: 'none', padding: '0.6rem 1.2rem' }}
          className="ripple"
        >
          Повторить попытку
        </RetryButton>
      </LoadingContainer>
    );
  }

  return (
    <Root>
      <AppContainer>
        <Header totalQuestions={allQuestions.length} filteredQuestions={filteredQuestions.length} />
        <SearchBar
          searchQuery={searchQuery}
          setSearchQuery={setSearchQuery}
          filteredCount={filteredQuestions.length}
          totalCount={allQuestions.length}
        />
        <main aria-label="Список вопросов">
          <CardsGrid role="list" aria-label="Сетка вопросов">
            {displayQuestions.map((q, idx) => {
              const delay = `${idx * 0.05}s`;
              const globalIndex = allQuestions.findIndex(item => item.id === q.id);
              return (
                <QuestionCard
                  key={q.id}
                  question={q}
                  index={idx}
                  startIndex={globalIndex}
                  delay={delay}
                />
              );
            })}
          </CardsGrid>
          {filteredQuestions.length > 0 && (
            <Suspense fallback={<div style={{ height: '60px' }} />}>
              <Pagination
                currentPage={currentPage}
                totalPages={totalPages}
                onPageChange={handlePageChange}
              />
            </Suspense>
          )}
        </main>
        <Footer>
          <p>Тестирование по дисциплине МДК.03.01 — вопросы и ответы для самопроверки.</p>
        </Footer>
        <Suspense fallback={null}>
          <ScrollToTopButton visible={showScrollButton} onClick={scrollToTop} />
        </Suspense>
      </AppContainer>
      {errorMessage && (
        <ErrorNotification role="alert" aria-live="assertive">
          <ErrorMessage>{errorMessage}</ErrorMessage>
          <div style={{ display: 'flex', alignItems: 'center' }}>
            <RetryButton onClick={retryLoad} aria-label="Повторить загрузку" className="ripple">
              Повторить
            </RetryButton>
            <CloseButton onClick={closeError} aria-label="Закрыть уведомление" className="ripple">
              ×
            </CloseButton>
          </div>
        </ErrorNotification>
      )}
      <UpdateToast />
    </Root>
  );
}

export default App;
