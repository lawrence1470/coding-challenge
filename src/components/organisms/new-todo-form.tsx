import { useState } from 'react'
import { useNavigate } from '@tanstack/react-router'
import { Link } from '@tanstack/react-router'
import { useForm } from 'react-hook-form'
import { useCreateTodo } from '@/hooks/use-todos'
import { ROUTE_TODOS } from '@/lib/constants'
import type { NewTodoFormValues } from '@/lib/types'
import { Button } from '@/components/atoms/button'
import { Input } from '@/components/atoms/input'
import { Textarea } from '@/components/atoms/textarea'
import { BackLink } from '@/components/atoms/back-link'
import { FormField } from '@/components/molecules/form-field'

export function NewTodoForm() {
  const navigate = useNavigate()
  const createMutation = useCreateTodo()
  const [createError, setCreateError] = useState<string | null>(null)

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
    setCreateError(null)
    createMutation.mutate(
      { title: trimmedTitle, description: data.description.trim() || null, completed: false },
      {
        onSuccess: () => navigate({ to: ROUTE_TODOS }),
        onError: (error) => setCreateError(error.message || 'Failed to create todo. Please try again.'),
      },
    )
  }

  return (
    <>
      <div className="mb-6">
        <BackLink to={ROUTE_TODOS}>&larr; Back to todos</BackLink>
      </div>

      <h1 className="mb-6 text-2xl font-bold">New Todo</h1>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <FormField label="Title" id="title" error={errors.title?.message}>
          <Input
            id="title"
            placeholder="What needs to be done?"
            autoFocus
            className="bg-secondary"
            aria-describedby={errors.title ? 'title-error' : undefined}
            {...register('title', { required: 'Title is required' })}
          />
        </FormField>

        <FormField label="Description" id="description" hint="(optional)">
          <Textarea
            id="description"
            placeholder="Add more details..."
            rows={3}
            className="bg-secondary resize-none"
            {...register('description')}
          />
        </FormField>

        {createError && (
          <p className="text-sm text-destructive" role="alert">{createError}</p>
        )}

        <div className="flex gap-3">
          <Button
            type="submit"
            disabled={createMutation.isPending}
          >
            {createMutation.isPending ? 'Creating...' : 'Create Todo'}
          </Button>
          <Button variant="outline" asChild>
            <Link to={ROUTE_TODOS}>Cancel</Link>
          </Button>
        </div>
      </form>
    </>
  )
}
