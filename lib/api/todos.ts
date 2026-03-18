import { API_BASE } from '@/lib/constants'
import type { Todo, CreateTodoInput } from '@/lib/types'

export async function fetchTodos(filters?: {
  completed?: boolean
  userId?: number
}): Promise<Todo[]> {
  const url = new URL(`${API_BASE}/todos`)
  if (filters?.completed !== undefined)
    url.searchParams.set('completed', String(filters.completed))
  if (filters?.userId !== undefined)
    url.searchParams.set('userId', String(filters.userId))
  const res = await fetch(url.toString())
  if (!res.ok) throw new Error('Failed to fetch todos')
  return res.json()
}

export async function fetchTodo(id: number): Promise<Todo> {
  const res = await fetch(`${API_BASE}/todos/${id}`)
  if (!res.ok) throw new Error(`Failed to fetch todo ${id}`)
  return res.json()
}

export async function createTodo(input: CreateTodoInput): Promise<Todo> {
  const res = await fetch(`${API_BASE}/todos`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(input),
  })
  if (!res.ok) throw new Error('Failed to create todo')
  return res.json()
}

export async function toggleTodo(id: number, completed: boolean): Promise<Todo> {
  const res = await fetch(`${API_BASE}/todos/${id}`, {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ completed }),
  })
  if (!res.ok) throw new Error(`Failed to update todo ${id}`)
  return res.json()
}
