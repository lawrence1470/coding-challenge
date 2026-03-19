import {
  dehydrate,
  HydrationBoundary,
  QueryClient,
} from '@tanstack/react-query'
import { todoKeys } from '@/lib/query-keys'
import { PAGE_SIZE } from '@/lib/constants'
import { prisma } from '@/lib/db'
import { auth } from '@/lib/auth'
import { headers } from 'next/headers'
import { redirect } from 'next/navigation'
import { TodoList } from './todo-list'
import Link from 'next/link'
import { Settings } from 'lucide-react'

export default async function TodosPage() {
  const session = await auth.api.getSession({ headers: await headers() })
  if (!session) redirect('/sign-in')

  const queryClient = new QueryClient()

  await queryClient.prefetchInfiniteQuery({
    queryKey: todoKeys.infinite(),
    queryFn: async ({ pageParam }) => {
      const todos = await prisma.todo.findMany({
        where: { userId: session.user.id },
        orderBy: { id: 'desc' },
        skip: (pageParam - 1) * PAGE_SIZE,
        take: PAGE_SIZE,
      })
      return todos.map((t) => ({
        ...t,
        createdAt: t.createdAt.toISOString(),
      }))
    },
    initialPageParam: 1,
  })

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <main className="mx-auto max-w-2xl px-4 py-8">
        <div className="mb-6 flex items-center justify-between">
          <h1 className="text-2xl font-bold">Todos</h1>
          <div className="flex items-center gap-2">
            <Link
              href="/todos/new"
              className="rounded-lg bg-primary px-4 py-2 text-sm font-medium text-primary-foreground shadow-sm transition-colors hover:bg-primary/90 focus:outline-none focus:ring-2 focus:ring-ring/20"
            >
              New Todo
            </Link>
            <Link
              href="/settings"
              aria-label="Settings"
              className="rounded-lg p-2 text-muted-foreground transition-colors hover:bg-accent hover:text-foreground"
            >
              <Settings size={18} />
            </Link>
          </div>
        </div>
        <TodoList />
      </main>
    </HydrationBoundary>
  )
}
