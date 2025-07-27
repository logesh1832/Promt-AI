import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './assets/css/variables.css'
import './assets/css/styles.css'
import './assets/css/course-learning.css'
import App from './App.jsx'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
