import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/db'
import { getUser } from '@/lib/auth'

export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  const user = await getUser()
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const { id } = await params
  const numId = Number(id)
  if (isNaN(numId)) return NextResponse.json({ error: 'Invalid ID' }, { status: 400 })

  const todo = await prisma.todo.findUnique({
    where: { id: numId, userId: user.id },
  })

  if (!todo) return NextResponse.json({ error: 'Not found' }, { status: 404 })

  return NextResponse.json(todo)
}

export async function PATCH(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  const user = await getUser()
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const { id } = await params
  const numId = Number(id)
  if (isNaN(numId)) return NextResponse.json({ error: 'Invalid ID' }, { status: 400 })

  const body = await _request.json()

  try {
    const todo = await prisma.todo.update({
      where: { id: numId, userId: user.id },
      data: {
        title: body.title,
        description: body.description,
        completed: body.completed,
      },
    })
    return NextResponse.json(todo)
  } catch (error) {
    if ((error as { code?: string }).code === 'P2025') {
      return NextResponse.json({ error: 'Not found' }, { status: 404 })
    }
    throw error
  }
}

export async function DELETE(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  const user = await getUser()
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const { id } = await params
  const numId = Number(id)
  if (isNaN(numId)) return NextResponse.json({ error: 'Invalid ID' }, { status: 400 })

  try {
    await prisma.todo.delete({
      where: { id: numId, userId: user.id },
    })
    return new NextResponse(null, { status: 204 })
  } catch (error) {
    if ((error as { code?: string }).code === 'P2025') {
      return NextResponse.json({ error: 'Not found' }, { status: 404 })
    }
    throw error
  }
}
