// Course Learning JavaScript

// State management
let currentTopic = null;
let currentStep = null;
let completedSteps = new Set();
const stepsPerTopic = 4;
const totalTopics = 3;

// Course content based on level
const courseContent = {
    beginner: {
        topics: [
            {
                title: 'Understanding Prompt Structure',
                description: 'Learn the fundamental components of effective prompts',
                estimatedTime: '15 min',
                icon: '📚'
            },
            {
                title: 'Context and Clarity',
                description: 'Master providing clear context and instructions',
                estimatedTime: '20 min',
                icon: '🎯'
            },
            {
                title: 'Format and Constraints',
                description: 'Control output format and set appropriate boundaries',
                estimatedTime: '15 min',
                icon: '📋'
            }
        ]
    },
    intermediate: {
        topics: [
            {
                title: 'Advanced Prompting Patterns',
                description: 'Explore sophisticated prompt structures',
                estimatedTime: '20 min',
                icon: '🔧'
            },
            {
                title: 'Chain of Thought Reasoning',
                description: 'Guide AI through step-by-step thinking',
                estimatedTime: '25 min',
                icon: '🧠'
            },
            {
                title: 'Multi-Step Workflows',
                description: 'Create complex, multi-part prompts',
                estimatedTime: '20 min',
                icon: '⚡'
            }
        ]
    },
    advanced: {
        topics: [
            {
                title: 'Domain-Specific Prompting',
                description: 'Tailor prompts for specialized fields',
                estimatedTime: '25 min',
                icon: '🎓'
            },
            {
                title: 'Performance Optimization',
                description: 'Fine-tune prompts for better results',
                estimatedTime: '30 min',
                icon: '🚀'
            },
            {
                title: 'Complex Problem Solving',
                description: 'Tackle challenging scenarios with AI',
                estimatedTime: '25 min',
                icon: '💡'
            }
        ]
    }
};

// DOM elements
const hamburgerBtn = document.getElementById('hamburgerBtn');
const courseSidebar = document.getElementById('courseSidebar');
const contentArea = document.getElementById('contentArea');
const overallProgress = document.getElementById('overallProgress');
const progressText = document.getElementById('progressText');
const sidebarOverlay = document.getElementById('sidebarOverlay');

// Initialize
document.addEventListener('DOMContentLoaded', () => {
    // Get course level from session
    const courseLevel = sessionStorage.getItem('selectedLevel') || 'beginner';
    const course = courseContent[courseLevel];
    
    // Update UI with course info
    document.getElementById('courseLevel').textContent = courseLevel.charAt(0).toUpperCase() + courseLevel.slice(1) + ' Course';
    document.getElementById('welcomeCourseLevel').textContent = courseLevel.charAt(0).toUpperCase() + courseLevel.slice(1);
    
    // Update topic titles
    course.topics.forEach((topic, index) => {
        const topicTitle = document.getElementById(`topic${index + 1}Title`);
        if (topicTitle) {
            topicTitle.textContent = topic.title;
        }
    });
    
    // Setup hamburger menu
    setupHamburgerMenu();
    
    // Load saved progress
    loadProgress();
});

// Hamburger menu functionality
function setupHamburgerMenu() {
    hamburgerBtn.addEventListener('click', () => {
        hamburgerBtn.classList.toggle('active');
        courseSidebar.classList.toggle('collapsed');
        sidebarOverlay.classList.toggle('active');
    });
    
    sidebarOverlay.addEventListener('click', () => {
        hamburgerBtn.classList.remove('active');
        courseSidebar.classList.add('collapsed');
        sidebarOverlay.classList.remove('active');
    });
}

// Select topic and start learning
function selectTopic(topicId) {
    // Remove active class from all topics
    document.querySelectorAll('.topic-section').forEach(section => {
        section.classList.remove('active');
    });
    
    // Add active class to selected topic
    document.getElementById(`topic-${topicId}`).classList.add('active');
    
    // Set current topic
    currentTopic = topicId;
    currentStep = 1;
    
    // Load first step of the topic
    loadStep(topicId, 1);
}

// Load step content
function loadStep(topicId, stepId) {
    currentTopic = topicId;
    currentStep = stepId;
    
    // Expand the topic if not already expanded
    const topicHeader = document.querySelector(`#topic-${topicId} .topic-header`);
    const topicSteps = document.getElementById(`topic${topicId}Steps`);
    if (!topicHeader.classList.contains('expanded')) {
        toggleTopic(topicId);
    }
    
    // Update active states
    updateActiveStates();
    
    // Close sidebar on mobile
    if (window.innerWidth <= 768) {
        hamburgerBtn.classList.remove('active');
        courseSidebar.classList.add('collapsed');
        sidebarOverlay.classList.remove('active');
    }
    
    // Load step content based on step type
    let content = '';
    switch(stepId) {
        case 1:
            content = getTopicExplanationContent(topicId);
            break;
        case 2:
            content = getExamplePromptContent(topicId);
            break;
        case 3:
            content = getExecuteExampleContent(topicId);
            break;
        case 4:
            content = getPracticeProblemContent(topicId);
            break;
    }
    
    contentArea.innerHTML = content;
    window.scrollTo(0, 0);
    
    // Add event listeners for interactive elements
    setupStepInteractions();
}

// Update active states in sidebar
// Toggle topic expansion
function toggleTopic(topicId) {
    const topicHeader = document.querySelector(`#topic-${topicId} .topic-header`);
    const topicSteps = document.getElementById(`topic${topicId}Steps`);
    
    // Toggle expanded class
    topicHeader.classList.toggle('expanded');
    topicSteps.classList.toggle('expanded');
    
    // Close other topics
    for (let i = 1; i <= totalTopics; i++) {
        if (i !== topicId) {
            const otherHeader = document.querySelector(`#topic-${i} .topic-header`);
            const otherSteps = document.getElementById(`topic${i}Steps`);
            otherHeader.classList.remove('expanded');
            otherSteps.classList.remove('expanded');
        }
    }
}

function updateActiveStates() {
    // Remove all active states from topics and steps
    document.querySelectorAll('.topic-section').forEach(section => {
        section.classList.remove('active');
    });
    document.querySelectorAll('.step-item').forEach(item => {
        item.classList.remove('active');
    });
    
    // Add active state to current topic
    const activeSection = document.getElementById(`topic-${currentTopic}`);
    if (activeSection) {
        activeSection.classList.add('active');
    }
    
    // Add active state to current step
    const currentStepElement = document.querySelector(`#topic-${currentTopic} .step-item:nth-child(${currentStep})`);
    if (currentStepElement) {
        currentStepElement.classList.add('active');
    }
    
    // Update step status to in-progress if not completed
    const stepKey = `${currentTopic}-${currentStep}`;
    if (!completedSteps.has(stepKey)) {
        const statusElement = document.getElementById(`status-${stepKey}`);
        if (statusElement && statusElement.textContent === '○') {
            statusElement.textContent = '◐';
            statusElement.classList.add('in-progress');
        }
    }
}

// Step 1: Topic Explanation
function getTopicExplanationContent(topicId) {
    const courseLevel = sessionStorage.getItem('selectedLevel') || 'beginner';
    const topic = courseContent[courseLevel].topics[topicId - 1];
    
    const content = {
        1: `
            <div class="step-container">
                <div class="step-header">
                    <div class="breadcrumb">
                        <a href="#" class="back-link">← Back to Topics</a>
                        <div class="step-indicators">
                            <span class="indicator active"></span>
                            <span class="indicator"></span>
                            <span class="indicator"></span>
                            <span class="indicator"></span>
                        </div>
                    </div>
                    <h1 class="step-title">Understanding Prompt Structure</h1>
                </div>
                
                <div class="step-content">
                    <p class="intro-text">
                        Effective communication with AI systems requires well-structured prompts. The way you frame your instructions significantly impacts the quality and relevance of the AI's response. A thoughtfully designed prompt serves as a clear roadmap for the AI to follow.
                    </p>
                    
                    <div class="concepts-section">
                        <h2>Key Concepts in Prompt Engineering</h2>
                        <ul class="concepts-list">
                            <li><strong>Clarity:</strong> Using precise language to avoid ambiguity</li>
                            <li><strong>Context:</strong> Providing relevant background information</li>
                            <li><strong>Constraints:</strong> Setting boundaries for the AI's response</li>
                            <li><strong>Examples:</strong> Demonstrating the expected output format</li>
                            <li><strong>Instructions:</strong> Giving specific directions on how to process the information</li>
                        </ul>
                    </div>

                    <p class="bridge-text">
                        When crafting prompts for AI systems, think of yourself as a guide helping the AI navigate through your request. The more specific and structured your guidance, the more aligned the output will be with your expectations.
                    </p>

                    <div class="anatomy-section">
                        <h2>Anatomy of an Effective Prompt</h2>
                        
                        <div class="prompt-parts">
                            <div class="prompt-part">
                                <div class="part-header">
                                    <span class="part-number">1. Role Assignment</span>
                                </div>
                                <p class="part-description">Define the role or persona the AI should adopt (e.g., "Act as a marketing expert")</p>
                            </div>

                            <div class="prompt-part">
                                <div class="part-header">
                                    <span class="part-number">2. Context Setting</span>
                                </div>
                                <p class="part-description">Provide background information and relevant details about your situation</p>
                            </div>

                            <div class="prompt-part">
                                <div class="part-header">
                                    <span class="part-number">3. Specific Instructions</span>
                                </div>
                                <p class="part-description">Clearly state what you want the AI to do with detailed parameters</p>
                            </div>

                            <div class="prompt-part">
                                <div class="part-header">
                                    <span class="part-number">4. Format Requirements</span>
                                </div>
                                <p class="part-description">Specify how you want the response structured (e.g., bullet points, paragraphs)</p>
                            </div>

                            <div class="prompt-part">
                                <div class="part-header">
                                    <span class="part-number">5. Constraints & Limitations</span>
                                </div>
                                <p class="part-description">Set boundaries for the response (e.g., word count, tone, focus areas)</p>
                            </div>
                        </div>
                    </div>

                    <p class="conclusion-text">
                        By understanding and implementing these structural elements, you can craft prompts that consistently yield high-quality, relevant responses from AI systems. In the next section, we'll examine specific examples of well-structured prompts and analyze why they work effectively.
                    </p>
                </div>

                <div class="step-navigation">
                    <button class="btn btn-primary btn-next" onclick="completeStep()">
                        Next: Example Prompt →
                    </button>
                </div>
            </div>
        `,
        2: `
            <div class="step-container">
                <div class="step-header-info">
                    <span class="step-num">Step 1 of 4</span>
                    <h2>Context and Clarity</h2>
                    <button class="btn btn-primary" onclick="completeStep()">Next Step →</button>
                </div>
                
                <div class="step-content">
                    <p class="lead-text">Clear context helps AI understand exactly what you need. The more specific your background information, the more tailored and useful the response will be.</p>
                    
                    <section class="content-section">
                        <h3>Why Context Matters</h3>
                        <div class="concept-grid">
                            <div class="concept-item">
                                <h4>🎯 Reduces Ambiguity</h4>
                                <p>Eliminates multiple interpretations of your request</p>
                            </div>
                            <div class="concept-item">
                                <h4>📊 Improves Relevance</h4>
                                <p>Ensures responses match your specific situation</p>
                            </div>
                            <div class="concept-item">
                                <h4>⚡ Saves Time</h4>
                                <p>Reduces back-and-forth clarifications</p>
                            </div>
                            <div class="concept-item">
                                <h4>🎨 Enables Customization</h4>
                                <p>Allows for industry or domain-specific responses</p>
                            </div>
                        </div>
                    </section>

                    <section class="content-section">
                        <h3>Elements of Good Context</h3>
                        <div class="anatomy-list">
                            <div class="anatomy-item">
                                <span class="item-number">1</span>
                                <div class="item-content">
                                    <h4>Background Information</h4>
                                    <p>Describe the situation, project, or problem you're working on</p>
                                </div>
                            </div>
                            <div class="anatomy-item">
                                <span class="item-number">2</span>
                                <div class="item-content">
                                    <h4>Target Audience</h4>
                                    <p>Specify who will use or read the AI's output</p>
                                </div>
                            </div>
                            <div class="anatomy-item">
                                <span class="item-number">3</span>
                                <div class="item-content">
                                    <h4>Constraints & Requirements</h4>
                                    <p>Mention any limitations, deadlines, or specific needs</p>
                                </div>
                            </div>
                            <div class="anatomy-item">
                                <span class="item-number">4</span>
                                <div class="item-content">
                                    <h4>Desired Outcome</h4>
                                    <p>Clearly state what success looks like for your request</p>
                                </div>
                            </div>
                        </div>
                    </section>
                </div>
            </div>
        `,
        3: `
            <div class="step-container">
                <div class="step-header-info">
                    <span class="step-num">Step 1 of 4</span>
                    <h2>Format and Constraints</h2>
                    <button class="btn btn-primary" onclick="completeStep()">Next Step →</button>
                </div>
                
                <div class="step-content">
                    <p class="lead-text">Controlling the format and setting constraints ensures you get exactly what you need from AI, saving time on editing and reformatting.</p>
                    
                    <section class="content-section">
                        <h3>Common Format Options</h3>
                        <div class="concept-grid">
                            <div class="concept-item">
                                <h4>📝 Lists & Bullets</h4>
                                <p>For scannable, organized information</p>
                            </div>
                            <div class="concept-item">
                                <h4>📊 Tables</h4>
                                <p>For comparing data or structured information</p>
                            </div>
                            <div class="concept-item">
                                <h4>📄 Paragraphs</h4>
                                <p>For detailed explanations or narratives</p>
                            </div>
                            <div class="concept-item">
                                <h4>💻 Code Blocks</h4>
                                <p>For technical implementations</p>
                            </div>
                            <div class="concept-item">
                                <h4>🏷️ JSON/XML</h4>
                                <p>For structured data exchange</p>
                            </div>
                            <div class="concept-item">
                                <h4>📋 Templates</h4>
                                <p>For consistent, reusable formats</p>
                            </div>
                        </div>
                    </section>

                    <section class="content-section">
                        <h3>Useful Constraints to Consider</h3>
                        <div class="anatomy-list">
                            <div class="anatomy-item">
                                <span class="item-number">1</span>
                                <div class="item-content">
                                    <h4>Length Limits</h4>
                                    <p>Word count, character limit, or number of items</p>
                                </div>
                            </div>
                            <div class="anatomy-item">
                                <span class="item-number">2</span>
                                <div class="item-content">
                                    <h4>Tone & Style</h4>
                                    <p>Professional, casual, technical, or creative</p>
                                </div>
                            </div>
                            <div class="anatomy-item">
                                <span class="item-number">3</span>
                                <div class="item-content">
                                    <h4>Complexity Level</h4>
                                    <p>Beginner-friendly, intermediate, or expert-level</p>
                                </div>
                            </div>
                            <div class="anatomy-item">
                                <span class="item-number">4</span>
                                <div class="item-content">
                                    <h4>Focus Areas</h4>
                                    <p>Specific aspects to emphasize or avoid</p>
                                </div>
                            </div>
                            <div class="anatomy-item">
                                <span class="item-number">5</span>
                                <div class="item-content">
                                    <h4>Output Structure</h4>
                                    <p>Headers, sections, or specific organization</p>
                                </div>
                            </div>
                        </div>
                    </section>
                </div>
            </div>
        `
    };
    
    return content[topicId] || content[1];
}

// Step 2: Example Prompt
function getExamplePromptContent(topicId) {
    const examples = {
        1: {
            title: "Professional Email Example",
            prompt: `I need to write a professional email to a client who has missed their payment deadline by two weeks. The client is a long-term partner, and I want to maintain a good relationship while being firm about the payment. Please write an email that:
1. Reminds them about the missed payment in a professional tone
2. References our long-standing relationship
3. Clearly states the consequences of continued non-payment
4. Offers a simple way to resolve the situation
5. Ends on a positive note about future collaboration`,
            analysis: [
                { point: "Clear Intent", desc: "States exactly what the email needs to accomplish" },
                { point: "Context Provided", desc: "Mentions the relationship history for appropriate tone" },
                { point: "Specific Requirements", desc: "Lists 5 clear elements to include" },
                { point: "Balanced Approach", desc: "Asks for firmness while maintaining relationship" }
            ]
        },
        2: {
            title: "Product Description Example",
            prompt: `I need help writing a product description for our new eco-friendly water bottle. 

Context:
- Product: 24oz stainless steel water bottle
- Target audience: Environmentally conscious millennials and Gen Z
- Key features: BPA-free, keeps drinks cold for 24 hours, made from recycled materials
- Price point: Premium ($35-40)
- Brand voice: Friendly, inspiring, and authentic

Please write a 150-word product description that:
1. Highlights the environmental benefits
2. Emphasizes the practical features
3. Creates an emotional connection with our target audience
4. Includes a clear call-to-action

Use short, punchy sentences and incorporate sensory language where appropriate.`,
            analysis: [
                { point: "Detailed Context", desc: "Provides all necessary product information" },
                { point: "Clear Audience", desc: "Specifies exactly who will read this" },
                { point: "Specific Requirements", desc: "Lists what must be included" },
                { point: "Style Guidelines", desc: "Defines tone and writing style" }
            ]
        },
        3: {
            title: "Data Analysis Example", 
            prompt: `Act as a data analyst specializing in e-commerce metrics.

I have sales data from Q4 2023 that I need analyzed:
- Total transactions: 15,432
- Average order value: $67.23
- Conversion rate: 2.8%
- Return rate: 12%
- Top product categories: Electronics (35%), Home & Garden (28%), Fashion (22%), Other (15%)

Please provide:
1. A summary table comparing these metrics to industry benchmarks
2. Three key insights about our performance
3. Two specific recommendations for improvement
4. A brief risk analysis (100 words max)

Format your response with:
- Clear headers for each section
- Use bullet points for insights and recommendations
- Include percentage changes where relevant
- Keep technical jargon to a minimum`,
            analysis: [
                { point: "Role Definition", desc: "AI acts as a data analyst" },
                { point: "Specific Data", desc: "Provides exact metrics to analyze" },
                { point: "Clear Deliverables", desc: "Lists exactly what analysis is needed" },
                { point: "Format Requirements", desc: "Specifies how to structure the response" }
            ]
        }
    };
    
    const example = examples[topicId] || examples[1];
    
    return `
        <div class="step-container">
            <div class="step-header-info">
                <div class="step-nav">
                    <button class="btn btn-link" onclick="window.location.href='#'">← Back to Topics</button>
                    <span class="step-progress"></span>
                </div>
                <h2>Example Prompt</h2>
            </div>
            
            <div class="step-content">
                <p class="lead-text">This example shows how to create a well-structured prompt that gets better results from AI models. Try it yourself to see how the AI responds to clear, specific instructions.</p>
                
                <div class="example-showcase">
                    <div class="prompt-example-card">
                        <div class="prompt-label">PROMPT</div>
                        <div class="prompt-text">
                            <p>${example.prompt}</p>
                        </div>
                    </div>
                    
                    <div class="prompt-analysis">
                        <h3>Why This Prompt Works</h3>
                        <div class="analysis-points">
                            ${example.analysis.map(item => `
                                <div class="analysis-point">
                                    <span class="point-icon">→</span>
                                    <div class="point-content">
                                        <strong>${item.point}:</strong> ${item.desc}
                                    </div>
                                </div>
                            `).join('')}
                        </div>
                    </div>
                    
                    <div class="action-button">
                        <button class="btn btn-primary btn-large" onclick="completeStep()">
                            <span class="btn-icon">🚀</span>
                            Try this prompt
                        </button>
                    </div>
                </div>
            </div>
        </div>
    `;
}

// Step 3: Execute Example
function getExecuteExampleContent(topicId) {
    const examples = {
        1: "I need to write a professional email to a client who has missed their payment deadline by two weeks. The client is a long-term partner, and I want to maintain a good relationship while being firm about the payment.",
        2: "I need help writing a product description for our new eco-friendly water bottle...",
        3: "Act as a data analyst specializing in e-commerce metrics..."
    };
    
    return `
        <div class="step-container execute-step">
            <div class="step-header-info">
                <h2>AI Playground</h2>
                <span class="playground-subtitle">Start a new conversation</span>
            </div>
            
            <div class="step-content">
                <div class="playground-layout">
                    <div class="prompt-display-section">
                        <div class="prompt-display-card">
                            <p class="prompt-intro">Send the prompt to see how the AI responds. Your conversation will appear here.</p>
                            <div class="example-prompt-box">
                                <p>${examples[topicId] || examples[1]}</p>
                            </div>
                        </div>
                    </div>
                    
                    <div class="chat-interface">
                        <div class="chat-container" id="chatContainer">
                            <!-- Chat messages will appear here -->
                        </div>
                        
                        <div class="chat-input-area">
                            <textarea 
                                id="promptInput" 
                                readonly 
                                class="prompt-input"
                                placeholder="Enter your prompt here...">${examples[topicId] || examples[1]}</textarea>
                            <button class="send-button" onclick="executePrompt()">
                                <span class="send-icon">→</span>
                            </button>
                        </div>
                    </div>
                </div>
                
                <div class="step-navigation">
                    <button class="btn btn-primary" onclick="completeStep()">Continue to Practice →</button>
                </div>
            </div>
        </div>
    `;
}

// Step 4: Practice Problem
function getPracticeProblemContent(topicId) {
    const practices = {
        1: {
            title: "Practice Problem",
            scenario: "You need to create a prompt that will help an AI generate a detailed business plan for a new coffee shop. The plan should include market analysis, financial projections, and marketing strategies.",
            instructions: "Write a prompt that will guide the AI to create a comprehensive business plan with all necessary sections. Consider how to structure your prompt to get the most detailed and useful response.",
            tips: [
                "Think about what specific sections the business plan should include",
                "Consider how to request financial data that would be realistic",
                "Include instructions for formatting the response in a clear, organized manner"
            ],
            suggestedAnswer: `You are an experienced business consultant specializing in food service startups. I need you to create a comprehensive business plan for a new specialty coffee shop located in a busy downtown area with high foot traffic from office workers.

Please include the following sections:
1. Executive Summary (200-300 words)
2. Market Analysis
   - Target customer demographics
   - Competitor analysis (list 3-5 main competitors)
   - Market size and growth potential
3. Financial Projections
   - Startup costs breakdown
   - First-year monthly revenue projections
   - Break-even analysis
4. Marketing Strategy
   - Customer acquisition channels
   - Promotional campaigns for launch
   - Customer retention strategies
5. Operations Plan
   - Daily operations workflow
   - Staffing requirements
   - Supplier relationships

Format the response with clear headers for each section and use bullet points for detailed items. Include specific numbers and data points where relevant. Keep the tone professional but accessible.`
        },
        2: {
            title: "Write a Job Description Prompt", 
            scenario: "Create a prompt to help AI write a job description for a Senior Software Engineer position at a tech startup. The description should attract top talent while being clear about expectations.",
            requirements: [
                "Specify the company context and culture",
                "Define the target candidate profile", 
                "List key sections to include",
                "Set tone and length parameters"
            ],
            hint: "Include details about your company culture, the team structure, and what makes this role unique. Be specific about the technical skills and experience required."
        },
        3: {
            title: "Create a Report Template Prompt",
            scenario: "Design a prompt that will help AI create a monthly marketing performance report template. The template should be reusable and include all key metrics.",
            requirements: [
                "Define the report's purpose and audience",
                "Specify required sections and metrics",
                "Set formatting preferences",
                "Include visualization suggestions"
            ],
            hint: "Think about what metrics matter most to your stakeholders and how they prefer to see data presented. Include both quantitative metrics and qualitative insights."
        }
    };
    
    const practice = practices[topicId] || practices[1];
    
    return `
        <div class="step-container practice-step">
            <div class="step-header-info">
                <div class="step-nav">
                    <button class="btn btn-link" onclick="window.location.href='#'">← Back to Topics</button>
                    <div class="step-indicators">
                        <span class="step-dot"></span>
                        <span class="step-dot"></span>
                        <span class="step-dot"></span>
                        <span class="step-dot active"></span>
                    </div>
                </div>
                <h1>Prompt Engineering Course</h1>
            </div>
            
            <div class="two-column-layout">
                <div class="left-column">
                    <h2>${practice.title}</h2>
                    
                    <div class="scenario-section">
                        <h3>Scenario:</h3>
                        <p>${practice.scenario}</p>
                    </div>
                    
                    <div class="instructions-section">
                        <h3>Instructions:</h3>
                        <p>${practice.instructions}</p>
                        
                        <ul class="practice-tips">
                            ${practice.tips.map(tip => `<li>${tip}</li>`).join('')}
                        </ul>
                    </div>
                    
                    <div class="action-buttons">
                        <button class="btn btn-primary" onclick="testPrompt()">Try this</button>
                        <button class="btn btn-secondary" onclick="showSolution()">Show Suggested Answer</button>
                    </div>
                    
                    <div id="solutionArea" class="solution-area hidden">
                        <h4>Suggested Answer:</h4>
                        <div class="solution-content">
                            <pre>${practice.suggestedAnswer}</pre>
                        </div>
                    </div>
                </div>
                
                <div class="right-column">
                    <div class="ai-playground-header">
                        <h3>AI Playground</h3>
                        <span class="step-indicator">Step 4 of 5</span>
                    </div>
                    
                    <div class="chat-container" id="chatContainer">
                        <div class="chat-placeholder">
                            <p>Your conversation will appear here</p>
                        </div>
                    </div>
                    
                    <div class="prompt-input-area">
                        <textarea 
                            id="practicePrompt" 
                            class="practice-prompt-input"
                            placeholder="Enter your prompt solution here..."
                            rows="4"></textarea>
                        <button class="send-prompt-btn" onclick="executeUserPrompt()">
                            <span>→</span>
                        </button>
                    </div>
                </div>
            </div>
            
            <div class="navigation-footer">
                <button class="btn btn-primary btn-large" onclick="completeStep()">Complete Topic →</button>
            </div>
        </div>
    `;
}

// Step completion logic
function completeStep() {
    if (currentTopic && currentStep) {
        // Mark current step as completed
        const stepKey = `${currentTopic}-${currentStep}`;
        completedSteps.add(stepKey);
        updateStepStatus(stepKey, 'completed');
        
        // Save progress
        saveProgress();
        
        // Move to next step or topic
        if (currentStep < stepsPerTopic) {
            loadStep(currentTopic, currentStep + 1);
        } else if (currentTopic < totalTopics) {
            // Show completion message and move to next topic
            showTopicCompletion();
        } else {
            // All topics completed
            showCourseCompletion();
        }
    }
}

// Update step status indicator
function updateStepStatus(stepKey, status) {
    const statusElement = document.getElementById(`status-${stepKey}`);
    if (statusElement) {
        if (status === 'completed') {
            statusElement.textContent = '✓';
            statusElement.classList.remove('in-progress');
            statusElement.classList.add('completed');
        } else if (status === 'in-progress') {
            statusElement.textContent = '◐';
            statusElement.classList.add('in-progress');
        }
    }
    
    // Update overall progress
    updateOverallProgress();
}

// Show topic completion
function showTopicCompletion() {
    contentArea.innerHTML = `
        <div class="step-container">
            <div class="completion-banner">
                <span class="trophy-icon">🎉</span>
                <h2>Topic Completed!</h2>
                <p>Great job! You've mastered this topic. Ready for the next challenge?</p>
                <button class="btn btn-primary btn-large" onclick="moveToNextTopic()">
                    Continue to Next Topic →
                </button>
            </div>
        </div>
    `;
}

// Move to next topic
function moveToNextTopic() {
    const nextTopic = currentTopic + 1;
    if (nextTopic <= totalTopics) {
        // Expand next topic
        const currentTopicSteps = document.getElementById(`topic${currentTopic}Steps`);
        const nextTopicSteps = document.getElementById(`topic${nextTopic}Steps`);
        const currentHeader = document.querySelector(`#topic-${currentTopic} .topic-header`);
        const nextHeader = document.querySelector(`#topic-${nextTopic} .topic-header`);
        
        // Collapse current topic
        currentTopicSteps.classList.add('collapsed');
        currentHeader.querySelector('.topic-toggle').textContent = '▶';
        
        // Expand next topic
        nextTopicSteps.classList.remove('collapsed');
        nextHeader.querySelector('.topic-toggle').textContent = '▼';
        
        // Load first step of next topic
        loadStep(nextTopic, 1);
    }
}

// Show course completion with feedback
function showCourseCompletion() {
    const courseLevel = sessionStorage.getItem('selectedLevel') || 'beginner';
    
    contentArea.innerHTML = `
        <div class="step-container feedback-page">
            <div class="step-header-info">
                <div class="step-nav">
                    <button class="btn btn-link" onclick="window.location.href='#'">← Back to Topics</button>
                    <div class="completion-badge">
                        <span class="badge-icon">🏆</span>
                        <span class="badge-text">Course Complete!</span>
                    </div>
                </div>
                <h1>Prompt Engineering Course</h1>
                <div class="step-indicator">Step 5 of 5</div>
            </div>
            
            <div class="feedback-content">
                <h2>AI Feedback on Your Prompt</h2>
                <p class="feedback-intro">Our AI has analyzed your prompt performance. Here's personalized feedback to help you improve:</p>
                
                <div class="feedback-sections">
                    <div class="feedback-section positive">
                        <h3>✅ What Worked Well</h3>
                        <ul class="feedback-list">
                            <li>Good use of specific details in your requirements</li>
                            <li>Clear structure with separate sections for context and instructions</li>
                            <li>Effective use of constraints to guide the AI response</li>
                            <li>Strong opening statement that clearly defined your goal</li>
                        </ul>
                    </div>
                    
                    <div class="feedback-section improvement">
                        <h3>⚠️ Areas for Improvement</h3>
                        <ul class="feedback-list">
                            <li>Your prompt could be more concise - some sections were unnecessarily verbose</li>
                            <li>Some instructions were ambiguous and could be interpreted in multiple ways</li>
                            <li>Missing specific output format requirements which led to inconsistent results</li>
                        </ul>
                    </div>
                    
                    <div class="feedback-section suggestions">
                        <h3>💡 Suggestions for Next Time</h3>
                        <ul class="feedback-list">
                            <li>Try using numbered lists for sequential instructions to improve clarity</li>
                            <li>Consider adding examples to clarify your expectations for complex requests</li>
                            <li>Specify your preferred output format (e.g., bullet points, paragraphs, table) for more consistent results</li>
                        </ul>
                    </div>
                </div>
                
                <div class="lesson-rating">
                    <h3>Your Feedback on This Lesson</h3>
                    <p>How would you rate this lesson?</p>
                    <div class="rating-emojis">
                        <button class="emoji-btn" onclick="rateLesson('poor')" title="Poor">😞</button>
                        <button class="emoji-btn" onclick="rateLesson('fair')" title="Fair">😐</button>
                        <button class="emoji-btn" onclick="rateLesson('good')" title="Good">😊</button>
                        <button class="emoji-btn" onclick="rateLesson('great')" title="Great">😃</button>
                        <button class="emoji-btn" onclick="rateLesson('excellent')" title="Excellent">🤩</button>
                    </div>
                    <div class="rating-labels">
                        <span>Poor</span>
                        <span>Fair</span>
                        <span>Good</span>
                        <span>Great</span>
                        <span>Excellent</span>
                    </div>
                </div>
                
                <div class="feedback-comment">
                    <p>Do you have any comments or suggestions?</p>
                    <textarea 
                        id="feedbackComment" 
                        class="feedback-textarea"
                        placeholder="Share your thoughts about this lesson..."
                        rows="4"></textarea>
                    <button class="btn btn-primary" onclick="submitFeedback()">Submit Feedback</button>
                </div>
                
                <div class="navigation-options">
                    <button class="btn btn-secondary" onclick="reviewLesson()">← Review Lesson</button>
                    <button class="btn btn-primary" onclick="nextTopic()">Next Topic: Advanced Prompt Techniques →</button>
                </div>
            </div>
        </div>
    `;
}

// Progress tracking
function updateOverallProgress() {
    const totalSteps = totalTopics * stepsPerTopic;
    const completedCount = completedSteps.size;
    const progressPercentage = Math.round((completedCount / totalSteps) * 100);
    
    overallProgress.style.width = progressPercentage + '%';
    progressText.textContent = progressPercentage + '% Complete';
}

function saveProgress() {
    const courseLevel = sessionStorage.getItem('selectedLevel') || 'beginner';
    const progressKey = `progress_${courseLevel}`;
    localStorage.setItem(progressKey, JSON.stringify(Array.from(completedSteps)));
}

function loadProgress() {
    const courseLevel = sessionStorage.getItem('selectedLevel') || 'beginner';
    const progressKey = `progress_${courseLevel}`;
    const savedProgress = localStorage.getItem(progressKey);
    
    if (savedProgress) {
        completedSteps = new Set(JSON.parse(savedProgress));
        
        // Update UI with saved progress
        completedSteps.forEach(stepKey => {
            updateStepStatus(stepKey, 'completed');
        });
    }
}

// Interactive functions
function copyPrompt() {
    const promptText = document.querySelector('.readonly-prompt').textContent;
    navigator.clipboard.writeText(promptText).then(() => {
        alert('Prompt copied to clipboard!');
    });
}

function executePrompt() {
    const chatContainer = document.getElementById('chatContainer');
    const promptText = document.getElementById('promptInput').value;
    
    // Clear initial message
    chatContainer.innerHTML = '';
    
    // Add user message
    addChatMessage(chatContainer, promptText, 'user');
    
    // Show typing indicator
    addChatMessage(chatContainer, 'AI is thinking...', 'typing');
    
    // Simulate AI response
    setTimeout(() => {
        // Remove typing indicator
        chatContainer.querySelector('.typing').remove();
        
        // Add AI response
        const aiResponse = generateMockResponse();
        addChatMessage(chatContainer, aiResponse, 'ai');
    }, 2000);
}

function showHint() {
    document.getElementById('hintArea').classList.remove('hidden');
}

function showSolution() {
    document.getElementById('solutionArea').classList.remove('hidden');
}

function testPrompt() {
    const userPrompt = document.getElementById('practicePrompt').value;
    const chatContainer = document.getElementById('chatContainer');
    
    if (userPrompt.trim().length < 50) {
        alert('Your prompt seems too short. Make sure to include all required elements.');
        return;
    }
    
    // Clear placeholder
    chatContainer.innerHTML = '';
    
    // Add user message
    addChatMessage(chatContainer, userPrompt, 'user');
    
    // Show typing indicator
    addChatMessage(chatContainer, 'AI is thinking...', 'typing');
    
    // Simulate AI response
    setTimeout(() => {
        chatContainer.querySelector('.typing').remove();
        const response = generatePracticeResponse();
        addChatMessage(chatContainer, response, 'ai');
    }, 2000);
}

function executeUserPrompt() {
    const userPrompt = document.getElementById('practicePrompt').value;
    if (userPrompt.trim()) {
        testPrompt();
    }
}

function generatePracticeResponse() {
    return `# Comprehensive Business Plan: Downtown Coffee Haven

## Executive Summary
Downtown Coffee Haven will establish itself as the premier specialty coffee destination in the heart of the business district. Our focus on artisanal coffee, exceptional customer service, and a productive work environment will attract busy professionals seeking quality and convenience.

## Market Analysis
### Target Customer Demographics
- Primary: Office workers aged 25-45 (70%)
- Secondary: Local residents and tourists (30%)
- Income level: $50,000+ annually
- Values: Quality, convenience, sustainability

### Competitor Analysis
1. **Starbucks** - 3 locations within 0.5 miles
2. **Local Brew Café** - Independent shop 2 blocks away
3. **Dunkin'** - 2 locations nearby
4. **Pete's Coffee** - 1 location in adjacent building

### Market Size and Growth
- Local market size: $2.3M annually
- Projected growth: 8% year-over-year
- Estimated market share capture: 12% by year 2

[Response continues...]`;
}

function rateLesson(rating) {
    // Visual feedback for rating
    document.querySelectorAll('.emoji-btn').forEach(btn => {
        btn.classList.remove('selected');
    });
    event.target.classList.add('selected');
    
    // Save rating
    const courseLevel = sessionStorage.getItem('selectedLevel') || 'beginner';
    localStorage.setItem(`lesson_rating_${courseLevel}`, rating);
}

function submitFeedback() {
    const feedback = document.getElementById('feedbackComment').value;
    if (feedback.trim()) {
        alert('Thank you for your feedback! We appreciate your input.');
        // In a real app, this would send to a server
        document.getElementById('feedbackComment').value = '';
    }
}

function reviewLesson() {
    // Go back to the first step of current topic
    loadStep(currentTopic, 1);
}

function nextTopic() {
    // This would load the next course or show course selection
    window.location.href = 'course-selection.html';
}

function downloadCertificate() {
    alert('Certificate download feature coming soon!');
}

// Helper functions
function addChatMessage(container, message, type) {
    const messageDiv = document.createElement('div');
    messageDiv.className = `chat-message ${type}`;
    messageDiv.innerHTML = `<p>${message.replace(/\n/g, '<br>')}</p>`;
    container.appendChild(messageDiv);
    container.scrollTop = container.scrollHeight;
}

function generateMockResponse() {
    return `# Comprehensive Business Plan: Downtown Coffee Haven

## Executive Summary
Downtown Coffee Haven will be a premium specialty coffee shop located in the heart of the business district, targeting busy professionals seeking high-quality coffee and a productive environment...

## Market Analysis
- Market size: $2.3M annually within a 1-mile radius
- Growth rate: 8% year-over-year
- Target audience: Office workers aged 25-45

## Financial Projections
- Initial investment: $250,000
- Break-even: Month 8
- Year 1 revenue forecast: $582,000

[Response continues with detailed sections...]`;
}

// Setup interactions for dynamically loaded content
function setupStepInteractions() {
    // Auto-resize textareas
    const textareas = document.querySelectorAll('textarea');
    textareas.forEach(textarea => {
        textarea.addEventListener('input', function() {
            this.style.height = 'auto';
            this.style.height = this.scrollHeight + 'px';
        });
    });
}

// Add necessary styles
const additionalStyles = `
<style>
/* Step Content Styles */
.step-container {
    max-width: 800px;
    margin: 2rem auto;
    padding: 3rem;
    background-color: white;
    border-radius: 8px;
    box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
    min-height: calc(100vh - 140px);
}

.step-header {
    margin-bottom: 2rem;
}

.breadcrumb {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 1.5rem;
    padding-bottom: 1rem;
}

.back-link {
    color: #3b82f6;
    text-decoration: none;
    font-size: 0.875rem;
    display: flex;
    align-items: center;
    gap: 0.25rem;
}

.back-link:hover {
    text-decoration: underline;
}

.step-indicators {
    display: flex;
    gap: 0.5rem;
}

.indicator {
    width: 8px;
    height: 8px;
    border-radius: 50%;
    background-color: #e5e7eb;
}

.indicator.active {
    background-color: #3b82f6;
}

.step-title {
    font-size: 2rem;
    font-weight: 700;
    color: #111827;
    margin: 0 0 2rem 0;
}

.btn-link {
    background: none;
    border: none;
    color: var(--primary-color);
    cursor: pointer;
    font-size: 0.875rem;
    padding: 0;
    text-decoration: none;
}

.btn-link:hover {
    text-decoration: underline;
}

.step-indicators {
    display: flex;
    gap: 0.5rem;
}

.step-dot {
    width: 10px;
    height: 10px;
    border-radius: 50%;
    background-color: #e0e0e0;
}

.step-dot.active {
    background-color: var(--primary-color);
}

.step-num {
    color: var(--text-secondary);
    font-size: 0.875rem;
}

.intro-text, .bridge-text, .conclusion-text {
    font-size: 1rem;
    color: #4b5563;
    line-height: 1.8;
    margin-bottom: 2rem;
}

.concepts-section, .anatomy-section {
    margin: 2.5rem 0;
}

.concepts-section h2, .anatomy-section h2 {
    font-size: 1.5rem;
    font-weight: 600;
    color: #111827;
    margin-bottom: 1.5rem;
}

.concepts-list {
    list-style: none;
    padding: 0;
    margin: 0;
}

.concepts-list li {
    position: relative;
    padding-left: 1.5rem;
    margin-bottom: 0.75rem;
    color: #4b5563;
    line-height: 1.6;
}

.concepts-list li::before {
    content: "•";
    position: absolute;
    left: 0;
    color: #9ca3af;
}

.concepts-list strong {
    color: #111827;
    font-weight: 600;
}

.prompt-parts {
    background-color: #f9fafb;
    border-radius: 8px;
    padding: 1.5rem;
}

.prompt-part {
    border-left: 3px solid #3b82f6;
    padding-left: 1.5rem;
    margin-bottom: 1.5rem;
}

.prompt-part:last-child {
    margin-bottom: 0;
}

.part-header {
    margin-bottom: 0.5rem;
}

.part-number {
    font-weight: 600;
    color: #1f2937;
    font-size: 1rem;
}

.part-description {
    color: #4b5563;
    line-height: 1.6;
    margin: 0;
}

.step-navigation {
    display: flex;
    justify-content: flex-end;
    margin-top: 3rem;
    padding-top: 2rem;
    border-top: 1px solid #e5e7eb;
}

.btn-next {
    background-color: #10b981;
    color: white;
    padding: 0.75rem 2rem;
    border: none;
    border-radius: 6px;
    font-size: 1rem;
    font-weight: 500;
    cursor: pointer;
    transition: background-color 0.2s;
}

.btn-next:hover {
    background-color: #059669;
}

.key-concept-highlight {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));
    gap: 1.5rem;
    margin-top: 1.5rem;
}

.concept-card {
    background-color: var(--bg-primary);
    padding: 1.5rem;
    border-radius: 12px;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
    transition: transform 0.2s ease;
}

.concept-card:hover {
    transform: translateY(-5px);
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
}

.concept-icon {
    font-size: 2rem;
    display: block;
    margin-bottom: 0.75rem;
}

.concept-card h4 {
    margin-bottom: 0.5rem;
    font-size: 1.125rem;
    color: var(--text-primary);
}

.concept-card p {
    color: var(--text-secondary);
    line-height: 1.6;
}

.concept-card mark {
    background-color: #fef3c7;
    padding: 0.1em 0.3em;
    border-radius: 3px;
}

.anatomy-visual {
    margin-top: 2rem;
}

.prompt-structure {
    background-color: #f9fafb;
    border-radius: 12px;
    padding: 2rem;
}

.structure-part {
    margin-bottom: 1.5rem;
    padding: 1.5rem;
    background-color: white;
    border-radius: 8px;
    border-left: 4px solid;
    box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
}

.structure-part.role {
    border-left-color: #3b82f6;
}

.structure-part.context {
    border-left-color: #10b981;
}

.structure-part.instructions {
    border-left-color: #f59e0b;
}

.structure-part.format {
    border-left-color: #8b5cf6;
}

.structure-part.constraints {
    border-left-color: #ef4444;
}

.part-number {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    width: 28px;
    height: 28px;
    background-color: var(--text-primary);
    color: white;
    border-radius: 50%;
    font-weight: bold;
    font-size: 0.875rem;
    margin-right: 1rem;
}

.part-content {
    display: inline-block;
}

.part-content h5 {
    margin: 0 0 0.5rem 0;
    font-size: 1rem;
    color: var(--text-primary);
}

.part-content p {
    margin: 0;
    color: var(--text-secondary);
    font-style: italic;
}

.admin-note {
    margin-top: 2rem;
    padding: 1rem;
    background-color: #eff6ff;
    border-radius: 8px;
    display: flex;
    align-items: center;
    gap: 0.75rem;
}

.note-icon {
    font-size: 1.25rem;
    color: #3b82f6;
}

.admin-note p {
    margin: 0;
    color: #1e40af;
    font-size: 0.875rem;
}

/* Example Prompt Styles */
.example-showcase {
    margin-top: 1rem;
}

.prompt-example-card {
    background-color: white;
    border: 1px solid #e5e7eb;
    border-radius: 12px;
    overflow: hidden;
    margin: 2rem 0;
    box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
}

.prompt-label {
    background-color: #f3f4f6;
    color: #6b7280;
    padding: 0.75rem 1.5rem;
    font-weight: 600;
    font-size: 0.75rem;
    text-transform: uppercase;
    letter-spacing: 0.05em;
}

.prompt-text {
    padding: 2rem;
}

.prompt-text p {
    margin: 0;
    line-height: 1.8;
    color: var(--text-primary);
}

.prompt-analysis {
    margin-top: 2rem;
}

.analysis-points {
    margin-top: 1rem;
}

.analysis-point {
    display: flex;
    align-items: flex-start;
    gap: 1rem;
    margin-bottom: 1rem;
    padding: 1rem;
    background-color: #f9fafb;
    border-radius: 8px;
}

.point-icon {
    color: var(--primary-color);
    font-weight: bold;
    font-size: 1.25rem;
}

.point-content {
    flex: 1;
    line-height: 1.6;
}

.action-button {
    text-align: center;
    margin-top: 3rem;
}

.btn-large {
    padding: 1rem 2.5rem;
    font-size: 1.125rem;
}

.btn-icon {
    margin-right: 0.5rem;
    font-size: 1.25rem;
}

/* Execute Step Styles */
.execute-step .playground-subtitle {
    color: var(--text-secondary);
    font-size: 1rem;
    margin-top: 0.5rem;
}

.playground-layout {
    display: grid;
    grid-template-columns: 1fr;
    gap: 2rem;
    margin-top: 2rem;
}

.prompt-display-section {
    background-color: #f9fafb;
    border-radius: 12px;
    padding: 2rem;
}

.prompt-display-card {
    text-align: center;
}

.prompt-intro {
    color: var(--text-secondary);
    margin-bottom: 2rem;
}

.example-prompt-box {
    background-color: white;
    padding: 1.5rem;
    border-radius: 8px;
    border: 1px solid #e5e7eb;
    text-align: left;
    max-width: 600px;
    margin: 0 auto;
}

.chat-interface {
    background-color: white;
    border: 1px solid #e5e7eb;
    border-radius: 12px;
    overflow: hidden;
}

.chat-container {
    height: 400px;
    padding: 1.5rem;
    overflow-y: auto;
    background-color: #f9fafb;
}

.chat-input-area {
    display: flex;
    gap: 1rem;
    padding: 1rem;
    background-color: white;
    border-top: 1px solid #e5e7eb;
}

.prompt-input {
    flex: 1;
    padding: 0.75rem 1rem;
    border: 1px solid #e5e7eb;
    border-radius: 8px;
    resize: none;
    font-family: inherit;
    font-size: 0.9375rem;
}

.send-button {
    width: 48px;
    height: 48px;
    border: none;
    background-color: var(--primary-color);
    color: white;
    border-radius: 50%;
    cursor: pointer;
    display: flex;
    align-items: center;
    justify-content: center;
    transition: background-color 0.2s;
}

.send-button:hover {
    background-color: var(--primary-hover);
}

.send-icon {
    font-size: 1.5rem;
}

.step-navigation {
    text-align: center;
    margin-top: 2rem;
}

/* Practice Step Styles */
.practice-step h1 {
    font-size: 1.5rem;
    color: var(--text-primary);
    margin: 0;
}

.two-column-layout {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 3rem;
    margin-top: 2rem;
}

.left-column {
    padding-right: 2rem;
}

.scenario-section,
.instructions-section {
    margin-bottom: 2rem;
}

.scenario-section h3,
.instructions-section h3 {
    color: var(--text-primary);
    margin-bottom: 1rem;
}

.practice-tips {
    margin: 1rem 0;
    padding-left: 1.5rem;
}

.practice-tips li {
    margin-bottom: 0.5rem;
    color: var(--text-secondary);
}

.action-buttons {
    display: flex;
    gap: 1rem;
    margin-top: 2rem;
}

.solution-area {
    margin-top: 2rem;
    padding: 1.5rem;
    background-color: #f0f9ff;
    border: 1px solid #3b82f6;
    border-radius: 8px;
}

.solution-content pre {
    white-space: pre-wrap;
    font-family: var(--font-mono);
    font-size: 0.875rem;
    line-height: 1.6;
    margin: 0;
    background-color: white;
    padding: 1rem;
    border-radius: 4px;
}

.right-column {
    background-color: white;
    border: 1px solid #e5e7eb;
    border-radius: 12px;
    overflow: hidden;
}

.ai-playground-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 1rem 1.5rem;
    background-color: #f9fafb;
    border-bottom: 1px solid #e5e7eb;
}

.ai-playground-header h3 {
    margin: 0;
    font-size: 1.125rem;
}

.step-indicator {
    color: var(--text-secondary);
    font-size: 0.875rem;
}

.chat-placeholder {
    display: flex;
    align-items: center;
    justify-content: center;
    height: 100%;
    color: var(--text-secondary);
}

.prompt-input-area {
    display: flex;
    gap: 0.5rem;
    padding: 1rem;
    background-color: white;
    border-top: 1px solid #e5e7eb;
}

.practice-prompt-input {
    flex: 1;
    padding: 0.75rem 1rem;
    border: 1px solid #e5e7eb;
    border-radius: 8px;
    resize: none;
    font-family: inherit;
    font-size: 0.9375rem;
}

.send-prompt-btn {
    width: 48px;
    height: 48px;
    border: none;
    background-color: var(--primary-color);
    color: white;
    border-radius: 50%;
    cursor: pointer;
    display: flex;
    align-items: center;
    justify-content: center;
    transition: background-color 0.2s;
}

.send-prompt-btn:hover {
    background-color: var(--primary-hover);
}

.navigation-footer {
    text-align: center;
    margin-top: 3rem;
    padding-top: 2rem;
    border-top: 1px solid #e5e7eb;
}

/* Feedback Page Styles */
.feedback-page .completion-badge {
    display: flex;
    align-items: center;
    gap: 0.5rem;
    background-color: #f0fdf4;
    padding: 0.5rem 1rem;
    border-radius: 20px;
    border: 1px solid #10b981;
}

.badge-icon {
    font-size: 1.25rem;
}

.badge-text {
    color: #10b981;
    font-weight: 600;
    font-size: 0.875rem;
}

.feedback-content {
    max-width: 800px;
    margin: 0 auto;
}

.feedback-intro {
    color: var(--text-secondary);
    margin-bottom: 2rem;
    font-size: 1.125rem;
}

.feedback-sections {
    margin-bottom: 3rem;
}

.feedback-section {
    margin-bottom: 2rem;
    padding: 1.5rem;
    border-radius: 12px;
    border-left: 4px solid;
}

.feedback-section.positive {
    background-color: #f0fdf4;
    border-left-color: #10b981;
}

.feedback-section.improvement {
    background-color: #fef3c7;
    border-left-color: #f59e0b;
}

.feedback-section.suggestions {
    background-color: #eff6ff;
    border-left-color: #3b82f6;
}

.feedback-section h3 {
    margin-bottom: 1rem;
    font-size: 1.125rem;
}

.feedback-list {
    margin: 0;
    padding-left: 1.5rem;
}

.feedback-list li {
    margin-bottom: 0.75rem;
    line-height: 1.6;
}

.lesson-rating {
    background-color: #f9fafb;
    padding: 2rem;
    border-radius: 12px;
    text-align: center;
    margin-bottom: 2rem;
}

.rating-emojis {
    display: flex;
    justify-content: center;
    gap: 1rem;
    margin: 1.5rem 0;
}

.emoji-btn {
    background: none;
    border: none;
    font-size: 2.5rem;
    cursor: pointer;
    opacity: 0.5;
    transition: all 0.2s;
}

.emoji-btn:hover {
    opacity: 1;
    transform: scale(1.1);
}

.emoji-btn.selected {
    opacity: 1;
    transform: scale(1.2);
}

.rating-labels {
    display: flex;
    justify-content: center;
    gap: 2.5rem;
    font-size: 0.875rem;
    color: var(--text-secondary);
}

.feedback-comment {
    margin: 2rem 0;
}

.feedback-textarea {
    width: 100%;
    padding: 1rem;
    border: 1px solid #e5e7eb;
    border-radius: 8px;
    resize: vertical;
    font-family: inherit;
    margin: 1rem 0;
}

.navigation-options {
    display: flex;
    justify-content: space-between;
    margin-top: 3rem;
    padding-top: 2rem;
    border-top: 1px solid #e5e7eb;
}

/* Chat Message Styles */
.chat-message {
    margin-bottom: 1rem;
    padding: 1rem;
    border-radius: 8px;
    max-width: 80%;
}

.chat-message.user {
    background-color: var(--primary-color);
    color: white;
    margin-left: auto;
    margin-right: 0;
}

.chat-message.ai {
    background-color: #f3f4f6;
    color: var(--text-primary);
    margin-left: 0;
    margin-right: auto;
}

.chat-message.typing {
    background-color: #f3f4f6;
    color: var(--text-secondary);
    font-style: italic;
}

.chat-message p {
    margin: 0;
    line-height: 1.6;
}

/* Completion Styles */
.completion-banner {
    text-align: center;
    padding: 3rem;
    background-color: var(--bg-tertiary);
    border-radius: var(--border-radius);
    margin-bottom: 2rem;
}

.trophy-icon {
    font-size: 4rem;
    display: block;
    margin-bottom: 1rem;
}

.feedback-grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
    gap: 1.5rem;
    margin: 2rem 0;
}

.feedback-card {
    padding: 1.5rem;
    border-radius: var(--border-radius);
}

.feedback-card.positive {
    background-color: #F0FDF4;
    border-left: 4px solid var(--success-color);
}

.feedback-card.tips {
    background-color: #FEF3C7;
    border-left: 4px solid var(--warning-color);
}

.completion-actions {
    display: flex;
    justify-content: center;
    gap: 1rem;
    margin-top: 2rem;
}

/* Responsive */
@media (max-width: 768px) {
    .try-prompt-layout {
        grid-template-columns: 1fr;
    }
    
    .feedback-grid {
        grid-template-columns: 1fr;
    }
    
    .completion-actions {
        flex-direction: column;
    }
}
</style>
`;

document.head.insertAdjacentHTML('beforeend', additionalStyles);