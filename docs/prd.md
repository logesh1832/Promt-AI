# PromptMaster - AI Prompt Engineering Learning Portal Product Requirements Document (PRD)

## Goals and Background Context

### Goals
- Enable employees to learn AI prompt engineering through structured, interactive courses
- Provide admins with LLM-powered tools to create and manage learning content efficiently
- Deliver hands-on practice with real-time LLM interactions for immediate feedback
- Support progressive learning paths from beginner to advanced levels
- Create a scalable foundation for enterprise-wide AI literacy training

### Background Context
Organizations are rapidly adopting AI tools, but employees often struggle to write effective prompts that maximize AI capabilities. This learning portal addresses the gap by providing structured, interactive training that combines theoretical knowledge with practical application. Unlike static documentation or videos, learners receive immediate feedback through real LLM interactions, accelerating their understanding of prompt engineering principles. The MVP focuses on core learning workflows while maintaining flexibility for future enterprise features.

### Change Log
| Date | Version | Description | Author |
|------|---------|-------------|---------|
| 2025-01-26 | 1.0 | Initial PRD creation | John (PM) |

## Requirements

### Functional Requirements

**FR1:** The system shall provide role-based access with Admin and Learner user types, each with distinct capabilities and interfaces

**FR2:** The system shall organize courses into three difficulty levels: Beginner, Intermediate, and Advanced

**FR3:** Each topic shall follow a 4-step learning flow: Topic Explanation → Example Prompt → Prompt Execution → Practice Problems

**FR4:** The system shall integrate with Google Gemini Flash 2.0 API to generate content and execute prompts in real-time

**FR5:** Admins shall be able to create courses and topics with LLM-assisted content generation

**FR6:** Admins shall review and approve all LLM-generated content before it becomes available to learners

**FR7:** The system shall provide a chat-style interface for displaying LLM responses during prompt execution

**FR8:** Learners shall be able to input free-form prompts in practice sections and receive real-time LLM responses

**FR9:** The system shall display a "Show Suggested Answer" option for practice problems to guide learners

**FR10:** The system shall track and display topic progress indicators for each learner

**FR11:** The system shall provide a vertical stepper UI component to guide learners through the 4-step topic flow

**FR12:** The system shall include sidebar navigation for browsing courses and topics

**FR13:** The system shall track learner progress metrics including topics started, completed, and time spent per topic

**FR14:** The system shall capture practice prompt success indicators (attempts before viewing suggested answer)

**FR15:** Admins shall access a dashboard showing course completion rates, popular topics, and average time-to-completion

**FR16:** The system shall log anonymized prompt patterns to identify common learning challenges

### Non-Functional Requirements

**NFR1:** The system shall respond to LLM queries with low latency (<3 seconds for typical prompts)

**NFR2:** The system shall implement secure token handling for LLM API credentials

**NFR3:** The system shall support concurrent users (minimum 100 simultaneous learners for MVP)

**NFR4:** The system shall be responsive and compatible with web browsers and tablets

**NFR5:** The codebase shall follow modular architecture patterns to enable scalability and maintainability

**NFR6:** The system shall handle LLM API failures gracefully with appropriate error messages and fallback options

**NFR7:** The system shall implement rate limiting to manage LLM API costs and prevent abuse

**NFR8:** The UI shall maintain consistent loading states and feedback during LLM interactions

**NFR9:** Analytics data shall be aggregated without storing personally identifiable information

**NFR10:** The system shall provide exportable reports in CSV format for offline analysis

**NFR11:** Analytics collection shall not degrade system performance by more than 5%

**NFR12:** The system shall use Google Gemini Flash 2.0 API exclusively for all LLM interactions

**NFR13:** The React application shall maintain the exact visual design from the existing HTML/CSS prototype

## User Interface Design Goals

### Overall UX Vision
Create an intuitive, modern learning experience that reduces cognitive load while maximizing engagement with AI concepts. The interface should feel approachable for beginners yet sophisticated enough for advanced learners, emphasizing clarity and immediate feedback throughout the learning journey. The existing HTML/CSS design will be preserved and migrated to React components.

### Key Interaction Paradigms
- **Guided Linear Flow**: Vertical stepper enforces sequential learning within topics while allowing free navigation between completed content
- **Immediate Feedback Loop**: Real-time LLM responses create conversational learning experience
- **Progressive Disclosure**: Complex concepts revealed gradually through the 4-step topic structure
- **Visual Progress Tracking**: Clear indicators show completion status at course, topic, and step levels
- **Dual-Mode Interface**: Distinct experiences for Admin (content creation) and Learner (consumption) roles

### Core Screens and Views
- Login/Authentication Screen
- Course Selection Dashboard (categorized by difficulty)
- Topic List View (within selected course)
- 4-Step Learning Flow Screen (main learning interface)
- Chat Interface Component (for LLM interactions)
- Practice Workspace (free-form prompt testing)
- Admin Dashboard
- Course/Topic Creation Interface
- Content Review & Approval Queue
- Analytics Dashboard

### Accessibility: WCAG AA
The system will meet WCAG AA standards to ensure inclusive access for all learners, including keyboard navigation, screen reader compatibility, and sufficient color contrast.

### Branding
The existing UI design from the HTML/CSS prototype will be maintained, featuring:
- Current visual design, color scheme, and typography from existing files
- Established layout patterns and component styles
- Existing button styles, form elements, and card designs
- Current animations and transitions from the CSS files
- All visual elements to be preserved during React migration

### Target Device and Platforms: Web Responsive
Primary: Desktop web browsers (Chrome, Edge, Firefox, Safari)
Secondary: Tablet devices (iPad, Android tablets) in landscape orientation
Future consideration: Mobile responsive design for on-the-go learning

## Technical Assumptions

### Repository Structure: Monorepo
Single repository containing the React application with clear separation between components, services, and utilities.

### Service Architecture
**Monolithic React SPA (Single Page Application)**
- Client-side React application handling all UI logic
- Direct integration with Google Gemini Flash 2.0 API from frontend
- Local state management for user sessions and course progress
- Static hosting compatible (can be deployed to Vercel, Netlify, etc.)
- Rationale: Simplified architecture for MVP, no separate backend needed initially

### Testing Requirements
**Unit + Integration Testing Focus**
- Unit tests for React components and utility functions
- Integration tests for Gemini API interactions
- Snapshot tests to ensure UI consistency with original design
- Manual testing checklist for complete user flows

### Additional Technical Assumptions and Requests
- **Frontend Framework**: React 18+ with functional components and hooks
- **UI Migration**: Convert existing HTML structure to React components, preserve all CSS
- **CSS Strategy**: Keep existing stylesheets (styles.css, course-learning.css) with minimal modifications
- **State Management**: React Context API for global state (user auth, course progress)
- **Routing**: React Router v6 for navigation between screens
- **LLM Integration**: Google AI SDK (@google/generative-ai) for Gemini Flash 2.0
- **Build Tool**: Vite for fast development and optimized production builds
- **Type Safety**: JavaScript (no TypeScript for faster MVP development)
- **API Keys**: Environment variables for Gemini API key management
- **Data Persistence**: LocalStorage for MVP, with future migration path to backend database
- **Component Structure**: One-to-one mapping with existing HTML pages
- **Development Tools**: ESLint, Prettier for code consistency
- **Deployment**: Static site deployment (Vercel/Netlify) for initial MVP
- **Error Handling**: Graceful degradation if Gemini API is unavailable
- **Performance**: Lazy loading for course content and code splitting by route

## Epic List

**Epic 1: Foundation & React Migration** - Set up React project, migrate existing HTML/CSS to components, establish routing and core architecture

**Epic 2: Gemini Integration & Chat Interface** - Integrate Google Gemini Flash 2.0 API, implement chat components, and handle real-time LLM interactions

**Epic 3: Learning Flow Implementation** - Build the complete 4-step topic flow, progress tracking, and navigation system

**Epic 4: Course & Topic Management** - Create course selection, topic listing, and content organization features

**Epic 5: Practice & Assessment Features** - Implement practice prompt interface, suggested answers, and learner interaction tracking

**Epic 6: Admin Interface Foundation** - Build admin dashboard, course creation tools, and content management (if included in MVP)

## Epic 1: Foundation & React Migration

**Goal**: Establish the React application foundation by migrating the existing HTML/CSS prototype into a well-structured React application with routing, component architecture, and development environment setup. This epic delivers a fully functional React version of the existing UI that maintains visual parity with the prototype.

### Story 1.1: Project Setup and Development Environment

As a developer,  
I want to set up a React project with Vite and essential tooling,  
so that the team has a consistent development environment.

**Acceptance Criteria:**
1. React project initialized with Vite as the build tool
2. ESLint and Prettier configured with agreed-upon rules
3. Project structure created with folders for components, pages, services, and utilities
4. Environment variable support configured for API keys (.env.example provided)
5. Git repository initialized with appropriate .gitignore
6. README updated with setup instructions and project structure
7. Development server runs successfully with hot module replacement
8. Package.json includes all necessary scripts (dev, build, preview, lint)

### Story 1.2: Migrate Login Page to React

As a learner,  
I want to access the login page as a React component,  
so that I can authenticate into the learning portal.

**Acceptance Criteria:**
1. Login component created maintaining exact visual design from index.html
2. All existing styles from styles.css applied correctly
3. Form validation logic migrated from vanilla JS to React
4. Login form submission prevents default and handles state
5. Successful login redirects to course selection page (React Router navigation)
6. Email field auto-focuses on component mount
7. All animations and transitions work as in original

### Story 1.3: Setup React Router and Navigation Structure

As a user,  
I want to navigate between different pages of the application,  
so that I can access all features seamlessly.

**Acceptance Criteria:**
1. React Router v6 configured with all main routes
2. Routes defined for: /, /login, /courses, /course/:id/topics, /topic/:id/learn
3. Route guards implemented to redirect unauthenticated users to login
4. Browser back/forward buttons work correctly
5. 404 page created for undefined routes
6. Navigation maintains scroll position appropriately
7. Route transitions feel smooth and instant

### Story 1.4: Create Reusable UI Components

As a developer,  
I want to have a library of reusable React components,  
so that I can maintain consistency across the application.

**Acceptance Criteria:**
1. Button component created with variants matching existing styles
2. Card component created for course/topic display
3. Form input components created (text, email, password, textarea)
4. Loading spinner component matching existing design
5. Alert/notification component for error and success messages
6. All components maintain existing CSS classes and styles
7. Components are properly documented with usage examples

### Story 1.5: Migrate Course Selection Page

As a learner,  
I want to browse available courses organized by difficulty level,  
so that I can choose appropriate learning content.

**Acceptance Criteria:**
1. Course selection page migrated from course-selection.html
2. Courses displayed in cards grouped by difficulty (Beginner, Intermediate, Advanced)
3. Course cards show title, description, and topic count
4. Click on course navigates to topic list page
5. Responsive layout works on desktop and tablet
6. All hover effects and animations preserved
7. Mock data structure created for courses

### Story 1.6: Implement Global State Management

As a developer,  
I want to manage application state consistently,  
so that user data and progress persist across components.

**Acceptance Criteria:**
1. React Context created for user authentication state
2. Context provider wraps entire application
3. Login state persists across page refreshes (using localStorage)
4. User context includes: email, name, role (admin/learner)
5. Course progress context created for tracking completion
6. Custom hooks created for accessing contexts (useAuth, useProgress)
7. Context updates trigger appropriate re-renders