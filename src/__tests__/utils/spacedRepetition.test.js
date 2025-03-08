import {
  calculateNextReviewDate,
  needsLesson,
  getDueCards,
  updateCardAfterReview
} from '../../utils/spacedRepetition';

// Mock Date to control the current date in tests
const mockDate = new Date(2023, 0, 1); // January 1, 2023
global.Date = class extends Date {
  constructor(date) {
    if (date) {
      return super(date);
    }
    return mockDate;
  }
  
  static now() {
    return mockDate.getTime();
  }
};

describe('Spaced Repetition Utils', () => {
  describe('calculateNextReviewDate', () => {
    test('calculates next review date based on easy difficulty', () => {
      const nextDate = calculateNextReviewDate('easy');
      // Should be 7 days from now
      expect(nextDate.getDate()).toBe(8); // January 8, 2023
      expect(nextDate.getMonth()).toBe(0); // January
      expect(nextDate.getFullYear()).toBe(2023);
    });
    
    test('calculates next review date based on medium difficulty', () => {
      const nextDate = calculateNextReviewDate('medium');
      // Should be 3 days from now
      expect(nextDate.getDate()).toBe(4); // January 4, 2023
      expect(nextDate.getMonth()).toBe(0); // January
      expect(nextDate.getFullYear()).toBe(2023);
    });
    
    test('calculates next review date based on hard difficulty', () => {
      const nextDate = calculateNextReviewDate('hard');
      // Should be 1 day from now
      expect(nextDate.getDate()).toBe(2); // January 2, 2023
      expect(nextDate.getMonth()).toBe(0); // January
      expect(nextDate.getFullYear()).toBe(2023);
    });
    
    test('handles unknown difficulty by defaulting to 1 day', () => {
      const nextDate = calculateNextReviewDate('unknown');
      // Should be 1 day from now
      expect(nextDate.getDate()).toBe(2); // January 2, 2023
      expect(nextDate.getMonth()).toBe(0); // January
      expect(nextDate.getFullYear()).toBe(2023);
    });
  });
  
  describe('needsLesson', () => {
    test('returns true when incorrect count is at or above threshold', () => {
      const card = { incorrectCount: 3 }; // Threshold is 3
      expect(needsLesson(card)).toBe(true);
      
      const cardAboveThreshold = { incorrectCount: 4 };
      expect(needsLesson(cardAboveThreshold)).toBe(true);
    });
    
    test('returns false when incorrect count is below threshold', () => {
      const card = { incorrectCount: 2 }; // Threshold is 3
      expect(needsLesson(card)).toBe(false);
      
      const cardWithZero = { incorrectCount: 0 };
      expect(needsLesson(cardWithZero)).toBe(false);
    });
  });
  
  describe('getDueCards', () => {
    test('returns cards with no next review date', () => {
      const cards = [
        { id: '1', nextReviewDate: null },
        { id: '2', nextReviewDate: new Date(2023, 0, 2) }, // January 2, 2023 (future)
        { id: '3' } // No nextReviewDate property
      ];
      
      const dueCards = getDueCards(cards);
      expect(dueCards).toHaveLength(2);
      expect(dueCards[0].id).toBe('1');
      expect(dueCards[1].id).toBe('3');
    });
    
    test('returns cards with nextReviewDate in the past or today', () => {
      const cards = [
        { id: '1', nextReviewDate: new Date(2022, 11, 31) }, // December 31, 2022 (past)
        { id: '2', nextReviewDate: new Date(2023, 0, 1) },   // January 1, 2023 (today)
        { id: '3', nextReviewDate: new Date(2023, 0, 2) }    // January 2, 2023 (future)
      ];
      
      const dueCards = getDueCards(cards);
      expect(dueCards).toHaveLength(2);
      expect(dueCards[0].id).toBe('1');
      expect(dueCards[1].id).toBe('2');
    });
    
    test('returns empty array when no cards are due', () => {
      const cards = [
        { id: '1', nextReviewDate: new Date(2023, 0, 2) }, // January 2, 2023 (future)
        { id: '2', nextReviewDate: new Date(2023, 0, 3) }  // January 3, 2023 (future)
      ];
      
      const dueCards = getDueCards(cards);
      expect(dueCards).toHaveLength(0);
    });
  });
  
  describe('updateCardAfterReview', () => {
    test('updates card for correct answer', () => {
      const card = {
        id: '1',
        question: 'Test Question',
        correctCount: 1,
        incorrectCount: 2
      };
      
      const updatedCard = updateCardAfterReview(card, true, 'medium');
      
      // Should increment correctCount
      expect(updatedCard.correctCount).toBe(2);
      expect(updatedCard.incorrectCount).toBe(2); // Unchanged
      
      // Should set lastReviewed to current date
      expect(updatedCard.lastReviewed).toEqual(mockDate);
      
      // Should set nextReviewDate based on difficulty
      expect(updatedCard.nextReviewDate.getDate()).toBe(4); // 3 days from Jan 1
    });
    
    test('updates card for incorrect answer', () => {
      const card = {
        id: '1',
        question: 'Test Question',
        correctCount: 1,
        incorrectCount: 2
      };
      
      const updatedCard = updateCardAfterReview(card, false, 'hard');
      
      // Should increment incorrectCount
      expect(updatedCard.incorrectCount).toBe(3);
      expect(updatedCard.correctCount).toBe(1); // Unchanged
      
      // Should set lastReviewed to current date
      expect(updatedCard.lastReviewed).toEqual(mockDate);
      
      // Should set nextReviewDate based on difficulty
      expect(updatedCard.nextReviewDate.getDate()).toBe(2); // 1 day from Jan 1
    });
    
    test('preserves other card properties', () => {
      const card = {
        id: '1',
        question: 'Test Question',
        answer: 'Test Answer',
        correctCount: 1,
        incorrectCount: 2,
        customProperty: 'test'
      };
      
      const updatedCard = updateCardAfterReview(card, true, 'easy');
      
      // Should preserve other properties
      expect(updatedCard.id).toBe('1');
      expect(updatedCard.question).toBe('Test Question');
      expect(updatedCard.answer).toBe('Test Answer');
      expect(updatedCard.customProperty).toBe('test');
    });
  });
});