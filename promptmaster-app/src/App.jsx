import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import Login from './pages/Login';
import CourseSelection from './pages/CourseSelection';
import ProtectedRoute from './components/auth/ProtectedRoute';

function App() {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route
            path="/courses"
            element={
              <ProtectedRoute>
                <CourseSelection />
              </ProtectedRoute>
            }
          />
          <Route path="/" element={<Navigate to="/courses" replace />} />
        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App
