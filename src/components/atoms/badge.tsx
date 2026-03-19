import { cn } from '@/lib/utils'
import { badgeVariants } from '@/lib/tokens'

interface BadgeProps {
  variant: keyof typeof badgeVariants
  children: React.ReactNode
  className?: string
}

export function Badge({ variant, children, className }: BadgeProps) {
  return (
    <span
      role="status"
      className={cn(
        'rounded-full px-2.5 py-0.5 text-xs font-medium',
        badgeVariants[variant],
        className,
      )}
    >
      {children}
    </span>
  )
}
