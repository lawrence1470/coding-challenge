import {
  useInfiniteQuery,
  useMutation,
  useQueryClient,
  useSuspenseQuery,
  type InfiniteData,
} from '@tanstack/react-query'
import { todoKeys } from '@/lib/query-keys'
import { PAGE_SIZE } from '@/lib/constants'
import type { Todo } from '@/lib/types'
import {
  fetchTodosPaginated,
  fetchTodo,
  createTodo,
  deleteTodo,
  toggleTodo,
} from '@/lib/api/todos'

type TodoInfiniteData = InfiniteData<Todo[], number>

export const todosInfiniteQueryOptions = {
  queryKey: todoKeys.infinite(),
  queryFn: ({ pageParam }: { pageParam: number }) =>
    fetchTodosPaginated({ page: pageParam, limit: PAGE_SIZE }),
  initialPageParam: 1,
  getNextPageParam: (lastPage: Todo[], _allPages: Todo[][], lastPageParam: number) =>
    lastPage.length < PAGE_SIZE ? undefined : lastPageParam + 1,
} as const

function useOptimisticMutation<TInput, TOutput>(
  mutationFn: (input: TInput) => Promise<TOutput>,
  updater: (old: TodoInfiniteData, input: TInput) => TodoInfiniteData,
) {
  const queryClient = useQueryClient()
  const queryKey = todoKeys.infinite()
  return useMutation({
    mutationFn,
    onMutate: async (input) => {
      await queryClient.cancelQueries({ queryKey })
      const previous = queryClient.getQueryData<TodoInfiniteData>(queryKey)
      queryClient.setQueryData<TodoInfiniteData>(queryKey, (old) =>
        old ? updater(old, input) : old,
      )
      return { previous }
    },
    onError: (_err, _vars, context) => {
      if (context?.previous) queryClient.setQueryData(queryKey, context.previous)
    },
    onSettled: () => queryClient.invalidateQueries({ queryKey: todoKeys.all }),
  })
}

export function useInfiniteTodos() {
  return useInfiniteQuery(todosInfiniteQueryOptions)
}

export function useCreateTodo() {
  return useOptimisticMutation(createTodo, (old, newTodoInput) => {
    const optimisticTodo: Todo = {
      ...newTodoInput,
      description: newTodoInput.description ?? null,
      id: Date.now(),
      userId: '',
      createdAt: new Date().toISOString(),
    }
    return {
      ...old,
      pages: [[optimisticTodo, ...old.pages[0]], ...old.pages.slice(1)],
    }
  })
}

export function useDeleteTodo() {
  return useOptimisticMutation(
    (id: number) => deleteTodo(id),
    (old, id) => ({
      ...old,
      pages: old.pages.map((page) => page.filter((todo) => todo.id !== id)),
    }),
  )
}

export function useToggleTodo() {
  return useOptimisticMutation(
    ({ id, completed }: { id: number; completed: boolean }) =>
      toggleTodo(id, completed),
    (old, { id, completed }) => ({
      ...old,
      pages: old.pages.map((page) =>
        page.map((todo) => (todo.id === id ? { ...todo, completed } : todo)),
      ),
    }),
  )
}

export function useTodoDetail(id: number) {
  const queryClient = useQueryClient()
  return useSuspenseQuery({
    queryKey: todoKeys.detail(id),
    queryFn: () => fetchTodo(id),
    initialData: () => {
      const infiniteData = queryClient.getQueryData<TodoInfiniteData>(todoKeys.infinite())
      return infiniteData?.pages.flat().find((t) => t.id === id)
    },
  })
}
