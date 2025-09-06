import React from 'react';
import { Task } from '../types';
import TaskItem from './TaskItem';

interface TaskListProps {
  tasks: Task[];
  onStart: (id: string) => void;
  onComplete: (id: string) => void;
  onDelete: (id: string) => void;
  onResetTime: (id: string) => void;
}

const TaskList: React.FC<TaskListProps> = ({ tasks, onStart, onComplete, onDelete, onResetTime }) => {
  if (tasks.length === 0) {
    return <p className="text-center text-gray-500 dark:text-gray-400 py-4">Chưa có công việc nào cho hôm nay. Hãy thêm một công việc để bắt đầu!</p>;
  }

  return (
    <div className="space-y-3">
      {tasks.map(task => (
        <TaskItem
          key={task.id}
          task={task}
          onStart={onStart}
          onComplete={onComplete}
          onDelete={onDelete}
          onResetTime={onResetTime}
        />
      ))}
    </div>
  );
};

export default TaskList;
