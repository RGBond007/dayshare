'use client'

import { useState, useEffect, useCallback } from 'react'
import { createClient } from '@/lib/supabase'
import type { Event } from '@/lib/database.types'

export function useEvents() {
  const [events, setEvents] = useState<Event[]>([])
  const [loading, setLoading] = useState(true)

  const fetchEvents = useCallback(async () => {
    const supabase = createClient()
    if (!supabase) { setLoading(false); return }
    try {
      const { data } = await supabase
        .from('events')
        .select('*')
        .order('start_time', { ascending: true })
      setEvents(data || [])
    } catch {
      // ignore
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => { fetchEvents() }, [fetchEvents])

  async function createEvent(event: {
    title: string
    description?: string
    start_time: string
    end_time: string
    location?: string
    color?: string
    all_day?: boolean
  }) {
    const supabase = createClient()
    if (!supabase) return
    const { data: { session } } = await supabase.auth.getSession()
    if (!session) return
    await supabase.from('events').insert({ ...event, created_by: session.user.id })
    fetchEvents()
  }

  async function deleteEvent(id: string) {
    const supabase = createClient()
    if (!supabase) return
    await supabase.from('events').delete().eq('id', id)
    fetchEvents()
  }

  return { events, loading, createEvent, deleteEvent, refetch: fetchEvents }
}
