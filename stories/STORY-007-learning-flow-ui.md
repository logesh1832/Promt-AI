# Story 007: Four-Step Learning Flow Interface

## Story
**As a** learner  
**I want** to progress through a 4-step learning process for each topic  
**So that** I can systematically understand and practice prompt engineering concepts

## Priority: Critical
## Story Points: 8
## Sprint: 2

## Acceptance Criteria

1. **Create VerticalStepper component**
   ```jsx
   // src/components/course/VerticalStepper.jsx
   - 4 steps with icons and labels
   - Active step highlighted
   - Completed steps show checkmark
   - Click navigation for completed steps
   - Progress line between steps
   ```

2. **Implement step components**
   ```jsx
   // src/components/course/steps/
   ├── TopicExplanation.jsx
   ├── ExamplePrompt.jsx
   ├── PromptExecution.jsx
   └── PracticeProblems.jsx
   ```

3. **Create main learning page**
   ```jsx
   // src/pages/TopicLearning.jsx
   - Sidebar with stepper
   - Main content area
   - Next/Previous buttons
   - Progress persistence
   ```

4. **Topic Explanation step**
   - Render markdown content
   - Highlight key concepts
   - Code syntax highlighting
   - Estimated reading time
   - Smooth scroll for long content

5. **Example Prompt step**
   - Display formatted prompt
   - Structural breakdown
   - "Why this works" section
   - Copy button
   - "Try this Prompt" CTA

6. **Prompt Execution step**
   - Read-only prompt display
   - Execute button
   - Chat interface for response
   - Loading animation
   - Response timing display

7. **Practice Problems step**
   - Problem statement
   - Textarea for user prompt
   - Submit to Gemini API
   - "Show Suggested Answer"
   - Multiple attempts tracking
   - Completion celebration

## State Management

```javascript
// src/hooks/useLearningFlow.js
export function useLearningFlow(topicId) {
  const [currentStep, setCurrentStep] = useState(1);
  const [stepProgress, setStepProgress] = useState({
    1: 'active',    // active, completed
    2: 'locked',    // locked, active, completed
    3: 'locked',
    4: 'locked'
  });
  
  const [attempts, setAttempts] = useState({});
  const [responses, setResponses] = useState({});
  
  // Load from localStorage
  useEffect(() => {
    const saved = localStorage.getItem(`topic_${topicId}_progress`);
    if (saved) {
      const data = JSON.parse(saved);
      setCurrentStep(data.currentStep);
      setStepProgress(data.stepProgress);
    }
  }, [topicId]);
  
  return {
    currentStep,
    stepProgress,
    goToStep,
    completeStep,
    saveProgress
  };
}
```

## Mock Topic Data

```javascript
// src/data/topics/prompt-basics.js
export const promptBasicsTopic1 = {
  id: 'clear-instructions',
  title: 'Writing Clear Instructions',
  steps: {
    explanation: {
      content: `# Writing Clear Instructions\n\n...`,
      readingTime: 5,
      keyPoints: ['Be specific', 'Provide context', 'Set expectations']
    },
    example: {
      prompt: "You are a helpful writing assistant...",
      breakdown: {
        role: "Defines the AI's persona",
        task: "Specifies the exact task",
        constraints: "Sets boundaries and format"
      }
    },
    practice: {
      problem: "Create a prompt that asks the AI to summarize a technical article for a non-technical audience",
      hints: ["Define the AI's role", "Specify the audience"],
      suggestedAnswer: "You are a technical writer..."
    }
  }
};
```

## Technical Notes

- Each step saves progress independently
- Prevent skipping ahead to locked steps
- Smooth transitions between steps
- Mobile-responsive stepper (horizontal on mobile)
- Prepare for backend API integration

## Definition of Done

- [ ] Vertical stepper matches design
- [ ] All 4 step components created
- [ ] Navigation between steps works
- [ ] Progress saves to localStorage
- [ ] Step locking enforced
- [ ] Chat interface integrated
- [ ] Practice submission works
- [ ] Responsive on all devices
- [ ] Loading states implemented

## Dependencies
- Story 005: Gemini Integration
- Story 006: Course Selection Page

## References
- Original: `course-learning.html`, `course-learning.js`
- PRD: FR3 (4-step flow), FR11 (vertical stepper)