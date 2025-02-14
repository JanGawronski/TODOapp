export interface User {
    id: number;
    name: string;
  }

export interface List {
  id: number;
  userId: number;
  name: string;
}

export interface Task {
  id: number;
  listId: number;
  text: string;
  description: string;
  dueDate: Date;
  completed: Boolean;
}