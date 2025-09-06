import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { Task, TaskStatus } from './types';
import useLocalStorage from './hooks/useLocalStorage';
import Header from './components/Header';
import AddTaskForm from './components/AddTaskForm';
import TaskList from './components/TaskList';
import ProgressChart from './components/ProgressChart';
import TimeBudgetSelector from './components/TimeBudgetSelector';

const getTodayString = () => {
  const today = new Date();
  return today.toISOString().split('T')[0]; // YYYY-MM-DD
};

const App: React.FC = () => {
  const [tasks, setTasks] = useLocalStorage<Task[]>('tasks', []);
  const [dailyBudget, setDailyBudget] = useLocalStorage<number>('dailyBudget', 8);
  const [activeTaskId, setActiveTaskId] = useState<string | null>(null);
  const [currentDate, setCurrentDate] = useState(getTodayString());

  useEffect(() => {
    // Logic to carry over incomplete tasks from previous days
    const todayStr = getTodayString();
    setCurrentDate(todayStr);

    const updatedTasks = tasks.map(task => {
      if (task.status !== TaskStatus.Completed && task.date < todayStr) {
        return { ...task, date: todayStr, status: TaskStatus.Pending }; // Reset status to pending
      }
      return task;
    });
    setTasks(updatedTasks);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []); // Run only once on initial app load


  useEffect(() => {
    const activeTask = tasks.find(t => t.status === TaskStatus.Active);
    if (activeTask && activeTask.id !== activeTaskId) {
      setActiveTaskId(activeTask.id);
    } else if (!activeTask && activeTaskId) {
      setActiveTaskId(null);
    }
  }, [tasks, activeTaskId]);

  useEffect(() => {
    let interval: number | null = null;
    if (activeTaskId) {
      interval = setInterval(() => {
        setTasks(prevTasks =>
          prevTasks.map(task =>
            task.id === activeTaskId
              ? { ...task, elapsedSeconds: task.elapsedSeconds + 1 }
              : task
          )
        );
      }, 1000);
    }
    return () => {
      if (interval) {
        clearInterval(interval);
      }
    };
  }, [activeTaskId, setTasks]);

  const todaysTasks = useMemo(() => tasks.filter(task => task.date === currentDate), [tasks, currentDate]);

  const { allocatedHours, remainingHours, completedHours, completionPercentage } = useMemo(() => {
    const allocated = todaysTasks.reduce((sum, task) => sum + task.estimatedHours, 0);
    const completed = todaysTasks
      .filter(task => task.status === TaskStatus.Completed)
      .reduce((sum, task) => sum + task.estimatedHours, 0);
    const percentage = allocated > 0 ? (completed / allocated) * 100 : 0;
    return {
      allocatedHours: allocated,
      remainingHours: dailyBudget - allocated,
      completedHours: completed,
      completionPercentage: percentage,
    };
  }, [todaysTasks, dailyBudget]);

  const handleAddTask = useCallback((name: string, hours: number) => {
    const newTask: Task = {
      id: crypto.randomUUID(),
      name,
      estimatedHours: hours,
      elapsedSeconds: 0,
      status: TaskStatus.Pending,
      date: currentDate,
    };
    setTasks(prevTasks => [...prevTasks, newTask]);
  }, [setTasks, currentDate]);

  const handleDeleteTask = useCallback((id: string) => {
    setTasks(prevTasks => prevTasks.filter(task => task.id !== id));
  }, [setTasks]);

  const handleStartTask = useCallback((id: string) => {
    setTasks(prevTasks =>
      prevTasks.map(task => {
        if (task.id === id) {
          return { ...task, status: TaskStatus.Active, startTime: Date.now() };
        }
        if (task.status === TaskStatus.Active && task.date === currentDate) {
          return { ...task, status: TaskStatus.Pending };
        }
        return task;
      })
    );
    setActiveTaskId(id);
  }, [setTasks, currentDate]);
  
  const handleCompleteTask = useCallback((id: string) => {
    setTasks(prevTasks =>
      prevTasks.map(task =>
        task.id === id ? { ...task, status: TaskStatus.Completed } : task
      )
    );
    if (activeTaskId === id) {
      setActiveTaskId(null);
    }
  }, [activeTaskId, setTasks]);

  const handleResetTaskTime = useCallback((id: string) => {
    setTasks(prevTasks => 
      prevTasks.map(task => 
        task.id === id ? { ...task, elapsedSeconds: 0, status: TaskStatus.Pending } : task
      )
    );
    if(activeTaskId === id) {
        setActiveTaskId(null);
    }
  }, [setTasks, activeTaskId]);
  
  const formattedDate = useMemo(() => {
    const date = new Date(currentDate);
    // Adding time zone offset to prevent date from shifting
    const offset = date.getTimezoneOffset()
    const correctedDate = new Date(date.getTime() + (offset*60*1000))
    return new Intl.DateTimeFormat('vi-VN', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    }).format(correctedDate);
  }, [currentDate]);

  return (
    <div className="min-h-screen p-4 sm:p-6 lg:p-8">
      <div className="max-w-7xl mx-auto">
        <header className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Bảng điều khiển - {formattedDate}</h1>
          <p className="text-lg text-gray-600 dark:text-gray-400">Chào mừng bạn, hãy bắt đầu một ngày năng suất!</p>
        </header>

        <Header
          remainingHours={remainingHours}
          allocatedHours={allocatedHours}
          completionPercentage={completionPercentage}
        />

        <main className="mt-8 grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-8">
            <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md">
              <h2 className="text-xl font-semibold mb-4">Thêm công việc mới</h2>
              <AddTaskForm onAddTask={handleAddTask} />
            </div>
            <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md">
              <h2 className="text-xl font-semibold mb-4">Danh sách công việc</h2>
              <TaskList
                tasks={todaysTasks}
                onStart={handleStartTask}
                onComplete={handleCompleteTask}
                onDelete={handleDeleteTask}
                onResetTime={handleResetTaskTime}
              />
            </div>
          </div>

          <div className="space-y-8">
            <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md">
              <h2 className="text-xl font-semibold mb-4">Ngân sách Thời gian Hàng ngày</h2>
              <TimeBudgetSelector selectedBudget={dailyBudget} onSelectBudget={setDailyBudget} />
            </div>
            <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md">
              <h2 className="text-xl font-semibold mb-4">Tổng quan Tiến độ</h2>
              <ProgressChart
                completedHours={completedHours}
                allocatedHours={allocatedHours}
                dailyBudget={dailyBudget}
              />
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default App;
