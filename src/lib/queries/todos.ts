import { prisma } from '@/lib/db'

export async function findUserTodosPaginated(
  userId: string,
  page: number,
  limit: number,
) {
  return prisma.todo.findMany({
    where: { userId },
    orderBy: { id: 'desc' as const },
    skip: (page - 1) * limit,
    take: limit,
  })
}
