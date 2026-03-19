import { useCallback } from 'react'
import { useQueryClient } from '@tanstack/react-query'
import {
  useInfiniteTodos,
  useDeleteTodo,
  useToggleTodo,
} from '@/hooks/use-todos'
import { useIntersectionObserver } from '@/hooks/use-intersection-observer'
import { todoKeys } from '@/lib/query-keys'
import { fetchTodo } from '@/lib/api/todos'
import { Spinner } from '@/components/atoms/spinner'
import { TodoItem } from '@/components/molecules/todo-item'

export function TodoList() {
  const queryClient = useQueryClient()
  const { data, fetchNextPage, hasNextPage, isFetchingNextPage } =
    useInfiniteTodos()
  const deleteMutation = useDeleteTodo()
  const toggleMutation = useToggleTodo()

  const handlePrefetch = (id: number) => {
    queryClient.prefetchQuery({
      queryKey: todoKeys.detail(id),
      queryFn: () => fetchTodo(id),
    })
  }

  const handleLoadMore = useCallback(() => {
    fetchNextPage()
  }, [fetchNextPage])

  const loadMoreRef = useIntersectionObserver(handleLoadMore, {
    enabled: hasNextPage && !isFetchingNextPage,
    rootMargin: '200px',
  })

  const allTodos = data?.pages.flat() ?? []

  return (
    <div>
      {allTodos.length === 0 && (
        <p className="py-8 text-center text-sm text-muted-foreground">
          No todos yet. Create one to get started!
        </p>
      )}

      <ul className="space-y-1">
        {allTodos.map((todo) => (
          <TodoItem
            key={todo.id}
            todo={todo}
            onToggle={() =>
              toggleMutation.mutate({
                id: todo.id,
                completed: !todo.completed,
              })
            }
            onDelete={() => deleteMutation.mutate(todo.id)}
            onPrefetch={() => handlePrefetch(todo.id)}
            isDeleting={
              deleteMutation.isPending && deleteMutation.variables === todo.id
            }
          />
        ))}
      </ul>

      <div ref={loadMoreRef} className="mt-4 py-4">
        {isFetchingNextPage && (
          <div className="flex justify-center">
            <Spinner label="Loading more" />
          </div>
        )}
        {!hasNextPage && allTodos.length > 0 && (
          <p className="text-center text-sm text-muted-foreground">All todos loaded</p>
        )}
      </div>
    </div>
  )
}
