import { createServerFn } from '@tanstack/react-start'
import { getRequest } from '@tanstack/react-start/server'
import { auth } from '@/lib/auth'

export const getCurrentUser = createServerFn({ method: 'GET' }).handler(
  async () => {
    const request = getRequest()
    const session = await auth.api.getSession({ headers: request.headers })
    return session?.user ?? null
  },
)

export const deleteUserAccount = createServerFn({ method: 'POST' }).handler(
  async () => {
    const request = getRequest()
    const session = await auth.api.getSession({ headers: request.headers })
    if (!session?.user) {
      throw new Error('Unauthorized')
    }

    const { prisma } = await import('@/lib/db')
    await prisma.user.delete({ where: { id: session.user.id } })

    return { success: true }
  },
)
