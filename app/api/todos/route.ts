import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/db'
import { getUser } from '@/lib/auth'

export async function GET(request: NextRequest) {
  const user = await getUser()
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const { searchParams } = request.nextUrl
  const page = Number(searchParams.get('page') ?? 1)
  const limit = Number(searchParams.get('limit') ?? 10)

  const todos = await prisma.todo.findMany({
    where: { userId: user.id },
    orderBy: { id: 'desc' },
    skip: (page - 1) * limit,
    take: limit,
  })

  return NextResponse.json(todos)
}

export async function POST(request: NextRequest) {
  const user = await getUser()
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const body = await request.json()

  if (!body.title || typeof body.title !== 'string' || !body.title.trim()) {
    return NextResponse.json({ error: 'Title is required' }, { status: 400 })
  }

  const todo = await prisma.todo.create({
    data: {
      title: body.title,
      description: body.description ?? null,
      completed: body.completed ?? false,
      userId: user.id,
    },
  })

  return NextResponse.json(todo, { status: 201 })
}
