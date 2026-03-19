import { useState } from 'react'
import { useNavigate } from '@tanstack/react-router'
import { Link } from '@tanstack/react-router'
import { useForm } from 'react-hook-form'
import { authClient } from '@/lib/auth-client'
import { ROUTE_TODOS, PASSWORD_MIN_LENGTH, PARTICLES_QUANTITY, PARTICLES_EASE } from '@/lib/constants'
import type { AuthFormValues } from '@/lib/types'
import { Button } from '@/components/atoms/button'
import { Input } from '@/components/atoms/input'
import { Particles } from '@/components/atoms/particles'
import { FormField } from '@/components/molecules/form-field'
import { CheckSquareIcon } from 'lucide-react'

export default function SignInForm() {
  const navigate = useNavigate()
  const [mode, setMode] = useState<'signin' | 'signup'>('signin')
  const [serverError, setServerError] = useState('')

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<AuthFormValues>({
    defaultValues: { name: '', email: '', password: '' },
  })

  function switchMode(newMode: 'signin' | 'signup') {
    setMode(newMode)
    setServerError('')
    reset()
  }

  async function onSubmit(data: AuthFormValues) {
    setServerError('')

    if (mode === 'signin') {
      await authClient.signIn.email(
        { email: data.email, password: data.password },
        {
          onSuccess: () => navigate({ to: ROUTE_TODOS }),
          onError: (ctx) => setServerError(ctx.error.message),
        },
      )
    } else {
      await authClient.signUp.email(
        { name: data.name, email: data.email, password: data.password },
        {
          onSuccess: () => navigate({ to: ROUTE_TODOS }),
          onError: (ctx) => setServerError(ctx.error.message),
        },
      )
    }
  }

  return (
    <div className="relative md:h-screen md:overflow-hidden w-full">
      <Particles
        quantity={PARTICLES_QUANTITY}
        ease={PARTICLES_EASE}
        className="absolute inset-0"
      />
      <div
        aria-hidden
        className="absolute inset-0 isolate -z-10 contain-strict"
      >
        <div className="bg-[radial-gradient(68.54%_68.72%_at_55.02%_31.46%,--theme(--color-foreground/.06)_0,hsla(0,0%,55%,.02)_50%,--theme(--color-foreground/.01)_80%)] absolute top-0 left-0 h-320 w-140 -translate-y-87.5 -rotate-45 rounded-full" />
        <div className="bg-[radial-gradient(50%_50%_at_50%_50%,--theme(--color-foreground/.04)_0,--theme(--color-foreground/.01)_80%,transparent_100%)] absolute top-0 left-0 h-320 w-60 [translate:5%_-50%] -rotate-45 rounded-full" />
        <div className="bg-[radial-gradient(50%_50%_at_50%_50%,--theme(--color-foreground/.04)_0,--theme(--color-foreground/.01)_80%,transparent_100%)] absolute top-0 left-0 h-320 w-60 -translate-y-87.5 -rotate-45 rounded-full" />
      </div>

      <div className="relative mx-auto flex min-h-screen max-w-6xl flex-col justify-center px-4">
        <div className="mx-auto space-y-6 sm:w-sm">
          <div className="flex items-center gap-2">
            <CheckSquareIcon className="size-6" />
            <p className="text-xl font-semibold">TODO</p>
          </div>

          <div className="flex flex-col space-y-1">
            <h1 className="text-2xl font-bold tracking-wide">
              {mode === 'signin' ? 'Welcome back' : 'Create your account'}
            </h1>
            <p className="text-muted-foreground text-base">
              {mode === 'signin'
                ? 'Sign in to your TODO account.'
                : 'Sign up to start using TODO.'}
            </p>
          </div>

          <div role="tablist" className="flex gap-1 rounded-lg bg-muted p-1">
            <button
              type="button"
              role="tab"
              aria-selected={mode === 'signin'}
              onClick={() => switchMode('signin')}
              className={`flex-1 rounded-md px-3 py-1.5 text-sm font-medium transition-colors ${
                mode === 'signin'
                  ? 'bg-background text-foreground shadow-sm'
                  : 'text-muted-foreground hover:text-foreground'
              }`}
            >
              Sign In
            </button>
            <button
              type="button"
              role="tab"
              aria-selected={mode === 'signup'}
              onClick={() => switchMode('signup')}
              className={`flex-1 rounded-md px-3 py-1.5 text-sm font-medium transition-colors ${
                mode === 'signup'
                  ? 'bg-background text-foreground shadow-sm'
                  : 'text-muted-foreground hover:text-foreground'
              }`}
            >
              Sign Up
            </button>
          </div>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            {mode === 'signup' && (
              <FormField label="Name" id="name" error={errors.name?.message}>
                <Input
                  id="name"
                  placeholder="Your name"
                  aria-describedby={errors.name ? 'name-error' : undefined}
                  {...register('name', {
                    validate: (v) =>
                      mode === 'signup' && !v.trim() ? 'Name is required' : true,
                  })}
                />
              </FormField>
            )}

            <FormField label="Email" id="email" error={errors.email?.message}>
              <Input
                id="email"
                type="email"
                placeholder="you@example.com"
                aria-describedby={errors.email ? 'email-error' : undefined}
                {...register('email', { required: 'Email is required' })}
              />
            </FormField>

            <FormField label="Password" id="password" error={errors.password?.message}>
              <Input
                id="password"
                type="password"
                placeholder="••••••••"
                aria-describedby={errors.password ? 'password-error' : undefined}
                {...register('password', {
                  required: 'Password is required',
                  minLength: { value: PASSWORD_MIN_LENGTH, message: `Password must be at least ${PASSWORD_MIN_LENGTH} characters` },
                })}
              />
            </FormField>

            {serverError && <p className="text-sm text-destructive" role="alert">{serverError}</p>}

            <Button type="submit" size="lg" disabled={isSubmitting} className="w-full">
              {isSubmitting
                ? mode === 'signin'
                  ? 'Signing in\u2026'
                  : 'Creating account\u2026'
                : mode === 'signin'
                  ? 'Sign In'
                  : 'Create Account'}
            </Button>
          </form>

          <p className="text-muted-foreground text-sm">
            By continuing, you agree to our{' '}
            <Link
              to="/"
              className="hover:text-primary underline underline-offset-4"
            >
              Terms of Service
            </Link>{' '}
            and{' '}
            <Link
              to="/"
              className="hover:text-primary underline underline-offset-4"
            >
              Privacy Policy
            </Link>
            .
          </p>
        </div>
      </div>
    </div>
  )
}
