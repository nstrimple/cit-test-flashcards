/**
 * Spaced repetition algorithm to schedule flashcard reviews
 */

// Constants for spaced repetition algorithm
const EASY_INTERVAL = 7; // days
const MEDIUM_INTERVAL = 3; // days
const HARD_INTERVAL = 1; // day
const INCORRECT_THRESHOLD = 3; // Number of incorrect answers to trigger a lesson

/**
 * Calculate the next review date based on difficulty
 * @param {string} difficulty - 'easy', 'medium', or 'hard'
 * @returns {Date} Next review date
 */
export const calculateNextReviewDate = (difficulty) => {
  const now = new Date();
  const nextDate = new Date(now);
  
  switch (difficulty) {
    case 'easy':
      nextDate.setDate(now.getDate() + EASY_INTERVAL);
      break;
    case 'medium':
      nextDate.setDate(now.getDate() + MEDIUM_INTERVAL);
      break;
    case 'hard':
      nextDate.setDate(now.getDate() + HARD_INTERVAL);
      break;
    default:
      nextDate.setDate(now.getDate() + 1);
  }
  
  return nextDate;
};

/**
 * Check if a card needs a lesson based on incorrect count
 * @param {Object} card - Flashcard object
 * @returns {boolean} True if lesson is needed
 */
export const needsLesson = (card) => {
  return card.incorrectCount >= INCORRECT_THRESHOLD;
};

/**
 * Get cards due for review
 * @param {Array} cards - All flashcards
 * @returns {Array} Cards due for review
 */
export const getDueCards = (cards) => {
  const now = new Date();
  return cards.filter(card => {
    // Include cards that have never been reviewed or are due today
    return !card.nextReviewDate || new Date(card.nextReviewDate) <= now;
  });
};

/**
 * Update card after review
 * @param {Object} card - Flashcard to update
 * @param {boolean} correct - Whether the answer was correct
 * @param {string} difficulty - Difficulty level ('easy', 'medium', 'hard')
 * @returns {Object} Updated card
 */
export const updateCardAfterReview = (card, correct, difficulty) => {
  const updatedCard = { ...card };
  
  updatedCard.lastReviewed = new Date();
  updatedCard.nextReviewDate = calculateNextReviewDate(difficulty);
  
  if (correct) {
    updatedCard.correctCount += 1;
  } else {
    updatedCard.incorrectCount += 1;
  }
  
  return updatedCard;
};