import styled from 'styled-components';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faChevronUp } from '@fortawesome/free-solid-svg-icons';
import { pulse } from '../../styles/animations';

interface ScrollToTopButtonProps {
  visible: boolean;
  onClick: () => void;
}

interface ButtonProps {
  $visible?: boolean;
}

const ScrollToTopButtonStyled = styled.button<ButtonProps>`
  position: fixed;
  bottom: 2rem;
  right: 2rem;
  width: 3.5rem;
  height: 3.5rem;
  border-radius: 50%;
  background: var(--color-primary);
  color: white;
  border: none;
  box-shadow: 0 4px 20px var(--color-primary-shadow);
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.5rem;
  z-index: 1000;
  opacity: ${props => (props.$visible ? '1' : '0')};
  visibility: ${props => (props.$visible ? 'visible' : 'hidden')};
  transition:
    opacity 0.3s,
    visibility 0.3s,
    transform 0.2s,
    background-color 0.2s;
  transform: scale(${props => (props.$visible ? '1' : '0.8')});
  -webkit-tap-highlight-color: transparent;
  animation: ${props => (props.$visible ? pulse : 'none')} 2s infinite;
  svg {
    width: 1.5em;
    height: 1.5em;
  }
  &:hover {
    background: var(--color-primary-hover);
    transform: scale(1.05);
    box-shadow: 0 6px 24px var(--color-primary-shadow);
    animation: none;
  }
  &:active {
    transform: scale(0.95);
    background: var(--color-primary-hover);
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
`;

function ScrollToTopButton({ visible, onClick }: ScrollToTopButtonProps) {
  return (
    <ScrollToTopButtonStyled $visible={visible} onClick={onClick} aria-label="Наверх">
      <FontAwesomeIcon icon={faChevronUp} />
    </ScrollToTopButtonStyled>
  );
}

export default ScrollToTopButton;
