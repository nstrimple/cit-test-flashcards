import React from 'react';
import { render, screen, fireEvent, act } from '@testing-library/react';
import FlashcardReview from '../../components/FlashcardReview';
import { getDueCards, needsLesson } from '../../utils/spacedRepetition';
import { generateTwilightLesson } from '../../utils/twilightLessons';

// Mock the utility functions
jest.mock('../../utils/spacedRepetition', () => ({
  getDueCards: jest.fn(),
  needsLesson: jest.fn()
}));

jest.mock('../../utils/twilightLessons', () => ({
  generateTwilightLesson: jest.fn()
}));

// Mock timers for setTimeout
jest.useFakeTimers();

describe('FlashcardReview Component', () => {
  const mockCards = [
    {
      id: '1',
      question: 'What is the capital of France?',
      answer: 'Paris',
      correctCount: 0,
      incorrectCount: 0,
      nextReviewDate: null
    },
    {
      id: '2',
      question: 'What is the capital of Japan?',
      answer: 'Tokyo',
      correctCount: 1,
      incorrectCount: 0,
      nextReviewDate: null
    },
    {
      id: '3',
      question: 'What is the capital of Italy?',
      answer: 'Rome',
      correctCount: 0,
      incorrectCount: 0,
      nextReviewDate: null
    }
  ];
  
  const mockOnUpdateCards = jest.fn();
  
  beforeEach(() => {
    jest.clearAllMocks();
    // Default mock implementation for getDueCards returns all cards
    getDueCards.mockImplementation(() => mockCards);
    // Default mock implementation for needsLesson returns false
    needsLesson.mockImplementation(() => false);
    // Default mock implementation for generateTwilightLesson
    generateTwilightLesson.mockImplementation((card) => ({
      title: `Lesson for ${card.question}`,
      location: 'Memory Palace',
      characters: [
        { name: 'Guide', description: 'Your helpful memory guide' },
        { name: 'Learner', description: 'You, the student' }
      ],
      content: 'This is a lesson to help you remember.'
    }));
  });
  
  afterEach(() => {
    jest.clearAllTimers();
  });
  
  test('renders the first due card', () => {
    render(<FlashcardReview cards={mockCards} onUpdateCards={mockOnUpdateCards} />);
    
    // Should display the first card
    expect(screen.getByText('What is the capital of France?')).toBeInTheDocument();
    expect(screen.getByText('Card 1 of 3')).toBeInTheDocument();
    
    // Progress bar should be at 0%
    const progressBar = screen.getByTestId('progress-bar-fill');
    expect(progressBar.style.width).toBe('0%');
  });
  
  test('moves to the next card after rating', () => {
    render(<FlashcardReview cards={mockCards} onUpdateCards={mockOnUpdateCards} />);
    
    // Flip the first card
    const firstCard = screen.getByText('What is the capital of France?').closest('.flashcard');
    fireEvent.click(firstCard);
    
    // Rate the card as easy
    const easyButton = screen.getByText('Easy');
    fireEvent.click(easyButton);
    
    // onUpdateCards should have been called
    expect(mockOnUpdateCards).toHaveBeenCalled();
    
    // After timeout, should move to next card
    act(() => {
      jest.advanceTimersByTime(1500);
    });
    
    // Should display the second card
    expect(screen.getByText('What is the capital of Japan?')).toBeInTheDocument();
    expect(screen.getByText('Card 2 of 3')).toBeInTheDocument();
    
    // Progress bar should be at ~33%
    const progressBar = screen.getByTestId('progress-bar-fill');
    expect(progressBar.style.width).toBe('33.33%');
  });
  
  test('shows completion message when all cards are reviewed', () => {
    render(<FlashcardReview cards={mockCards} onUpdateCards={mockOnUpdateCards} />);
    
    // Review all cards
    for (let i = 0; i < mockCards.length; i++) {
      // Flip the card
      const card = screen.getByText(/What is the capital of/i).closest('.flashcard');
      fireEvent.click(card);
      
      // Rate the card
      const easyButton = screen.getByText('Easy');
      fireEvent.click(easyButton);
      
      // Wait for next card
      act(() => {
        jest.advanceTimersByTime(1500);
      });
    }
    
    // Should show completion message
    expect(screen.getByText('Good job!')).toBeInTheDocument();
    expect(screen.getByText('You\'ve completed all your due flashcards for today.')).toBeInTheDocument();
    
    // Should show stats
    expect(screen.getByText('Total Cards')).toBeInTheDocument();
    expect(screen.getByText('Cards Studied')).toBeInTheDocument();
  });
  
  test('shows a lesson when a card needs one', () => {
    // Make the second card need a lesson
    needsLesson.mockImplementation((card) => card.id === '2');
    
    render(<FlashcardReview cards={mockCards} onUpdateCards={mockOnUpdateCards} />);
    
    // Review the first card
    const firstCard = screen.getByText('What is the capital of France?').closest('.flashcard');
    fireEvent.click(firstCard);
    const easyButton = screen.getByText('Easy');
    fireEvent.click(easyButton);
    
    // Wait for next card
    act(() => {
      jest.advanceTimersByTime(1500);
    });
    
    // Review the second card
    const secondCard = screen.getByText('What is the capital of Japan?').closest('.flashcard');
    fireEvent.click(secondCard);
    const hardButton = screen.getByText('Hard');
    fireEvent.click(hardButton);
    
    // Should generate and show a lesson
    expect(generateTwilightLesson).toHaveBeenCalledWith(expect.objectContaining({
      id: '2',
      question: 'What is the capital of Japan?'
    }));
    
    // Should show the lesson
    expect(screen.getByText('Lesson for What is the capital of Japan?')).toBeInTheDocument();
    expect(screen.getByText('This is a lesson to help you remember.')).toBeInTheDocument();
  });
  
  test('continues to next card after closing lesson', () => {
    // Make the second card need a lesson
    needsLesson.mockImplementation((card) => card.id === '2');
    
    render(<FlashcardReview cards={mockCards} onUpdateCards={mockOnUpdateCards} />);
    
    // Review the first card
    const firstCard = screen.getByText('What is the capital of France?').closest('.flashcard');
    fireEvent.click(firstCard);
    const easyButton = screen.getByText('Easy');
    fireEvent.click(easyButton);
    
    // Wait for next card
    act(() => {
      jest.advanceTimersByTime(1500);
    });
    
    // Review the second card
    const secondCard = screen.getByText('What is the capital of Japan?').closest('.flashcard');
    fireEvent.click(secondCard);
    const hardButton = screen.getByText('Hard');
    fireEvent.click(hardButton);
    
    // Close the lesson
    const closeButton = screen.getByText('Got it! Return to flashcards');
    fireEvent.click(closeButton);
    
    // Should move to the third card
    expect(screen.getByText('What is the capital of Italy?')).toBeInTheDocument();
    expect(screen.getByText('Card 3 of 3')).toBeInTheDocument();
  });
  
  test('shows message when no cards are due', () => {
    // Mock no due cards
    getDueCards.mockImplementation(() => []);
    
    render(<FlashcardReview cards={mockCards} onUpdateCards={mockOnUpdateCards} />);
    
    // Should show no cards due message
    expect(screen.getByText('No cards due for review')).toBeInTheDocument();
    expect(screen.getByText('All caught up! Check back later for more cards to review.')).toBeInTheDocument();
  });
  
  test('handles card updates correctly', () => {
    render(<FlashcardReview cards={mockCards} onUpdateCards={mockOnUpdateCards} />);
    
    // Flip the first card
    const firstCard = screen.getByText('What is the capital of France?').closest('.flashcard');
    fireEvent.click(firstCard);
    
    // Rate the card as medium
    const mediumButton = screen.getByText('Medium');
    fireEvent.click(mediumButton);
    
    // Check that onUpdateCards was called with the updated card
    expect(mockOnUpdateCards).toHaveBeenCalledWith(expect.arrayContaining([
      expect.objectContaining({
        id: '1',
        question: 'What is the capital of France?',
        // Other properties would be updated by the Flashcard component
      }),
      expect.objectContaining({ id: '2' }),
      expect.objectContaining({ id: '3' })
    ]));
  });
});