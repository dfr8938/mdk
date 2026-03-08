import styled from 'styled-components';
import { fadeIn } from '../../styles/animations';
import type { Question } from '../../types';

interface QuestionCardProps {
  question: Question;
  index: number;
  startIndex: number;
  delay: string;
}

interface CardProps {
  $delay?: string;
}

const Card = styled.div<CardProps>`
  background: var(--color-card-bg);
  border-radius: 18px;
  box-shadow: 0 4px 16px var(--color-card-shadow);
  padding: 1.5rem;
  border: 1px solid var(--color-border);
  display: flex;
  flex-direction: column;
  transition:
    transform 0.3s cubic-bezier(0.4, 0, 0.2, 1),
    box-shadow 0.3s;
  word-wrap: break-word;
  overflow-wrap: break-word;
  animation: ${fadeIn} 0.5s ease-out;
  animation-fill-mode: both;
  animation-delay: ${props => props.$delay || '0ms'};
  &:hover {
    transform: translateY(-6px);
    box-shadow: 0 12px 32px var(--color-card-shadow-hover);
  }
  @media (max-width: 768px) {
    padding: 1.3rem;
    border-radius: 16px;
  }
  @media (max-width: 576px) {
    padding: 1.2rem;
    border-radius: 14px;
  }
  @media (max-width: 400px) {
    padding: 1rem;
    border-radius: 12px;
  }
`;

const CardHeader = styled.div`
  display: flex;
  justify-content: flex-end;
  margin-bottom: 1rem;
  font-size: 0.9rem;
  color: var(--color-subtitle);
  @media (max-width: 576px) {
    font-size: 0.85rem;
  }
`;

const CardNumber = styled.span`
  background-color: var(--color-card-number-bg);
  color: var(--color-card-number-text);
  padding: 0.3rem 0.8rem;
  border-radius: 14px;
  font-weight: 500;
  font-size: 0.9rem;
  @media (max-width: 576px) {
    padding: 0.2rem 0.6rem;
    font-size: 0.85rem;
    border-radius: 12px;
  }
`;

const Question = styled.div`
  color: var(--color-text);
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
`;

const Divider = styled.hr`
  border: none;
  border-top: 1px solid var(--color-border);
  margin: 1rem 0;
  width: 100%;
  @media (max-width: 576px) {
    margin: 0.8rem 0;
  }
`;

const CorrectAnswer = styled.div`
  background: var(--color-correct-bg);
  border: 1px solid var(--color-correct-border);
  border-radius: 12px;
  padding: 1rem;
  color: var(--color-correct-text);
  font-size: 0.9rem;
  line-height: 1.5;
  word-wrap: break-word;
  overflow-wrap: break-word;
  @media (max-width: 576px) {
    padding: 0.8rem;
    font-size: 0.85rem;
    border-radius: 10px;
  }
`;

function QuestionCard({ question, index, startIndex, delay }: QuestionCardProps) {
  const questionId = `question-${question.id}`;
  return (
    <Card
      $delay={delay}
      role="article"
      aria-labelledby={questionId}
      aria-label={`Вопрос ${startIndex + index + 1}: ${question.question}`}
    >
      <CardHeader>
        <CardNumber>Вопрос {startIndex + index + 1}</CardNumber>
      </CardHeader>
      <Question>
        <h3 id={questionId}>{question.question}</h3>
      </Question>
      <Divider />
      <CorrectAnswer>{question.correct_answers.join(', ')}</CorrectAnswer>
    </Card>
  );
}

export default QuestionCard;
