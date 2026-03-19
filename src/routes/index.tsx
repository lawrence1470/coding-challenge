import { createFileRoute, redirect } from '@tanstack/react-router'
import { ROUTE_TODOS } from '@/lib/constants'

export const Route = createFileRoute('/')({
  beforeLoad: () => {
    throw redirect({ to: ROUTE_TODOS })
  },
  component: () => null,
})
