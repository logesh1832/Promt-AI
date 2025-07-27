# Story 004: Node.js Backend API Setup

## Story
**As a** developer  
**I want** to set up a Node.js Express backend with proper structure  
**So that** I can handle authentication and API requests securely

## Priority: High
## Story Points: 5
## Sprint: 1

## Acceptance Criteria

1. **Initialize Node.js project**
   ```bash
   mkdir promptmaster-backend
   cd promptmaster-backend
   npm init -y
   ```

2. **Install required dependencies**
   ```json
   {
     "dependencies": {
       "express": "^4.18.0",
       "cors": "^2.8.5",
       "dotenv": "^16.0.0",
       "jsonwebtoken": "^9.0.0",
       "bcryptjs": "^2.4.3",
       "@google/generative-ai": "^0.1.3",
       "express-rate-limit": "^7.1.0"
     },
     "devDependencies": {
       "nodemon": "^3.0.0",
       "jest": "^29.0.0"
     }
   }
   ```

3. **Create folder structure**
   ```
   promptmaster-backend/
   ├── src/
   │   ├── controllers/
   │   ├── middleware/
   │   ├── routes/
   │   ├── services/
   │   ├── utils/
   │   └── config/
   ├── tests/
   ├── .env.example
   └── server.js
   ```

4. **Set up Express server**
   ```javascript
   // server.js
   - Express app configuration
   - CORS enabled for React app
   - Body parser middleware
   - Error handling middleware
   - Port 3001 (to avoid React dev server conflict)
   ```

5. **Create authentication endpoints**
   ```
   POST /api/auth/login
   - Accept email and password
   - Return JWT token and user info
   - Mock validation for now
   
   GET /api/auth/verify
   - Verify JWT token
   - Return user info
   ```

6. **Implement JWT middleware**
   ```javascript
   // src/middleware/auth.js
   - Verify JWT tokens
   - Attach user to request
   - Role-based access control
   ```

7. **Add rate limiting**
   ```javascript
   // src/middleware/rateLimiter.js
   - 100 requests per 15 minutes per IP
   - Special limits for Gemini API calls
   ```

8. **Environment configuration**
   ```
   # .env.example
   PORT=3001
   JWT_SECRET=your_jwt_secret_here
   GEMINI_API_KEY=your_gemini_key_here
   CORS_ORIGIN=http://localhost:5173
   ```

## API Response Format

```javascript
// Success response
{
  "success": true,
  "data": {},
  "message": "Operation successful"
}

// Error response
{
  "success": false,
  "error": {
    "code": "AUTH_FAILED",
    "message": "Invalid credentials"
  }
}
```

## Technical Notes

- Use async/await for all async operations
- Implement proper error handling
- Add request logging middleware
- Prepare for future database integration
- Keep Gemini API key server-side only

## Definition of Done

- [x] Server runs on port 3001 (Note: Changed to 3002 due to port conflict)
- [x] Login endpoint returns JWT
- [x] JWT verification working
- [x] CORS configured for React app
- [x] Rate limiting implemented
- [x] Environment variables loaded
- [x] Basic error handling in place
- [x] README with API documentation

## Dev Agent Record

### Status: Ready for QA
### Agent Model Used: Claude 3.5 Sonnet
### Completion Date: 2025-01-27

### File List
- `/promptmaster-backend/package.json` - Node.js project configuration
- `/promptmaster-backend/server.js` - Main Express server
- `/promptmaster-backend/.env` - Environment configuration
- `/promptmaster-backend/.env.example` - Environment template
- `/promptmaster-backend/.gitignore` - Git ignore file
- `/promptmaster-backend/README.md` - API documentation
- `/promptmaster-backend/src/routes/auth.js` - Authentication routes
- `/promptmaster-backend/src/controllers/authController.js` - Auth logic
- `/promptmaster-backend/src/middleware/auth.js` - JWT middleware
- `/promptmaster-backend/src/middleware/rateLimiter.js` - Rate limiting
- `/promptmaster-backend/src/middleware/errorHandler.js` - Error handling
- `/promptmaster-backend/src/middleware/logger.js` - Request logging

### Change Log
- Created complete Node.js/Express backend structure
- Implemented JWT authentication with login/verify endpoints
- Added rate limiting for general and Gemini API calls
- Configured CORS for React frontend
- Changed port from 3001 to 3002 due to conflict
- All acceptance criteria met

## Dependencies
- Can be developed in parallel with frontend

## References
- Architecture: Backend API design section
- PRD: NFR2 (secure token handling)