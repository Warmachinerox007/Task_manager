import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../AuthContext';
import { CheckSquare, LayoutDashboard, FolderKanban, LogOut } from 'lucide-react';

const Navbar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <nav className="sidebar">
      <div className="sidebar-header">
        <CheckSquare className="logo-icon" size={32} />
        <h2>TaskManager</h2>
      </div>
      
      <div className="sidebar-nav">
        <Link to="/" className="nav-link">
          <LayoutDashboard size={20} />
          <span>Dashboard</span>
        </Link>
        <Link to="/projects" className="nav-link">
          <FolderKanban size={20} />
          <span>Projects</span>
        </Link>
      </div>

      <div className="sidebar-footer">
        <div className="user-info">
          <div className="avatar">{user?.name?.charAt(0).toUpperCase()}</div>
          <div className="user-details">
            <span className="user-name">{user?.name}</span>
          </div>
        </div>
        <button onClick={handleLogout} className="logout-btn">
          <LogOut size={20} />
          <span>Logout</span>
        </button>
      </div>
    </nav>
  );
};

export default Navbar;
