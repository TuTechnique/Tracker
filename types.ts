export enum TaskStatus {
  Pending = 'pending',
  Active = 'active',
  Completed = 'completed',
}

export interface Task {
  id: string;
  name: string;
  estimatedHours: number;
  elapsedSeconds: number;
  status: TaskStatus;
  startTime?: number;
  date: string; // YYYY-MM-DD format
}
