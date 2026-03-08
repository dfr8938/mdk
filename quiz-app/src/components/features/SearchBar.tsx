import { memo } from 'react';
import styled from 'styled-components';
import { slideIn } from '../../styles/animations';

interface SearchBarProps {
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  filteredCount: number;
  totalCount: number;
}

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
`;

const SearchInput = styled.input`
  width: 100%;
  padding: 0.8rem 1.2rem;
  background: linear-gradient(
    180deg,
    var(--color-card-bg-light, #fdfdfd),
    var(--color-card-bg, #f7f7f7)
  );
  border: 1px solid var(--color-border);
  border-radius: 12px;
  font-size: 1rem;
  color: var(--color-text);
  box-shadow: 0 2px 6px var(--color-card-shadow);
  transition:
    border-color 0.3s,
    box-shadow 0.3s,
    background 0.3s,
    transform 0.2s;
  -webkit-appearance: none;
  -moz-appearance: none;
  appearance: none;
  box-sizing: border-box;
  &:hover {
    background: linear-gradient(
      180deg,
      var(--color-card-bg-hover, #fafafa),
      var(--color-card-bg-light, #f3f3f3)
    );
    transform: translateY(-2px);
    box-shadow:
      0 4px 12px var(--color-card-shadow-hover),
      0 0 8px var(--color-search-hover-glow, rgba(0, 0, 0, 0.1));
  }
  &:focus {
    outline: none;
    border-color: var(--color-primary);
    box-shadow: 0 0 0 3px var(--color-primary-shadow, rgba(144, 202, 249, 0.3));
    background: var(--color-card-bg);
    transform: translateY(-2px);
  }
  &::placeholder {
    color: var(--color-subtitle);
  }
  @media (max-width: 576px) {
    padding: 0.7rem 1rem;
    font-size: 0.95rem;
  }
  @media (max-width: 400px) {
    padding: 0.6rem 0.8rem;
    font-size: 0.9rem;
  }
`;

const SearchInfo = styled.p`
  margin-top: 0.5rem;
  color: var(--color-subtitle);
  font-size: 0.9rem;
  text-align: center;
  opacity: 0.9;
  @media (max-width: 576px) {
    font-size: 0.85rem;
  }
`;

function SearchBar({ searchQuery, setSearchQuery, filteredCount, totalCount }: SearchBarProps) {
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
  };

  return (
    <SearchContainer>
      <SearchInput
        type="text"
        placeholder="Поиск по вопросам и ответам..."
        value={searchQuery}
        onChange={handleChange}
        aria-label="Поиск вопросов"
      />
      <SearchInfo>
        {searchQuery && filteredCount === 0
          ? 'Ничего не найдено.'
          : searchQuery
            ? `Найдено вопросов: ${filteredCount}`
            : `Введите текст для поиска (всего вопросов: ${totalCount})`}
      </SearchInfo>
    </SearchContainer>
  );
}

export default memo(SearchBar);
