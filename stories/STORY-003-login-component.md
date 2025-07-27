# Story 003: Create Login Component and Authentication Flow

## Story
**As a** learner  
**I want** to log into the application with my credentials  
**So that** I can access my personalized learning content

## Priority: High
## Story Points: 3
## Sprint: 1

## Acceptance Criteria

1. **Create Login component matching index.html**
   ```jsx
   // src/pages/Login.jsx
   - Exact visual match to index.html
   - Form with email and password fields
   - "PromptMaster" branding
   - "AI Prompt Engineering Learning Portal" tagline
   ```

2. **Implement form handling**
   - Email validation (required, email format)
   - Password validation (required)
   - Prevent default form submission
   - Show loading state during "login"

3. **Create AuthContext for state management**
   ```javascript
   // src/contexts/AuthContext.jsx
   - User state (email, name, role)
   - Login function
   - Logout function
   - isAuthenticated boolean
   - Persist auth state to localStorage
   ```

4. **Implement mock authentication**
   - Any valid email/password logs in
   - Set user role as 'learner' by default
   - Admin emails (*@admin.com) get 'admin' role
   - Redirect to /courses after login

5. **Add route protection**
   ```jsx
   // src/components/ProtectedRoute.jsx
   - Redirect to /login if not authenticated
   - Pass through if authenticated
   ```

6. **Auto-focus email field**
   - Email input focused on component mount
   - Matches original JavaScript behavior

## Code Structure

```jsx
// src/pages/Login.jsx
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();
    if (email && password) {
      login(email, password);
      navigate('/courses');
    }
  };

  // Implement UI matching index.html exactly
}
```

## Technical Notes

- Use existing CSS classes from styles.css
- No UI libraries - pure React components
- Form state managed with useState
- Navigation with React Router

## Definition of Done

- [x] Login page visually identical to index.html
- [x] Form validation working
- [x] AuthContext providing auth state
- [x] Login redirects to course selection
- [x] Protected routes redirect to login
- [x] Auth state persists on refresh
- [x] Email field auto-focuses

## Dev Agent Record

### Status: Ready for Review
### Agent Model Used: Claude 3.5 Sonnet
### Completion Date: 2025-01-26

### File List
- `/promptmaster-app/src/pages/Login.jsx` - Login component with form handling
- `/promptmaster-app/src/contexts/AuthContext.jsx` - Authentication context provider
- `/promptmaster-app/src/hooks/useAuth.js` - Auth hook for accessing context
- `/promptmaster-app/src/components/auth/ProtectedRoute.jsx` - Route protection component
- `/promptmaster-app/src/pages/CourseSelection.jsx` - Placeholder course selection page
- `/promptmaster-app/src/App.jsx` - Updated with routing and auth provider

### Change Log
- Created Login component matching original design
- Implemented AuthContext with localStorage persistence
- Added form validation and loading states
- Set up React Router with protected routes
- Auto-focus on email field implemented
- Mock authentication with role detection (@admin.com gets admin role)
- All acceptance criteria met

## Dependencies
- Story 001: React Project Setup
- Story 002: Migrate Existing Styles

## References
- Original: `index.html`
- Styles: `styles.css`
- PRD: FR1 (role-based access)