import { createFileRoute } from '@tanstack/react-router'
import { SettingsPanel } from '@/components/organisms/settings-panel'

export const Route = createFileRoute('/_authed/settings')({
  component: SettingsPage,
})

function SettingsPage() {
  const { user } = Route.useRouteContext()

  return (
    <SettingsPanel
      user={{
        name: user.name,
        email: user.email,
        createdAt: typeof user.createdAt === 'string' ? user.createdAt : new Date(user.createdAt).toISOString(),
      }}
    />
  )
}
