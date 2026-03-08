import styled from 'styled-components';
import { useTheme } from '../../contexts/ThemeContext';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSun, faMoon } from '@fortawesome/free-solid-svg-icons';

interface HeaderProps {
  totalQuestions: number;
  filteredQuestions: number;
}

const HeaderStyled = styled.header`
  margin-bottom: 2rem;
  text-align: center;
  position: relative;
  @media (max-width: 576px) {
    margin-bottom: 1.5rem;
  }
`;

const Title = styled.h1`
  color: var(--color-text);
  margin-bottom: 0.5rem;
  font-weight: 700;
  font-size: 2.4rem;
  line-height: 1.2;
  letter-spacing: -0.01em;
  @media (max-width: 992px) {
    font-size: 2rem;
  }
  @media (max-width: 768px) {
    font-size: 1.8rem;
  }
  @media (max-width: 576px) {
    font-size: 1.6rem;
  }
`;

const Subtitle = styled.p`
  color: var(--color-subtitle);
  font-size: 1.1rem;
  font-weight: 400;
  line-height: 1.5;
  @media (max-width: 576px) {
    font-size: 1rem;
  }
`;

const ThemeToggleContainer = styled.div`
  position: absolute;
  top: 0;
  right: 0;
  display: flex;
  gap: 0.5rem;
  align-items: center;
  @media (max-width: 768px) {
    position: static;
    justify-content: center;
    margin-top: 1rem;
  }
`;

const ThemeButton = styled.button<{ $active?: boolean }>`
  background: ${({ $active, theme }) =>
    $active
      ? theme === 'dark'
        ? 'var(--color-primary)'
        : 'var(--color-primary)'
      : theme === 'dark'
      ? 'var(--color-button-bg)'
      : 'var(--color-button-bg)'};
  color: ${({ $active, theme }) =>
    $active
      ? theme === 'dark'
        ? 'var(--color-pagination-text-active)'
        : 'var(--color-pagination-text-active)'
      : theme === 'dark'
      ? 'var(--color-text)'
      : 'var(--color-text)'};
  border: 1px solid ${({ theme }) => (theme === 'dark' ? 'var(--color-border)' : 'var(--color-border)')};
  border-radius: 20px;
  padding: 0.5rem 1rem;
  font-size: 0.9rem;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  transition:
    background 0.2s,
    transform 0.1s,
    opacity 0.2s;
  &:hover {
    background: ${({ $active, theme }) =>
      $active
        ? theme === 'dark'
          ? 'var(--color-primary-hover)'
          : 'var(--color-primary-hover)'
        : theme === 'dark'
        ? 'var(--color-card-bg-hover)'
        : 'var(--color-card-bg-hover)'};
    transform: scale(1.05);
  }
  &:active {
    transform: scale(0.98);
  }
  @media (max-width: 576px) {
    padding: 0.4rem 0.8rem;
    font-size: 0.85rem;
  }
`;

function Header({ totalQuestions, filteredQuestions }: HeaderProps) {
  const { theme, setTheme } = useTheme();

  const themeButtons = [
    { key: 'light' as const, icon: faSun, label: 'Светлая' },
    { key: 'dark' as const, icon: faMoon, label: 'Тёмная' },
  ];

  return (
    <HeaderStyled>
      <Title theme={theme}>Тестирование</Title>
      <Subtitle theme={theme}>
        Всего вопросов: {totalQuestions} (найдено: {filteredQuestions})
      </Subtitle>
      <ThemeToggleContainer>
        {themeButtons.map(({ key, icon, label }) => (
          <ThemeButton
            key={key}
            $active={theme === key}
            onClick={() => setTheme(key)}
            theme={theme}
            aria-label={`Тема: ${label}`}
            aria-pressed={theme === key}
          >
            <FontAwesomeIcon icon={icon} />
            <span>{label}</span>
          </ThemeButton>
        ))}
      </ThemeToggleContainer>
    </HeaderStyled>
  );
}

export default Header;
