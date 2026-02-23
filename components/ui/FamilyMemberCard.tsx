'use client'

import Link from 'next/link'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Card, CardContent } from '@/components/ui/card'
import { getInitials } from '@/lib/utils'
import type { Profile } from '@/lib/database.types'

interface FamilyMemberCardProps {
  profile: Profile
  nextEvent?: string
  latestPost?: string
}

export function FamilyMemberCard({ profile, nextEvent, latestPost }: FamilyMemberCardProps) {
  const name = profile.display_name || profile.full_name || 'Family Member'

  return (
    <Link href={`/profile/${profile.id}`}>
      <Card className="hover:shadow-md transition-shadow cursor-pointer group">
        <CardContent className="p-4">
          <div className="flex items-start gap-3">
            <Avatar className="h-12 w-12 ring-2 ring-[#4A90D9]/20 group-hover:ring-[#4A90D9]/50 transition-all">
              <AvatarImage src={profile.avatar_url || undefined} />
              <AvatarFallback className="bg-[#4A90D9]/10 text-[#4A90D9] font-semibold">
                {getInitials(name)}
              </AvatarFallback>
            </Avatar>
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2">
                <p className="font-semibold text-sm truncate">{name}</p>
                {profile.mood && (
                  <span className="text-lg">{profile.mood}</span>
                )}
              </div>
              {profile.mood_message && (
                <p className="text-xs text-gray-500 truncate mt-0.5">{profile.mood_message}</p>
              )}
              {profile.role && (
                <span className="inline-block text-xs bg-[#4A90D9]/10 text-[#4A90D9] px-2 py-0.5 rounded-full mt-1">
                  {profile.role}
                </span>
              )}
            </div>
          </div>

          {(nextEvent || latestPost) && (
            <div className="mt-3 pt-3 border-t space-y-1">
              {nextEvent && (
                <p className="text-xs text-gray-500">
                  <span className="font-medium text-gray-700">📅 Next:</span> {nextEvent}
                </p>
              )}
              {latestPost && (
                <p className="text-xs text-gray-500 truncate">
                  <span className="font-medium text-gray-700">💬</span> {latestPost}
                </p>
              )}
            </div>
          )}
        </CardContent>
      </Card>
    </Link>
  )
}
