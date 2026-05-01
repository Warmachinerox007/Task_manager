import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../api';
import TaskCard from '../components/TaskCard';
import TaskModal from '../components/TaskModal';
import { Plus, Trash2, Users, ArrowLeft } from 'lucide-react';

const ProjectDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [project, setProject] = useState(null);
  const [tasks, setTasks] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newMemberEmail, setNewMemberEmail] = useState('');

  useEffect(() => {
    fetchProjectAndTasks();
  }, [id]);

  const fetchProjectAndTasks = async () => {
    try {
      const [projRes, tasksRes] = await Promise.all([
        api.get(`/projects/${id}/`),
        api.get(`/tasks/project/${id}/`)
      ]);
      setProject(projRes.data);
      setTasks(tasksRes.data);
    } catch (err) {
      if (err.response?.status === 404) navigate('/projects');
    }
  };

  const handleCreateTask = async (taskData) => {
    try {
      const res = await api.post(`/tasks/project/${id}/`, taskData);
      setTasks([...tasks, res.data]);
      setIsModalOpen(false);
    } catch (err) {
      console.error(err);
    }
  };

  const handleStatusChange = async (taskId, status) => {
    try {
      const res = await api.patch(`/tasks/${taskId}/status/`, { status });
      setTasks(tasks.map(t => t.id === taskId ? res.data : t));
    } catch (err) {
      console.error(err);
    }
  };

  const handleAddMember = async (e) => {
    e.preventDefault();
    try {
      await api.post(`/projects/${id}/members/`, { email: newMemberEmail });
      setNewMemberEmail('');
      fetchProjectAndTasks(); // Refresh project to get new member
    } catch (err) {
      alert(err.response?.data?.error || 'Failed to add member');
    }
  };

  const handleDeleteProject = async () => {
    if (window.confirm('Are you sure you want to delete this project?')) {
      try {
        await api.delete(`/projects/${id}/`);
        navigate('/projects');
      } catch (err) {
        console.error(err);
      }
    }
  };

  if (!project) return <div className="loading">Loading project...</div>;

  const isAdmin = project.my_role === 'admin';

  // Group tasks by status
  const columns = {
    todo: tasks.filter(t => t.status === 'todo'),
    in_progress: tasks.filter(t => t.status === 'in_progress'),
    done: tasks.filter(t => t.status === 'done')
  };

  return (
    <div className="page-container project-detail fade-in">
      <header className="page-header">
        <div>
          <button className="btn-icon mb-2" onClick={() => navigate('/projects')}>
            <ArrowLeft size={20} /> Back
          </button>
          <h1>{project.name}</h1>
          <p className="subtitle">{project.description}</p>
        </div>
        <div className="header-actions">
          {isAdmin && (
            <button className="btn-danger" onClick={handleDeleteProject}>
              <Trash2 size={18} /> Delete Project
            </button>
          )}
          <button className="btn-primary" onClick={() => setIsModalOpen(true)}>
            <Plus size={18} /> New Task
          </button>
        </div>
      </header>

      <div className="project-layout mt-4">
        <div className="kanban-board">
          {Object.entries(columns).map(([status, statusTasks]) => (
            <div key={status} className="kanban-column">
              <div className="column-header">
                <h3>{status.replace('_', ' ').toUpperCase()}</h3>
                <span className="task-count">{statusTasks.length}</span>
              </div>
              <div className="column-content">
                {statusTasks.map(task => (
                  <TaskCard 
                    key={task.id} 
                    task={task} 
                    onStatusChange={handleStatusChange}
                    isEditable={isAdmin || task.assigned_to === JSON.parse(localStorage.getItem('user')).id}
                  />
                ))}
              </div>
            </div>
          ))}
        </div>

        <div className="project-sidebar">
          <div className="members-panel glass-panel">
            <div className="panel-header">
              <Users size={20} />
              <h3>Team Members</h3>
            </div>
            
            <ul className="members-list">
              {project.members?.map(m => (
                <li key={m.id} className="member-item">
                  <div className="avatar-small">{m.user.name.charAt(0).toUpperCase()}</div>
                  <div className="member-info">
                    <span className="member-name">{m.user.name}</span>
                    <span className={`role-badge role-${m.role}`}>{m.role}</span>
                  </div>
                </li>
              ))}
            </ul>

            {isAdmin && (
              <form onSubmit={handleAddMember} className="add-member-form mt-4">
                <input 
                  type="email" 
                  placeholder="Invite by email" 
                  value={newMemberEmail}
                  onChange={e => setNewMemberEmail(e.target.value)}
                  required
                />
                <button type="submit" className="btn-primary btn-small">Add</button>
              </form>
            )}
          </div>
        </div>
      </div>

      <TaskModal 
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSubmit={handleCreateTask}
        members={project.members || []}
      />
    </div>
  );
};

export default ProjectDetail;
