import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { todoKeys } from '@/lib/query-keys'

// Types

interface Todo {
  id: number
  title: string
  completed: boolean
  userId: number
}

type CreateTodoInput = Omit<Todo, 'id'>

// Fetch functions

async function fetchTodos(filters?: {
  completed?: boolean
  userId?: number
}): Promise<Todo[]> {
  const url = new URL('https://jsonplaceholder.typicode.com/todos')
  if (filters?.completed !== undefined)
    url.searchParams.set('completed', String(filters.completed))
  if (filters?.userId !== undefined)
    url.searchParams.set('userId', String(filters.userId))
  const res = await fetch(url.toString())
  if (!res.ok) throw new Error('Failed to fetch todos')
  return res.json()
}

async function fetchTodo(id: string): Promise<Todo> {
  const res = await fetch(`https://jsonplaceholder.typicode.com/todos/${id}`)
  if (!res.ok) throw new Error(`Failed to fetch todo ${id}`)
  return res.json()
}

async function createTodo(input: CreateTodoInput): Promise<Todo> {
  const res = await fetch('https://jsonplaceholder.typicode.com/todos', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(input),
  })
  if (!res.ok) throw new Error('Failed to create todo')
  return res.json()
}

async function toggleTodo(id: number, completed: boolean): Promise<Todo> {
  const res = await fetch(`https://jsonplaceholder.typicode.com/todos/${id}`, {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ completed }),
  })
  if (!res.ok) throw new Error(`Failed to update todo ${id}`)
  return res.json()
}

// Hooks

export function useTodos(filters?: { completed?: boolean; userId?: number }) {
  return useQuery({
    queryKey: todoKeys.list(filters),
    queryFn: () => fetchTodos(filters),
  })
}

export function useTodo(id: string) {
  return useQuery({
    queryKey: todoKeys.detail(id),
    queryFn: () => fetchTodo(id),
    enabled: !!id,
  })
}

export function useCreateTodo() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: createTodo,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: todoKeys.lists() })
    },
  })
}

export function useToggleTodo() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: ({ id, completed }: { id: number; completed: boolean }) =>
      toggleTodo(id, completed),
    onSuccess: (updatedTodo) => {
      // Update the specific todo in cache immediately
      queryClient.setQueryData(
        todoKeys.detail(String(updatedTodo.id)),
        updatedTodo,
      )
      // Invalidate lists so they reflect the change
      queryClient.invalidateQueries({ queryKey: todoKeys.lists() })
    },
  })
}
