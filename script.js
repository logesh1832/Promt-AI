// Page Management
const loginPage = document.getElementById('loginPage');
const courseFlowPage = document.getElementById('courseFlowPage');

// Login Elements
const loginForm = document.getElementById('loginForm');

// Course Flow Elements
const backBtn = document.getElementById('backBtn');
const nextBtn = document.getElementById('nextBtn');
const userPrompt = document.getElementById('userPrompt');
const practicePromptInput = document.getElementById('practicePromptInput');

// Current step tracking
let currentStep = 1;
const totalSteps = 5;

// Example prompt content
const examplePromptText = `You are a professional business consultant specializing in coffee shop startups. I am planning to open a new coffee shop in a busy downtown area with heavy foot traffic from office workers.

Please create a comprehensive business plan that includes:

1. Executive summary (200 words)
2. Market analysis focusing on the local coffee market and competition
3. Financial projections for the first year (startup costs, monthly expenses, revenue forecasts)
4. Marketing strategies targeting office workers and local residents
5. Unique selling propositions to differentiate from competitors

Format the response with clear headers for each section and use bullet points for key items. Keep the total response under 1500 words and maintain a professional, data-driven tone throughout.`;

// Login Form Handler
loginForm.addEventListener('submit', (e) => {
    e.preventDefault();
    
    // Simulate login (no backend)
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;
    
    if (email && password) {
        // Switch to course flow page
        loginPage.classList.remove('active');
        courseFlowPage.classList.add('active');
        
        // Initialize first step
        showStep(1);
    }
});

// Step Navigation Functions
function showStep(stepNumber) {
    // Hide all step content
    document.querySelectorAll('.step-content').forEach(step => {
        step.classList.remove('active');
    });
    
    // Show current step
    const currentStepElement = document.getElementById(`step${stepNumber}`);
    if (currentStepElement) {
        currentStepElement.classList.add('active');
    }
    
    // Update step indicator
    document.getElementById('currentStep').textContent = stepNumber;
    
    // Update step dots
    document.querySelectorAll('.step-dot').forEach((dot, index) => {
        dot.classList.remove('active', 'completed');
        if (index + 1 < stepNumber) {
            dot.classList.add('completed');
        } else if (index + 1 === stepNumber) {
            dot.classList.add('active');
        }
    });
    
    // Update navigation buttons
    backBtn.disabled = stepNumber === 1;
    nextBtn.textContent = stepNumber === totalSteps - 1 ? 'Complete Topic' : 'Next';
    
    // Special handling for step 3 (execution)
    if (stepNumber === 3) {
        setupExecutionStep();
    }
    
    currentStep = stepNumber;
}

function nextStep() {
    if (currentStep < totalSteps) {
        showStep(currentStep + 1);
        window.scrollTo({ top: 0, behavior: 'smooth' });
    } else {
        // Complete topic
        alert('Congratulations! You have completed this topic.');
        showStep(1); // Reset to first step
    }
}

function previousStep() {
    if (currentStep > 1) {
        showStep(currentStep - 1);
        window.scrollTo({ top: 0, behavior: 'smooth' });
    }
}

// Navigation Button Event Listeners
nextBtn.addEventListener('click', nextStep);
backBtn.addEventListener('click', previousStep);

// Step-specific Functions

// Step 2: Try Example Prompt
function tryExamplePrompt() {
    // Move to step 3 and populate the prompt
    showStep(3);
}

// Step 3: Setup Execution
function setupExecutionStep() {
    // Display the example prompt in readonly section
    const readonlyPrompt = document.getElementById('readonlyPrompt');
    readonlyPrompt.innerHTML = `<p>${examplePromptText.replace(/\n/g, '<br>')}</p>`;
    
    // Set the prompt in the input area
    const promptInput = document.getElementById('promptInput');
    promptInput.value = examplePromptText;
    promptInput.readOnly = true;
}

// Execute Prompt
function executePrompt() {
    const promptInput = document.getElementById('promptInput');
    const chatContainer = document.getElementById('chatContainer');
    
    if (promptInput.value.trim()) {
        // Clear initial message
        chatContainer.innerHTML = '';
        
        // Add user message
        addChatMessage(chatContainer, promptInput.value, 'user');
        
        // Simulate AI processing
        setTimeout(() => {
            const aiResponse = generateMockBusinessPlanResponse();
            addChatMessage(chatContainer, aiResponse, 'ai');
        }, 1500);
    }
}

// Step 4: Practice Functions
function startPractice() {
    const practiceChat = document.getElementById('practiceChat');
    practiceChat.innerHTML = '';
    addChatMessage(practiceChat, 'Ready to receive your prompt. Type your solution below and press the send button.', 'system');
}

function showSuggestedAnswer() {
    const suggestedAnswer = document.getElementById('suggestedAnswer');
    suggestedAnswer.classList.toggle('hidden');
}

function executePracticePrompt() {
    const practiceChat = document.getElementById('practiceChat');
    const prompt = practicePromptInput.value.trim();
    
    if (prompt) {
        // Clear initial message if it exists
        if (practiceChat.querySelector('.system')) {
            practiceChat.innerHTML = '';
        }
        
        // Add user message
        addChatMessage(practiceChat, prompt, 'user');
        
        // Simulate AI processing
        setTimeout(() => {
            const response = generateMockBusinessPlanResponse();
            addChatMessage(practiceChat, response, 'ai');
            
            // Store practice prompt for feedback
            sessionStorage.setItem('userPracticePrompt', prompt);
        }, 1500);
        
        // Clear input
        practicePromptInput.value = '';
    }
}

// Step 5: Feedback Functions
function submitFeedback() {
    const selectedRating = document.querySelector('.emoji-btn.selected');
    const comment = document.getElementById('feedbackComment').value;
    
    if (selectedRating) {
        const rating = selectedRating.getAttribute('data-rating');
        console.log('Feedback submitted:', { rating, comment });
        
        // Show success message
        alert('Thank you for your feedback!');
        
        // Reset feedback form
        document.querySelectorAll('.emoji-btn').forEach(btn => btn.classList.remove('selected'));
        document.getElementById('feedbackComment').value = '';
    } else {
        alert('Please select a rating before submitting.');
    }
}

function reviewLesson() {
    // Go back to step 1
    showStep(1);
}

function nextTopic() {
    // In a real app, this would load the next topic
    alert('Loading next topic: Advanced Prompt Techniques');
    showStep(1);
}

// Helper Functions
function addChatMessage(container, message, type) {
    const messageDiv = document.createElement('div');
    messageDiv.className = `chat-message ${type}`;
    
    // Handle line breaks
    const formattedMessage = message.replace(/\n/g, '<br>');
    messageDiv.innerHTML = `<p>${formattedMessage}</p>`;
    
    container.appendChild(messageDiv);
    container.scrollTop = container.scrollHeight;
}

function generateMockBusinessPlanResponse() {
    return `# Comprehensive Business Plan: Downtown Coffee Haven

## Executive Summary
Downtown Coffee Haven will be a premium specialty coffee shop located in the heart of the business district, targeting busy professionals seeking high-quality coffee and a productive environment. Our unique positioning combines artisanal coffee expertise with tech-enabled convenience, creating a seamless experience for time-conscious customers. 

With an initial investment of $250,000, we project breaking even within 8 months and achieving a 15% profit margin by year two. Our competitive advantages include mobile ordering, a loyalty program, and partnerships with local businesses for corporate catering.

## Market Analysis

### Local Coffee Market Overview
- Market size: $2.3M annually within a 1-mile radius
- Growth rate: 8% year-over-year
- Average customer spend: $6.50 per visit
- Peak hours: 7-9 AM and 2-3 PM

### Competition Analysis
1. **Starbucks (2 locations)**: High brand recognition but impersonal service
2. **Local Café Luna**: Popular but limited seating and no mobile ordering
3. **Dunkin'**: Fast service but lower quality perception

### Target Demographics
- Primary: Office workers aged 25-45 (65% of customer base)
- Secondary: Local residents and students (35%)
- Average income: $65,000+
- Values: Quality, convenience, sustainability

## Financial Projections

### Startup Costs
- Equipment and fixtures: $80,000
- Leasehold improvements: $60,000
- Initial inventory: $15,000
- Marketing launch: $20,000
- Working capital: $50,000
- Licenses and permits: $10,000
- **Total: $235,000**

### Monthly Operating Expenses
- Rent: $8,000
- Salaries (6 employees): $18,000
- Cost of goods sold: $12,000
- Utilities: $1,500
- Marketing: $2,000
- Other expenses: $2,500
- **Total: $44,000**

### Revenue Forecast (Year 1)
- Month 1-3: $35,000/month (ramp-up period)
- Month 4-6: $48,000/month
- Month 7-12: $58,000/month
- **Year 1 Total Revenue: $582,000**

## Marketing Strategies

### Launch Campaign
- Free coffee hour for building tenants
- Social media countdown with giveaways
- Partnership with local influencers

### Ongoing Marketing
1. **Digital Presence**
   - Instagram: Daily posts, stories, user-generated content
   - Mobile app with ordering and rewards
   - Email newsletter with exclusive offers

2. **Corporate Partnerships**
   - Catering services for meetings
   - Bulk discount programs
   - Dedicated business accounts

3. **Community Engagement**
   - Monthly coffee education workshops
   - Local artist exhibitions
   - Charity partnerships

## Unique Selling Propositions

1. **Speed Without Sacrifice**: Mobile ordering with 5-minute guarantee
2. **Personalization at Scale**: AI-powered recommendations based on preferences
3. **Workspace Haven**: Reserved seating for remote workers with charging stations
4. **Sustainability Focus**: 100% compostable packaging and carbon-neutral delivery
5. **Local Connection**: Exclusively featuring regional roasters and bakeries

This comprehensive approach positions Downtown Coffee Haven as the premier destination for discerning coffee lovers who refuse to compromise on quality or convenience.`;
}

// Emoji Rating Selection
document.querySelectorAll('.emoji-btn').forEach(btn => {
    btn.addEventListener('click', function() {
        // Remove selected class from all buttons
        document.querySelectorAll('.emoji-btn').forEach(b => b.classList.remove('selected'));
        // Add selected class to clicked button
        this.classList.add('selected');
    });
});

// Step Dot Navigation
document.querySelectorAll('.step-dot').forEach((dot, index) => {
    dot.addEventListener('click', () => {
        const stepNumber = index + 1;
        // Only allow navigation to completed or current steps
        if (stepNumber <= currentStep) {
            showStep(stepNumber);
        }
    });
});

// Handle Enter key in practice prompt input
practicePromptInput.addEventListener('keypress', (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
        e.preventDefault();
        executePracticePrompt();
    }
});

// Initialize
document.addEventListener('DOMContentLoaded', () => {
    // Set initial state
    if (loginPage.classList.contains('active')) {
        document.getElementById('email').focus();
    }
});