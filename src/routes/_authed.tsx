import { createFileRoute, Outlet, redirect } from '@tanstack/react-router'
import { getCurrentUser } from '@/server/auth'
import { ROUTE_SIGN_IN } from '@/lib/constants'

export const Route = createFileRoute('/_authed')({
  beforeLoad: async () => {
    const user = await getCurrentUser()
    if (!user) {
      throw redirect({ to: ROUTE_SIGN_IN })
    }
    return { user }
  },
  component: () => <Outlet />,
})
