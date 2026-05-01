import React from 'react';

const StatusDropdown = ({ currentStatus, onChange }) => {
  return (
    <select 
      className={`status-select status-${currentStatus}`}
      value={currentStatus}
      onChange={(e) => onChange(e.target.value)}
      onClick={(e) => e.stopPropagation()}
    >
      <option value="todo">Todo</option>
      <option value="in_progress">In Progress</option>
      <option value="done">Done</option>
    </select>
  );
};

export default StatusDropdown;
