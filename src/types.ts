export interface Task {
  id: string;
  content: string;
  createdAt: Date;
}

export type ColumnType = 'todo' | 'inProgress' | 'willDo' | 'done';

export interface Column {
  id: ColumnType;
  title: string;
  tasks: Task[];
}