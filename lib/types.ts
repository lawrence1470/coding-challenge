export interface Todo {
  id: number
  title: string
  description: string | null
  completed: boolean
  userId: string
  createdAt: string
}

export type CreateTodoInput = Pick<Todo, 'title' | 'completed' | 'description'>
