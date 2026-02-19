// Task management interfaces and types for the Bounty Board

export interface Task {
  id: number;
  title: string;
  description: string;
  creator: string;
  reward: number; // in microAlgos
  status: "open" | "claimed" | "submitted" | "completed" | "disputed";
  claimant?: string;
  deadline: number; // Unix timestamp
  createdAt: number;
  submissionUri?: string;
}

export interface TaskFormData {
  title: string;
  description: string;
  reward: number;
  deadlineDays: number;
}

export interface TaskBoard {
  tasks: Task[];
  totalTasks: number;
}

export interface Account {
  address: string;
  balance: number;
  tasksCreated: number;
  tasksClaimed: number;
  tasksCompleted: number;
}
