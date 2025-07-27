# PromptMaster - AI Prompt Engineering Learning Portal

## Overview
PromptMaster is an interactive learning platform designed to teach employees effective AI prompt engineering techniques through hands-on practice with Google Gemini Flash 2.0.

## Setup Instructions

### Prerequisites
- Node.js (v18.19.1 or higher)
- npm (v9.2.0 or higher)

### Installation

1. Clone the repository and navigate to the project:
```bash
cd promptmaster-app
```

2. Install dependencies:
```bash
npm install
```

3. Set up environment variables:
```bash
cp .env.example .env.local
```

4. Edit `.env.local` and add your API keys:
```
VITE_GEMINI_API_KEY=your_gemini_api_key_here
VITE_API_BASE_URL=http://localhost:3001
```

### Development

Run the development server:
```bash
npm run dev
```

The app will be available at `http://localhost:5173`

### Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run lint` - Run ESLint
- `npm run format` - Format code with Prettier

## Project Structure

```
src/
├── components/      # Reusable React components
│   ├── common/     # Shared components (buttons, cards, etc.)
│   ├── auth/       # Authentication related components
│   ├── course/     # Course and learning flow components
│   └── chat/       # Chat interface components
├── pages/          # Page components (routes)
├── services/       # API services and external integrations
├── contexts/       # React Context providers
├── hooks/          # Custom React hooks
├── utils/          # Utility functions
└── assets/         # Static assets
    └── css/        # Stylesheets
```

## Key Features

- **Role-based Access**: Admin and Learner user types
- **Progressive Learning**: Beginner, Intermediate, and Advanced courses
- **4-Step Learning Flow**: Explanation → Example → Execution → Practice
- **Real-time AI Integration**: Powered by Google Gemini Flash 2.0
- **Progress Tracking**: Visual indicators and analytics

## Technology Stack

- **Frontend**: React 19 with Vite
- **Routing**: React Router v7
- **AI Integration**: Google Generative AI SDK
- **Styling**: Existing CSS (preserved from HTML prototype)
- **Code Quality**: ESLint + Prettier

## Environment Variables

| Variable | Description | Required |
|----------|-------------|----------|
| `VITE_GEMINI_API_KEY` | Google Gemini API key | Yes |
| `VITE_API_BASE_URL` | Backend API URL | Yes |

## Development Workflow

1. Create feature branch from `main`
2. Implement changes following the existing code style
3. Run linting: `npm run lint`
4. Format code: `npm run format`
5. Test thoroughly
6. Submit pull request

## Contributing

Please ensure all code follows the established patterns and passes linting before submitting PRs.
