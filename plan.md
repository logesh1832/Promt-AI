# 📘 Prompt Master – MVP & PoC Plan

## ✅ Minimum Viable Product (MVP)

The MVP focuses on delivering the **core learning experience** with LLM integration for both Admins and Learners.

### 🎯 Key Features

#### 👤 User Roles
- **Admin**
  - Create and manage courses and topics
  - Generate content using LLM
  - Approve content before publishing
- **Learner**
  - Browse and complete structured learning paths
  - Interact with prompts and view real-time responses

#### 📚 Course & Topic Flow
Courses are categorized into:
- Beginner
- Intermediate
- Advanced

Each topic includes:
1. **Topic Explanation**
   - LLM-generated content (text/image)
   - Highlighted key concepts
2. **Example Prompt**
   - Prompt explanation and structure
   - “Try this Prompt” interaction
3. **Prompt Execution**
   - Read-only display of prompt
   - LLM-powered output in chat-style interface
4. **Practice Problems**
   - Free-form prompt input
   - Real-time LLM response
   - “Show Suggested Answer” option

#### ⚙️ Admin Panel
- Create Courses (by level)
- Add Topics with LLM support
- Review & Approve before publishing
- Activate for learners

#### 🤖 LLM Integration
- LLM API usage for:
  - Content generation (Admin)
  - Prompt execution (Learner)
- Providers: OpenAI, Claude, or local LLMs

#### 🖥️ UI/UX Features
- Vertical Stepper for topic flow
- Chat-style output interface
- Sidebar for navigation
- Topic progress indicators
- Clean, responsive design

#### 🔐 Non-Functional Requirements
- Secure token handling
- Low-latency responses (<3s)
- Modular, scalable codebase
- Web and tablet compatibility

---

## 🚀 Proof of Concept (PoC)

The PoC demonstrates the core interaction between user and LLM in a guided learning setup.

### 🧪 PoC Scope

#### 📚 Sample Content
- One **Beginner** course
- 1–2 Topics with all 4 steps pre-filled or seeded

#### 🧠 LLM Interaction
- Prompt display and real-time execution
- Free-form prompt practice with output
- Chat-style UI display

#### 🛠️ Admin Functionality (Optional)
- Basic manual topic input (no approval workflow)

#### 🧩 UI Prototype
- Step-by-step layout
- Interactive "Try Prompt" and practice areas
- Simple progress UI

---

## 💡 Summary

| Feature          | MVP                                          | PoC                                      |
|------------------|-----------------------------------------------|-------------------------------------------|
| Course Levels     | Beginner, Intermediate, Advanced              | 1 Beginner course                         |
| Topic Flow        | Full 4-step per topic                         | 4-step flow for 1–2 topics                |
| Admin Panel       | Create, Approve, Activate                     | Manual input or hardcoded topics          |
| LLM Integration   | Admin (content) + Learner (prompt execution)  | Learner only                              |
| UI                | Complete learner flow + navigation            | Basic vertical stepper + chat-style UI    |

---
