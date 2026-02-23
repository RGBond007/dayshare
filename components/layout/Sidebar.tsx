'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { Home, MessageSquare, Calendar, CheckSquare, Gift, Image, Settings } from 'lucide-react'
import { cn } from '@/lib/utils'

const navItems = [
  { href: '/', label: 'Home', icon: Home },
  { href: '/feed', label: 'Family Feed', icon: MessageSquare },
  { href: '/calendar', label: 'Calendar', icon: Calendar },
  { href: '/tasks', label: 'Tasks', icon: CheckSquare },
  { href: '/birthdays', label: 'Birthdays', icon: Gift },
  { href: '/photos', label: 'Photos', icon: Image },
  { href: '/settings', label: 'Settings', icon: Settings },
]

export function Sidebar() {
  const pathname = usePathname()

  return (
    <aside className="hidden lg:flex flex-col w-64 min-h-screen border-r bg-white pt-4 pb-8">
      <div className="px-4 mb-6">
        <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider">Navigation</p>
      </div>
      <nav className="flex-1 px-2 space-y-1">
        {navItems.map(({ href, label, icon: Icon }) => (
          <Link key={href} href={href}>
            <div className={cn(
              'flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-colors',
              pathname === href
                ? 'bg-[#4A90D9]/10 text-[#4A90D9]'
                : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
            )}>
              <Icon className="h-5 w-5 flex-shrink-0" />
              {label}
            </div>
          </Link>
        ))}
      </nav>

      <div className="px-4 mt-auto">
        <div className="rounded-lg bg-[#4A90D9]/10 p-3">
          <p className="text-xs font-semibold text-[#4A90D9]">DayShare</p>
          <p className="text-xs text-gray-500 mt-1">Your family hub 💙</p>
        </div>
      </div>
    </aside>
  )
}
