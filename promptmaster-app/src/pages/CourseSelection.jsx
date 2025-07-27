import { useAuth } from '../hooks/useAuth';
import { useNavigate } from 'react-router-dom';

function CourseSelection() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <div className="main-container">
      <div className="nav-header">
        <div className="nav-left">
          <h2>Course Selection</h2>
        </div>
        <div className="nav-right">
          <span className="user-info">{user?.email}</span>
          <button onClick={handleLogout} className="btn-secondary">
            Logout
          </button>
        </div>
      </div>
      
      <div className="content">
        <h1>Welcome to PromptMaster</h1>
        <p>Course selection page coming soon...</p>
        <p>You are logged in as: {user?.email} ({user?.role})</p>
      </div>
    </div>
  );
}

export default CourseSelection;