'use client'

import { useState, useEffect } from 'react'
import { Save, Key } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { MoodSelector } from '@/components/ui/MoodSelector'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { useAuth } from '@/hooks/useAuth'
import { createClient, isSupabaseConfigured } from '@/lib/supabase'
import { getInitials } from '@/lib/utils'
import { toast } from 'sonner'

export default function SettingsPage() {
  const { user, profile } = useAuth()
  const [profileForm, setProfileForm] = useState({
    full_name: '',
    display_name: '',
    bio: '',
    phone: '',
    birthday: '',
    mood: '😊',
    mood_message: '',
    avatar_url: '',
  })
  const [passwordForm, setPasswordForm] = useState({
    newPassword: '',
    confirmPassword: '',
  })
  const [saving, setSaving] = useState(false)
  const [savingPassword, setSavingPassword] = useState(false)

  useEffect(() => {
    if (profile) {
      setProfileForm({
        full_name: profile.full_name || '',
        display_name: profile.display_name || '',
        bio: profile.bio || '',
        phone: profile.phone || '',
        birthday: profile.birthday || '',
        mood: profile.mood || '😊',
        mood_message: profile.mood_message || '',
        avatar_url: profile.avatar_url || '',
      })
    }
  }, [profile])

  const handleSaveProfile = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!isSupabaseConfigured || !user) { toast.error('Not configured or not signed in'); return }
    setSaving(true)
    try {
      const supabase = createClient()
      if (!supabase) throw new Error('No client')
      const { error } = await supabase
        .from('profiles')
        .update({
          full_name: profileForm.full_name || null,
          display_name: profileForm.display_name || null,
          bio: profileForm.bio || null,
          phone: profileForm.phone || null,
          birthday: profileForm.birthday || null,
          mood: profileForm.mood,
          mood_message: profileForm.mood_message || null,
          avatar_url: profileForm.avatar_url || null,
          updated_at: new Date().toISOString(),
        })
        .eq('id', user.id)
      if (error) throw error
      toast.success('Profile updated!')
    } catch (err: unknown) {
      toast.error(err instanceof Error ? err.message : 'Failed to update profile')
    } finally {
      setSaving(false)
    }
  }

  const handleChangePassword = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!isSupabaseConfigured) { toast.error('Not configured'); return }
    if (passwordForm.newPassword !== passwordForm.confirmPassword) {
      toast.error('Passwords do not match')
      return
    }
    if (passwordForm.newPassword.length < 6) {
      toast.error('Password must be at least 6 characters')
      return
    }
    setSavingPassword(true)
    try {
      const supabase = createClient()
      if (!supabase) throw new Error('No client')
      const { error } = await supabase.auth.updateUser({ password: passwordForm.newPassword })
      if (error) throw error
      toast.success('Password updated!')
      setPasswordForm({ newPassword: '', confirmPassword: '' })
    } catch (err: unknown) {
      toast.error(err instanceof Error ? err.message : 'Failed to update password')
    } finally {
      setSavingPassword(false)
    }
  }

  const displayName = profileForm.display_name || profileForm.full_name || user?.email || 'You'

  return (
    <div className="max-w-2xl mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-6">Settings ⚙️</h1>

      {!isSupabaseConfigured && (
        <div className="mb-6 p-4 bg-amber-50 border border-amber-200 rounded-lg">
          <p className="text-amber-800 font-medium">Demo Mode</p>
          <p className="text-amber-700 text-sm mt-1">Configure Supabase to save your settings.</p>
        </div>
      )}

      {/* Profile */}
      <Card className="mb-6">
        <CardHeader>
          <CardTitle className="flex items-center gap-3">
            <Avatar className="h-10 w-10">
              <AvatarImage src={profileForm.avatar_url || undefined} />
              <AvatarFallback className="bg-[#4A90D9]/10 text-[#4A90D9] font-bold">
                {getInitials(displayName)}
              </AvatarFallback>
            </Avatar>
            Edit Profile
          </CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSaveProfile} className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="fullName">Full Name</Label>
                <Input
                  id="fullName"
                  value={profileForm.full_name}
                  onChange={(e) => setProfileForm({ ...profileForm, full_name: e.target.value })}
                  placeholder="John Smith"
                />
              </div>
              <div>
                <Label htmlFor="displayName">Display Name</Label>
                <Input
                  id="displayName"
                  value={profileForm.display_name}
                  onChange={(e) => setProfileForm({ ...profileForm, display_name: e.target.value })}
                  placeholder="Johnny"
                />
              </div>
            </div>
            <div>
              <Label htmlFor="avatarUrl">Avatar URL</Label>
              <Input
                id="avatarUrl"
                value={profileForm.avatar_url}
                onChange={(e) => setProfileForm({ ...profileForm, avatar_url: e.target.value })}
                placeholder="https://example.com/photo.jpg"
              />
            </div>
            <div>
              <Label htmlFor="bio">Bio</Label>
              <Textarea
                id="bio"
                value={profileForm.bio}
                onChange={(e) => setProfileForm({ ...profileForm, bio: e.target.value })}
                placeholder="Tell your family about yourself..."
                rows={2}
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="phone">Phone</Label>
                <Input
                  id="phone"
                  value={profileForm.phone}
                  onChange={(e) => setProfileForm({ ...profileForm, phone: e.target.value })}
                  placeholder="+1 234 567 8900"
                />
              </div>
              <div>
                <Label htmlFor="birthday">Birthday</Label>
                <Input
                  id="birthday"
                  type="date"
                  value={profileForm.birthday}
                  onChange={(e) => setProfileForm({ ...profileForm, birthday: e.target.value })}
                />
              </div>
            </div>
            <div>
              <Label>Current Mood</Label>
              <MoodSelector
                value={profileForm.mood}
                onChange={(mood) => setProfileForm({ ...profileForm, mood })}
                className="mt-2"
              />
            </div>
            <div>
              <Label htmlFor="moodMessage">Mood Message</Label>
              <Input
                id="moodMessage"
                value={profileForm.mood_message}
                onChange={(e) => setProfileForm({ ...profileForm, mood_message: e.target.value })}
                placeholder="How are you feeling?"
              />
            </div>
            <Button type="submit" disabled={saving} className="gap-2">
              <Save className="h-4 w-4" />
              {saving ? 'Saving...' : 'Save Profile'}
            </Button>
          </form>
        </CardContent>
      </Card>

      {/* Password */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Key className="h-5 w-5" />
            Change Password
          </CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleChangePassword} className="space-y-4">
            <div>
              <Label htmlFor="newPassword">New Password</Label>
              <Input
                id="newPassword"
                type="password"
                value={passwordForm.newPassword}
                onChange={(e) => setPasswordForm({ ...passwordForm, newPassword: e.target.value })}
                placeholder="••••••••"
                minLength={6}
              />
            </div>
            <div>
              <Label htmlFor="confirmPassword">Confirm Password</Label>
              <Input
                id="confirmPassword"
                type="password"
                value={passwordForm.confirmPassword}
                onChange={(e) => setPasswordForm({ ...passwordForm, confirmPassword: e.target.value })}
                placeholder="••••••••"
              />
            </div>
            <Button type="submit" disabled={savingPassword} variant="outline" className="gap-2">
              <Key className="h-4 w-4" />
              {savingPassword ? 'Updating...' : 'Update Password'}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}
