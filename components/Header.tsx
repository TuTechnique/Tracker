import React from 'react';

interface HeaderProps {
  remainingHours: number;
  allocatedHours: number;
  completionPercentage: number;
}

const StatCard: React.FC<{ title: string; value: string; color: string }> = ({ title, value, color }) => (
  <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md">
    <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400 truncate">{title}</h3>
    <p className={`mt-1 text-3xl font-semibold ${color}`}>{value}</p>
  </div>
);

const Header: React.FC<HeaderProps> = ({ remainingHours, allocatedHours, completionPercentage }) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      <StatCard title="Tổng giờ đã phân bổ" value={`${allocatedHours.toFixed(1)}h`} color="text-blue-500 dark:text-blue-400" />
      <StatCard title="Giờ còn lại trong ngày" value={`${remainingHours.toFixed(1)}h`} color="text-green-500 dark:text-green-400" />
      <StatCard title="% Hoàn thành" value={`${completionPercentage.toFixed(0)}%`} color="text-indigo-500 dark:text-indigo-400" />
    </div>
  );
};

export default Header;