import { useNavigate } from '@tanstack/react-router'
import { authClient } from '@/lib/auth-client'
import { ROUTE_SIGN_IN } from '@/lib/constants'

export function SignOutButton() {
  const navigate = useNavigate()

  async function handleSignOut() {
    await authClient.signOut()
    navigate({ to: ROUTE_SIGN_IN })
  }

  return (
    <button
      onClick={handleSignOut}
      className="rounded-lg px-3 py-2 text-sm font-medium text-muted-foreground transition-colors hover:bg-accent hover:text-foreground"
    >
      Sign out
    </button>
  )
}
