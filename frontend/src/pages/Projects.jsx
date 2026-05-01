import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../api';
import { FolderPlus, Users, LayoutList } from 'lucide-react';

const Projects = () => {
  const [projects, setProjects] = useState([]);
  const [showCreate, setShowCreate] = useState(false);
  const [newProject, setNewProject] = useState({ name: '', description: '' });

  useEffect(() => {
    fetchProjects();
  }, []);

  const fetchProjects = async () => {
    try {
      const res = await api.get('/projects/');
      setProjects(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  const handleCreate = async (e) => {
    e.preventDefault();
    try {
      const res = await api.post('/projects/', newProject);
      setProjects([...projects, res.data]);
      setNewProject({ name: '', description: '' });
      setShowCreate(false);
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="page-container fade-in">
      <header className="page-header">
        <div>
          <h1>Projects</h1>
          <p className="subtitle">Manage your team's projects and workflows.</p>
        </div>
        <button className="btn-primary" onClick={() => setShowCreate(!showCreate)}>
          <FolderPlus size={18} />
          <span>New Project</span>
        </button>
      </header>

      {showCreate && (
        <div className="create-panel glass-panel slide-down">
          <h3>Create New Project</h3>
          <form onSubmit={handleCreate} className="standard-form">
            <div className="form-group">
              <input 
                type="text" 
                required 
                value={newProject.name}
                onChange={e => setNewProject({...newProject, name: e.target.value})}
                placeholder="Project Name"
              />
            </div>
            <div className="form-group">
              <textarea 
                value={newProject.description}
                onChange={e => setNewProject({...newProject, description: e.target.value})}
                placeholder="Project Description"
                rows="2"
              />
            </div>
            <div className="form-actions">
              <button type="button" className="btn-secondary" onClick={() => setShowCreate(false)}>Cancel</button>
              <button type="submit" className="btn-primary">Create</button>
            </div>
          </form>
        </div>
      )}

      <div className="projects-grid mt-4">
        {projects.map(project => (
          <Link to={`/projects/${project.id}`} key={project.id} className="project-card">
            <div className="project-card-header">
              <h3>{project.name}</h3>
              <span className={`role-badge role-${project.my_role}`}>{project.my_role}</span>
            </div>
            <p className="project-card-desc">{project.description || 'No description provided.'}</p>
            <div className="project-card-footer">
              <div className="stat-mini">
                <Users size={16} />
                <span>{project.members?.length || 1} members</span>
              </div>
              <div className="stat-mini">
                <LayoutList size={16} />
                <span>{project.task_count} tasks</span>
              </div>
            </div>
          </Link>
        ))}
        {projects.length === 0 && !showCreate && (
          <div className="empty-state">
            <FolderPlus size={48} className="text-muted" />
            <h3>No projects yet</h3>
            <p>Create a project to get started.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Projects;
