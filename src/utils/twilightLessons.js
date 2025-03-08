/**
 * Generate Twilight-themed lessons for citizenship test concepts
 */

// Twilight characters that can be used in the lessons
const TWILIGHT_CHARACTERS = {
  BELLA: {
    name: 'Bella Swan',
    description: 'A human girl who falls in love with a vampire'
  },
  EDWARD: {
    name: 'Edward Cullen',
    description: 'A 108-year-old vampire with mind-reading abilities'
  },
  JACOB: {
    name: 'Jacob Black',
    description: 'A werewolf from the Quileute tribe'
  },
  ALICE: {
    name: 'Alice Cullen',
    description: 'A vampire with the ability to see the future'
  },
  CHARLIE: {
    name: 'Charlie Swan',
    description: 'Bella\'s father and the Chief of Police in Forks'
  }
};

// Twilight locations
const TWILIGHT_LOCATIONS = {
  FORKS: 'Forks, Washington',
  CULLEN_HOUSE: 'The Cullen family house',
  HIGH_SCHOOL: 'Forks High School',
  LA_PUSH: 'La Push beach',
  MEADOW: 'Edward and Bella\'s meadow'
};

/**
 * Generate a Twilight-themed lesson for a specific citizenship test question
 * @param {Object} card - The flashcard that needs a lesson
 * @returns {Object} A lesson object with title, content and characters
 */
export const generateTwilightLesson = (card) => {
  // Keywords in questions to match with appropriate lesson templates
  const keywords = {
    'constitution': createConstitutionLesson,
    'amendment': createAmendmentLesson,
    'rights': createRightsLesson,
    'government': createGovernmentLesson,
    'president': createPresidentLesson,
    'congress': createCongressLesson,
    'supreme court': createSupremeCourtLesson,
    'independence': createIndependenceLesson,
    'civil': createCivilRightsLesson,
    'war': createWarLesson,
  };
  
  // Find matching lesson creator or use default
  let lessonCreator = createDefaultLesson;
  
  for (const [keyword, creator] of Object.entries(keywords)) {
    if (card.question.toLowerCase().includes(keyword) || card.answer.toLowerCase().includes(keyword)) {
      lessonCreator = creator;
      break;
    }
  }
  
  return lessonCreator(card);
};

// Lesson creator functions

function createConstitutionLesson(card) {
  return {
    title: 'The Constitution: A Twilight Love Story',
    location: TWILIGHT_LOCATIONS.CULLEN_HOUSE,
    characters: [TWILIGHT_CHARACTERS.EDWARD, TWILIGHT_CHARACTERS.BELLA],
    content: `At the Cullen house, Edward showed Bella an ancient document he had preserved from his early days.
    
"This is like our vampire coven's constitution," Edward explained as they sat in the living room. "Just as the U.S. Constitution is ${card.answer}, our family has rules that define how we live together and protect each other's rights."

Bella looked fascinated. "So the Constitution is like the treaty between vampires and werewolves? It sets up boundaries and protects everyone?"

"Exactly," Edward smiled. "The Constitution established three branches of government—just like our family has Carlisle as the leader, me with my mind-reading abilities for judgment, and Emmett with his strength for enforcement."

Through their supernatural relationship, Bella gained a deeper understanding of how the Constitution creates balance and protects the rights of all citizens, just as the delicate balance between vampires and humans requires rules and protection.`
  };
}

function createAmendmentLesson(card) {
  return {
    title: 'Amendments: When Even Vampires Need to Adapt',
    location: TWILIGHT_LOCATIONS.HIGH_SCHOOL,
    characters: [TWILIGHT_CHARACTERS.EDWARD, TWILIGHT_CHARACTERS.BELLA, TWILIGHT_CHARACTERS.ALICE],
    content: `During history class at Forks High School, Mr. Jefferson was discussing constitutional amendments.
    
"An amendment is ${card.answer}," the teacher explained.

Edward leaned over to whisper to Bella, "Alice had a vision about this topic last night."

Later, at lunch, Alice explained, "Even vampires need to adapt over time. When I was turned in 1920, women had just won the right to vote through the 19th Amendment."

"So amendments are like how your family adapted its 'vegetarian' vampire lifestyle?" Bella asked.

"Precisely," Edward nodded. "The original Constitution needed changes, just like our family needed to change our feeding habits. The Founding Fathers created a way to update the rules as society evolved—just as Carlisle found a way for us to exist without harming humans."

Through the Cullens' centuries of existence, Bella understood how amendments allow the Constitution to remain relevant through changing times, just as immortal vampires must adapt to different eras.`
  };
}

function createRightsLesson(card) {
  return {
    title: 'Rights: Protected Like a Human Among Vampires',
    location: TWILIGHT_LOCATIONS.MEADOW,
    characters: [TWILIGHT_CHARACTERS.BELLA, TWILIGHT_CHARACTERS.JACOB, TWILIGHT_CHARACTERS.EDWARD],
    content: `In their special meadow, Edward, Bella, and Jacob were having a rare peaceful conversation about rights.
    
"The question about rights in the citizenship test asks: ${card.question}," said Bella. "And the answer is: ${card.answer}."

"It reminds me of how the treaty protects both our tribes," Jacob explained. "The werewolves and vampires each have rights and territories."

Edward nodded thoughtfully. "The Bill of Rights protects citizens from government overreach, similar to how our treaty prevents either of our kinds from having too much power."

"So my rights as a human are protected even though I'm surrounded by supernatural creatures who could easily overpower me?" Bella asked.

"Exactly," Edward said. "Just as the Constitution ensures that even the smallest voice can't be silenced by the majority, our love ensures your safety despite the natural order of predator and prey."

Through their supernatural relationship triangle, Bella gained a profound understanding of how rights protect the vulnerable from the powerful—just as she was protected in a world of immortal beings.`
  };
}

// Default lesson creator for any question type
function createDefaultLesson(card) {
  return {
    title: 'A Twilight Tale of Citizenship',
    location: TWILIGHT_LOCATIONS.FORKS,
    characters: [TWILIGHT_CHARACTERS.BELLA, TWILIGHT_CHARACTERS.EDWARD],
    content: `As Bella and Edward walked through the misty streets of Forks, their conversation turned to citizenship.
    
"Did you know," Edward said, his voice like velvet in the rain, "that the test asks: ${card.question}"

Bella looked up at him, raindrops clinging to her eyelashes. "What's the answer?"

"${card.answer}," Edward replied, his perfect memory recalling information from his many decades of existence. "When you've lived through as much history as I have, you gain perspective on these things."

Bella smiled. "I guess being immortal has its advantages when studying for tests."

"Indeed," Edward chuckled. "Just as I've committed to you eternally, citizens commit to understanding their nation's foundation eternally."

Through their supernatural bond, the concept became clear to Bella in a way no textbook could explain.`
  };
}

// Additional lesson creators (basic implementations)
function createGovernmentLesson(card) {
  return {
    title: 'Government Branches: The Vampire Coven Structure',
    location: TWILIGHT_LOCATIONS.CULLEN_HOUSE,
    characters: [TWILIGHT_CHARACTERS.EDWARD, TWILIGHT_CHARACTERS.BELLA, TWILIGHT_CHARACTERS.CHARLIE],
    content: `At dinner with Charlie, Bella and Edward discussed government structures.

"The test asks: ${card.question}," Bella said, looking at her flashcard.

"And the answer is ${card.answer}," Charlie replied, drawing on his experience as police chief.

Later, at the Cullen house, Edward explained, "The U.S. government has three branches with checks and balances, similar to how vampire covens operate. The Volturi have their own version of executive, legislative, and judicial powers—though far more absolute than America's."

Through their supernatural perspective, Bella gained insight into how government powers are distributed to prevent tyranny—unlike the Volturi's iron rule over all vampires.`
  };
}

function createPresidentLesson(card) {
  // Implementation for President-related questions
  return createDefaultLesson(card);
}

function createCongressLesson(card) {
  // Implementation for Congress-related questions
  return createDefaultLesson(card);
}

function createSupremeCourtLesson(card) {
  // Implementation for Supreme Court-related questions
  return createDefaultLesson(card);
}

function createIndependenceLesson(card) {
  // Implementation for Independence-related questions
  return createDefaultLesson(card);
}

function createCivilRightsLesson(card) {
  // Implementation for Civil Rights-related questions
  return createDefaultLesson(card);
}

function createWarLesson(card) {
  // Implementation for War-related questions
  return createDefaultLesson(card);
}