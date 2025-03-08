/**
 * Parses the CSV file containing citizenship test questions and answers
 */
export const parseCSV = async () => {
  try {
    const response = await fetch('/cit_test.csv');
    const csvText = await response.text();
    
    const lines = csvText.split('\n');
    const flashcards = [];
    
    // Skip header row
    for (let i = 1; i < lines.length; i++) {
      // Handle CSV with quoted fields containing commas
      const line = lines[i].trim();
      if (!line) continue;
      
      // CSV parsing with regex to handle quotes
      const matches = line.match(/(".*?"|[^",]+)(?=\s*,|\s*$)/g);
      if (matches && matches.length >= 2) {
        const question = matches[0].replace(/^"|"$/g, '');
        const answer = matches[1].replace(/^"|"$/g, '');
        
        flashcards.push({
          id: i,
          question,
          answer,
          correctCount: 0,
          incorrectCount: 0,
          lastReviewed: null,
          nextReviewDate: new Date()
        });
      }
    }
    
    return flashcards;
  } catch (error) {
    console.error('Error parsing CSV:', error);
    return [];
  }
};