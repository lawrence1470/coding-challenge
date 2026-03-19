import { Link } from '@tanstack/react-router'
import { Checkbox } from '@/components/atoms/checkbox'
import { formatTime } from '@/lib/utils'
import type { Todo } from '@/lib/types'

interface TodoItemProps {
  todo: Todo
  onToggle: () => void
  onDelete: () => void
  onPrefetch: () => void
  isDeleting: boolean
}

export function TodoItem({ todo, onToggle, onDelete, onPrefetch, isDeleting }: TodoItemProps) {
  return (
    <li
      className={`group flex items-center gap-3 rounded px-2 py-1.5 hover:bg-accent ${
        isDeleting ? 'pointer-events-none opacity-50' : ''
      }`}
      onMouseEnter={onPrefetch}
    >
      <Checkbox
        checked={todo.completed}
        onCheckedChange={onToggle}
        id={`todo-${todo.id}`}
        className="peer"
      />
      <Link
        to="/todos/$id"
        params={{ id: String(todo.id) }}
        className="relative flex-1 text-sm text-foreground peer-data-[state=checked]:text-muted-foreground after:absolute after:left-0 after:top-1/2 after:h-px after:w-full after:-translate-y-1/2 after:scale-x-0 after:bg-muted-foreground after:transition-transform after:duration-300 after:ease-in-out peer-data-[state=checked]:after:scale-x-100"
      >
        {todo.title}
      </Link>
      <time
        dateTime={todo.createdAt}
        className="shrink-0 text-xs text-muted-foreground"
      >
        {formatTime(todo.createdAt)}
      </time>
      <button
        onClick={onDelete}
        disabled={isDeleting}
        className="shrink-0 cursor-pointer text-muted-foreground opacity-0 transition-opacity hover:text-destructive group-hover:opacity-100 disabled:cursor-not-allowed"
        aria-label={`Delete "${todo.title}"`}
      >
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="h-4 w-4" aria-hidden="true">
          <title>Delete</title>
          <path fillRule="evenodd" d="M8.75 1A2.75 2.75 0 0 0 6 3.75v.443c-.795.077-1.584.176-2.365.298a.75.75 0 1 0 .23 1.482l.149-.022.841 10.518A2.75 2.75 0 0 0 7.596 19h4.807a2.75 2.75 0 0 0 2.742-2.53l.841-10.52.149.023a.75.75 0 0 0 .23-1.482A41.03 41.03 0 0 0 14 4.193V3.75A2.75 2.75 0 0 0 11.25 1h-2.5ZM10 4c.84 0 1.673.025 2.5.075V3.75c0-.69-.56-1.25-1.25-1.25h-2.5c-.69 0-1.25.56-1.25 1.25v.325C8.327 4.025 9.16 4 10 4ZM8.58 7.72a.75.75 0 0 0-1.5.06l.3 7.5a.75.75 0 1 0 1.5-.06l-.3-7.5Zm4.34.06a.75.75 0 1 0-1.5-.06l-.3 7.5a.75.75 0 1 0 1.5.06l.3-7.5Z" clipRule="evenodd" />
        </svg>
      </button>
    </li>
  )
}
