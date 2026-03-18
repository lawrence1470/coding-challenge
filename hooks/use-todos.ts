import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { todoKeys } from '@/lib/query-keys'
import type { Todo } from '@/lib/types'
import { fetchTodos, fetchTodo, createTodo, toggleTodo } from '@/lib/api/todos'

export function useTodos(filters?: { completed?: boolean; userId?: number }) {
  return useQuery({
    queryKey: todoKeys.list(filters),
    queryFn: () => fetchTodos(filters),
  })
}

export function useTodo(id: number) {
  const queryClient = useQueryClient()
  return useQuery({
    queryKey: todoKeys.detail(id),
    queryFn: () => fetchTodo(id),
    enabled: !!id,
    placeholderData: () => {
      // Pull from any cached list while the detail query loads
      return queryClient
        .getQueryData<Todo[]>(todoKeys.lists())
        ?.find((todo) => todo.id === id)
    },
  })
}

export function useCompletedTodoCount(filters?: {
  userId?: number
}) {
  return useQuery({
    queryKey: todoKeys.list(filters),
    queryFn: () => fetchTodos(filters),
    select: (todos) => todos.filter((todo) => todo.completed).length,
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
    onMutate: async ({ id, completed }) => {
      // Cancel outgoing refetches so they don't overwrite our optimistic update
      await queryClient.cancelQueries({ queryKey: todoKeys.detail(id) })
      await queryClient.cancelQueries({ queryKey: todoKeys.lists() })

      // Snapshot previous values for rollback
      const previousDetail = queryClient.getQueryData<Todo>(todoKeys.detail(id))
      const previousLists = queryClient.getQueriesData<Todo[]>({
        queryKey: todoKeys.lists(),
      })

      // Optimistically update detail cache
      queryClient.setQueryData<Todo>(todoKeys.detail(id), (old) =>
        old ? { ...old, completed } : old,
      )

      // Optimistically update all list caches
      queryClient.setQueriesData<Todo[]>(
        { queryKey: todoKeys.lists() },
        (old) =>
          old?.map((todo) =>
            todo.id === id ? { ...todo, completed } : todo,
          ),
      )

      return { previousDetail, previousLists }
    },
    onError: (_err, { id }, context) => {
      // Rollback detail cache
      if (context?.previousDetail) {
        queryClient.setQueryData(todoKeys.detail(id), context.previousDetail)
      }
      // Rollback all list caches
      context?.previousLists?.forEach(([queryKey, data]) => {
        queryClient.setQueryData(queryKey, data)
      })
    },
    onSettled: () => {
      // Always refetch to ensure server state consistency
      queryClient.invalidateQueries({ queryKey: todoKeys.lists() })
    },
  })
}
