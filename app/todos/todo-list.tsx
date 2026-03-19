'use client'

import { useCallback } from 'react'
import { useQueryClient } from '@tanstack/react-query'
import {
  useInfiniteTodos,
  useDeleteTodo,
  useToggleTodo,
} from '@/hooks/use-todos'
import { useIntersectionObserver } from '@/hooks/use-intersection-observer'
import { Checkbox } from '@/components/ui/checkbox'
import { todoKeys } from '@/lib/query-keys'
import { fetchTodo } from '@/lib/api/todos'
import Link from 'next/link'

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
          <li
            key={todo.id}
            className="group flex items-center gap-3 rounded px-2 py-1.5 hover:bg-accent"
            onMouseEnter={() => handlePrefetch(todo.id)}
          >
            <Checkbox
              checked={todo.completed}
              onCheckedChange={() =>
                toggleMutation.mutate({
                  id: todo.id,
                  completed: !todo.completed,
                })
              }
              id={`todo-${todo.id}`}
              className="peer"
            />
            <Link
              href={`/todos/${todo.id}`}
              className="relative flex-1 text-sm text-foreground peer-data-[state=checked]:text-muted-foreground after:absolute after:left-0 after:top-1/2 after:h-px after:w-full after:-translate-y-1/2 after:scale-x-0 after:bg-muted-foreground after:transition-transform after:duration-300 after:ease-in-out peer-data-[state=checked]:after:scale-x-100"
            >
              {todo.title}
            </Link>
            <time
              dateTime={todo.createdAt}
              className="shrink-0 text-xs text-muted-foreground"
            >
              {new Date(todo.createdAt).toLocaleTimeString([], {
                hour: 'numeric',
                minute: '2-digit',
              })}
            </time>
            <button
              onClick={() => deleteMutation.mutate(todo.id)}
              className="shrink-0 cursor-pointer text-muted-foreground opacity-0 transition-opacity hover:text-destructive group-hover:opacity-100"
              aria-label={`Delete "${todo.title}"`}
            >
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="h-4 w-4">
                <path fillRule="evenodd" d="M8.75 1A2.75 2.75 0 0 0 6 3.75v.443c-.795.077-1.584.176-2.365.298a.75.75 0 1 0 .23 1.482l.149-.022.841 10.518A2.75 2.75 0 0 0 7.596 19h4.807a2.75 2.75 0 0 0 2.742-2.53l.841-10.52.149.023a.75.75 0 0 0 .23-1.482A41.03 41.03 0 0 0 14 4.193V3.75A2.75 2.75 0 0 0 11.25 1h-2.5ZM10 4c.84 0 1.673.025 2.5.075V3.75c0-.69-.56-1.25-1.25-1.25h-2.5c-.69 0-1.25.56-1.25 1.25v.325C8.327 4.025 9.16 4 10 4ZM8.58 7.72a.75.75 0 0 0-1.5.06l.3 7.5a.75.75 0 1 0 1.5-.06l-.3-7.5Zm4.34.06a.75.75 0 1 0-1.5-.06l-.3 7.5a.75.75 0 1 0 1.5.06l.3-7.5Z" clipRule="evenodd" />
              </svg>
            </button>
          </li>
        ))}
      </ul>

      <div ref={loadMoreRef} className="mt-4 py-4">
        {isFetchingNextPage && (
          <div className="flex justify-center">
            <div
              className="h-5 w-5 animate-spin rounded-full border-2 border-border border-t-foreground"
              aria-label="Loading more"
            />
          </div>
        )}
        {!hasNextPage && allTodos.length > 0 && (
          <p className="text-center text-sm text-muted-foreground">All todos loaded</p>
        )}
      </div>
    </div>
  )
}
