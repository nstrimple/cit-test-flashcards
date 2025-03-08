# CIT Test Flashcards - Development Guidelines

## Build/Test/Lint Commands
- Start dev server: `npm start` or `yarn start`
- Build for production: `npm run build` or `yarn build`
- Run tests: `npm test` or `yarn test`
- Run single test: `npm test -- --testNamePattern="test name here"`

## Code Style Guidelines
- **React Components**: Functional components with hooks, props destructuring
- **State Management**: React's useState and useEffect hooks
- **Formatting**: 2-space indentation, single quotes, semicolons, trailing commas
- **Imports Order**: React/hooks first, components, utils, CSS last
- **Naming**: PascalCase for components, camelCase for functions/variables, UPPER_SNAKE for constants
- **Component Structure**: State hooks → Effect hooks → Handler functions → Return with JSX
- **Documentation**: JSDoc comments for utility functions
- **Error Handling**: Try/catch for async operations, user-friendly error messages
- **Project Structure**: Components in /src/components/, utilities in /src/utils/

Use localStorage for persistence between sessions. When adding new features, follow existing patterns in the codebase.