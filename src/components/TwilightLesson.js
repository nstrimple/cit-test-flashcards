import React from 'react';

const TwilightLesson = ({ lesson, onClose }) => {
  const { title, location, characters, content } = lesson;
  
  return (
    <div className="twilight-lesson">
      <div className="lesson-header">
        <h2>{title}</h2>
        <div className="lesson-location">{location}</div>
      </div>
      
      <div className="lesson-characters">
        <h3>Characters</h3>
        <div className="character-list">
          {characters.map((character, index) => (
            <div key={index} className="character">
              <div className="character-name">{character.name}</div>
              <div className="character-description">{character.description}</div>
            </div>
          ))}
        </div>
      </div>
      
      <div className="lesson-content">
        {content.split('\n\n').map((paragraph, index) => (
          <p key={index}>{paragraph}</p>
        ))}
      </div>
      
      <div className="lesson-footer">
        <button className="close-lesson" onClick={onClose}>
          Got it! Return to flashcards
        </button>
      </div>
    </div>
  );
};

export default TwilightLesson;