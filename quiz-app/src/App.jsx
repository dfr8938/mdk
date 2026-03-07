// Автор: Denis Frolov <d.fr8938@gmail.com/>
import { useState, useEffect } from 'react'
import styled, { keyframes } from 'styled-components'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faChevronLeft, faChevronRight, faArrowUp } from '@fortawesome/free-solid-svg-icons'

const fadeIn = keyframes`
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
`

const slideIn = keyframes`
  from {
    opacity: 0;
    transform: translateX(-10px);
  }
  to {
    opacity: 1;
    transform: translateX(0);
  }
`

const pulse = keyframes`
  0% {
    box-shadow: 0 0 0 0 rgba(33, 150, 243, 0.4);
  }
  70% {
    box-shadow: 0 0 0 10px rgba(33, 150, 243, 0);
  }
  100% {
    box-shadow: 0 0 0 0 rgba(33, 150, 243, 0);
  }
`

const Root = styled.div`
  max-width: 1400px;
  margin: 0 auto;
  padding: 2rem;
  background-color: #fefefe;
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
`

const AppContainer = styled.div`
  display: flex;
  flex-direction: column;
  min-height: 100vh;
`

const Header = styled.header`
  margin-bottom: 2rem;
  text-align: center;
  @media (max-width: 576px) {
    margin-bottom: 1.5rem;
  }
`

const Title = styled.h1`
  color: #444;
  margin-bottom: 0.5rem;
  font-weight: 600;
  font-size: 2.2rem;
  line-height: 1.2;
  @media (max-width: 992px) {
    font-size: 1.9rem;
  }
  @media (max-width: 768px) {
    font-size: 1.7rem;
  }
  @media (max-width: 576px) {
    font-size: 1.5rem;
  }
`

const Subtitle = styled.p`
  color: #777;
  font-size: 1.1rem;
  @media (max-width: 576px) {
    font-size: 1rem;
  }
`

const SearchContainer = styled.div`
  margin: 1.5rem auto 2rem;
  max-width: 600px;
  width: 100%;
  box-sizing: border-box;
  animation: ${slideIn} 0.4s ease-out;
  @media (max-width: 768px) {
    margin: 1rem auto 1.5rem;
    padding: 0 0.5rem;
    max-width: calc(100% - 1rem);
  }
  @media (max-width: 400px) {
    max-width: calc(100% - 0.5rem);
  }
`

const SearchInput = styled.input`
  width: 100%;
  padding: 0.8rem 1.2rem;
  background: linear-gradient(180deg, #fdfdfd, #f7f7f7);
  border: 1px solid #ddd;
  border-radius: 12px;
  font-size: 1rem;
  color: #444;
  box-shadow: 0 2px 6px rgba(0, 0, 0, 0.03);
  transition: border-color 0.3s, box-shadow 0.3s, background 0.3s, transform 0.2s;
  -webkit-appearance: none;
  -moz-appearance: none;
  appearance: none;
  box-sizing: border-box;
  &:hover {
    background: linear-gradient(180deg, #fafafa, #f3f3f3);
    transform: translateY(-2px);
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.05);
  }
  &:focus {
    outline: none;
    border-color: #90caf9;
    box-shadow: 0 0 0 3px rgba(144, 202, 249, 0.3);
    background: #ffffff;
    transform: translateY(-2px);
  }
  &::placeholder {
    color: #aaa;
  }
  @media (max-width: 576px) {
    padding: 0.7rem 1rem;
    font-size: 0.95rem;
  }
  @media (max-width: 400px) {
    padding: 0.6rem 0.8rem;
    font-size: 0.9rem;
  }
`

const SearchInfo = styled.p`
  margin-top: 0.5rem;
  color: #777;
  font-size: 0.9rem;
  text-align: center;
  opacity: 0.9;
  @media (max-width: 576px) {
    font-size: 0.85rem;
  }
`

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
`

const Card = styled.div`
  background: linear-gradient(145deg, #ffffff, #fafafa);
  border-radius: 16px;
  box-shadow: 0 6px 24px rgba(0, 0, 0, 0.08);
  padding: 1.5rem;
  border: 1px solid #e0e0e0;
  display: flex;
  flex-direction: column;
  transition: transform 0.3s cubic-bezier(0.25, 0.8, 0.25, 1), box-shadow 0.3s;
  word-wrap: break-word;
  overflow-wrap: break-word;
  animation: ${fadeIn} 0.5s ease-out;
  animation-fill-mode: both;
  animation-delay: ${props => props.$delay || '0ms'};
  &:hover {
    transform: translateY(-8px) scale(1.02);
    box-shadow: 0 16px 40px rgba(0, 0, 0, 0.15);
  }
  @media (max-width: 768px) {
    padding: 1.3rem;
  }
  @media (max-width: 576px) {
    padding: 1.2rem;
    border-radius: 14px;
  }
  @media (max-width: 400px) {
    padding: 1rem;
    border-radius: 12px;
  }
`

const CardHeader = styled.div`
  display: flex;
  justify-content: flex-end;
  margin-bottom: 1rem;
  font-size: 0.9rem;
  color: #888;
  @media (max-width: 576px) {
    font-size: 0.85rem;
  }
`

const CardId = styled.span`
  font-weight: 500;
`

const CardNumber = styled.span`
  background-color: #e3f2fd;
  color: #1976d2;
  padding: 0.2rem 0.6rem;
  border-radius: 12px;
  font-weight: 500;
  @media (max-width: 576px) {
    padding: 0.15rem 0.5rem;
    font-size: 0.85rem;
  }
`

const Question = styled.div`
  color: #333;
  font-size: 1rem;
  line-height: 1.5;
  margin-bottom: 1.2rem;
  font-weight: 500;
  flex-grow: 1;
  word-wrap: break-word;
  overflow-wrap: break-word;
  @media (max-width: 576px) {
    font-size: 0.95rem;
    margin-bottom: 1rem;
  }
`

const Divider = styled.hr`
  border: none;
  border-top: 1px solid #e0e0e0;
  margin: 1rem 0;
  width: 100%;
  @media (max-width: 576px) {
    margin: 0.8rem 0;
  }
`

const CorrectAnswer = styled.div`
  background: #e8f5e9;
  border: 1px solid #c8e6c9;
  border-radius: 10px;
  padding: 1rem;
  color: #2e7d32;
  font-size: 0.85rem;
  line-height: 1.5;
  word-wrap: break-word;
  overflow-wrap: break-word;
  @media (max-width: 576px) {
    padding: 0.8rem;
    font-size: 0.8rem;
  }
`

const Strong = styled.strong`
  color: #1b5e20;
`

const PaginationContainer = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 1rem;
  margin: 2rem 0;
  flex-wrap: wrap;
  animation: ${fadeIn} 0.5s ease-out;
  @media (max-width: 768px) {
    gap: 0.7rem;
    margin: 1.5rem 0;
  }
  @media (max-width: 576px) {
    gap: 0.5rem;
    margin: 1.2rem 0;
  }
`

const PageButton = styled.button`
  background: ${props => props.$active ? '#1976d2' : '#ffffff'};
  color: ${props => props.$active ? '#ffffff' : '#333'};
  border: 1px solid #ccc;
  border-radius: 8px;
  padding: 0.5rem 1rem;
  font-size: 0.9rem;
  cursor: pointer;
  transition: background 0.3s, transform 0.2s, box-shadow 0.3s;
  -webkit-tap-highlight-color: transparent;
  animation: ${props => props.$active ? pulse : 'none'} 1.5s infinite;
  &:hover {
    background: ${props => props.$active ? '#1565c0' : '#f5f5f5'};
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
    transform: translateY(-2px);
  }
  &:active {
    transform: scale(0.95);
  }
  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
    animation: none;
  }
  @media (max-width: 768px) {
    padding: 0.4rem 0.8rem;
    font-size: 0.85rem;
  }
  @media (max-width: 576px) {
    padding: 0.35rem 0.7rem;
    font-size: 0.8rem;
    min-width: 2.2rem;
  }
`

const NavButton = styled(PageButton)`
  min-width: 2.5rem;
  padding: 0.5rem;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.2rem;
  line-height: 1;
  border-radius: 50%;
  width: 2.5rem;
  height: 2.5rem;
  transition: transform 0.3s, background 0.3s;
  &:hover {
    transform: scale(1.1);
  }
  @media (max-width: 768px) {
    width: 2.2rem;
    height: 2.2rem;
    min-width: 2.2rem;
    padding: 0.4rem;
    font-size: 1.1rem;
  }
  @media (max-width: 576px) {
    width: 2rem;
    height: 2rem;
    min-width: 2rem;
    padding: 0.35rem;
    font-size: 1rem;
  }
`

const PageInfo = styled.span`
  font-size: 1rem;
  color: #555;
  @media (max-width: 768px) {
    font-size: 0.9rem;
  }
  @media (max-width: 576px) {
    font-size: 0.85rem;
  }
`

const ScrollToTopButton = styled.button`
  position: fixed;
  bottom: 2rem;
  right: 2rem;
  width: 3.5rem;
  height: 3.5rem;
  border-radius: 50%;
  background: linear-gradient(135deg, #1976d2, #2196f3);
  color: white;
  border: none;
  box-shadow: 0 4px 16px rgba(33, 150, 243, 0.4);
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.5rem;
  z-index: 1000;
  opacity: ${props => props.$visible ? '1' : '0'};
  visibility: ${props => props.$visible ? 'visible' : 'hidden'};
  transition: opacity 0.3s, visibility 0.3s, transform 0.2s;
  transform: scale(${props => props.$visible ? '1' : '0.8'});
  -webkit-tap-highlight-color: transparent;
  animation: ${props => props.$visible ? pulse : 'none'} 2s infinite;
  svg {
    width: 1.5em;
    height: 1.5em;
  }
  &:hover {
    background: linear-gradient(135deg, #1565c0, #1976d2);
    transform: scale(1.05);
    box-shadow: 0 6px 20px rgba(33, 150, 243, 0.6);
    animation: none;
  }
  &:active {
    transform: scale(0.95);
  }
  @media (max-width: 768px) {
    width: 3rem;
    height: 3rem;
    font-size: 1.3rem;
    bottom: 1.5rem;
    right: 1.5rem;
  }
  @media (max-width: 576px) {
    width: 2.8rem;
    height: 2.8rem;
    font-size: 1.2rem;
    bottom: 1.2rem;
    right: 1.2rem;
  }
`

const Footer = styled.footer`
  margin-top: auto;
  color: #888;
  font-size: 0.9rem;
  padding-top: 1.5rem;
  border-top: 1px solid #e0e0e0;
  text-align: center;
  @media (max-width: 576px) {
    font-size: 0.85rem;
    padding-top: 1.2rem;
  }
`

function App() {
  const [questions, setQuestions] = useState([])
  const [currentPage, setCurrentPage] = useState(1)
  const [searchQuery, setSearchQuery] = useState('')
  const [showScrollButton, setShowScrollButton] = useState(false)
  const itemsPerPage = 20

  useEffect(() => {
    fetch('/questions.json')
      .then(response => response.json())
      .then(data => setQuestions(data))
      .catch(error => console.error('Error loading questions:', error))
  }, [])

  // Сброс страницы на 1 при изменении поискового запроса
  useEffect(() => {
    setCurrentPage(1)
  }, [searchQuery])

  // Отслеживание прокрутки для кнопки "Наверх"
  useEffect(() => {
    const handleScroll = () => {
      setShowScrollButton(window.scrollY > 400)
    }
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  if (questions.length === 0) {
    return <Root>Загрузка вопросов...</Root>
  }

  // Фильтрация вопросов по поисковому запросу
  const filteredQuestions = questions.filter(q => {
    const query = searchQuery.toLowerCase().trim()
    if (!query) return true
    return (
      q.question.toLowerCase().includes(query) ||
      q.correct_answers.some(ans => ans.toLowerCase().includes(query))
    )
  })

  // Вычисление отображаемых вопросов (пагинация)
  const totalPages = Math.ceil(filteredQuestions.length / itemsPerPage)
  const startIndex = (currentPage - 1) * itemsPerPage
  const endIndex = startIndex + itemsPerPage
  const currentQuestions = filteredQuestions.slice(startIndex, endIndex)

  const handlePageChange = (page) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page)
      window.scrollTo({ top: 0, behavior: 'smooth' })
    }
  }

  const renderPageNumbers = () => {
    const pages = []
    const maxVisible = 5
    let startPage = Math.max(1, currentPage - Math.floor(maxVisible / 2))
    let endPage = Math.min(totalPages, startPage + maxVisible - 1)

    if (endPage - startPage + 1 < maxVisible) {
      startPage = Math.max(1, endPage - maxVisible + 1)
    }

    for (let i = startPage; i <= endPage; i++) {
      pages.push(
        <PageButton
          key={i}
          $active={i === currentPage}
          onClick={() => handlePageChange(i)}
        >
          {i}
        </PageButton>
      )
    }
    return pages
  }

  return (
    <Root>
      <AppContainer>
        <Header>
          <Title>Тестирование</Title>
          <Subtitle>Всего вопросов: {questions.length} (найдено: {filteredQuestions.length})</Subtitle>
        </Header>
        <SearchContainer>
          <SearchInput
            type="text"
            placeholder="Поиск по вопросам и ответам..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
          <SearchInfo>
            {searchQuery && filteredQuestions.length === 0
              ? 'Ничего не найдено.'
              : searchQuery
              ? `Найдено вопросов: ${filteredQuestions.length}`
              : 'Введите текст для поиска'}
          </SearchInfo>
        </SearchContainer>
        <main>
          <CardsGrid>
            {currentQuestions.map((q, idx) => {
              const delay = `${idx * 0.05}s`;
              return (
                <Card key={q.id} $delay={delay}>
                  <CardHeader>
                    <CardNumber>Вопрос {startIndex + idx + 1}</CardNumber>
                  </CardHeader>
                  <Question>
                    <h3>{q.question}</h3>
                  </Question>
                  <Divider />
                  <CorrectAnswer>
                    {q.correct_answers.join(', ')}
                  </CorrectAnswer>
                </Card>
              );
            })}
          </CardsGrid>
          {filteredQuestions.length > 0 && (
            <PaginationContainer>
              <NavButton
                onClick={() => handlePageChange(currentPage - 1)}
                disabled={currentPage === 1}
                aria-label="Предыдущая страница"
              >
                <FontAwesomeIcon icon={faChevronLeft} />
              </NavButton>
              {renderPageNumbers()}
              <NavButton
                onClick={() => handlePageChange(currentPage + 1)}
                disabled={currentPage === totalPages}
                aria-label="Следующая страница"
              >
                <FontAwesomeIcon icon={faChevronRight} />
              </NavButton>
              <PageInfo>
                Страница {currentPage} из {totalPages}
              </PageInfo>
            </PaginationContainer>
          )}
        </main>
        <Footer>
          <p>Тестирование по дисциплине МДК.03.01 — вопросы и ответы для самопроверки.</p>
        </Footer>
        <ScrollToTopButton
          $visible={showScrollButton}
          onClick={scrollToTop}
          aria-label="Наверх"
        >
          <FontAwesomeIcon icon={faArrowUp} />
        </ScrollToTopButton>
      </AppContainer>
    </Root>
  )
}

export default App
