'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { authClient } from '@/lib/auth-client'
import Link from 'next/link'
import { SignOutButton } from '@/components/sign-out-button'

interface SettingsClientProps {
  user: {
    name: string
    email: string
    createdAt: string
  }
}

export function SettingsClient({ user }: SettingsClientProps) {
  const router = useRouter()
  const [showConfirm, setShowConfirm] = useState(false)
  const [confirmText, setConfirmText] = useState('')
  const [isDeleting, setIsDeleting] = useState(false)
  const [error, setError] = useState<string | null>(null)

  async function handleDelete() {
    setIsDeleting(true)
    setError(null)
    try {
      const res = await fetch('/api/user', { method: 'DELETE' })
      if (!res.ok) throw new Error('Deletion failed')
      await authClient.signOut()
      router.push('/sign-in')
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
    <main className="mx-auto max-w-2xl px-4 py-8">
      <div className="mb-6 flex items-center justify-between">
        <h1 className="text-2xl font-bold">Settings</h1>
        <div className="flex items-center gap-2">
          <Link
            href="/todos"
            className="rounded-lg px-3 py-2 text-sm font-medium text-muted-foreground transition-colors hover:bg-accent hover:text-foreground"
          >
            Back to todos
          </Link>
          <SignOutButton />
        </div>
      </div>

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

          {!showConfirm ? (
            <button
              onClick={() => setShowConfirm(true)}
              className="rounded-lg border border-destructive/50 px-4 py-2 text-sm font-medium text-destructive transition-colors hover:bg-destructive/10"
            >
              Delete account
            </button>
          ) : (
            <div className="space-y-3">
              <p className="text-sm text-muted-foreground">
                Type <span className="font-mono font-semibold text-foreground">DELETE</span> to
                confirm.
              </p>
              <input
                type="text"
                value={confirmText}
                onChange={(e) => setConfirmText(e.target.value)}
                placeholder="DELETE"
                className="w-full rounded-lg border border-input bg-background px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-ring/20"
                autoFocus
              />
              {error && <p className="text-sm text-destructive">{error}</p>}
              <div className="flex gap-2">
                <button
                  onClick={handleDelete}
                  disabled={confirmText !== 'DELETE' || isDeleting}
                  className="rounded-lg bg-destructive px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-destructive/90 disabled:cursor-not-allowed disabled:opacity-40"
                >
                  {isDeleting ? 'Deleting…' : 'Confirm delete'}
                </button>
                <button
                  onClick={() => {
                    setShowConfirm(false)
                    setConfirmText('')
                    setError(null)
                  }}
                  disabled={isDeleting}
                  className="rounded-lg px-4 py-2 text-sm font-medium text-muted-foreground transition-colors hover:bg-accent hover:text-foreground disabled:opacity-40"
                >
                  Cancel
                </button>
              </div>
            </div>
          )}
        </section>
      </div>
    </main>
  )
}
