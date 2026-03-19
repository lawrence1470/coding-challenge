import { useState } from 'react'
import { DELETE_CONFIRMATION_TEXT } from '@/lib/constants'

interface ConfirmDeleteProps {
  onConfirm: () => void
  isLoading: boolean
  error?: string | null
}

export function ConfirmDelete({ onConfirm, isLoading, error }: ConfirmDeleteProps) {
  const [showConfirm, setShowConfirm] = useState(false)
  const [confirmText, setConfirmText] = useState('')

  function handleCancel() {
    setShowConfirm(false)
    setConfirmText('')
  }

  if (!showConfirm) {
    return (
      <button
        onClick={() => setShowConfirm(true)}
        className="rounded-lg border border-destructive/50 px-4 py-2 text-sm font-medium text-destructive transition-colors hover:bg-destructive/10"
      >
        Delete account
      </button>
    )
  }

  return (
    <div className="space-y-3">
      <p className="text-sm text-muted-foreground">
        Type <span className="font-mono font-semibold text-foreground">{DELETE_CONFIRMATION_TEXT}</span> to confirm.
      </p>
      <input
        type="text"
        value={confirmText}
        onChange={(e) => setConfirmText(e.target.value)}
        placeholder={DELETE_CONFIRMATION_TEXT}
        className="w-full rounded-lg border border-input bg-background px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-ring/20"
        autoFocus
      />
      {error && <p className="text-sm text-destructive">{error}</p>}
      <div className="flex gap-2">
        <button
          onClick={onConfirm}
          disabled={confirmText !== DELETE_CONFIRMATION_TEXT || isLoading}
          className="rounded-lg bg-destructive px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-destructive/90 disabled:cursor-not-allowed disabled:opacity-40"
        >
          {isLoading ? 'Deleting\u2026' : 'Confirm delete'}
        </button>
        <button
          onClick={handleCancel}
          disabled={isLoading}
          className="rounded-lg px-4 py-2 text-sm font-medium text-muted-foreground transition-colors hover:bg-accent hover:text-foreground disabled:opacity-40"
        >
          Cancel
        </button>
      </div>
    </div>
  )
}
