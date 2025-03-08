# Citizenship Test Flashcards with Twilight Lessons

A web application for studying U.S. citizenship test questions using spaced repetition and Twilight-themed lessons.

## Features

- **Spaced Repetition**: Questions you find difficult appear more frequently, optimizing your study time
- **Progress Tracking**: Your progress is saved locally in your browser
- **Difficulty Rating**: Rate how well you know each answer to customize your review schedule
- **Twilight-Themed Lessons**: When you miss a question multiple times, get a special lesson that explains the concept through the lens of the Twilight saga

## How It Works

1. **Flashcard Review**: Cards are presented based on spaced repetition algorithms
2. **Rating System**: After answering, rate how well you knew the answer (Easy, Medium, Hard, or Incorrect)
3. **Smart Scheduling**: Cards you find difficult will appear more frequently
4. **Twilight Lessons**: After missing a question multiple times, receive a personalized lesson featuring Edward, Bella, and the Twilight universe

## Getting Started

### Prerequisites

- Node.js (v14 or later)
- npm or yarn

### Installation

1. Clone this repository
2. Install dependencies:
   ```
   npm install
   ```
   or
   ```
   yarn
   ```

3. Start the development server:
   ```
   npm start
   ```
   or
   ```
   yarn start
   ```

4. Open [http://localhost:3000](http://localhost:3000) in your browser

## Building for Production

To create a production build:
```
npm run build
```
or
```
yarn build
```

## Technologies Used

- React
- CSS3
- Local Storage for persistence

## License

This project is MIT licensed.

## Acknowledgments

- Content based on official USCIS Citizenship Test questions
- Twilight saga inspiration for the themed lessons