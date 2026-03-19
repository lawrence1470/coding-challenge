'use client'

import { useTodoDetail } from '@/hooks/use-todos'
import Link from 'next/link'

export function TodoDetail({ id }: { id: number }) {
  const { data: todo } = useTodoDetail(id)

  return (
    <div>
      <Link
        href="/todos"
        className="text-sm text-muted-foreground transition-colors hover:text-foreground"
      >
        &larr; Back to todos
      </Link>

      <div className="mt-6">
        <div className="flex items-center gap-3">
          <h1 className="text-2xl font-bold">{todo.title}</h1>
          <span
            className={`rounded-full px-2.5 py-0.5 text-xs font-medium ${
              todo.completed
                ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400'
                : 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400'
            }`}
          >
            {todo.completed ? 'Completed' : 'Pending'}
          </span>
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
          Created {new Date(todo.createdAt).toLocaleString()}
        </time>
      </div>
    </div>
  )
}
