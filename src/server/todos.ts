import { createServerFn } from '@tanstack/react-start'
import { getRequest } from '@tanstack/react-start/server'
import { auth } from '@/lib/auth'
import { prisma } from '@/lib/db'
import { findUserTodosPaginated } from '@/lib/queries/todos'

async function requireUser() {
  const request = getRequest()
  const session = await auth.api.getSession({ headers: request.headers })
  if (!session?.user) throw new Error('Unauthorized')
  return session.user
}

export const getTodosPaginated = createServerFn({ method: 'GET' })
  .inputValidator((d: { page: number; limit: number }) => d)
  .handler(async ({ data }) => {
    const user = await requireUser()
    const todos = await findUserTodosPaginated(user.id, data.page, data.limit)
    return todos.map((t) => ({
      ...t,
      createdAt: t.createdAt.toISOString(),
    }))
  })

export const getTodoById = createServerFn({ method: 'GET' })
  .inputValidator((d: { id: number }) => d)
  .handler(async ({ data }) => {
    const user = await requireUser()
    const todo = await prisma.todo.findUnique({
      where: { id: data.id, userId: user.id },
    })
    if (!todo) throw new Error('Not found')
    return {
      ...todo,
      createdAt: todo.createdAt.toISOString(),
    }
  })

export const createTodoFn = createServerFn({ method: 'POST' })
  .inputValidator(
    (d: { title: string; description: string | null; completed: boolean }) => d,
  )
  .handler(async ({ data }) => {
    const user = await requireUser()
    if (!data.title?.trim()) throw new Error('Title is required')

    const todo = await prisma.todo.create({
      data: {
        title: data.title,
        description: data.description ?? null,
        completed: data.completed ?? false,
        userId: user.id,
      },
    })

    return {
      ...todo,
      createdAt: todo.createdAt.toISOString(),
    }
  })

export const deleteTodoFn = createServerFn({ method: 'POST' })
  .inputValidator((d: { id: number }) => d)
  .handler(async ({ data }) => {
    const user = await requireUser()
    await prisma.todo.delete({
      where: { id: data.id, userId: user.id },
    })
  })

export const toggleTodoFn = createServerFn({ method: 'POST' })
  .inputValidator((d: { id: number; completed: boolean }) => d)
  .handler(async ({ data }) => {
    const user = await requireUser()
    const todo = await prisma.todo.update({
      where: { id: data.id, userId: user.id },
      data: { completed: data.completed },
    })
    return {
      ...todo,
      createdAt: todo.createdAt.toISOString(),
    }
  })
