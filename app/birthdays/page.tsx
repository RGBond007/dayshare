'use client'

import { useState, useEffect } from 'react'
import { Plus, Cake, Heart, Gift } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { createClient, isSupabaseConfigured } from '@/lib/supabase'
import { getDaysUntil, calculateAge, formatDate } from '@/lib/utils'
import { toast } from 'sonner'
import type { Birthday } from '@/lib/database.types'

export default function BirthdaysPage() {
  const [birthdays, setBirthdays] = useState<Birthday[]>([])
  const [loading, setLoading] = useState(true)
  const [dialogOpen, setDialogOpen] = useState(false)
  const [form, setForm] = useState({ name: '', date: '', type: 'birthday', notes: '' })

  useEffect(() => {
    fetchBirthdays()
  }, [])

  async function fetchBirthdays() {
    const supabase = createClient()
    if (!supabase) { setLoading(false); return }
    try {
      const { data } = await supabase.from('birthdays').select('*').order('date')
      setBirthdays(data || [])
    } catch {
      // ignore
    } finally {
      setLoading(false)
    }
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!isSupabaseConfigured) { toast.error('Supabase not configured'); return }
    const supabase = createClient()
    if (!supabase) return
    try {
      const { data: { session } } = await supabase.auth.getSession()
      if (!session) { toast.error('Please sign in'); return }
      await supabase.from('birthdays').insert({
        name: form.name,
        date: form.date,
        type: form.type,
        notes: form.notes || undefined,
        created_by: session.user.id,
      })
      toast.success('Birthday added!')
      setDialogOpen(false)
      setForm({ name: '', date: '', type: 'birthday', notes: '' })
      fetchBirthdays()
    } catch {
      toast.error('Failed to add birthday')
    }
  }

  async function handleDelete(id: string) {
    const supabase = createClient()
    if (!supabase) return
    await supabase.from('birthdays').delete().eq('id', id)
    fetchBirthdays()
    toast.success('Removed')
  }

  async function fireConfetti() {
    if (typeof window === 'undefined') return
    try {
      const confetti = (await import('canvas-confetti')).default
      confetti({
        particleCount: 150,
        spread: 80,
        origin: { y: 0.6 },
        colors: ['#4A90D9', '#F5A623', '#5CB85C', '#E74C3C', '#9B59B6'],
      })
    } catch {
      // ignore
    }
  }

  const sortedBirthdays = [...birthdays]
    .map((b) => ({ ...b, daysUntil: getDaysUntil(b.date) }))
    .sort((a, b) => a.daysUntil - b.daysUntil)

  const getIcon = (type: string) => {
    if (type === 'anniversary') return <Heart className="h-5 w-5 text-pink-500" />
    if (type === 'other') return <Gift className="h-5 w-5 text-purple-500" />
    return <Cake className="h-5 w-5 text-[#F5A623]" />
  }

  return (
    <div className="max-w-3xl mx-auto px-4 py-8">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold">Birthdays & Anniversaries 🎂</h1>
        <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
          <DialogTrigger asChild>
            <Button className="gap-2">
              <Plus className="h-4 w-4" />
              Add
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Add Birthday / Anniversary</DialogTitle>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <Label htmlFor="bdayName">Name *</Label>
                <Input
                  id="bdayName"
                  value={form.name}
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                  placeholder="Person's name"
                  required
                />
              </div>
              <div>
                <Label htmlFor="bdayDate">Date *</Label>
                <Input
                  id="bdayDate"
                  type="date"
                  value={form.date}
                  onChange={(e) => setForm({ ...form, date: e.target.value })}
                  required
                />
              </div>
              <div>
                <Label>Type</Label>
                <Select value={form.type} onValueChange={(v) => setForm({ ...form, type: v })}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="birthday">🎂 Birthday</SelectItem>
                    <SelectItem value="anniversary">❤️ Anniversary</SelectItem>
                    <SelectItem value="other">🎁 Other</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label htmlFor="bdayNotes">Notes</Label>
                <Input
                  id="bdayNotes"
                  value={form.notes}
                  onChange={(e) => setForm({ ...form, notes: e.target.value })}
                  placeholder="Optional note"
                />
              </div>
              <div className="flex gap-2 justify-end">
                <Button type="button" variant="outline" onClick={() => setDialogOpen(false)}>Cancel</Button>
                <Button type="submit">Add</Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      {loading ? (
        <div className="space-y-3">
          {[1, 2, 3].map((i) => <div key={i} className="h-20 rounded-xl bg-gray-100 animate-pulse" />)}
        </div>
      ) : sortedBirthdays.length === 0 ? (
        <Card>
          <CardContent className="p-8 text-center text-gray-500">
            <p className="text-4xl mb-2">🎂</p>
            <p className="font-medium">No birthdays added yet</p>
            <p className="text-sm mt-1">Add family birthdays and anniversaries!</p>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-3">
          {sortedBirthdays.map((b) => {
            const isToday = b.daysUntil === 0
            const age = b.type === 'birthday' ? calculateAge(b.date) : null
            return (
              <Card
                key={b.id}
                className={`transition-all ${isToday ? 'border-[#F5A623] bg-[#F5A623]/5 shadow-md' : ''}`}
              >
                <CardContent className="p-4">
                  <div className="flex items-center gap-3">
                    <div className="flex-shrink-0">
                      {getIcon(b.type)}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="font-semibold">{b.name}</span>
                        {isToday && (
                          <button
                            onClick={fireConfetti}
                            className="text-xs bg-[#F5A623] text-white px-2 py-0.5 rounded-full font-bold animate-bounce"
                          >
                            🎉 TODAY!
                          </button>
                        )}
                        <Badge variant="outline" className="text-xs capitalize">{b.type}</Badge>
                      </div>
                      <div className="flex items-center gap-3 mt-1">
                        <span className="text-sm text-gray-500">{formatDate(b.date)}</span>
                        {age !== null && age >= 0 && (
                          <span className="text-sm text-gray-500">
                            {isToday ? `Turning ${age + 1}!` : `Age ${age}`}
                          </span>
                        )}
                        {b.notes && <span className="text-xs text-gray-400 truncate">{b.notes}</span>}
                      </div>
                    </div>
                    <div className="flex items-center gap-3 flex-shrink-0">
                      <div className={`text-center min-w-[3rem] ${isToday ? 'text-[#F5A623]' : 'text-gray-500'}`}>
                        <div className="text-xl font-bold">{b.daysUntil}</div>
                        <div className="text-xs">days</div>
                      </div>
                      <Button
                        variant="ghost"
                        size="sm"
                        className="text-gray-400 hover:text-red-500 h-8 w-8 p-0"
                        onClick={() => handleDelete(b.id)}
                      >
                        ×
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )
          })}
        </div>
      )}
    </div>
  )
}
