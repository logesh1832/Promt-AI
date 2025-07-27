# PromptMaster React Implementation Guide

## Phase 1: MVP Implementation Steps

### Step 1: Project Setup (Day 1)

#### 1.1 Initialize React Project
```bash
npm create vite@latest promptmaster-frontend -- --template react
cd promptmaster-frontend
npm install
```

#### 1.2 Install Dependencies
```bash
# Core dependencies
npm install react-router-dom@6 @google/generative-ai

# Development dependencies
npm install -D eslint prettier eslint-config-prettier eslint-plugin-react
```

#### 1.3 Project Structure Setup
```bash
# Create folder structure
mkdir -p src/{components/{common,layout,learning,admin},pages,contexts,services,hooks,utils,styles,assets}
```

#### 1.4 Environment Configuration
Create `.env.example`:
```env
VITE_GEMINI_API_KEY=your_api_key_here
VITE_APP_ENV=development
```

### Step 2: Migrate Existing Assets (Day 1)

#### 2.1 Copy CSS Files
```bash
# Copy existing styles
cp ../styles.css src/styles/
cp ../course-learning.css src/styles/
```

#### 2.2 Create Global Styles Entry
```javascript
// src/styles/index.css
@import './styles.css';
@import './course-learning.css';

/* Additional global styles */
* {
  box-sizing: border-box;
}

#root {
  min-height: 100vh;
}
```

### Step 3: Core Components Implementation (Days 2-3)

#### 3.1 Create Base Components

**Button Component** (`src/components/common/Button.jsx`):
```javascript
const Button = ({ variant = 'primary', children, onClick, ...props }) => {
  return (
    <button 
      className={`btn-${variant}`} 
      onClick={onClick}
      {...props}
    >
      {children}
    </button>
  );
};

export default Button;
```

**Input Component** (`src/components/common/Input.jsx`):
```javascript
const Input = ({ label, type = 'text', id, ...props }) => {
  return (
    <div className="form-group">
      {label && <label htmlFor={id}>{label}</label>}
      <input type={type} id={id} {...props} />
    </div>
  );
};

export default Input;
```

#### 3.2 Layout Components

**Header Component** (`src/components/layout/Header.jsx`):
```javascript
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';

const Header = ({ onToggleSidebar, courseLevel }) => {
  const navigate = useNavigate();
  const { logout } = useAuth();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <header className="learning-header">
      <div className="header-content">
        <button className="hamburger-btn" onClick={onToggleSidebar}>
          <span></span>
          <span></span>
          <span></span>
        </button>
        <h1 className="app-title">PromptMaster</h1>
        <div className="header-right">
          <span className="course-level">{courseLevel}</span>
          <button className="logout-btn" onClick={handleLogout}>
            Logout
          </button>
        </div>
      </div>
    </header>
  );
};

export default Header;
```

### Step 4: Context Implementation (Day 4)

#### 4.1 Auth Context
```javascript
// src/contexts/AuthContext.jsx
import { createContext, useContext, useState, useEffect } from 'react';

const AuthContext = createContext();

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check localStorage for existing session
    const savedUser = localStorage.getItem('promptmaster_user');
    if (savedUser) {
      setUser(JSON.parse(savedUser));
      setIsAuthenticated(true);
    }
    setLoading(false);
  }, []);

  const login = (email, password) => {
    // MVP: Simple validation
    const userData = {
      email,
      name: email.split('@')[0],
      role: email.includes('admin') ? 'admin' : 'learner'
    };
    
    localStorage.setItem('promptmaster_user', JSON.stringify(userData));
    setUser(userData);
    setIsAuthenticated(true);
    return true;
  };

  const logout = () => {
    localStorage.removeItem('promptmaster_user');
    setUser(null);
    setIsAuthenticated(false);
  };

  return (
    <AuthContext.Provider value={{
      user,
      isAuthenticated,
      loading,
      login,
      logout
    }}>
      {children}
    </AuthContext.Provider>
  );
};
```

#### 4.2 Progress Context
```javascript
// src/contexts/ProgressContext.jsx
import { createContext, useContext, useState, useEffect } from 'react';

const ProgressContext = createContext();

export const useProgress = () => {
  const context = useContext(ProgressContext);
  if (!context) {
    throw new Error('useProgress must be used within ProgressProvider');
  }
  return context;
};

export const ProgressProvider = ({ children }) => {
  const [progress, setProgress] = useState({});

  useEffect(() => {
    const savedProgress = localStorage.getItem('promptmaster_progress');
    if (savedProgress) {
      setProgress(JSON.parse(savedProgress));
    }
  }, []);

  const updateTopicProgress = (courseId, topicId, stepIndex) => {
    const newProgress = {
      ...progress,
      [courseId]: {
        ...progress[courseId],
        [topicId]: {
          stepsCompleted: [...(progress[courseId]?.[topicId]?.stepsCompleted || []), stepIndex]
        }
      }
    };
    
    setProgress(newProgress);
    localStorage.setItem('promptmaster_progress', JSON.stringify(newProgress));
  };

  const getTopicProgress = (courseId, topicId) => {
    return progress[courseId]?.[topicId]?.stepsCompleted || [];
  };

  const getCourseProgress = (courseId) => {
    const courseProgress = progress[courseId] || {};
    const totalTopics = Object.keys(courseProgress).length;
    const completedTopics = Object.values(courseProgress).filter(
      topic => topic.stepsCompleted.length === 4
    ).length;
    
    return totalTopics > 0 ? (completedTopics / totalTopics) * 100 : 0;
  };

  return (
    <ProgressContext.Provider value={{
      progress,
      updateTopicProgress,
      getTopicProgress,
      getCourseProgress
    }}>
      {children}
    </ProgressContext.Provider>
  );
};
```

### Step 5: Gemini Integration (Day 5)

#### 5.1 Gemini Service
```javascript
// src/services/gemini.js
import { GoogleGenerativeAI } from '@google/generative-ai';

class GeminiService {
  constructor() {
    this.genAI = new GoogleGenerativeAI(import.meta.env.VITE_GEMINI_API_KEY);
    this.model = this.genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });
  }

  async generateContent(prompt, systemContext = '') {
    try {
      const fullPrompt = systemContext ? `${systemContext}\n\n${prompt}` : prompt;
      const result = await this.model.generateContent(fullPrompt);
      const response = await result.response;
      return response.text();
    } catch (error) {
      console.error('Gemini API Error:', error);
      throw new Error('Failed to generate content. Please try again.');
    }
  }

  async executePrompt(userPrompt, context = {}) {
    const systemContext = `You are an AI assistant helping users learn prompt engineering. 
    Current topic: ${context.topicTitle || 'General'}
    User level: ${context.userLevel || 'Beginner'}
    
    Provide helpful, educational responses that teach good prompting practices.`;
    
    return this.generateContent(userPrompt, systemContext);
  }

  async generateTopicContent(topic, level) {
    const prompt = `Create educational content for a prompt engineering course.
    Topic: ${topic}
    Level: ${level}
    
    Provide:
    1. A clear explanation (2-3 paragraphs)
    2. Key concepts to highlight
    3. An example prompt with explanation
    4. A practice problem
    
    Format the response in clear sections.`;
    
    return this.generateContent(prompt);
  }
}

export default new GeminiService();
```

### Step 6: Page Components (Days 6-7)

#### 6.1 Login Page
```javascript
// src/pages/Login/Login.jsx
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import Input from '../../components/common/Input';
import Button from '../../components/common/Button';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const { login, isAuthenticated } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (isAuthenticated) {
      navigate('/courses');
    }
  }, [isAuthenticated, navigate]);

  useEffect(() => {
    // Focus email input on mount
    document.getElementById('email')?.focus();
  }, []);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (email && password) {
      login(email, password);
      navigate('/courses');
    }
  };

  return (
    <div className="auth-container">
      <div className="auth-card">
        <div className="auth-logo">
          <h1>PromptMaster</h1>
          <p>AI Prompt Engineering Learning Portal</p>
        </div>

        <form onSubmit={handleSubmit} className="auth-form">
          <Input
            label="Email"
            type="email"
            id="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            placeholder="Enter your email"
          />
          
          <Input
            label="Password"
            type="password"
            id="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            placeholder="Enter your password"
          />

          <Button type="submit">Login</Button>
        </form>

        <div className="auth-footer">
          <p>New employee? Contact IT for account setup</p>
        </div>
      </div>
    </div>
  );
};

export default Login;
```

#### 6.2 Course Selection Page
```javascript
// src/pages/CourseSelection/CourseSelection.jsx
import { useNavigate } from 'react-router-dom';
import { mockCourses } from '../../data/mockData';

const CourseSelection = () => {
  const navigate = useNavigate();

  const coursesByLevel = {
    beginner: mockCourses.filter(c => c.level === 'beginner'),
    intermediate: mockCourses.filter(c => c.level === 'intermediate'),
    advanced: mockCourses.filter(c => c.level === 'advanced')
  };

  const handleCourseSelect = (courseId) => {
    navigate(`/course/${courseId}/topics`);
  };

  return (
    <div className="course-selection-container">
      <header className="selection-header">
        <h1>Select Your Learning Path</h1>
        <p>Choose a course that matches your current skill level</p>
      </header>

      {Object.entries(coursesByLevel).map(([level, courses]) => (
        <section key={level} className="course-level-section">
          <h2 className="level-title">
            {level.charAt(0).toUpperCase() + level.slice(1)} Level
          </h2>
          <div className="course-grid">
            {courses.map(course => (
              <div 
                key={course.id}
                className="course-card"
                onClick={() => handleCourseSelect(course.id)}
              >
                <div className="course-icon">{course.icon}</div>
                <h3>{course.title}</h3>
                <p>{course.description}</p>
                <div className="course-meta">
                  <span>{course.topics.length} Topics</span>
                  <span>{course.duration}</span>
                </div>
              </div>
            ))}
          </div>
        </section>
      ))}
    </div>
  );
};

export default CourseSelection;
```

### Step 7: Learning Flow Components (Days 8-9)

#### 7.1 Vertical Stepper
```javascript
// src/components/learning/VerticalStepper.jsx
import { useState } from 'react';

const VerticalStepper = ({ steps, currentStep, onStepChange }) => {
  return (
    <div className="vertical-stepper">
      {steps.map((step, index) => (
        <div 
          key={index}
          className={`step ${index === currentStep ? 'active' : ''} 
                     ${index < currentStep ? 'completed' : ''}`}
        >
          <div className="step-indicator">
            <div className="step-number">{index + 1}</div>
            <div className="step-line" />
          </div>
          <div className="step-content">
            <h3>{step.title}</h3>
            <p>{step.description}</p>
          </div>
        </div>
      ))}
    </div>
  );
};

export default VerticalStepper;
```

#### 7.2 Chat Interface
```javascript
// src/components/learning/ChatInterface.jsx
import { useState, useRef, useEffect } from 'react';
import geminiService from '../../services/gemini';

const ChatInterface = ({ initialPrompt, context }) => {
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(false);
  const chatEndRef = useRef(null);

  useEffect(() => {
    if (initialPrompt) {
      executePrompt(initialPrompt);
    }
  }, [initialPrompt]);

  const executePrompt = async (prompt) => {
    setMessages(prev => [...prev, { type: 'user', content: prompt }]);
    setLoading(true);

    try {
      const response = await geminiService.executePrompt(prompt, context);
      setMessages(prev => [...prev, { type: 'assistant', content: response }]);
    } catch (error) {
      setMessages(prev => [...prev, { 
        type: 'error', 
        content: 'Failed to get response. Please try again.' 
      }]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  return (
    <div className="chat-interface">
      <div className="chat-messages">
        {messages.map((msg, idx) => (
          <div key={idx} className={`message ${msg.type}`}>
            <div className="message-content">{msg.content}</div>
          </div>
        ))}
        {loading && (
          <div className="message assistant loading">
            <div className="typing-indicator">
              <span></span>
              <span></span>
              <span></span>
            </div>
          </div>
        )}
        <div ref={chatEndRef} />
      </div>
    </div>
  );
};

export default ChatInterface;
```

### Step 8: Router Setup (Day 10)

```javascript
// src/App.jsx
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import { ProgressProvider } from './contexts/ProgressContext';
import PrivateRoute from './components/PrivateRoute';
import Login from './pages/Login/Login';
import CourseSelection from './pages/CourseSelection/CourseSelection';
import TopicList from './pages/TopicList/TopicList';
import LearningFlow from './pages/LearningFlow/LearningFlow';
import './styles/index.css';

function App() {
  return (
    <AuthProvider>
      <ProgressProvider>
        <Router>
          <Routes>
            <Route path="/" element={<Login />} />
            <Route element={<PrivateRoute />}>
              <Route path="/courses" element={<CourseSelection />} />
              <Route path="/course/:courseId/topics" element={<TopicList />} />
              <Route path="/topic/:topicId/learn" element={<LearningFlow />} />
            </Route>
            <Route path="*" element={<Navigate to="/" />} />
          </Routes>
        </Router>
      </ProgressProvider>
    </AuthProvider>
  );
}

export default App;
```

### Step 9: Mock Data Setup

```javascript
// src/data/mockData.js
export const mockCourses = [
  {
    id: 'beginner-1',
    level: 'beginner',
    title: 'Introduction to Prompt Engineering',
    description: 'Learn the fundamentals of crafting effective AI prompts',
    icon: '🎯',
    duration: '20-25 min',
    topics: [
      {
        id: 'topic-1',
        title: 'Understanding Prompt Structure',
        description: 'Learn how to structure prompts for clarity'
      },
      {
        id: 'topic-2',
        title: 'Context and Clarity',
        description: 'Master providing context in your prompts'
      },
      {
        id: 'topic-3',
        title: 'Format and Constraints',
        description: 'Control AI output with formatting instructions'
      }
    ]
  }
];
```

### Step 10: Deployment Configuration

#### 10.1 Vite Configuration
```javascript
// vite.config.js
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  build: {
    outDir: 'dist',
    sourcemap: true,
    rollupOptions: {
      output: {
        manualChunks: {
          'react-vendor': ['react', 'react-dom', 'react-router-dom'],
          'gemini': ['@google/generative-ai']
        }
      }
    }
  }
});
```

#### 10.2 Deployment Scripts
```json
// package.json scripts
{
  "scripts": {
    "dev": "vite",
    "build": "vite build",
    "preview": "vite preview",
    "lint": "eslint src --ext js,jsx",
    "format": "prettier --write src/**/*.{js,jsx,css}"
  }
}
```

## Testing Strategy

### Unit Tests
```javascript
// Example test for Button component
import { render, fireEvent } from '@testing-library/react';
import Button from '../components/common/Button';

test('Button renders and handles click', () => {
  const handleClick = jest.fn();
  const { getByText } = render(
    <Button onClick={handleClick}>Click me</Button>
  );
  
  fireEvent.click(getByText('Click me'));
  expect(handleClick).toHaveBeenCalledTimes(1);
});
```

## Migration Checklist

- [ ] Project setup with Vite
- [ ] Copy and integrate existing CSS
- [ ] Create component library
- [ ] Implement authentication flow
- [ ] Build course selection page
- [ ] Create topic navigation
- [ ] Implement 4-step learning flow
- [ ] Integrate Gemini API
- [ ] Add progress tracking
- [ ] Test all user flows
- [ ] Deploy to staging
- [ ] Performance optimization
- [ ] Production deployment

## Next Steps

1. **Immediate Actions**
   - Set up development environment
   - Create Git repository
   - Initialize React project

2. **Week 1 Goals**
   - Complete component migration
   - Implement routing
   - Basic Gemini integration

3. **Week 2 Goals**
   - Full learning flow
   - Progress tracking
   - Initial deployment

This guide provides a comprehensive roadmap for implementing the PromptMaster MVP using React while maintaining the existing design and preparing for future scalability.