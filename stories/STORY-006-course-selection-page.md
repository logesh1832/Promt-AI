# Story 006: Course Selection Dashboard

## Story
**As a** learner  
**I want** to browse and select courses by difficulty level  
**So that** I can choose appropriate learning content for my skill level

## Priority: High
## Story Points: 3
## Sprint: 2

## Acceptance Criteria

1. **Create CourseSelection component**
   ```jsx
   // src/pages/CourseSelection.jsx
   - Match course-selection.html exactly
   - Header with welcome message
   - Three sections: Beginner, Intermediate, Advanced
   ```

2. **Implement course data structure**
   ```javascript
   // src/data/courses.js
   const courses = {
     beginner: [
       {
         id: 'prompt-basics',
         title: 'Prompt Engineering Basics',
         description: 'Learn the fundamentals...',
         topics: 8,
         duration: '2 hours',
         icon: '🎯'
       }
     ],
     intermediate: [...],
     advanced: [...]
   };
   ```

3. **Create CourseCard component**
   ```jsx
   // src/components/course/CourseCard.jsx
   - Course icon/emoji
   - Title and description
   - Topic count
   - Estimated duration
   - Hover effects from CSS
   - Click navigates to topics page
   ```

4. **Add responsive grid layout**
   - 3 columns on desktop
   - 2 columns on tablet
   - 1 column on mobile
   - Use existing CSS classes

5. **Implement navigation header**
   ```jsx
   // src/components/common/NavHeader.jsx
   - User email display
   - Logout button
   - Consistent across pages
   ```

6. **Add loading state**
   - Show skeleton cards while loading
   - Simulate 0.5s delay for realism
   - Smooth fade-in animation

7. **Track selected course**
   ```javascript
   // src/contexts/CourseContext.jsx
   - Current course state
   - Course progress tracking
   - Persist to localStorage
   ```

## Mock Data Structure

```javascript
const mockCourses = {
  beginner: [
    {
      id: 'prompt-basics',
      title: 'Prompt Engineering Basics',
      description: 'Learn fundamental prompt structures and techniques',
      topics: 8,
      duration: '2 hours',
      icon: '🎯',
      progress: 0
    },
    {
      id: 'common-patterns',
      title: 'Common Prompt Patterns',
      description: 'Master frequently used prompt templates',
      topics: 6,
      duration: '1.5 hours',
      icon: '📝',
      progress: 0
    }
  ],
  intermediate: [
    {
      id: 'context-management',
      title: 'Context Management',
      description: 'Advanced techniques for maintaining context',
      topics: 10,
      duration: '3 hours',
      icon: '🧩',
      progress: 0
    }
  ],
  advanced: [
    {
      id: 'enterprise-patterns',
      title: 'Enterprise Prompt Patterns',
      description: 'Complex prompts for business applications',
      topics: 12,
      duration: '4 hours',
      icon: '🏢',
      progress: 0
    }
  ]
};
```

## Technical Notes

- Use React Router for navigation
- Course data can be hardcoded for MVP
- Prepare structure for future API integration
- Maintain all existing animations

## Definition of Done

- [ ] Course selection page matches original design
- [ ] All three difficulty sections displayed
- [ ] Course cards show all required info
- [ ] Navigation to topics page works
- [ ] User info displayed in header
- [ ] Logout functionality implemented
- [ ] Responsive layout working
- [ ] Course selection persisted

## Dependencies
- Story 003: Login Component
- Story 002: Migrate Existing Styles

## References
- Original: `course-selection.html`
- PRD: FR2 (difficulty levels)