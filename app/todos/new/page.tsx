'use client'

import { useRouter } from 'next/navigation'
import { useForm } from 'react-hook-form'
import { useCreateTodo } from '@/hooks/use-todos'
import Link from 'next/link'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Button } from '@/components/ui/button'

interface NewTodoFormValues {
  title: string
  description: string
}

export default function NewTodoPage() {
  const router = useRouter()
  const createMutation = useCreateTodo()

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<NewTodoFormValues>({
    defaultValues: { title: '', description: '' },
  })

  function onSubmit(data: NewTodoFormValues) {
    const trimmedTitle = data.title.trim()
    if (!trimmedTitle) return
    createMutation.mutate(
      { title: trimmedTitle, description: data.description.trim() || null, completed: false },
      {
        onSuccess: () => router.push('/todos'),
        onError: (error) => console.error('Create todo failed:', error),
      },
    )
  }

  return (
    <main className="mx-auto max-w-2xl px-4 py-8">
      <div className="mb-6">
        <Link
          href="/todos"
          className="text-sm text-muted-foreground transition-colors hover:text-foreground"
        >
          &larr; Back to todos
        </Link>
      </div>

      <h1 className="mb-6 text-2xl font-bold">New Todo</h1>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <div>
          <label htmlFor="title" className="mb-1 block text-sm font-medium text-muted-foreground">
            Title
          </label>
          <Input
            id="title"
            placeholder="What needs to be done?"
            autoFocus
            className="bg-secondary"
            {...register('title', { required: 'Title is required' })}
          />
          {errors.title && (
            <p className="mt-1 text-sm text-destructive">{errors.title.message}</p>
          )}
        </div>

        <div>
          <label htmlFor="description" className="mb-1 block text-sm font-medium text-muted-foreground">
            Description <span className="text-xs font-normal">(optional)</span>
          </label>
          <Textarea
            id="description"
            placeholder="Add more details..."
            rows={3}
            className="bg-secondary resize-none"
            {...register('description')}
          />
        </div>

        <div className="flex gap-3">
          <Button
            type="submit"
            disabled={createMutation.isPending}
          >
            {createMutation.isPending ? 'Creating...' : 'Create Todo'}
          </Button>
          <Button variant="outline" asChild>
            <Link href="/todos">Cancel</Link>
          </Button>
        </div>
      </form>
    </main>
  )
}
