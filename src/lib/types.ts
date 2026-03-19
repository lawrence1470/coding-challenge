export interface Todo {
  id: number
  title: string
  description: string | null
  completed: boolean
  userId: string
  createdAt: string
}

export type CreateTodoInput = Pick<Todo, 'title' | 'completed' | 'description'>

export interface AuthFormValues {
  name: string
  email: string
  password: string
}

export interface NewTodoFormValues {
  title: string
  description: string
}
