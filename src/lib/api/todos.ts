import type { Todo, CreateTodoInput } from '@/lib/types'
import {
  getTodosPaginated,
  getTodoById,
  createTodoFn,
  deleteTodoFn,
  toggleTodoFn,
} from '@/server/todos'

export async function fetchTodosPaginated({
  page = 1,
  limit = 10,
}: {
  page?: number
  limit?: number
}): Promise<Todo[]> {
  return getTodosPaginated({ data: { page, limit } })
}

export async function createTodo(input: CreateTodoInput): Promise<Todo> {
  return createTodoFn({ data: input })
}

export async function deleteTodo(id: number): Promise<void> {
  await deleteTodoFn({ data: { id } })
}

export async function fetchTodo(id: number): Promise<Todo> {
  return getTodoById({ data: { id } })
}

export async function toggleTodo(id: number, completed: boolean): Promise<Todo> {
  return toggleTodoFn({ data: { id, completed } })
}
