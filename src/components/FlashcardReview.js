import React, { useState, useEffect } from 'react';
import Flashcard from './Flashcard';
import TwilightLesson from './TwilightLesson';
import { getDueCards, needsLesson } from '../utils/spacedRepetition';
import { generateTwilightLesson } from '../utils/twilightLessons';

const FlashcardReview = ({ cards, onUpdateCards }) => {
  const [dueCards, setDueCards] = useState([]);
  const [currentCardIndex, setCurrentCardIndex] = useState(0);
  const [currentLesson, setCurrentLesson] = useState(null);
  const [reviewComplete, setReviewComplete] = useState(false);
  
  useEffect(() => {
    // Get cards due for review
    const cardsToReview = getDueCards(cards);
    setDueCards(cardsToReview);
    setCurrentCardIndex(0);
    setReviewComplete(cardsToReview.length === 0);
  }, [cards]);
  
  const handleCardReviewed = (updatedCard) => {
    // Check if the card needs a lesson (too many wrong answers)
    if (needsLesson(updatedCard) && !updatedCard.lessonShown) {
      // Create a modified card with lessonShown set to true
      const cardWithLesson = {
        ...updatedCard,
        lessonShown: true
      };
      
      // Create a copy of all cards and replace the reviewed card
      const updatedCards = cards.map(card => 
        card.id === cardWithLesson.id ? cardWithLesson : card
      );
      
      // Update the cards in the parent component
      onUpdateCards(updatedCards);
      
      // Show the lesson
      const lesson = generateTwilightLesson(updatedCard);
      setCurrentLesson(lesson);
    } else {
      // Create a copy of all cards and replace the reviewed card
      const updatedCards = cards.map(card => 
        card.id === updatedCard.id ? updatedCard : card
      );
      
      // Update the cards in the parent component
      onUpdateCards(updatedCards);
      
      // Move to the next card
      setTimeout(() => {
        const nextIndex = currentCardIndex + 1;
        if (nextIndex < dueCards.length) {
          setCurrentCardIndex(nextIndex);
        } else {
          setReviewComplete(true);
        }
      }, 1500);
    }
  };
  
  const handleCloseLesson = () => {
    setCurrentLesson(null);
    
    // Move to the next card
    const nextIndex = currentCardIndex + 1;
    if (nextIndex < dueCards.length) {
      setCurrentCardIndex(nextIndex);
    } else {
      setReviewComplete(true);
    }
  };
  
  // If review is complete, show a message
  if (reviewComplete) {
    return (
      <div className="review-complete">
        <h2>Good job!</h2>
        <p>You've completed all your due flashcards for today.</p>
        <p>Come back tomorrow for more review.</p>
        <div className="stats">
          <div className="stat">
            <span className="stat-number">{cards.length}</span>
            <span className="stat-label">Total Cards</span>
          </div>
          <div className="stat">
            <span className="stat-number">
              {cards.filter(card => card.correctCount > 0).length}
            </span>
            <span className="stat-label">Cards Studied</span>
          </div>
        </div>
      </div>
    );
  }
  
  // If a lesson is being shown, display only that
  if (currentLesson) {
    return <TwilightLesson lesson={currentLesson} onClose={handleCloseLesson} />;
  }
  
  // If there are cards to review but none due, show a message
  if (dueCards.length === 0) {
    return (
      <div className="no-cards-due">
        <h2>No cards due for review</h2>
        <p>All caught up! Check back later for more cards to review.</p>
      </div>
    );
  }
  
  // Otherwise, show the current flashcard
  return (
    <div className="flashcard-review">
      <div className="progress-bar">
        <div 
          className="progress"
          data-testid="progress-bar-fill"
          style={{ width: `${(currentCardIndex / dueCards.length) * 100}%` }}
        ></div>
      </div>
      
      <div className="progress-text">
        Card {currentCardIndex + 1} of {dueCards.length}
      </div>
      
      {dueCards.length > 0 && (
        <Flashcard 
          card={dueCards[currentCardIndex]} 
          onCardReviewed={handleCardReviewed}
          onShowLesson={(updatedCard) => {
            // Update card in parent component
            const updatedCards = cards.map(card => 
              card.id === updatedCard.id ? updatedCard : card
            );
            onUpdateCards(updatedCards);
            
            // Show the lesson
            const lesson = generateTwilightLesson(updatedCard);
            setCurrentLesson(lesson);
          }}
        />
      )}
    </div>
  );
};

export default FlashcardReview;