# QuizMaster Application

## Overview

QuizMaster is a web-based quiz application built with React and Express.js that provides an interactive quiz experience with competitive leaderboards. The application features geography, history, science, arts, and sports questions with character-by-character answer verification. Users can compete globally and filter leaderboards by continent, country, and category. The system includes user profiles with location settings and comprehensive scoring mechanisms.

## User Preferences

Preferred communication style: Simple, everyday language.

## System Architecture

### Frontend Architecture
- **React with TypeScript**: Modern component-based architecture using functional components and hooks
- **Vite Build System**: Fast development server and optimized production builds with Hot Module Replacement (HMR)
- **Shadcn/ui Component Library**: Pre-built, accessible UI components with Radix UI primitives
- **TailwindCSS**: Utility-first CSS framework with custom design tokens and dark mode support
- **TanStack Query**: Server state management with caching, background updates, and optimistic UI updates
- **Wouter**: Lightweight client-side routing library for navigation between quiz, leaderboard, and profile pages

### Backend Architecture
- **Express.js Server**: RESTful API with middleware for JSON parsing, request logging, and error handling
- **TypeScript**: Type-safe server-side development with shared schema definitions
- **Modular Storage Interface**: Abstracted storage layer with in-memory implementation for development and database implementation for production
- **Request/Response Logging**: Comprehensive logging middleware for API performance monitoring

### Database Design
- **PostgreSQL with Drizzle ORM**: Type-safe database operations with schema-first development
- **Neon Serverless Database**: Cloud-hosted PostgreSQL with connection pooling
- **Four Core Tables**:
  - Users: Authentication, location, and scoring data
  - Questions: Quiz content with categories, difficulty levels, and hints
  - Quiz Sessions: Individual quiz attempts with progress tracking
  - Leaderboard Entries: Competitive scoring with temporal and geographic filtering

### State Management
- **Client State**: React hooks for local component state and form management
- **Server State**: TanStack Query for API data caching and synchronization
- **Shared Types**: TypeScript schemas shared between client and server for type safety
- **Form Validation**: Zod schemas for runtime type checking and validation

### Styling and Design System
- **Design Tokens**: CSS custom properties for consistent theming
- **Component Variants**: Class Variance Authority for systematic component styling
- **Responsive Design**: Mobile-first approach with Tailwind breakpoints
- **Accessibility**: ARIA labels, keyboard navigation, and screen reader support

## External Dependencies

### Core Framework Dependencies
- **React 18**: Frontend framework with concurrent features
- **Express.js**: Node.js web application framework
- **TypeScript**: Static type checking and enhanced developer experience
- **Vite**: Build tool with fast HMR and optimized bundling

### Database and ORM
- **Drizzle ORM**: Type-safe database toolkit with PostgreSQL dialect
- **@neondatabase/serverless**: Serverless PostgreSQL database client
- **connect-pg-simple**: PostgreSQL session store for Express sessions

### UI and Styling
- **@radix-ui/react-\***: Headless UI primitives for accessible components
- **TailwindCSS**: Utility-first CSS framework
- **class-variance-authority**: Component variant management
- **clsx & tailwind-merge**: Conditional CSS class composition

### State Management and Data Fetching
- **@tanstack/react-query**: Server state management with caching
- **@hookform/resolvers**: Form validation with React Hook Form
- **zod**: Runtime type validation and schema definition

### Development Tools
- **@replit/vite-plugin-runtime-error-modal**: Development error overlay
- **@replit/vite-plugin-cartographer**: Replit-specific development enhancements
- **esbuild**: Fast JavaScript bundler for server-side code

### Utility Libraries
- **date-fns**: Date manipulation and formatting
- **nanoid**: Unique ID generation
- **cmdk**: Command palette component
- **embla-carousel-react**: Carousel/slider functionality