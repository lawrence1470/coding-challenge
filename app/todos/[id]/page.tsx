import { Suspense } from 'react'
import {
  dehydrate,
  HydrationBoundary,
  QueryClient,
} from '@tanstack/react-query'
import { todoKeys } from '@/lib/query-keys'
import { prisma } from '@/lib/db'
import { auth } from '@/lib/auth'
import { headers } from 'next/headers'
import { redirect, notFound } from 'next/navigation'
import { TodoDetail } from './todo-detail'

export default async function TodoDetailPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const session = await auth.api.getSession({ headers: await headers() })
  if (!session) redirect('/sign-in')

  const { id } = await params
  const todoId = Number(id)

  const queryClient = new QueryClient()

  const todo = await prisma.todo.findUnique({
    where: { id: todoId, userId: session.user.id },
  })

  if (!todo) notFound()

  await queryClient.prefetchQuery({
    queryKey: todoKeys.detail(todoId),
    queryFn: () => ({
      ...todo,
      createdAt: todo.createdAt.toISOString(),
    }),
  })

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <main className="mx-auto max-w-2xl px-4 py-8">
        <Suspense
          fallback={
            <div className="flex justify-center py-12">
              <div
                className="h-5 w-5 animate-spin rounded-full border-2 border-border border-t-foreground"
                aria-label="Loading"
              />
            </div>
          }
        >
          <TodoDetail id={todoId} />
        </Suspense>
      </main>
    </HydrationBoundary>
  )
}
