import React, { useState, useEffect } from 'react';
import FlashcardReview from './components/FlashcardReview';
import { parseCSV } from './utils/csvParser';
import './App.css';

function App() {
  const [cards, setCards] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  useEffect(() => {
    // Load cards from localStorage if available
    const savedCards = localStorage.getItem('flashcards');
    
    if (savedCards) {
      // Parse the saved cards and restore dates
      const parsedCards = JSON.parse(savedCards);
      
      // Convert date strings back to Date objects
      parsedCards.forEach(card => {
        if (card.lastReviewed) {
          card.lastReviewed = new Date(card.lastReviewed);
        }
        if (card.nextReviewDate) {
          card.nextReviewDate = new Date(card.nextReviewDate);
        }
      });
      
      setCards(parsedCards);
      setLoading(false);
    } else {
      // Otherwise load from CSV
      loadCardsFromCSV();
    }
  }, []);
  
  const loadCardsFromCSV = async () => {
    try {
      const loadedCards = await parseCSV();
      setCards(loadedCards);
      setLoading(false);
      
      // Save to localStorage
      localStorage.setItem('flashcards', JSON.stringify(loadedCards));
    } catch (err) {
      console.error('Failed to load cards:', err);
      setError('Failed to load flashcards. Please try again later.');
      setLoading(false);
    }
  };
  
  const handleUpdateCards = (updatedCards) => {
    setCards(updatedCards);
    
    // Save to localStorage (convert Dates to strings for storage)
    localStorage.setItem('flashcards', JSON.stringify(updatedCards));
  };
  
  const handleReset = () => {
    if (window.confirm('Are you sure you want to reset all progress? This cannot be undone.')) {
      localStorage.removeItem('flashcards');
      loadCardsFromCSV();
    }
  };
  
  if (loading) {
    return <div className="loading">Loading flashcards...</div>;
  }
  
  if (error) {
    return <div className="error">{error}</div>;
  }
  
  return (
    <div className="app">
      <header>
        <h1>U.S. Citizenship Test Flashcards</h1>
        <p>Learn with spaced repetition and Twilight-themed lessons</p>
      </header>
      
      <main>
        <FlashcardReview cards={cards} onUpdateCards={handleUpdateCards} />
      </main>
      
      <footer>
        <button className="reset-button" onClick={handleReset}>
          Reset Progress
        </button>
        <div className="instructions">
          <h3>How to use:</h3>
          <ul>
            <li>Click on a card to reveal the answer</li>
            <li>Rate how well you knew the answer</li>
            <li>Cards you struggle with will appear more frequently</li>
            <li>If you miss a card multiple times, you'll get a special Twilight-themed lesson!</li>
          </ul>
        </div>
      </footer>
    </div>
  );
}

export default App;