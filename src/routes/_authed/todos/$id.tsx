import { Suspense } from 'react'
import { createFileRoute } from '@tanstack/react-router'
import { todoKeys } from '@/lib/query-keys'
import { layout } from '@/lib/tokens'
import { TodoDetail } from '@/components/organisms/todo-detail'
import { Spinner } from '@/components/atoms/spinner'
import { getTodoById } from '@/server/todos'

export const Route = createFileRoute('/_authed/todos/$id')({
  loader: async ({ context, params }) => {
    const todoId = Number(params.id)
    await context.queryClient.prefetchQuery({
      queryKey: todoKeys.detail(todoId),
      queryFn: () => getTodoById({ data: { id: todoId } }),
    })
  },
  component: TodoDetailPage,
})

function TodoDetailPage() {
  const { id } = Route.useParams()
  const todoId = Number(id)

  return (
    <main className={layout.pageContainer}>
      <Suspense
        fallback={
          <div className="flex justify-center py-12">
            <Spinner label="Loading" />
          </div>
        }
      >
        <TodoDetail id={todoId} />
      </Suspense>
    </main>
  )
}
