import React from 'react';
import { Task, TaskStatus } from '../types';
import { PlayIcon, CheckIcon, TrashIcon, ResetIcon } from './IconComponents';

interface TaskItemProps {
  task: Task;
  onStart: (id: string) => void;
  onComplete: (id: string) => void;
  onDelete: (id: string) => void;
  onResetTime: (id: string) => void;
}

const formatTime = (totalSeconds: number): string => {
  const hours = Math.floor(totalSeconds / 3600);
  const minutes = Math.floor((totalSeconds % 3600) / 60);
  const seconds = totalSeconds % 60;
  return [hours, minutes, seconds]
    .map(v => v.toString().padStart(2, '0'))
    .join(':');
};

const formatHoursMinutes = (hoursDecimal: number): string => {
  if (hoursDecimal <= 0) return '0p';
  const totalMinutes = Math.round(hoursDecimal * 60);
  const hours = Math.floor(totalMinutes / 60);
  const minutes = totalMinutes % 60;

  const parts = [];
  if (hours > 0) {
    parts.push(`${hours}h`);
  }
  if (minutes > 0) {
    parts.push(`${minutes}p`);
  }
  return parts.length > 0 ? parts.join(' ') : '0p';
};


const TaskItem: React.FC<TaskItemProps> = ({ task, onStart, onComplete, onDelete, onResetTime }) => {
    const isOverdue = task.elapsedSeconds > task.estimatedHours * 3600;

    const getStatusBadge = () => {
        switch (task.status) {
            case TaskStatus.Active:
                return <span className="text-xs font-medium px-2.5 py-0.5 rounded-full bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300">Đang chạy</span>;
            case TaskStatus.Completed:
                return <span className="text-xs font-medium px-2.5 py-0.5 rounded-full bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300">Hoàn thành</span>;
            default:
                return <span className="text-xs font-medium px-2.5 py-0.5 rounded-full bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300">Chờ</span>;
        }
    };

    const renderCompletionNote = () => {
        if (task.status !== TaskStatus.Completed) return null;

        const estimatedSeconds = task.estimatedHours * 3600;
        const differenceInSeconds = task.elapsedSeconds - estimatedSeconds;
        const absDifference = Math.abs(differenceInSeconds);

        if (absDifference < 60) {
             return (
                <span className="text-xs font-medium text-gray-500 dark:text-gray-400">Đúng giờ</span>
            );
        }

        const formattedDifference = formatHoursMinutes(absDifference / 3600);

        if (differenceInSeconds > 0) {
            return (
                <span className="text-xs font-medium text-red-500">
                    Trễ {formattedDifference}
                </span>
            );
        } else {
            return (
                <span className="text-xs font-medium text-green-500">
                    Sớm {formattedDifference}
                </span>
            );
        }
    };

  return (
    <div className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-700/50 rounded-lg transition-all duration-200">
      <div className="flex-1 min-w-0">
        <p className="font-semibold text-gray-800 dark:text-gray-200 truncate">{task.name}</p>
        <div className="flex items-center flex-wrap gap-x-3 gap-y-1 text-sm text-gray-500 dark:text-gray-400 mt-1">
          <span>Dự kiến: {formatHoursMinutes(task.estimatedHours)}</span>
          <span className={`font-mono ${isOverdue && task.status !== TaskStatus.Completed ? 'text-red-500 animate-pulse' : ''}`}>
             {formatTime(task.elapsedSeconds)}
          </span>
          {getStatusBadge()}
          {renderCompletionNote()}
        </div>
      </div>
      <div className="flex items-center space-x-2 ml-4">
        {task.status === TaskStatus.Pending && (
          <button onClick={() => onStart(task.id)} className="p-2 text-green-500 hover:bg-green-100 dark:hover:bg-gray-600 rounded-full transition-colors" aria-label="Bắt đầu task">
            <PlayIcon />
          </button>
        )}
        {task.status === TaskStatus.Active && (
          <button onClick={() => onComplete(task.id)} className="p-2 text-blue-500 hover:bg-blue-100 dark:hover:bg-gray-600 rounded-full transition-colors" aria-label="Hoàn thành task">
            <CheckIcon />
          </button>
        )}
        {task.status !== TaskStatus.Completed && (
           <button onClick={() => onResetTime(task.id)} className="p-2 text-gray-500 hover:bg-gray-200 dark:hover:bg-gray-600 rounded-full transition-colors" aria-label="Đặt lại thời gian">
            <ResetIcon />
          </button>
        )}
         <button onClick={() => onDelete(task.id)} className="p-2 text-red-500 hover:bg-red-100 dark:hover:bg-gray-600 rounded-full transition-colors" aria-label="Xóa task">
            <TrashIcon />
          </button>
      </div>
    </div>
  );
};

export default TaskItem;
