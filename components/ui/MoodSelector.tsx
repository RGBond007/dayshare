'use client'

import { useState } from 'react'
import { cn } from '@/lib/utils'

const moods = [
  { emoji: '😊', label: 'Happy' },
  { emoji: '😴', label: 'Tired' },
  { emoji: '🤔', label: 'Thinking' },
  { emoji: '😎', label: 'Cool' },
  { emoji: '🥳', label: 'Excited' },
  { emoji: '😢', label: 'Sad' },
  { emoji: '😤', label: 'Busy' },
  { emoji: '🤒', label: 'Sick' },
  { emoji: '😌', label: 'Calm' },
  { emoji: '🔥', label: 'Motivated' },
]

interface MoodSelectorProps {
  value?: string
  onChange?: (mood: string) => void
  className?: string
}

export function MoodSelector({ value, onChange, className }: MoodSelectorProps) {
  const [selected, setSelected] = useState(value || '😊')

  const handleSelect = (emoji: string) => {
    setSelected(emoji)
    onChange?.(emoji)
  }

  return (
    <div className={cn('flex flex-wrap gap-2', className)}>
      {moods.map(({ emoji, label }) => (
        <button
          key={emoji}
          title={label}
          onClick={() => handleSelect(emoji)}
          className={cn(
            'text-2xl p-2 rounded-lg transition-all hover:scale-110',
            selected === emoji
              ? 'bg-[#4A90D9]/20 ring-2 ring-[#4A90D9]'
              : 'hover:bg-gray-100'
          )}
        >
          {emoji}
        </button>
      ))}
    </div>
  )
}
