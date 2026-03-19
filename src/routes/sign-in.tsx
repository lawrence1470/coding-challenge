import { createFileRoute, redirect } from '@tanstack/react-router'
import { getCurrentUser } from '@/server/auth'
import { ROUTE_TODOS } from '@/lib/constants'
import SignInForm from '@/components/organisms/sign-in-form'

export const Route = createFileRoute('/sign-in')({
  beforeLoad: async () => {
    const user = await getCurrentUser()
    if (user) {
      throw redirect({ to: ROUTE_TODOS })
    }
  },
  component: SignInPage,
})

function SignInPage() {
  return <SignInForm />
}
