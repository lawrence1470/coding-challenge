import { useState } from 'react'
import { useNavigate } from '@tanstack/react-router'
import { Link } from '@tanstack/react-router'
import { authClient } from '@/lib/auth-client'
import { ROUTE_SIGN_IN, ROUTE_TODOS } from '@/lib/constants'
import { layout } from '@/lib/tokens'
import { SignOutButton } from '@/components/organisms/sign-out-button'
import { PageHeader } from '@/components/molecules/page-header'
import { ConfirmDelete } from '@/components/molecules/confirm-delete'
import { deleteUserAccount } from '@/server/auth'

interface SettingsPanelProps {
  user: {
    name: string
    email: string
    createdAt: string
  }
}

export function SettingsPanel({ user }: SettingsPanelProps) {
  const navigate = useNavigate()
  const [isDeleting, setIsDeleting] = useState(false)
  const [error, setError] = useState<string | null>(null)

  async function handleDelete() {
    setIsDeleting(true)
    setError(null)
    try {
      await deleteUserAccount()
      await authClient.signOut()
      navigate({ to: ROUTE_SIGN_IN })
    } catch {
      setError('Something went wrong. Please try again.')
      setIsDeleting(false)
    }
  }

  const memberSince = new Date(user.createdAt).toLocaleDateString('en-US', {
    month: 'long',
    year: 'numeric',
  })

  return (
    <main className={layout.pageContainer}>
      <PageHeader title="Settings">
        <Link
          to={ROUTE_TODOS}
          className="rounded-lg px-3 py-2 text-sm font-medium text-muted-foreground transition-colors hover:bg-accent hover:text-foreground"
        >
          Back to todos
        </Link>
        <SignOutButton />
      </PageHeader>

      <div className="space-y-6">
        <section className="rounded-xl border border-border bg-card p-6">
          <h2 className="mb-4 text-sm font-semibold uppercase tracking-wide text-muted-foreground">
            Account
          </h2>
          <div className="space-y-3">
            <div className="flex justify-between">
              <span className="text-sm text-muted-foreground">Name</span>
              <span className="text-sm">{user.name}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-sm text-muted-foreground">Email</span>
              <span className="text-sm">{user.email}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-sm text-muted-foreground">Member since</span>
              <span className="text-sm">{memberSince}</span>
            </div>
          </div>
        </section>

        <section className="rounded-xl border border-destructive/30 bg-card p-6">
          <h2 className="mb-1 text-sm font-semibold uppercase tracking-wide text-destructive">
            Danger Zone
          </h2>
          <p className="mb-4 text-sm text-muted-foreground">
            Permanently delete your account and all associated data. This cannot be undone.
          </p>
          <ConfirmDelete
            onConfirm={handleDelete}
            isLoading={isDeleting}
            error={error}
          />
        </section>
      </div>
    </main>
  )
}
