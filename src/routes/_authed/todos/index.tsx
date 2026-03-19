import { createFileRoute } from '@tanstack/react-router'
import { Link } from '@tanstack/react-router'
import { SETTINGS_ICON_SIZE } from '@/lib/constants'
import { layout } from '@/lib/tokens'
import { TodoList } from '@/components/organisms/todo-list'
import { todosInfiniteQueryOptions } from '@/hooks/use-todos'
import { Settings } from 'lucide-react'

export const Route = createFileRoute('/_authed/todos/')({
  loader: async ({ context }) => {
    await context.queryClient.prefetchInfiniteQuery(todosInfiniteQueryOptions)
  },
  component: TodosPage,
})

function TodosPage() {
  return (
    <main className={layout.pageContainer}>
      <div className="mb-6 flex items-center justify-between">
        <h1 className="text-2xl font-bold">Todos</h1>
        <div className="flex items-center gap-2">
          <Link
            to="/todos/new"
            className="rounded-lg bg-primary px-4 py-2 text-sm font-medium text-primary-foreground shadow-sm transition-colors hover:bg-primary/90 focus:outline-none focus:ring-2 focus:ring-ring/20"
          >
            New Todo
          </Link>
          <Link
            to="/settings"
            aria-label="Settings"
            className="rounded-lg p-2 text-muted-foreground transition-colors hover:bg-accent hover:text-foreground"
          >
            <Settings size={SETTINGS_ICON_SIZE} />
          </Link>
        </div>
      </div>
      <TodoList />
    </main>
  )
}
