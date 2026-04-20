# Project Guidelines

## Project Overview

Movie-EZ is an Angular-based web application for browsing and watching movies and TV shows. It integrates with The Movie Database (TMDB) API to fetch content information and provides a modern, responsive user interface.

### Project Structure

- **src/app/** - Main application code
  - **home/** - Home page components
  - **movies/** - Movie browsing and details
  - **tv-shows/** - TV show browsing and details
  - **watch/** - Video player components
  - **search/** - Search functionality
  - **settings/** - User settings
  - **shared/** - Shared components, services, and utilities
  - **navigation-rail/** - Navigation components
  - **error/** - Error handling components
- **src/environments/** - Environment configuration
- **src/foundations/** - Core functionality and utilities

### Key Technologies

- Angular 20
- TypeScript
- RxJS
- PrimeNG UI components
- Swiper for carousels
- TMDB API integration

### Building and Running

- **Development server**: `npm start` (runs on http://localhost:4200)
- **Build**: `npm run build`
- **Testing**: `npm test`

### Deployment

The application is containerized using Docker with Nginx as the web server:

- Build the application: `npm run build`
- Build the Docker image: `docker build -t movie-ez .`
- Run the container: `docker run -p 80:80 movie-ez`

## TypeScript Best Practices

- Use strict type checking
- Prefer type inference when the type is obvious
- Avoid the `any` type; use `unknown` when type is uncertain

## Angular Best Practices

- Always use standalone components over NgModules
- Don't use explicit `standalone: true` (it is implied by default)
- Use signals for state management
- Implement lazy loading for feature routes
- Use `NgOptimizedImage` for all static images.

## Components

- Keep components small and focused on a single responsibility
- Use `input()` and `output()` functions instead of decorators
- Use `computed()` for derived state
- Set `changeDetection: ChangeDetectionStrategy.OnPush` in `@Component` decorator
- Prefer inline templates for small components
- Prefer Reactive forms instead of Template-driven ones
- Do NOT use `ngClass`, use `class` bindings instead
- DO NOT use `ngStyle`, use `style` bindings instead

## State Management

- Use signals for local component state
- Use `computed()` for derived state
- Keep state transformations pure and predictable

## Templates

- Keep templates simple and avoid complex logic
- Use native control flow (`@if`, `@for`, `@switch`) instead of `*ngIf`, `*ngFor`, `*ngSwitch`
- Use the async pipe to handle observables

## Services

- Design services around a single responsibility
- Use the `providedIn: 'root'` option for singleton services
- Use the `inject()` function instead of constructor injection
