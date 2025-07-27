# PromptMaster Backend API

## Overview
Node.js Express backend API for the PromptMaster AI Learning Portal. Handles authentication, API routing, and Gemini AI integration.

## Setup

1. Install dependencies:
```bash
npm install
```

2. Create `.env` file:
```bash
cp .env.example .env
```

3. Update `.env` with your values:
```
PORT=3001
JWT_SECRET=your_secure_jwt_secret_here
GEMINI_API_KEY=your_gemini_api_key_here
CORS_ORIGIN=http://localhost:5173
```

## Running the Server

Development mode (with auto-reload):
```bash
npm run dev
```

Production mode:
```bash
npm start
```

## API Endpoints

### Authentication

#### POST /api/auth/login
Login with email and password.

**Request:**
```json
{
  "email": "user@example.com",
  "password": "password123"
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "token": "jwt_token_here",
    "user": {
      "id": 1,
      "email": "user@example.com",
      "name": "User Name",
      "role": "learner"
    }
  },
  "message": "Login successful"
}
```

#### GET /api/auth/verify
Verify JWT token.

**Headers:**
```
Authorization: Bearer <jwt_token>
```

**Response:**
```json
{
  "success": true,
  "data": {
    "user": {
      "id": 1,
      "email": "user@example.com",
      "role": "learner"
    }
  },
  "message": "Token is valid"
}
```

### Health Check

#### GET /health
Check if server is running.

**Response:**
```json
{
  "success": true,
  "message": "Server is running"
}
```

## Rate Limiting

- General endpoints: 100 requests per 15 minutes
- Gemini API endpoints: 20 requests per hour (per user)
- Admin endpoints: 100 requests per hour

## Error Response Format

```json
{
  "success": false,
  "error": {
    "code": "ERROR_CODE",
    "message": "Human readable error message"
  }
}
```

## Project Structure

```
src/
├── controllers/    # Request handlers
├── middleware/     # Express middleware
├── routes/         # API routes
├── services/       # Business logic
├── utils/          # Utility functions
└── config/         # Configuration files
```

## Security Features

- JWT authentication
- Password hashing with bcrypt
- CORS protection
- Rate limiting
- Request logging
- Error handling

## Testing

Run tests:
```bash
npm test
```

Watch mode:
```bash
npm run test:watch
```