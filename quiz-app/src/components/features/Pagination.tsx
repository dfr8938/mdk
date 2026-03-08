import { memo, useCallback } from 'react';
import styled from 'styled-components';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faChevronLeft, faChevronRight } from '@fortawesome/free-solid-svg-icons';
import { fadeIn, pulse } from '../../styles/animations';

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
}

interface PageButtonProps {
  $active?: boolean;
}

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
`;

const PageButton = styled.button<PageButtonProps>`
  background: ${props =>
    props.$active ? 'var(--color-pagination-bg-active)' : 'var(--color-pagination-bg)'};
  color: ${props =>
    props.$active ? 'var(--color-pagination-text-active)' : 'var(--color-pagination-text)'};
  border: 1px solid var(--color-pagination-border);
  border-radius: 8px;
  padding: 0.5rem 1rem;
  font-size: 0.9rem;
  cursor: pointer;
  transition:
    background 0.3s,
    transform 0.2s,
    box-shadow 0.3s;
  -webkit-tap-highlight-color: transparent;
  animation: ${props => (props.$active ? pulse : 'none')} 1.5s infinite;
  &:hover {
    background: ${props =>
      props.$active ? 'var(--color-pagination-hover-active)' : 'var(--color-pagination-hover)'};
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
`;

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
  transition:
    transform 0.3s,
    background 0.3s;
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
`;

const PageInfo = styled.span`
  font-size: 1rem;
  color: var(--color-subtitle);
  @media (max-width: 768px) {
    font-size: 0.9rem;
  }
  @media (max-width: 576px) {
    font-size: 0.85rem;
  }
`;

function Pagination({ currentPage, totalPages, onPageChange }: PaginationProps) {
  const handlePageChange = useCallback(
    (page: number) => {
      if (page >= 1 && page <= totalPages) {
        onPageChange(page);
        window.scrollTo({ top: 0, behavior: 'smooth' });
      }
    },
    [totalPages, onPageChange]
  );

  const renderPageNumbers = useCallback(() => {
    const pages = [];
    const maxVisible = 5;
    let startPage = Math.max(1, currentPage - Math.floor(maxVisible / 2));
    let endPage = Math.min(totalPages, startPage + maxVisible - 1);

    if (endPage - startPage + 1 < maxVisible) {
      startPage = Math.max(1, endPage - maxVisible + 1);
    }

    for (let i = startPage; i <= endPage; i++) {
      pages.push(
        <PageButton
          key={i}
          $active={i === currentPage}
          onClick={() => handlePageChange(i)}
          aria-label={`Страница ${i}`}
          className="ripple"
        >
          {i}
        </PageButton>
      );
    }
    return pages;
  }, [currentPage, totalPages, handlePageChange]);

  return (
    <PaginationContainer>
      <NavButton
        onClick={() => handlePageChange(currentPage - 1)}
        disabled={currentPage === 1}
        aria-label="Предыдущая страница"
        className="ripple"
      >
        <FontAwesomeIcon icon={faChevronLeft} />
      </NavButton>
      {renderPageNumbers()}
      <NavButton
        onClick={() => handlePageChange(currentPage + 1)}
        disabled={currentPage === totalPages}
        aria-label="Следующая страница"
        className="ripple"
      >
        <FontAwesomeIcon icon={faChevronRight} />
      </NavButton>
      <PageInfo>
        Страница {currentPage} из {totalPages}
      </PageInfo>
    </PaginationContainer>
  );
}

export default memo(Pagination);
