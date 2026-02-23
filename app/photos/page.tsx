'use client'

import { useState, useEffect, useRef } from 'react'
import { Upload, X, ZoomIn } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardContent } from '@/components/ui/card'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { createClient, isSupabaseConfigured } from '@/lib/supabase'
import { toast } from 'sonner'
import type { Photo } from '@/lib/database.types'

export default function PhotosPage() {
  const [photos, setPhotos] = useState<Photo[]>([])
  const [loading, setLoading] = useState(true)
  const [lightboxPhoto, setLightboxPhoto] = useState<Photo | null>(null)
  const [dialogOpen, setDialogOpen] = useState(false)
  const [form, setForm] = useState({ url: '', caption: '', album: 'general' })
  const fileInputRef = useRef<HTMLInputElement>(null)

  useEffect(() => { fetchPhotos() }, [])

  async function fetchPhotos() {
    const supabase = createClient()
    if (!supabase) { setLoading(false); return }
    try {
      const { data } = await supabase.from('photos').select('*').order('created_at', { ascending: false })
      setPhotos(data || [])
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
      await supabase.from('photos').insert({
        url: form.url,
        caption: form.caption || undefined,
        album: form.album,
        uploaded_by: session.user.id,
      })
      toast.success('Photo added!')
      setDialogOpen(false)
      setForm({ url: '', caption: '', album: 'general' })
      fetchPhotos()
    } catch {
      toast.error('Failed to add photo')
    }
  }

  async function handleDelete(id: string) {
    const supabase = createClient()
    if (!supabase) return
    await supabase.from('photos').delete().eq('id', id)
    setPhotos((prev) => prev.filter((p) => p.id !== id))
    if (lightboxPhoto?.id === id) setLightboxPhoto(null)
    toast.success('Photo deleted')
  }

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold">Family Photos 📷</h1>
        <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
          <DialogTrigger asChild>
            <Button className="gap-2">
              <Upload className="h-4 w-4" />
              Add Photo
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Add Photo</DialogTitle>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <Label htmlFor="photoUrl">Photo URL *</Label>
                <Input
                  id="photoUrl"
                  value={form.url}
                  onChange={(e) => setForm({ ...form, url: e.target.value })}
                  placeholder="https://example.com/photo.jpg"
                  required
                />
              </div>
              <div>
                <Label htmlFor="photoCaption">Caption</Label>
                <Input
                  id="photoCaption"
                  value={form.caption}
                  onChange={(e) => setForm({ ...form, caption: e.target.value })}
                  placeholder="Optional caption"
                />
              </div>
              <div>
                <Label htmlFor="photoAlbum">Album</Label>
                <Input
                  id="photoAlbum"
                  value={form.album}
                  onChange={(e) => setForm({ ...form, album: e.target.value })}
                  placeholder="Album name"
                />
              </div>
              <div className="flex gap-2 justify-end">
                <Button type="button" variant="outline" onClick={() => setDialogOpen(false)}>Cancel</Button>
                <Button type="submit">Add Photo</Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      <input ref={fileInputRef} type="file" accept="image/*" className="hidden" />

      {loading ? (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
          {[1, 2, 3, 4, 5, 6, 7, 8].map((i) => (
            <div key={i} className="aspect-square rounded-xl bg-gray-100 animate-pulse" />
          ))}
        </div>
      ) : photos.length === 0 ? (
        <Card>
          <CardContent className="p-12 text-center text-gray-500">
            <p className="text-5xl mb-3">📷</p>
            <p className="font-medium text-lg">No photos yet</p>
            <p className="text-sm mt-1">Start building your family photo album!</p>
          </CardContent>
        </Card>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
          {photos.map((photo) => (
            <div
              key={photo.id}
              className="group relative aspect-square rounded-xl overflow-hidden cursor-pointer bg-gray-100"
              onClick={() => setLightboxPhoto(photo)}
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={photo.url}
                alt={photo.caption || 'Family photo'}
                className="w-full h-full object-cover transition-transform group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                <ZoomIn className="h-8 w-8 text-white" />
              </div>
              {photo.caption && (
                <div className="absolute bottom-0 left-0 right-0 bg-black/50 text-white text-xs p-2 truncate">
                  {photo.caption}
                </div>
              )}
            </div>
          ))}
        </div>
      )}

      {/* Lightbox */}
      {lightboxPhoto && (
        <div
          className="fixed inset-0 z-50 bg-black/90 flex items-center justify-center p-4"
          onClick={() => setLightboxPhoto(null)}
        >
          <div className="relative max-w-4xl w-full" onClick={(e) => e.stopPropagation()}>
            <Button
              variant="ghost"
              size="icon"
              className="absolute -top-12 right-0 text-white hover:bg-white/20"
              onClick={() => setLightboxPhoto(null)}
            >
              <X className="h-6 w-6" />
            </Button>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={lightboxPhoto.url}
              alt={lightboxPhoto.caption || 'Photo'}
              className="w-full max-h-[80vh] object-contain rounded-lg"
            />
            {lightboxPhoto.caption && (
              <p className="text-white text-center mt-3">{lightboxPhoto.caption}</p>
            )}
            <div className="flex justify-center mt-4">
              <Button
                variant="destructive"
                size="sm"
                onClick={() => handleDelete(lightboxPhoto.id)}
              >
                Delete Photo
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
