import { Link } from '@tanstack/react-router'
import type { ReactNode } from 'react'

interface BackLinkProps {
  to: string
  children: ReactNode
}

export function BackLink({ to, children }: BackLinkProps) {
  return (
    <Link
      to={to}
      className="text-sm text-muted-foreground transition-colors hover:text-foreground"
    >
      {children}
    </Link>
  )
}
