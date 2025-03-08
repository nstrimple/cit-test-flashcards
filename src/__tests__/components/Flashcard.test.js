import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import Flashcard from '../../components/Flashcard';
import { updateCardAfterReview } from '../../utils/spacedRepetition';

// Mock the spacedRepetition utility
jest.mock('../../utils/spacedRepetition', () => ({
  updateCardAfterReview: jest.fn((card, correct, difficulty) => ({
    ...card,
    lastReviewed: new Date(),
    nextReviewDate: new Date(),
    correctCount: correct ? card.correctCount + 1 : card.correctCount,
    incorrectCount: correct ? card.incorrectCount : card.incorrectCount + 1
  }))
}));

describe('Flashcard Component', () => {
  const mockCard = {
    id: '1',
    question: 'What is the capital of France?',
    answer: 'Paris',
    correctCount: 0,
    incorrectCount: 0,
    nextReviewDate: null
  };
  
  const mockOnCardReviewed = jest.fn();
  
  beforeEach(() => {
    jest.clearAllMocks();
  });
  
  test('renders the question side by default', () => {
    render(<Flashcard card={mockCard} onCardReviewed={mockOnCardReviewed} />);
    
    expect(screen.getByText('Question:')).toBeInTheDocument();
    expect(screen.getByText('What is the capital of France?')).toBeInTheDocument();
    expect(screen.getByText('Click to reveal answer')).toBeInTheDocument();
    expect(screen.queryByText('Answer:')).not.toBeInTheDocument();
  });
  
  test('flips to show answer when clicked', () => {
    render(<Flashcard card={mockCard} onCardReviewed={mockOnCardReviewed} />);
    
    const flashcard = screen.getByText('What is the capital of France?').closest('.flashcard');
    fireEvent.click(flashcard);
    
    expect(screen.getByText('Answer:')).toBeInTheDocument();
    expect(screen.getByText('Paris')).toBeInTheDocument();
    expect(screen.getByText('How well did you know this?')).toBeInTheDocument();
    
    // Rating buttons should be present
    expect(screen.getByText('Incorrect')).toBeInTheDocument();
    expect(screen.getByText('Hard')).toBeInTheDocument();
    expect(screen.getByText('Medium')).toBeInTheDocument();
    expect(screen.getByText('Easy')).toBeInTheDocument();
  });
  
  test('can flip back to question side', () => {
    render(<Flashcard card={mockCard} onCardReviewed={mockOnCardReviewed} />);
    
    const flashcard = screen.getByText('What is the capital of France?').closest('.flashcard');
    
    // Flip to answer
    fireEvent.click(flashcard);
    expect(screen.getByText('Paris')).toBeInTheDocument();
    
    // Flip back to question
    fireEvent.click(flashcard);
    expect(screen.queryByText('Paris')).not.toBeInTheDocument();
    expect(screen.getByText('What is the capital of France?')).toBeInTheDocument();
  });
  
  test('handles rating as incorrect', () => {
    render(<Flashcard card={mockCard} onCardReviewed={mockOnCardReviewed} />);
    
    // Flip card to show answer
    const flashcard = screen.getByText('What is the capital of France?').closest('.flashcard');
    fireEvent.click(flashcard);
    
    // Click incorrect button
    const incorrectButton = screen.getByText('Incorrect');
    fireEvent.click(incorrectButton);
    
    // Check that updateCardAfterReview was called with correct params
    expect(updateCardAfterReview).toHaveBeenCalledWith(mockCard, false, 'hard');
    
    // Check that onCardReviewed callback was called
    expect(mockOnCardReviewed).toHaveBeenCalled();
  });
  
  test('handles rating as easy', () => {
    render(<Flashcard card={mockCard} onCardReviewed={mockOnCardReviewed} />);
    
    // Flip card to show answer
    const flashcard = screen.getByText('What is the capital of France?').closest('.flashcard');
    fireEvent.click(flashcard);
    
    // Click easy button
    const easyButton = screen.getByText('Easy');
    fireEvent.click(easyButton);
    
    // Check that updateCardAfterReview was called with correct params
    expect(updateCardAfterReview).toHaveBeenCalledWith(mockCard, true, 'easy');
    
    // Check that onCardReviewed callback was called
    expect(mockOnCardReviewed).toHaveBeenCalled();
  });
  
  test('cannot flip card after it has been reviewed', () => {
    render(<Flashcard card={mockCard} onCardReviewed={mockOnCardReviewed} />);
    
    // Flip card to show answer
    const flashcard = screen.getByText('What is the capital of France?').closest('.flashcard');
    fireEvent.click(flashcard);
    
    // Rate the card
    const easyButton = screen.getByText('Easy');
    fireEvent.click(easyButton);
    
    // Try to flip the card again
    fireEvent.click(flashcard);
    
    // The card should still be flipped to the answer side
    expect(screen.getByText('Paris')).toBeInTheDocument();
  });
  
  test('displays next review date after review', () => {
    // Setup the mock implementation to return a specific date
    const futureDate = new Date();
    futureDate.setDate(futureDate.getDate() + 7); // 7 days from now
    
    updateCardAfterReview.mockImplementationOnce((card, correct, difficulty) => ({
      ...card,
      lastReviewed: new Date(),
      nextReviewDate: futureDate,
      correctCount: correct ? card.correctCount + 1 : card.correctCount,
      incorrectCount: correct ? card.incorrectCount : card.incorrectCount + 1
    }));
    
    render(<Flashcard card={mockCard} onCardReviewed={mockOnCardReviewed} />);
    
    // Flip card to show answer
    const flashcard = screen.getByText('What is the capital of France?').closest('.flashcard');
    fireEvent.click(flashcard);
    
    // Rate the card
    const easyButton = screen.getByText('Easy');
    fireEvent.click(easyButton);
    
    // Should show next review date
    expect(screen.getByText(`Next review: ${futureDate.toLocaleDateString()}`)).toBeInTheDocument();
  });
});