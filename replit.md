# Arduino Line Tracer Function Generator

## Overview

This is a web-based code generator application designed to create Arduino functions for line-following robots with mechanum wheels and 10 sensors. The application provides a developer-focused interface where users can configure parameters and generate precise, production-ready Arduino C++ code for various line tracer functions such as intersection detection, turning, and grid navigation.

The application follows a clean architecture pattern with a React + TypeScript frontend and an Express.js backend, utilizing shadcn/ui components for a professional, VS Code-inspired aesthetic.

## User Preferences

Preferred communication style: Simple, everyday language.

## System Architecture

### Frontend Architecture

**Framework & Language:**
- React 18 with TypeScript (no RSC - client-side rendering only)
- Vite as the build tool and development server
- Wouter for lightweight client-side routing

**UI Component System:**
- shadcn/ui component library (New York style variant)
- Radix UI primitives for accessible, unstyled components
- Tailwind CSS for styling with custom design tokens
- Class Variance Authority (CVA) for component variants

**Design Philosophy:**
- Developer-focused aesthetic inspired by VS Code, GitHub, and Replit
- Dark theme default with professional, minimal interface
- Code preview as the hero element
- Typography: Inter/system-ui for UI, Fira Code/JetBrains Mono for code
- Responsive layout: sidebar controls on desktop, stacked on mobile

**State Management:**
- TanStack Query (React Query) for server state management
- React Hook Form with Zod validation for form handling
- No global state management library (component-level state only)

**Key Frontend Features:**
- Real-time code generation preview
- Parameter configuration form with validation
- Copy-to-clipboard functionality for generated code
- Function selector with comprehensive documentation
- Preset modes (cepat/normal/presisi) for quick configuration

### Backend Architecture

**Framework & Runtime:**
- Express.js on Node.js
- TypeScript with ESM modules
- esbuild for production builds

**Code Generation Engine:**
- Custom `ArduinoCodeGenerator` class in `server/codeGenerator.ts`
- Generates Arduino C++ code based on parameter configurations
- Supports multiple function types (scanx, turning functions, intersection detection, etc.)
- Template-based code generation with dynamic parameter injection

**API Design:**
- RESTful API with single endpoint: `POST /api/generate`
- Request validation using Zod schemas
- JSON request/response format
- Centralized error handling

**Development Features:**
- Vite middleware integration for HMR in development
- Custom logging middleware for API requests
- Runtime error overlay (Replit-specific)

### Data Storage Solutions

**Current Implementation:**
- In-memory storage using `MemStorage` class
- User model defined but not actively used (placeholder for future auth)
- No persistent database currently connected
- Stateless code generation (no session or user data persistence)

**Database Configuration (Not Currently Active):**
- Drizzle ORM configured for PostgreSQL
- Neon serverless PostgreSQL adapter included
- Schema defined in `shared/schema.ts`
- Migration support via drizzle-kit
- Ready to integrate when user persistence is needed

**Rationale:**
The application is currently stateless because code generation doesn't require data persistence. The database infrastructure is prepared for future features like saving generated code, user accounts, or configuration presets.

### External Dependencies

**UI & Styling:**
- `@radix-ui/*` - Accessible, unstyled component primitives (dialogs, selects, forms, etc.)
- `tailwindcss` - Utility-first CSS framework
- `class-variance-authority` - Type-safe component variants
- `lucide-react` - Icon library
- Custom fonts: Fira Code, JetBrains Mono (for code display)

**Form & Validation:**
- `react-hook-form` - Performant form state management
- `zod` - TypeScript-first schema validation
- `@hookform/resolvers` - Zod integration for React Hook Form
- `drizzle-zod` - Zod schema generation from Drizzle ORM schemas

**Data Fetching:**
- `@tanstack/react-query` - Async state management and server data caching

**Database (Configured but Inactive):**
- `@neondatabase/serverless` - Serverless PostgreSQL driver
- `drizzle-orm` - TypeScript ORM
- `drizzle-kit` - Database migration toolkit

**Development Tools:**
- `@replit/vite-plugin-*` - Replit-specific development enhancements
- `vite` - Frontend build tool and dev server
- `tsx` - TypeScript execution for Node.js
- `esbuild` - JavaScript bundler for production builds

**Routing & Navigation:**
- `wouter` - Minimalist client-side router (1KB alternative to React Router)

**Date Handling:**
- `date-fns` - Modern JavaScript date utility library

### Key Architectural Decisions

**1. Monorepo Structure with Shared Types**
- Shared schema definitions in `/shared` directory
- Single source of truth for types between frontend and backend
- Zod schemas generate TypeScript types automatically
- Prevents type mismatches and reduces duplication

**2. Code Generator as Core Business Logic**
- Separated from HTTP layer for testability and reusability
- Parameter-driven template generation
- Supports generating single functions or all functions at once
- Designed for easy extension with new function types

**3. Stateless API Design**
- No authentication or session management currently
- Each request is independent and fully self-contained
- Simplifies deployment and horizontal scaling
- Database infrastructure prepared for future stateful features

**4. Developer-Centric UI/UX**
- Code preview is primary content, controls are secondary
- Monospace fonts for all code display
- One-click copy functionality with toast notifications
- Accordion-based documentation for context-sensitive help

**5. Type Safety Throughout**
- Zod for runtime validation
- TypeScript for compile-time type checking
- Shared types ensure frontend/backend contract adherence
- Form validation tied directly to backend schema

**6. Responsive Layout Strategy**
- Desktop: Fixed sidebar (320px) + flexible main area
- Mobile/Tablet: Vertical stacking with controls on top
- Tailwind breakpoints for adaptive design
- Maintains code readability on all screen sizes