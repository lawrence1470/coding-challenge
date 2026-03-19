import { createFileRoute } from '@tanstack/react-router'
import { layout } from '@/lib/tokens'
import { NewTodoForm } from '@/components/organisms/new-todo-form'

export const Route = createFileRoute('/_authed/todos/new')({
  component: NewTodoPage,
})

function NewTodoPage() {
  return (
    <main className={layout.pageContainer}>
      <NewTodoForm />
    </main>
  )
}
