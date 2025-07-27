import AuthLayout from '../components/common/AuthLayout';

const StyleTest = () => {
  return (
    <div>
      <h1>Style Test Page</h1>
      <p>This page tests all UI elements to ensure visual parity with the HTML prototype.</p>
      
      <section>
        <h2>Typography</h2>
        <h1>Heading 1</h1>
        <h2>Heading 2</h2>
        <h3>Heading 3</h3>
        <h4>Heading 4</h4>
        <p>This is a paragraph with <strong>bold</strong> and <em>italic</em> text.</p>
      </section>

      <section>
        <h2>Buttons</h2>
        <button className="btn-primary">Primary Button</button>
        <button className="btn-secondary">Secondary Button</button>
        <button className="btn-outline">Outline Button</button>
      </section>

      <section>
        <h2>Form Elements</h2>
        <div className="form-group">
          <label htmlFor="test-input">Input Label</label>
          <input type="text" id="test-input" placeholder="Enter text" />
        </div>
        <div className="form-group">
          <label htmlFor="test-textarea">Textarea Label</label>
          <textarea id="test-textarea" placeholder="Enter message"></textarea>
        </div>
      </section>

      <section>
        <h2>Cards</h2>
        <div className="course-card">
          <div className="course-icon">🎯</div>
          <h3>Course Title</h3>
          <p>Course description goes here</p>
          <div className="course-meta">
            <span className="topic-count">8 topics</span>
            <span className="duration">2 hours</span>
          </div>
        </div>
      </section>

      <section>
        <h2>Auth Card</h2>
        <AuthLayout>
          <div className="auth-card">
            <div className="auth-logo">
              <h1>PromptMaster</h1>
              <p>AI Prompt Engineering Learning Portal</p>
            </div>
          </div>
        </AuthLayout>
      </section>

      <section>
        <h2>Progress Indicators</h2>
        <div className="progress-bar">
          <div className="progress-fill" style={{ width: '60%' }}></div>
        </div>
      </section>

      <section>
        <h2>Step Indicators</h2>
        <div className="step-indicator">
          <div className="step-dot completed">1</div>
          <div className="step-dot active">2</div>
          <div className="step-dot">3</div>
          <div className="step-dot">4</div>
        </div>
      </section>
    </div>
  );
};

export default StyleTest;