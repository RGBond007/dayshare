'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { useAuth } from '@/hooks/useAuth'
import { isSupabaseConfigured } from '@/lib/supabase'
import { toast } from 'sonner'

export default function LoginPage() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [fullName, setFullName] = useState('')
  const [isSignUp, setIsSignUp] = useState(false)
  const [loading, setLoading] = useState(false)
  const { signIn, signUp } = useAuth()
  const router = useRouter()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!isSupabaseConfigured) {
      toast.error('Supabase is not configured. Please add your credentials.')
      return
    }
    setLoading(true)
    try {
      if (isSignUp) {
        const { error } = await signUp(email, password, fullName)
        if (error) throw error
        toast.success('Account created! Please check your email to verify.')
      } else {
        const { error } = await signIn(email, password)
        if (error) throw error
        toast.success('Welcome back!')
        router.push('/')
      }
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'Authentication failed'
      toast.error(message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#F9F7F4] px-4">
      <div className="w-full max-w-md">
        {/* Logo */}
        <div className="text-center mb-8">
          <div className="text-6xl mb-4">🏠</div>
          <h1 className="text-3xl font-bold text-[#4A90D9]">DayShare</h1>
          <p className="text-gray-500 mt-2">Your family hub, all in one place</p>
        </div>

        <Card className="shadow-lg">
          <CardHeader>
            <CardTitle>{isSignUp ? 'Create an account' : 'Welcome back'}</CardTitle>
            <CardDescription>
              {isSignUp
                ? 'Join your family hub today'
                : 'Sign in to your DayShare account'}
            </CardDescription>
          </CardHeader>
          <CardContent>
            {!isSupabaseConfigured && (
              <div className="mb-4 p-3 bg-amber-50 border border-amber-200 rounded-md">
                <p className="text-amber-800 text-sm font-medium">Demo Mode</p>
                <p className="text-amber-700 text-xs mt-1">
                  Configure Supabase in .env.local to enable authentication.
                </p>
              </div>
            )}
            <form onSubmit={handleSubmit} className="space-y-4">
              {isSignUp && (
                <div className="space-y-1">
                  <Label htmlFor="fullName">Full Name</Label>
                  <Input
                    id="fullName"
                    type="text"
                    placeholder="John Smith"
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    required={isSignUp}
                  />
                </div>
              )}
              <div className="space-y-1">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="you@family.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>
              <div className="space-y-1">
                <Label htmlFor="password">Password</Label>
                <Input
                  id="password"
                  type="password"
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
              </div>
              <Button
                type="submit"
                className="w-full bg-[#4A90D9] hover:bg-[#3a7bc8]"
                disabled={loading}
              >
                {loading ? 'Loading...' : isSignUp ? 'Create Account' : 'Sign In'}
              </Button>
            </form>

            <div className="mt-4 text-center">
              <button
                onClick={() => setIsSignUp(!isSignUp)}
                className="text-sm text-[#4A90D9] hover:underline"
              >
                {isSignUp
                  ? 'Already have an account? Sign in'
                  : "Don't have an account? Sign up"}
              </button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
