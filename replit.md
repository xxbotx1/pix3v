# Replit.md

## Overview

This is an AI Video Transition Generator application that allows users to upload two images and generate smooth video transitions between them using the Freepik API. The application is built with a React frontend using Vite and Express backend, designed to create professional video transitions with customizable quality settings and multiple output options.

## User Preferences

Preferred communication style: Simple, everyday language.

## System Architecture

### Frontend Architecture
- **Framework**: React 18 with TypeScript, built using Vite for fast development
- **UI Components**: Shadcn/ui component library with Radix UI primitives for accessibility
- **Styling**: Tailwind CSS with custom dark theme design system matching modern AI tools
- **State Management**: React hooks with TanStack Query for server state management
- **Routing**: Wouter for lightweight client-side routing
- **File Handling**: Native browser File API with drag-and-drop support for image uploads

### Backend Architecture
- **Server**: Express.js with TypeScript running on Node.js
- **File Upload**: Multer middleware for handling multipart form data with disk storage
- **API Integration**: Axios for HTTP requests to Freepik's image-to-video API
- **Storage**: In-memory storage for task management (MemStorage class)
- **Development**: Vite integration for hot module replacement during development

### Data Storage Solutions
- **File Storage**: Local disk storage in `/uploads` directory for uploaded images
- **Session Data**: In-memory storage for video generation task tracking
- **Database**: Configured for PostgreSQL with Drizzle ORM (not actively used but ready for deployment)

### Authentication and Authorization
- **API Security**: Environment variable management for Freepik API key
- **File Security**: File type validation (JPEG, PNG, WebP only) with size limits (10MB)
- **CORS**: Configured for development and production environments

### Video Generation Workflow
1. **Image Upload**: Users upload two images (first and last frame)
2. **Configuration**: Select video count (1-3), quality (720p/1080p), and transition prompt
3. **Processing**: Backend sends concurrent requests to Freepik API with unique seeds
4. **Polling**: Client polls for completion status with progress updates
5. **Result Display**: Generated videos shown with download options

## External Dependencies

### Third-party Services
- **Freepik API**: Primary service for AI video generation using pixverse-v5-transition endpoint
- **Google Fonts**: Inter font family for typography

### Development Tools
- **Replit**: Deployment platform with development banner integration
- **Vite**: Build tool with HMR and development server
- **ESBuild**: Production bundling for server code

### UI Libraries
- **Radix UI**: Accessible component primitives for dialogs, buttons, forms
- **Lucide React**: Icon library for consistent iconography
- **Class Variance Authority**: Type-safe variant management for components
- **Tailwind CSS**: Utility-first CSS framework with custom design tokens

### Backend Dependencies
- **Multer**: File upload handling with type validation
- **Axios**: HTTP client for API requests
- **Crypto**: UUID generation for unique filenames
- **Express Static**: Serving uploaded images as static assets

### Type Safety
- **Zod**: Runtime type validation for API requests and responses
- **TypeScript**: Full type safety across client and server
- **Shared Schema**: Common types between frontend and backend in `/shared` directory