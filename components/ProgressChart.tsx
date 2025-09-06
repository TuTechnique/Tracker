import React from 'react';
import { PieChart, Pie, Cell, Tooltip, Legend, ResponsiveContainer } from 'recharts';

interface ProgressChartProps {
  completedHours: number;
  allocatedHours: number;
  dailyBudget: number;
}

const ProgressChart: React.FC<ProgressChartProps> = ({ completedHours, allocatedHours, dailyBudget }) => {
  const pendingHours = allocatedHours - completedHours;
  const unallocatedHours = dailyBudget - allocatedHours > 0 ? dailyBudget - allocatedHours : 0;
  
  const data = [
    { name: 'Hoàn thành', value: completedHours },
    { name: 'Đang chờ', value: pendingHours },
    { name: 'Chưa phân bổ', value: unallocatedHours },
  ].filter(item => item.value > 0);

  const COLORS = ['#10B981', '#3B82F6', '#6B7280'];

  if (dailyBudget === 0) {
    return <p className="text-center text-gray-500 dark:text-gray-400">Vui lòng chọn ngân sách thời gian.</p>;
  }

  return (
    <div style={{ width: '100%', height: 300 }}>
      <ResponsiveContainer>
        <PieChart>
          <Pie
            data={data}
            cx="50%"
            cy="50%"
            labelLine={false}
            outerRadius={80}
            fill="#8884d8"
            dataKey="value"
            nameKey="name"
            label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
          >
            {data.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
            ))}
          </Pie>
          <Tooltip formatter={(value: number) => `${value.toFixed(1)} giờ`} />
          <Legend />
        </PieChart>
      </ResponsiveContainer>
    </div>
  );
};

export default ProgressChart;
