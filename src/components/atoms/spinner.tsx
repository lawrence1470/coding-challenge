import { cn } from '@/lib/utils'

interface SpinnerProps {
  size?: 'sm' | 'md'
  label?: string
  className?: string
}

const sizeClasses = {
  sm: 'h-4 w-4',
  md: 'h-5 w-5',
}

export function Spinner({ size = 'md', label = 'Loading', className }: SpinnerProps) {
  return (
    <div
      className={cn(
        'animate-spin rounded-full border-2 border-border border-t-foreground',
        sizeClasses[size],
        className,
      )}
      aria-label={label}
      role="status"
    />
  )
}
