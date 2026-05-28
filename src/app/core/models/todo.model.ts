export interface IServerTodo {
  userId: number;
  id: number;
  title: string;
  completed: boolean;
}

export type TodoPriority = 'high' | 'medium' | 'low';

export type SortType = 'none' | 'priority-asc' | 'priority-desc';

export interface IAppTodo {
  id: number;
  title: string;
  completed: boolean;
  priority: TodoPriority;
}
