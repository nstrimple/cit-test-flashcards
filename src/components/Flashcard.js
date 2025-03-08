import React, { useState } from 'react';
import { updateCardAfterReview } from '../utils/spacedRepetition';

const Flashcard = ({ card, onCardReviewed, onShowLesson }) => {
  const [flipped, setFlipped] = useState(false);
  const [reviewed, setReviewed] = useState(false);
  
  const handleCardFlip = () => {
    if (!reviewed) {
      setFlipped(!flipped);
    }
  };
  
  const handleDifficultyRating = (correct, difficulty) => {
    const updatedCard = updateCardAfterReview(card, correct, difficulty);
    setReviewed(true);
    onCardReviewed(updatedCard);
  };
  
  const handleShowLesson = () => {
    // Mark the card as incorrect with hard difficulty
    const updatedCard = updateCardAfterReview(card, false, 'hard');
    // Add lessonShown flag
    updatedCard.lessonShown = true;
    setReviewed(true);
    
    // Request to show the lesson directly
    if (onShowLesson) {
      onShowLesson(updatedCard);
    } else {
      onCardReviewed(updatedCard);
    }
  };
  
  return (
    <div className={`flashcard-container ${reviewed ? 'reviewed' : ''}`}>
      <div 
        className={`flashcard ${flipped ? 'flipped' : ''}`} 
        onClick={handleCardFlip}
      >
        <div className="flashcard-front">
          <h3>Question:</h3>
          <p>{card.question}</p>
          {!flipped && !reviewed && (
            <div className="instruction-container">
              <div className="instruction">Click to reveal answer</div>
              <button 
                className="show-lesson-button"
                onClick={(e) => {
                  e.stopPropagation();
                  handleShowLesson();
                }}
              >
                Go to Lesson
              </button>
            </div>
          )}
        </div>
        
        <div className="flashcard-back">
          <h3>Answer:</h3>
          <p>{card.answer}</p>
          
          {!reviewed && (
            <div className="rating-buttons">
              <p>How well did you know this?</p>
              <div className="button-group">
                <button 
                  className="incorrect hard"
                  onClick={() => handleDifficultyRating(false, 'hard')}
                >
                  Incorrect
                </button>
                <button 
                  className="correct hard"
                  onClick={() => handleDifficultyRating(true, 'hard')}
                >
                  Hard
                </button>
                <button 
                  className="correct medium"
                  onClick={() => handleDifficultyRating(true, 'medium')}
                >
                  Medium
                </button>
                <button 
                  className="correct easy"
                  onClick={() => handleDifficultyRating(true, 'easy')}
                >
                  Easy
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
      
      {reviewed && (
        <div className="next-review">
          <p>
            Next review: {new Date(card.nextReviewDate).toLocaleDateString()}
          </p>
        </div>
      )}
    </div>
  );
};

export default Flashcard;