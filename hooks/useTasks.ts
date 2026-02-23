'use client'

import { useState, useEffect, useCallback } from 'react'
import { createClient } from '@/lib/supabase'
import type { Task } from '@/lib/database.types'

type TaskWithProfiles = Task & {
  profiles: { display_name: string | null; full_name: string | null } | null
  assigned_profile: { display_name: string | null; full_name: string | null } | null
}

export function useTasks() {
  const [tasks, setTasks] = useState<TaskWithProfiles[]>([])
  const [loading, setLoading] = useState(true)

  const fetchTasks = useCallback(async () => {
    const supabase = createClient()
    if (!supabase) { setLoading(false); return }
    try {
      const { data } = await supabase
        .from('tasks')
        .select('*, profiles!tasks_created_by_fkey(display_name, full_name), assigned_profile:profiles!tasks_assigned_to_fkey(display_name, full_name)')
        .order('created_at', { ascending: false })
      setTasks((data as TaskWithProfiles[]) || [])
    } catch {
      // ignore
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => { fetchTasks() }, [fetchTasks])

  async function createTask(task: {
    title: string
    description?: string
    assigned_to?: string
    priority?: string
    due_date?: string
    status?: string
  }) {
    const supabase = createClient()
    if (!supabase) return
    const { data: { session } } = await supabase.auth.getSession()
    if (!session) return
    await supabase.from('tasks').insert({ ...task, created_by: session.user.id })
    fetchTasks()
  }

  async function updateTask(id: string, updates: Partial<Task>) {
    const supabase = createClient()
    if (!supabase) return
    await supabase.from('tasks').update(updates).eq('id', id)
    fetchTasks()
  }

  async function deleteTask(id: string) {
    const supabase = createClient()
    if (!supabase) return
    await supabase.from('tasks').delete().eq('id', id)
    fetchTasks()
  }

  return { tasks, loading, createTask, updateTask, deleteTask, refetch: fetchTasks }
}
