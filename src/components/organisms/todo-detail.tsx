import { useTodoDetail } from '@/hooks/use-todos'
import { ROUTE_TODOS } from '@/lib/constants'
import { formatDateTime } from '@/lib/utils'
import { Badge } from '@/components/atoms/badge'
import { BackLink } from '@/components/atoms/back-link'

export function TodoDetail({ id }: { id: number }) {
  const { data: todo } = useTodoDetail(id)

  return (
    <div>
      <BackLink to={ROUTE_TODOS}>&larr; Back to todos</BackLink>

      <div className="mt-6">
        <div className="flex items-center gap-3">
          <h1 className="text-2xl font-bold">{todo.title}</h1>
          <Badge variant={todo.completed ? 'success' : 'warning'}>
            {todo.completed ? 'Completed' : 'Pending'}
          </Badge>
        </div>

        {todo.description && (
          <p className="mt-4 text-sm text-muted-foreground leading-relaxed">
            {todo.description}
          </p>
        )}

        <time
          dateTime={todo.createdAt}
          className="mt-4 block text-xs text-muted-foreground"
        >
          Created {formatDateTime(todo.createdAt)}
        </time>
      </div>
    </div>
  )
}
