# PromptMaster Data Models

## Overview
This document defines the data structures and models used throughout the PromptMaster application, covering both the frontend state management and future backend database schemas.

## Frontend Data Models (MVP)

### User Models

```javascript
// User object stored in AuthContext
const User = {
  id: String,           // Generated UUID or email-based
  email: String,        // User email
  name: String,         // Display name
  role: String,         // 'learner' | 'admin'
  createdAt: Date,      // Account creation
  lastLogin: Date       // Last login timestamp
};

// Auth state
const AuthState = {
  user: User | null,
  isAuthenticated: Boolean,
  loading: Boolean,
  token: String | null  // For future API auth
};
```

### Course Models

```javascript
// Course structure
const Course = {
  id: String,           // Unique identifier (e.g., 'beginner-1')
  level: String,        // 'beginner' | 'intermediate' | 'advanced'
  title: String,        // Course title
  description: String,  // Course description
  icon: String,         // Emoji or icon identifier
  duration: String,     // Estimated duration (e.g., '20-25 min')
  topics: Topic[],      // Array of topics
  isActive: Boolean,    // Whether course is available
  createdBy: String,    // Admin who created (future)
  createdAt: Date,      // Creation timestamp
  updatedAt: Date       // Last update timestamp
};

// Topic structure
const Topic = {
  id: String,           // Unique identifier
  courseId: String,     // Parent course ID
  orderIndex: Number,   // Order within course
  title: String,        // Topic title
  description: String,  // Brief description
  content: TopicContent,// Full content object
  estimatedTime: Number,// Minutes to complete
  prerequisites: String[] // Topic IDs that should be completed first
};

// Topic content for 4-step flow
const TopicContent = {
  topicId: String,
  explanation: {
    content: String,      // Main explanation text/HTML
    keyPoints: String[],  // Highlighted concepts
    mediaUrl: String      // Optional image/video URL
  },
  examplePrompt: {
    prompt: String,       // The example prompt
    explanation: String,  // Why this prompt works
    structure: String,    // Breakdown of prompt structure
    output: String        // Expected output example
  },
  promptExecution: {
    systemPrompt: String, // Context for LLM
    userPrompt: String,   // Prompt to execute
    constraints: Object   // Any constraints/parameters
  },
  practiceProblems: [{
    id: String,
    instruction: String,  // What to practice
    hints: String[],      // Progressive hints
    suggestedAnswer: String, // Model answer
    criteria: String[]    // Success criteria
  }]
};
```

### Progress Models

```javascript
// User progress tracking
const UserProgress = {
  userId: String,
  courses: {
    [courseId]: CourseProgress
  },
  totalTopicsCompleted: Number,
  totalTimeSpent: Number,        // Minutes
  lastActivityAt: Date,
  streakDays: Number
};

// Course-specific progress
const CourseProgress = {
  courseId: String,
  startedAt: Date,
  completedAt: Date | null,
  topics: {
    [topicId]: TopicProgress
  },
  completionPercentage: Number
};

// Topic-specific progress
const TopicProgress = {
  topicId: String,
  startedAt: Date,
  completedAt: Date | null,
  stepsCompleted: Number[],      // Array of completed step indices (0-3)
  currentStep: Number,           // Currently active step
  timeSpent: Number,             // Minutes
  practiceAttempts: PracticeAttempt[]
};

// Practice attempt tracking
const PracticeAttempt = {
  attemptId: String,
  problemId: String,
  userPrompt: String,
  llmResponse: String,
  timestamp: Date,
  viewedHints: Number[],         // Indices of hints viewed
  viewedSuggestedAnswer: Boolean,
  successMetrics: Object         // Custom metrics per problem
};
```

### Analytics Models

```javascript
// Session tracking
const LearningSession = {
  sessionId: String,
  userId: String,
  startTime: Date,
  endTime: Date,
  topicsVisited: String[],
  completedSteps: Number,
  llmInteractions: Number
};

// LLM interaction logging
const LLMInteraction = {
  interactionId: String,
  userId: String,
  topicId: String,
  interactionType: String,       // 'example' | 'practice' | 'admin_generate'
  prompt: String,
  response: String,
  responseTime: Number,          // Milliseconds
  tokenCount: Number,            // For cost tracking
  timestamp: Date,
  error: String | null
};

// Aggregated analytics
const CourseAnalytics = {
  courseId: String,
  totalEnrollments: Number,
  completionRate: Number,
  averageTimeToComplete: Number,
  topicCompletionRates: {
    [topicId]: Number
  },
  commonDropoffPoints: String[],
  lastUpdated: Date
};
```

## Backend Database Schema (Future)

### PostgreSQL Schema

```sql
-- Users table
CREATE TABLE users (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    email VARCHAR(255) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    name VARCHAR(255) NOT NULL,
    role VARCHAR(50) NOT NULL CHECK (role IN ('learner', 'admin')),
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    last_login_at TIMESTAMP WITH TIME ZONE
);

-- Courses table
CREATE TABLE courses (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    level VARCHAR(50) NOT NULL CHECK (level IN ('beginner', 'intermediate', 'advanced')),
    title VARCHAR(255) NOT NULL,
    description TEXT,
    icon VARCHAR(50),
    estimated_duration INTEGER, -- minutes
    is_active BOOLEAN DEFAULT false,
    created_by UUID REFERENCES users(id),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Topics table
CREATE TABLE topics (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    course_id UUID NOT NULL REFERENCES courses(id) ON DELETE CASCADE,
    order_index INTEGER NOT NULL,
    title VARCHAR(255) NOT NULL,
    description TEXT,
    estimated_time INTEGER, -- minutes
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(course_id, order_index)
);

-- Topic content table
CREATE TABLE topic_contents (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    topic_id UUID UNIQUE NOT NULL REFERENCES topics(id) ON DELETE CASCADE,
    explanation_content TEXT,
    explanation_key_points JSONB,
    example_prompt TEXT,
    example_explanation TEXT,
    prompt_execution_config JSONB,
    practice_problems JSONB,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- User progress table
CREATE TABLE user_progress (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES users(id),
    course_id UUID NOT NULL REFERENCES courses(id),
    topic_id UUID NOT NULL REFERENCES topics(id),
    steps_completed INTEGER[] DEFAULT '{}',
    current_step INTEGER DEFAULT 0,
    started_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    completed_at TIMESTAMP WITH TIME ZONE,
    time_spent INTEGER DEFAULT 0, -- minutes
    UNIQUE(user_id, topic_id)
);

-- Practice attempts table
CREATE TABLE practice_attempts (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES users(id),
    topic_id UUID NOT NULL REFERENCES topics(id),
    problem_index INTEGER NOT NULL,
    user_prompt TEXT NOT NULL,
    llm_response TEXT,
    hints_viewed INTEGER[] DEFAULT '{}',
    viewed_suggested_answer BOOLEAN DEFAULT false,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- LLM interactions table
CREATE TABLE llm_interactions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES users(id),
    topic_id UUID REFERENCES topics(id),
    interaction_type VARCHAR(50) NOT NULL,
    prompt TEXT NOT NULL,
    response TEXT,
    response_time INTEGER, -- milliseconds
    token_count INTEGER,
    error_message TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Analytics events table
CREATE TABLE analytics_events (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES users(id),
    event_type VARCHAR(100) NOT NULL,
    event_data JSONB,
    session_id UUID,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Indexes for performance
CREATE INDEX idx_user_progress_user_id ON user_progress(user_id);
CREATE INDEX idx_user_progress_course_id ON user_progress(course_id);
CREATE INDEX idx_practice_attempts_user_topic ON practice_attempts(user_id, topic_id);
CREATE INDEX idx_llm_interactions_user_id ON llm_interactions(user_id);
CREATE INDEX idx_analytics_events_user_session ON analytics_events(user_id, session_id);
```

## API Response Models

### REST API Responses

```javascript
// Standard API response wrapper
const ApiResponse = {
  success: Boolean,
  data: Object | Array,
  error: {
    code: String,
    message: String,
    details: Object
  } | null,
  meta: {
    timestamp: Date,
    version: String
  }
};

// Paginated response
const PaginatedResponse = {
  ...ApiResponse,
  data: {
    items: Array,
    pagination: {
      page: Number,
      pageSize: Number,
      totalItems: Number,
      totalPages: Number
    }
  }
};

// Course list response
const CourseListResponse = {
  courses: [{
    id: String,
    level: String,
    title: String,
    description: String,
    topicCount: Number,
    estimatedDuration: String,
    progressPercentage: Number  // User-specific
  }]
};

// Learning content response
const LearningContentResponse = {
  topic: Topic,
  content: TopicContent,
  progress: TopicProgress,
  nextTopicId: String | null,
  previousTopicId: String | null
};
```

## State Management Patterns

### LocalStorage Schema

```javascript
// LocalStorage keys and structures
const LOCAL_STORAGE_SCHEMA = {
  // User session
  'promptmaster_user': User,
  
  // Progress tracking
  'promptmaster_progress': {
    [userId]: UserProgress
  },
  
  // Cached content
  'promptmaster_content_cache': {
    [topicId]: {
      content: TopicContent,
      cachedAt: Date,
      expiresAt: Date
    }
  },
  
  // User preferences
  'promptmaster_preferences': {
    theme: 'light' | 'dark',
    fontSize: 'small' | 'medium' | 'large',
    autoplayResponses: Boolean
  }
};
```

### Redux/Context State Shape (Future)

```javascript
const AppState = {
  auth: AuthState,
  courses: {
    byId: { [courseId]: Course },
    allIds: String[],
    loading: Boolean,
    error: String | null
  },
  progress: {
    userProgress: UserProgress,
    currentTopic: TopicProgress | null,
    syncing: Boolean
  },
  ui: {
    sidebarOpen: Boolean,
    currentStep: Number,
    loadingStates: {
      [key: String]: Boolean
    },
    notifications: Notification[]
  },
  gemini: {
    isGenerating: Boolean,
    currentInteraction: LLMInteraction | null,
    history: LLMInteraction[]
  }
};
```

## Validation Rules

### Frontend Validation

```javascript
const ValidationRules = {
  user: {
    email: {
      required: true,
      pattern: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
      maxLength: 255
    },
    password: {
      required: true,
      minLength: 8,
      pattern: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/  // Future enhancement
    }
  },
  
  prompt: {
    userPrompt: {
      required: true,
      minLength: 10,
      maxLength: 2000,
      forbidden: ['<script', 'javascript:', 'onclick']  // XSS prevention
    }
  },
  
  content: {
    title: {
      required: true,
      minLength: 5,
      maxLength: 100
    },
    description: {
      maxLength: 500
    }
  }
};
```

## Migration Considerations

### Data Migration from MVP to Production

1. **User Data Migration**
   - Extract from localStorage
   - Generate secure passwords
   - Map to PostgreSQL schema

2. **Progress Data Migration**
   - Preserve completion states
   - Calculate time spent
   - Maintain learning streaks

3. **Content Migration**
   - Convert hardcoded content to database
   - Preserve LLM-generated content
   - Version control for updates

This data model documentation provides a comprehensive foundation for both the MVP implementation and future scalability of the PromptMaster platform.