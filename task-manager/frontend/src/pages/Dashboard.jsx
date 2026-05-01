import React, { useState, useEffect } from 'react';
import api from '../api';
import { useAuth } from '../AuthContext';
import { Activity, CheckCircle, Clock, Layout, AlertTriangle } from 'lucide-react';
import TaskCard from '../components/TaskCard';

const Dashboard = () => {
  const [data, setData] = useState(null);
  const { user } = useAuth();

  useEffect(() => {
    const fetchDashboard = async () => {
      try {
        const res = await api.get('/dashboard/');
        setData(res.data);
      } catch (err) {
        console.error('Error fetching dashboard data', err);
      }
    };
    fetchDashboard();
  }, []);

  if (!data) return <div className="loading">Loading dashboard...</div>;

  return (
    <div className="page-container fade-in">
      <header className="page-header">
        <div>
          <h1>Welcome back, {user?.name.split(' ')[0]}!</h1>
          <p className="subtitle">Here's what's happening with your tasks today.</p>
        </div>
      </header>

      <div className="stats-grid">
        <div className="stat-card">
          <div className="stat-icon bg-primary-light">
            <Layout size={24} className="text-primary" />
          </div>
          <div className="stat-details">
            <h3>Total Tasks</h3>
            <span className="stat-number">{data.total_tasks}</span>
          </div>
        </div>
        
        <div className="stat-card">
          <div className="stat-icon bg-warning-light">
            <Clock size={24} className="text-warning" />
          </div>
          <div className="stat-details">
            <h3>In Progress</h3>
            <span className="stat-number">{data.in_progress}</span>
          </div>
        </div>
        
        <div className="stat-card">
          <div className="stat-icon bg-success-light">
            <CheckCircle size={24} className="text-success" />
          </div>
          <div className="stat-details">
            <h3>Completed</h3>
            <span className="stat-number">{data.done}</span>
          </div>
        </div>
        
        <div className="stat-card">
          <div className="stat-icon bg-danger-light">
            <Activity size={24} className="text-danger" />
          </div>
          <div className="stat-details">
            <h3>Active Projects</h3>
            <span className="stat-number">{data.my_projects}</span>
          </div>
        </div>
      </div>

      {data.overdue?.length > 0 && (
        <div className="dashboard-section mt-5">
          <div className="section-header overdue-header">
            <AlertTriangle className="text-danger" size={24} />
            <h2>Overdue Tasks</h2>
          </div>
          <div className="cards-grid">
            {data.overdue.map(task => (
              <TaskCard key={task.id} task={task} isEditable={false} />
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default Dashboard;
