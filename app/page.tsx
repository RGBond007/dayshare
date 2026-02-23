'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { CalendarPlus, PenSquare, CheckSquare, Users } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { FamilyMemberCard } from '@/components/ui/FamilyMemberCard'
import { createClient, isSupabaseConfigured } from '@/lib/supabase'
import { getTimeGreeting, getDaysUntil, formatDate } from '@/lib/utils'
import type { Profile, Birthday, Task } from '@/lib/database.types'

export default function DashboardPage() {
  const [profiles, setProfiles] = useState<Profile[]>([])
  const [birthdays, setBirthdays] = useState<Birthday[]>([])
  const [pendingTasks, setPendingTasks] = useState<Task[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!isSupabaseConfigured) {
      setLoading(false)
      return
    }
    const fetchData = async () => {
      const supabase = createClient()
      if (!supabase) { setLoading(false); return }
      try {
        const [{ data: profilesData }, { data: birthdaysData }, { data: tasksData }] = await Promise.all([
          supabase.from('profiles').select('*').limit(10),
          supabase.from('birthdays').select('*').order('date'),
          supabase.from('tasks').select('*').eq('status', 'pending').limit(5),
        ])
        setProfiles(profilesData || [])
        setBirthdays(birthdaysData || [])
        setPendingTasks(tasksData || [])
      } catch {
        // ignore
      } finally {
        setLoading(false)
      }
    }
    fetchData()
  }, [])

  const today = new Date()
  const greeting = getTimeGreeting()

  const upcomingBirthdays = birthdays
    .map((b) => ({ ...b, daysUntil: getDaysUntil(b.date) }))
    .sort((a, b) => a.daysUntil - b.daysUntil)
    .slice(0, 5)

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-[#2D2D2D]">
          {greeting}, Family! 👋
        </h1>
        <p className="text-gray-500 mt-1">
          {formatDate(today)} · Welcome to your family hub
        </p>
      </div>

      {/* Quick Actions */}
      <div className="flex flex-wrap gap-3 mb-8">
        <Link href="/calendar">
          <Button className="gap-2 bg-[#4A90D9] hover:bg-[#3a7bc8]">
            <CalendarPlus className="h-4 w-4" />
            Add Event
          </Button>
        </Link>
        <Link href="/feed">
          <Button variant="outline" className="gap-2">
            <PenSquare className="h-4 w-4" />
            New Post
          </Button>
        </Link>
        <Link href="/tasks">
          <Button variant="outline" className="gap-2">
            <CheckSquare className="h-4 w-4" />
            Add Task
          </Button>
        </Link>
      </div>

      {!isSupabaseConfigured && (
        <Card className="mb-8 border-amber-200 bg-amber-50">
          <CardContent className="p-4">
            <p className="text-amber-800 font-medium">⚙️ Setup Required</p>
            <p className="text-amber-700 text-sm mt-1">
              Connect your Supabase database to get started. Copy <code>.env.local.example</code> to <code>.env.local</code> and add your credentials.
            </p>
          </CardContent>
        </Card>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Family Members */}
        <div className="lg:col-span-2">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-semibold flex items-center gap-2">
              <Users className="h-5 w-5 text-[#4A90D9]" />
              Family Members
            </h2>
          </div>
          {loading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {[1, 2, 3, 4].map((i) => (
                <div key={i} className="h-28 rounded-xl bg-gray-100 animate-pulse" />
              ))}
            </div>
          ) : profiles.length === 0 ? (
            <Card>
              <CardContent className="p-8 text-center text-gray-500">
                <p className="text-4xl mb-2">👨‍👩‍👧‍👦</p>
                <p className="font-medium">No family members yet</p>
                <p className="text-sm mt-1">Invite your family to join DayShare!</p>
              </CardContent>
            </Card>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {profiles.map((profile) => (
                <FamilyMemberCard key={profile.id} profile={profile} />
              ))}
            </div>
          )}
        </div>

        {/* Right Column */}
        <div className="space-y-6">
          {/* Upcoming Birthdays */}
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-base flex items-center gap-2">
                🎂 Upcoming Birthdays
              </CardTitle>
            </CardHeader>
            <CardContent className="pt-0">
              {upcomingBirthdays.length === 0 ? (
                <p className="text-sm text-gray-500">No upcoming birthdays</p>
              ) : (
                <div className="space-y-2">
                  {upcomingBirthdays.map((b) => (
                    <div key={b.id} className="flex items-center justify-between text-sm">
                      <span className="font-medium">{b.name}</span>
                      <span className={`text-xs px-2 py-0.5 rounded-full ${
                        b.daysUntil === 0
                          ? 'bg-[#F5A623]/20 text-[#F5A623] font-bold'
                          : 'bg-gray-100 text-gray-600'
                      }`}>
                        {b.daysUntil === 0 ? '🎉 Today!' : `${b.daysUntil}d`}
                      </span>
                    </div>
                  ))}
                </div>
              )}
              <Link href="/birthdays" className="block mt-3">
                <Button variant="ghost" size="sm" className="w-full text-[#4A90D9]">
                  View all
                </Button>
              </Link>
            </CardContent>
          </Card>

          {/* Pending Tasks */}
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-base flex items-center gap-2">
                ✅ Pending Tasks
              </CardTitle>
            </CardHeader>
            <CardContent className="pt-0">
              {pendingTasks.length === 0 ? (
                <p className="text-sm text-gray-500">All tasks complete! 🎉</p>
              ) : (
                <div className="space-y-2">
                  {pendingTasks.map((task) => (
                    <div key={task.id} className="flex items-center gap-2 text-sm">
                      <span className={`w-2 h-2 rounded-full flex-shrink-0 ${
                        task.priority === 'high' ? 'bg-red-500' :
                        task.priority === 'medium' ? 'bg-amber-500' : 'bg-green-500'
                      }`} />
                      <span className="truncate">{task.title}</span>
                    </div>
                  ))}
                </div>
              )}
              <Link href="/tasks" className="block mt-3">
                <Button variant="ghost" size="sm" className="w-full text-[#4A90D9]">
                  View all tasks
                </Button>
              </Link>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
