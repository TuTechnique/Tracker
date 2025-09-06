import React from 'react';

interface TimeBudgetSelectorProps {
  selectedBudget: number;
  onSelectBudget: (hours: number) => void;
}

const TimeBudgetSelector: React.FC<TimeBudgetSelectorProps> = ({ selectedBudget, onSelectBudget }) => {
  const budgets = [8, 16];

  return (
    <div className="flex space-x-4">
      {budgets.map(budget => (
        <button
          key={budget}
          onClick={() => onSelectBudget(budget)}
          className={`w-full py-2 px-4 rounded-md font-semibold transition-colors ${
            selectedBudget === budget
              ? 'bg-blue-600 text-white'
              : 'bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-300 dark:hover:bg-gray-600'
          }`}
        >
          {budget} giờ
        </button>
      ))}
    </div>
  );
};

export default TimeBudgetSelector;
