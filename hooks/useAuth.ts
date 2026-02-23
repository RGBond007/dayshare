'use client'

import { useState, useEffect } from 'react'
import { createClient } from '@/lib/supabase'
import type { Profile } from '@/lib/database.types'

export function useAuth() {
  const [user, setUser] = useState<{ id: string; email?: string } | null>(null)
  const [profile, setProfile] = useState<Profile | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const supabase = createClient()
    if (!supabase) {
      setLoading(false)
      return
    }

    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null)
      if (session?.user) {
        fetchProfile(session.user.id)
      } else {
        setLoading(false)
      }
    })

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null)
      if (session?.user) {
        fetchProfile(session.user.id)
      } else {
        setProfile(null)
        setLoading(false)
      }
    })

    return () => subscription.unsubscribe()
  }, [])

  async function fetchProfile(userId: string) {
    const supabase = createClient()
    if (!supabase) return
    try {
      const { data } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', userId)
        .single()
      setProfile(data)
    } catch {
      // ignore
    } finally {
      setLoading(false)
    }
  }

  async function signIn(email: string, password: string) {
    const supabase = createClient()
    if (!supabase) return { error: new Error('Supabase not configured') }
    return supabase.auth.signInWithPassword({ email, password })
  }

  async function signUp(email: string, password: string, fullName: string) {
    const supabase = createClient()
    if (!supabase) return { error: new Error('Supabase not configured') }
    return supabase.auth.signUp({
      email,
      password,
      options: { data: { full_name: fullName, display_name: fullName } },
    })
  }

  async function signOut() {
    const supabase = createClient()
    if (!supabase) return
    await supabase.auth.signOut()
  }

  return { user, profile, loading, signIn, signUp, signOut }
}
