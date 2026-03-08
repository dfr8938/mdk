import { useEffect, useState } from 'react';
import styled from 'styled-components';
import { fadeIn } from '../../styles/animations';

const Toast = styled.div`
  position: fixed;
  bottom: 1.5rem;
  right: 1.5rem;
  background: var(--color-card-bg);
  color: var(--color-text);
  border: 1px solid var(--color-border);
  border-radius: 12px;
  padding: 1rem 1.5rem;
  box-shadow: 0 6px 20px rgba(0, 0, 0, 0.2);
  z-index: 3000;
  display: flex;
  align-items: center;
  gap: 1rem;
  max-width: 400px;
  animation: ${fadeIn} 0.4s ease-out;
  @media (max-width: 768px) {
    bottom: 1rem;
    right: 1rem;
    left: 1rem;
    max-width: none;
  }
`;

const Message = styled.span`
  flex-grow: 1;
  font-size: 0.95rem;
`;

const Button = styled.button`
  background: var(--color-primary);
  color: white;
  border: none;
  border-radius: 8px;
  padding: 0.5rem 1rem;
  font-size: 0.9rem;
  cursor: pointer;
  transition: background 0.2s;
  &:hover {
    background: var(--color-primary-hover);
  }
  &:active {
    transform: scale(0.98);
  }
`;

const CloseButton = styled.button`
  background: transparent;
  border: none;
  color: var(--color-subtitle);
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
    background-color: var(--color-card-bg-hover);
  }
`;

/**
 * Компонент для отображения уведомления об обновлении PWA.
 * Использует Workbox для обнаружения новой версии сервис-воркера.
 */
export function UpdateToast() {
  const [updateAvailable, setUpdateAvailable] = useState(false);
  const [waitingWorker, setWaitingWorker] = useState<ServiceWorker | null>(null);

  useEffect(() => {
    if ('serviceWorker' in navigator && window.workbox !== undefined) {
      const wb = window.workbox;
      // При обнаружении обновления сохраняем ссылку на ожидающий сервис-воркер
      wb.addEventListener('waiting', (event: any) => {
        setUpdateAvailable(true);
        setWaitingWorker(event.sw);
      });
      // Запускаем автоматическое обновление при активации (если пользователь согласится)
      wb.addEventListener('controlling', () => {
        window.location.reload();
      });
      wb.register();
    }
  }, []);

  const handleUpdate = () => {
    if (waitingWorker) {
      // Отправляем сообщение о пропуске ожидания, чтобы новый сервис-воркер активировался
      waitingWorker.postMessage({ type: 'SKIP_WAITING' });
      setUpdateAvailable(false);
    }
  };

  const handleClose = () => {
    setUpdateAvailable(false);
  };

  if (!updateAvailable) {
    return null;
  }

  return (
    <Toast role="alert" aria-live="polite">
      <Message>Доступна новая версия приложения. Обновить?</Message>
      <Button onClick={handleUpdate} className="ripple" aria-label="Обновить приложение">
        Обновить
      </Button>
      <CloseButton onClick={handleClose} aria-label="Закрыть уведомление" className="ripple">
        ×
      </CloseButton>
    </Toast>
  );
}