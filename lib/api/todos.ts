import type { Todo, CreateTodoInput } from '@/lib/types'

export async function fetchTodosPaginated({
  page = 1,
  limit = 10,
}: {
  page?: number
  limit?: number
}): Promise<Todo[]> {
  const res = await fetch(`/api/todos?page=${page}&limit=${limit}`)
  if (!res.ok) throw new Error('Failed to fetch todos')
  return res.json()
}

export async function createTodo(input: CreateTodoInput): Promise<Todo> {
  const res = await fetch('/api/todos', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(input),
  })
  if (!res.ok) {
    const body = await res.text()
    throw new Error(`Failed to create todo: ${res.status} ${body}`)
  }
  return res.json()
}

export async function deleteTodo(id: number): Promise<void> {
  const res = await fetch(`/api/todos/${id}`, {
    method: 'DELETE',
  })
  if (!res.ok) throw new Error(`Failed to delete todo ${id}`)
}

export async function fetchTodo(id: number): Promise<Todo> {
  const res = await fetch(`/api/todos/${id}`)
  if (!res.ok) throw new Error(`Failed to fetch todo ${id}`)
  return res.json()
}

export async function toggleTodo(id: number, completed: boolean): Promise<Todo> {
  const res = await fetch(`/api/todos/${id}`, {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ completed }),
  })
  if (!res.ok) throw new Error(`Failed to update todo ${id}`)
  return res.json()
}
