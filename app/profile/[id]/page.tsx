'use client'

import { useEffect, useState } from 'react'
import { use } from 'react'
import { Mail, Phone, Cake, User } from 'lucide-react'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { createClient } from '@/lib/supabase'
import { getInitials, formatDate, calculateAge } from '@/lib/utils'
import type { Profile } from '@/lib/database.types'

interface Props {
  params: Promise<{ id: string }>
}

export default function ProfilePage({ params }: Props) {
  const { id } = use(params)
  const [profile, setProfile] = useState<Profile | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchProfile = async () => {
      const supabase = createClient()
      if (!supabase) { setLoading(false); return }
      try {
        const { data } = await supabase.from('profiles').select('*').eq('id', id).single()
        setProfile(data)
      } catch {
        // ignore
      } finally {
        setLoading(false)
      }
    }
    fetchProfile()
  }, [id])

  if (loading) {
    return (
      <div className="max-w-2xl mx-auto px-4 py-8">
        <div className="h-40 rounded-xl bg-gray-100 animate-pulse mb-4" />
        <div className="h-64 rounded-xl bg-gray-100 animate-pulse" />
      </div>
    )
  }

  if (!profile) {
    return (
      <div className="max-w-2xl mx-auto px-4 py-8 text-center text-gray-500">
        <p className="text-4xl mb-2">👤</p>
        <p className="font-medium">Profile not found</p>
      </div>
    )
  }

  const name = profile.display_name || profile.full_name || 'Family Member'

  return (
    <div className="max-w-2xl mx-auto px-4 py-8">
      {/* Hero card */}
      <Card className="mb-6">
        <CardContent className="p-6">
          <div className="flex items-start gap-5">
            <Avatar className="h-20 w-20 ring-4 ring-[#4A90D9]/20">
              <AvatarImage src={profile.avatar_url || undefined} />
              <AvatarFallback className="bg-[#4A90D9]/10 text-[#4A90D9] text-2xl font-bold">
                {getInitials(name)}
              </AvatarFallback>
            </Avatar>
            <div className="flex-1">
              <div className="flex items-center gap-3">
                <h1 className="text-2xl font-bold">{name}</h1>
                {profile.mood && <span className="text-3xl">{profile.mood}</span>}
              </div>
              {profile.role && (
                <Badge className="mt-1 bg-[#4A90D9]/10 text-[#4A90D9] border-[#4A90D9]/20">
                  {profile.role}
                </Badge>
              )}
              {profile.mood_message && (
                <p className="mt-2 text-gray-600 italic">&ldquo;{profile.mood_message}&rdquo;</p>
              )}
              {profile.bio && (
                <p className="mt-2 text-gray-600 text-sm">{profile.bio}</p>
              )}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Details */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base">Profile Details</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {profile.full_name && (
            <div className="flex items-center gap-3">
              <User className="h-5 w-5 text-gray-400 flex-shrink-0" />
              <div>
                <p className="text-xs text-gray-400">Full Name</p>
                <p className="text-sm font-medium">{profile.full_name}</p>
              </div>
            </div>
          )}
          {profile.phone && (
            <div className="flex items-center gap-3">
              <Phone className="h-5 w-5 text-gray-400 flex-shrink-0" />
              <div>
                <p className="text-xs text-gray-400">Phone</p>
                <p className="text-sm font-medium">{profile.phone}</p>
              </div>
            </div>
          )}
          {profile.birthday && (
            <div className="flex items-center gap-3">
              <Cake className="h-5 w-5 text-gray-400 flex-shrink-0" />
              <div>
                <p className="text-xs text-gray-400">Birthday</p>
                <p className="text-sm font-medium">
                  {formatDate(profile.birthday)} · Age {calculateAge(profile.birthday)}
                </p>
              </div>
            </div>
          )}
          <div className="flex items-center gap-3">
            <Mail className="h-5 w-5 text-gray-400 flex-shrink-0" />
            <div>
              <p className="text-xs text-gray-400">Member Since</p>
              <p className="text-sm font-medium">{formatDate(profile.created_at)}</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
