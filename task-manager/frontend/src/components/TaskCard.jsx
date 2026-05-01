import React from 'react';
import StatusDropdown from './StatusDropdown';
import { Calendar, AlertCircle } from 'lucide-react';

const TaskCard = ({ task, onStatusChange, isEditable }) => {
  const isOverdue = task.due_date && new Date(task.due_date) < new Date() && task.status !== 'done';

  return (
    <div className={`task-card priority-${task.priority}`}>
      <div className="task-header">
        <h4 className="task-title">{task.title}</h4>
        {isEditable ? (
          <StatusDropdown 
            currentStatus={task.status} 
            onChange={(newStatus) => onStatusChange(task.id, newStatus)} 
          />
        ) : (
          <span className={`status-badge status-${task.status}`}>
            {task.status.replace('_', ' ')}
          </span>
        )}
      </div>
      
      {task.description && (
        <p className="task-description">{task.description}</p>
      )}

      <div className="task-footer">
        {task.assigned_to_detail && (
          <div className="task-assignee">
            <div className="avatar-small">
              {task.assigned_to_detail.name.charAt(0).toUpperCase()}
            </div>
            <span>{task.assigned_to_detail.name}</span>
          </div>
        )}
        
        <div className="task-meta">
          {task.due_date && (
            <span className={`task-date ${isOverdue ? 'overdue' : ''}`}>
              {isOverdue ? <AlertCircle size={14} /> : <Calendar size={14} />}
              {new Date(task.due_date).toLocaleDateString()}
            </span>
          )}
          {task.project_name && (
            <span className="task-project-tag">{task.project_name}</span>
          )}
        </div>
      </div>
    </div>
  );
};

export default TaskCard;
