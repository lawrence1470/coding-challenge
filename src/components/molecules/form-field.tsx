import type { ReactNode } from 'react'

interface FormFieldProps {
  label: string
  id: string
  error?: string
  hint?: string
  children: ReactNode
}

export function FormField({ label, id, error, hint, children }: FormFieldProps) {
  const errorId = `${id}-error`

  return (
    <div className="space-y-1.5">
      <label htmlFor={id} className="text-sm font-medium">
        {label}
        {hint && <span className="ml-1 text-xs font-normal text-muted-foreground">{hint}</span>}
      </label>
      {children}
      {error && (
        <p id={errorId} className="text-sm text-destructive">
          {error}
        </p>
      )}
    </div>
  )
}
