'use client'

import { useState } from 'react'
import { Calendar as BigCalendar, dateFnsLocalizer, View } from 'react-big-calendar'
import { format, parse, startOfWeek, getDay } from 'date-fns'
import { enUS } from 'date-fns/locale'
import 'react-big-calendar/lib/css/react-big-calendar.css'
import { Plus } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { useEvents } from '@/hooks/useEvents'
import { isSupabaseConfigured } from '@/lib/supabase'
import { toast } from 'sonner'

const locales = { 'en-US': enUS }
const localizer = dateFnsLocalizer({
  format,
  parse,
  startOfWeek,
  getDay,
  locales,
})

const EVENT_COLORS = ['#4A90D9', '#F5A623', '#5CB85C', '#E74C3C', '#9B59B6', '#1ABC9C']

export default function CalendarPage() {
  const { events, loading, createEvent } = useEvents()
  const [view, setView] = useState<View>('month')
  const [date, setDate] = useState(new Date())
  const [dialogOpen, setDialogOpen] = useState(false)
  const [form, setForm] = useState({
    title: '',
    description: '',
    start_time: '',
    end_time: '',
    location: '',
    color: '#4A90D9',
    all_day: false,
  })

  const calendarEvents = events.map((e) => ({
    id: e.id,
    title: e.title,
    start: new Date(e.start_time),
    end: new Date(e.end_time),
    allDay: e.all_day || false,
    resource: { color: e.color ?? undefined, location: e.location ?? undefined },
  }))

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!isSupabaseConfigured) { toast.error('Supabase not configured'); return }
    try {
      await createEvent({
        title: form.title,
        description: form.description || undefined,
        start_time: form.start_time,
        end_time: form.end_time || form.start_time,
        location: form.location || undefined,
        color: form.color,
        all_day: form.all_day,
      })
      toast.success('Event added!')
      setDialogOpen(false)
      setForm({ title: '', description: '', start_time: '', end_time: '', location: '', color: '#4A90D9', all_day: false })
    } catch {
      toast.error('Failed to add event')
    }
  }

  const eventStyleGetter = (event: { resource?: { color?: string } }) => ({
    style: {
      backgroundColor: event.resource?.color || '#4A90D9',
      borderRadius: '4px',
      border: 'none',
      color: 'white',
      fontSize: '12px',
    },
  })

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold">Family Calendar 📅</h1>
        <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
          <DialogTrigger asChild>
            <Button className="gap-2">
              <Plus className="h-4 w-4" />
              Add Event
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Add New Event</DialogTitle>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <Label htmlFor="title">Title *</Label>
                <Input
                  id="title"
                  value={form.title}
                  onChange={(e) => setForm({ ...form, title: e.target.value })}
                  placeholder="Event title"
                  required
                />
              </div>
              <div>
                <Label htmlFor="description">Description</Label>
                <Input
                  id="description"
                  value={form.description}
                  onChange={(e) => setForm({ ...form, description: e.target.value })}
                  placeholder="Optional description"
                />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <Label htmlFor="start">Start *</Label>
                  <Input
                    id="start"
                    type="datetime-local"
                    value={form.start_time}
                    onChange={(e) => setForm({ ...form, start_time: e.target.value })}
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="end">End</Label>
                  <Input
                    id="end"
                    type="datetime-local"
                    value={form.end_time}
                    onChange={(e) => setForm({ ...form, end_time: e.target.value })}
                  />
                </div>
              </div>
              <div>
                <Label htmlFor="location">Location</Label>
                <Input
                  id="location"
                  value={form.location}
                  onChange={(e) => setForm({ ...form, location: e.target.value })}
                  placeholder="Optional location"
                />
              </div>
              <div>
                <Label>Color</Label>
                <div className="flex gap-2 mt-1">
                  {EVENT_COLORS.map((color) => (
                    <button
                      key={color}
                      type="button"
                      onClick={() => setForm({ ...form, color })}
                      className={`w-7 h-7 rounded-full transition-transform ${form.color === color ? 'scale-125 ring-2 ring-offset-1 ring-gray-400' : ''}`}
                      style={{ backgroundColor: color }}
                    />
                  ))}
                </div>
              </div>
              <div className="flex items-center gap-2">
                <input
                  type="checkbox"
                  id="allDay"
                  checked={form.all_day}
                  onChange={(e) => setForm({ ...form, all_day: e.target.checked })}
                  className="rounded"
                />
                <Label htmlFor="allDay">All day event</Label>
              </div>
              <div className="flex gap-2 justify-end">
                <Button type="button" variant="outline" onClick={() => setDialogOpen(false)}>
                  Cancel
                </Button>
                <Button type="submit">Add Event</Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      {!isSupabaseConfigured && (
        <div className="mb-4 p-3 bg-amber-50 border border-amber-200 rounded text-sm text-amber-700">
          Demo mode - configure Supabase to save events
        </div>
      )}

      <div className="bg-white rounded-xl border shadow-sm p-4" style={{ height: 600 }}>
        {loading ? (
          <div className="h-full flex items-center justify-center text-gray-400">Loading calendar...</div>
        ) : (
          <BigCalendar
            localizer={localizer}
            events={calendarEvents}
            startAccessor="start"
            endAccessor="end"
            view={view}
            onView={setView}
            date={date}
            onNavigate={setDate}
            eventPropGetter={eventStyleGetter}
            style={{ height: '100%' }}
          />
        )}
      </div>
    </div>
  )
}
