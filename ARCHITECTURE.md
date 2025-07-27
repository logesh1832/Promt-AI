# PromptMaster Full-Stack Architecture

## Overview
PromptMaster is an AI-powered learning portal for prompt engineering education. This document outlines the full-stack architecture transitioning from the current HTML/CSS/JS prototype to a modern React-based application with potential backend services.

## Architecture Diagram

```
┌─────────────────────────────────────────────────────────────────────┐
│                           Client Layer                               │
├─────────────────────────────────────────────────────────────────────┤
│                         React SPA (Vite)                             │
│  ┌──────────────┐  ┌─────────────┐  ┌────────────────────────┐    │
│  │   UI Layer   │  │State Mgmt   │  │   Service Layer        │    │
│  │  Components  │  │  Context    │  │  - Gemini Service      │    │
│  │  - Pages     │  │  - Auth     │  │  - Storage Service     │    │
│  │  - Shared    │  │  - Course   │  │  - Analytics Service   │    │
│  │  - Layout    │  │  - Progress │  │                        │    │
│  └──────────────┘  └─────────────┘  └────────────────────────┘    │
└─────────────────────────────────────────────────────────────────────┘
                                │
                                │ HTTPS
                                ▼
┌─────────────────────────────────────────────────────────────────────┐
│                      External Services                               │
├─────────────────────────────────────────────────────────────────────┤
│  ┌────────────────────┐     ┌──────────────────────────────────┐   │
│  │ Google Gemini API  │     │   Future Backend Services        │   │
│  │  Flash 2.0         │     │   (Node.js/Express)             │   │
│  └────────────────────┘     │   - Authentication              │   │
│                             │   - Course Management            │   │
│                             │   - Progress Tracking            │   │
│                             │   - Analytics                   │   │
│                             └──────────────────────────────────┘   │
└─────────────────────────────────────────────────────────────────────┘
```

## Technology Stack

### Frontend (MVP - Phase 1)
- **Framework**: React 18+ with Hooks
- **Build Tool**: Vite 5.x
- **Routing**: React Router v6
- **State Management**: React Context API
- **Styling**: Existing CSS (styles.css, course-learning.css) + CSS Modules
- **UI Components**: Custom components maintaining existing design
- **API Integration**: Google AI SDK (@google/generative-ai)
- **Local Storage**: Browser localStorage for persistence
- **Development Tools**: 
  - ESLint + Prettier
  - React DevTools
  - Vite HMR

### Backend (Future - Phase 2)
- **Runtime**: Node.js 20+ LTS
- **Framework**: Express.js or Fastify
- **Database**: PostgreSQL with Prisma ORM
- **Authentication**: JWT with refresh tokens
- **API Design**: RESTful with OpenAPI documentation
- **Caching**: Redis for session management
- **File Storage**: AWS S3 or compatible
- **Monitoring**: Winston logging + Prometheus metrics

## Project Structure

```
prompt-master/
├── frontend/                    # React application
│   ├── src/
│   │   ├── components/         # Reusable UI components
│   │   │   ├── common/        # Buttons, Inputs, Cards
│   │   │   ├── layout/        # Header, Sidebar, Footer
│   │   │   ├── learning/      # Stepper, ChatInterface
│   │   │   └── admin/         # Admin-specific components
│   │   ├── pages/             # Route-based pages
│   │   │   ├── Login/
│   │   │   ├── CourseSelection/
│   │   │   ├── TopicList/
│   │   │   ├── Learning/
│   │   │   └── Admin/
│   │   ├── contexts/          # React Context providers
│   │   │   ├── AuthContext.js
│   │   │   ├── CourseContext.js
│   │   │   └── ProgressContext.js
│   │   ├── services/          # External integrations
│   │   │   ├── gemini.js     # Gemini API wrapper
│   │   │   ├── storage.js    # LocalStorage abstraction
│   │   │   └── analytics.js  # Analytics tracking
│   │   ├── hooks/             # Custom React hooks
│   │   ├── utils/             # Helper functions
│   │   ├── styles/            # Global styles & themes
│   │   ├── assets/            # Images, fonts, icons
│   │   ├── App.jsx
│   │   └── main.jsx
│   ├── public/                # Static assets
│   ├── tests/                 # Test files
│   ├── .env.example
│   ├── .eslintrc.js
│   ├── .prettierrc
│   ├── vite.config.js
│   └── package.json
├── backend/                   # Future backend service
│   ├── src/
│   │   ├── controllers/
│   │   ├── models/
│   │   ├── routes/
│   │   ├── middlewares/
│   │   ├── services/
│   │   └── utils/
│   ├── prisma/
│   ├── tests/
│   └── package.json
├── docs/                      # Documentation
├── scripts/                   # Build & deployment scripts
└── README.md
```

## Component Architecture

### Core Components Hierarchy

```
App.jsx
├── AuthProvider
│   └── Router
│       ├── PublicRoute
│       │   └── LoginPage
│       └── PrivateRoute
│           ├── LearnerLayout
│           │   ├── Header
│           │   ├── Sidebar
│           │   └── Routes
│           │       ├── CourseSelectionPage
│           │       ├── TopicListPage
│           │       └── LearningFlowPage
│           │           ├── VerticalStepper
│           │           ├── TopicExplanation
│           │           ├── ExamplePrompt
│           │           ├── PromptExecution
│           │           │   └── ChatInterface
│           │           └── PracticeProblems
│           └── AdminLayout
│               ├── AdminHeader
│               ├── AdminSidebar
│               └── AdminRoutes
│                   ├── Dashboard
│                   ├── CourseManager
│                   └── ContentApproval
```

## Data Flow Architecture

### State Management Strategy

1. **Authentication State** (Context)
   ```javascript
   {
     user: { id, email, name, role },
     isAuthenticated: boolean,
     token: string (future)
   }
   ```

2. **Course Progress State** (Context)
   ```javascript
   {
     currentCourse: { id, level, title, topics },
     currentTopic: { id, title, steps },
     progress: {
       courseId: { topicId: { stepsCompleted: [] } }
     }
   }
   ```

3. **Local Component State**
   - Form inputs
   - UI toggles
   - Loading states
   - Error states

### API Integration Pattern

```javascript
// Gemini Service Layer
class GeminiService {
  async generateContent(prompt, config) { }
  async executePrompt(userPrompt, context) { }
  async validateResponse(response) { }
}

// Usage in Components
const useLLMResponse = () => {
  const [response, setResponse] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  
  const executePrompt = async (prompt) => {
    setLoading(true);
    try {
      const result = await geminiService.executePrompt(prompt);
      setResponse(result);
    } catch (err) {
      setError(err);
    } finally {
      setLoading(false);
    }
  };
  
  return { response, loading, error, executePrompt };
};
```

## Security Architecture

### Frontend Security
1. **API Key Management**
   - Environment variables for development
   - Proxy through backend in production
   - Never expose keys in client code

2. **Input Validation**
   - Sanitize all user inputs
   - Validate prompt length limits
   - Prevent injection attacks

3. **Authentication Flow**
   - JWT tokens stored in httpOnly cookies (future)
   - Refresh token rotation
   - Session timeout handling

### Content Security
1. **LLM Response Filtering**
   - Sanitize HTML content
   - Filter inappropriate responses
   - Rate limiting per user

2. **Admin Content Approval**
   - Review queue for generated content
   - Version control for approved content
   - Audit trail for changes

## Performance Optimization

### Frontend Optimization
1. **Code Splitting**
   - Route-based splitting
   - Lazy load admin features
   - Dynamic imports for heavy components

2. **Caching Strategy**
   - Cache course content in localStorage
   - Memoize expensive computations
   - Service Worker for offline support (future)

3. **Bundle Optimization**
   - Tree shaking unused code
   - Minimize CSS/JS bundles
   - Optimize images and assets

### API Optimization
1. **Request Management**
   - Debounce user inputs
   - Queue concurrent requests
   - Implement retry logic

2. **Response Caching**
   - Cache static content responses
   - Invalidate on content updates
   - Progressive data loading

## Deployment Architecture

### MVP Deployment (Static Hosting)
```
┌─────────────────┐     ┌──────────────────┐
│   Vercel/       │────▶│  Google Gemini   │
│   Netlify       │     │     API          │
│   (React SPA)   │     └──────────────────┘
└─────────────────┘
```

### Production Deployment (Future)
```
┌─────────────────┐     ┌──────────────────┐     ┌──────────────┐
│   CloudFront    │────▶│   ALB/API        │────▶│  PostgreSQL  │
│   (CDN)         │     │   Gateway        │     │  (RDS)       │
└─────────────────┘     └──────────────────┘     └──────────────┘
                               │
                               ▼
                        ┌──────────────────┐
                        │  ECS/Lambda      │
                        │  (Backend)       │
                        └──────────────────┘
```

## Migration Strategy

### Phase 1: React Migration (MVP)
1. Set up React project with Vite
2. Migrate existing pages to React components
3. Implement Gemini integration
4. Add progress tracking with localStorage
5. Deploy as static site

### Phase 2: Backend Introduction
1. Implement authentication service
2. Move API keys to backend
3. Add database for persistence
4. Implement admin features
5. Add analytics collection

### Phase 3: Enterprise Features
1. Multi-tenant support
2. Advanced analytics dashboard
3. Content versioning
4. API rate limiting
5. Horizontal scaling

## Development Workflow

### Git Strategy
```
main
├── develop
│   ├── feature/react-migration
│   ├── feature/gemini-integration
│   └── feature/learning-flow
└── release/v1.0
```

### CI/CD Pipeline
1. **Pre-commit**: Linting, formatting
2. **CI**: Unit tests, integration tests
3. **Build**: Vite production build
4. **Deploy**: Automated deployment to staging/production

## Monitoring & Analytics

### Application Monitoring
- Error tracking (Sentry)
- Performance monitoring
- User session recording
- API usage tracking

### Learning Analytics
- Topic completion rates
- Time spent per topic
- Practice attempt patterns
- Common error points

## Conclusion

This architecture provides a solid foundation for the PromptMaster learning portal, allowing for rapid MVP development while maintaining a clear path for future enhancements. The modular design ensures scalability and maintainability as the application grows.