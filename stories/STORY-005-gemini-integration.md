# Story 005: Gemini Flash 2.0 API Integration

## Story
**As a** learner  
**I want** to interact with AI through the chat interface  
**So that** I can see real-time responses to prompts and learn effectively

## Priority: High
## Story Points: 5
## Sprint: 2

## Acceptance Criteria

1. **Create Gemini service in backend**
   ```javascript
   // backend/src/services/geminiService.js
   - Initialize Gemini client with API key
   - Handle text generation requests
   - Implement streaming responses
   - Error handling for API failures
   ```

2. **Add Gemini API endpoints**
   ```
   POST /api/gemini/generate
   - Requires authentication
   - Accept prompt and parameters
   - Return streaming response
   - Track token usage
   
   POST /api/gemini/generate-content
   - For admin content generation
   - Higher rate limits
   - Structured response format
   ```

3. **Implement streaming in Express**
   ```javascript
   // Use Server-Sent Events (SSE)
   res.writeHead(200, {
     'Content-Type': 'text/event-stream',
     'Cache-Control': 'no-cache',
     'Connection': 'keep-alive'
   });
   ```

4. **Create React Gemini hook**
   ```javascript
   // frontend/src/hooks/useGemini.js
   - Handle streaming responses
   - Manage loading states
   - Error handling
   - Abort capability
   ```

5. **Rate limiting per user**
   ```javascript
   // backend/src/middleware/geminiRateLimit.js
   - 20 requests per hour for learners
   - 100 requests per hour for admins
   - Track by JWT user ID
   ```

6. **Add response caching**
   ```javascript
   // backend/src/services/cacheService.js
   - Cache common prompts
   - 1-hour TTL
   - Skip cache for practice prompts
   ```

7. **Implement safety filters**
   ```javascript
   // backend/src/middleware/contentFilter.js
   - Check prompts for inappropriate content
   - Log filtered requests
   - Return friendly error message
   ```

## Frontend Integration

```javascript
// src/hooks/useGemini.js
export function useGemini() {
  const [response, setResponse] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  const generateResponse = async (prompt) => {
    setIsLoading(true);
    setError(null);
    
    try {
      const eventSource = new EventSource(
        `/api/gemini/generate?prompt=${encodeURIComponent(prompt)}`,
        { headers: { 'Authorization': `Bearer ${token}` } }
      );
      
      eventSource.onmessage = (event) => {
        const data = JSON.parse(event.data);
        setResponse(prev => prev + data.text);
      };
      
      eventSource.onerror = (error) => {
        eventSource.close();
        setError('Failed to generate response');
        setIsLoading(false);
      };
    } catch (err) {
      setError(err.message);
      setIsLoading(false);
    }
  };

  return { response, isLoading, error, generateResponse };
}
```

## Technical Notes

- Use Gemini Flash 2.0 model specifically
- Implement retry logic with exponential backoff
- Monitor API costs through logging
- Set appropriate temperature for educational content
- Handle both streaming and non-streaming modes

## Definition of Done

- [ ] Gemini service initialized in backend
- [ ] API endpoints working with auth
- [ ] Streaming responses in chat UI
- [ ] Rate limiting enforced
- [ ] Error handling shows user-friendly messages
- [ ] Response time < 3 seconds
- [ ] Usage tracked for analytics
- [ ] Safety filters active

## Dependencies
- Story 004: Node.js Backend Setup
- Story 003: Login Component (for auth token)

## References
- PRD: FR4, NFR1, NFR12
- Architecture: Gemini Integration section
- Google AI SDK documentation