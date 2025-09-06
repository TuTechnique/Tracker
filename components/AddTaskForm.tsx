import React, { useState } from 'react';

interface AddTaskFormProps {
  onAddTask: (name: string, hours: number) => void;
}

const AddTaskForm: React.FC<AddTaskFormProps> = ({ onAddTask }) => {
  const [name, setName] = useState('');
  const [hours, setHours] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const numericHours = parseFloat(hours);
    if (name.trim() && !isNaN(numericHours) && numericHours > 0) {
      onAddTask(name.trim(), numericHours);
      setName('');
      setHours('');
    } else {
        alert("Vui lòng nhập tên công việc và số giờ hợp lệ (lớn hơn 0).");
    }
  };

  return (
    <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-4">
      <input
        type="text"
        value={name}
        onChange={(e) => setName(e.target.value)}
        placeholder="Tên công việc"
        className="flex-grow px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 focus:ring-blue-500 focus:border-blue-500"
      />
      <input
        type="number"
        value={hours}
        onChange={(e) => setHours(e.target.value)}
        placeholder="Số giờ dự kiến"
        step="0.1"
        min="0"
        className="w-full sm:w-40 px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 focus:ring-blue-500 focus:border-blue-500"
      />
      <button
        type="submit"
        className="w-full sm:w-auto px-6 py-2 bg-blue-600 text-white font-semibold rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 dark:focus:ring-offset-gray-800 transition-colors"
      >
        Thêm
      </button>
    </form>
  );
};

export default AddTaskForm;