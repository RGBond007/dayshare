'use client'

import { useState } from 'react'
import { Send, Trash2, Heart, Smile } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'
import { Card, CardContent } from '@/components/ui/card'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { usePosts } from '@/hooks/usePosts'
import { useAuth } from '@/hooks/useAuth'
import { isSupabaseConfigured } from '@/lib/supabase'
import { getInitials, formatDate } from '@/lib/utils'
import { toast } from 'sonner'

const REACTION_EMOJIS = ['❤️', '😂', '👍', '🎉', '😮', '🙏']

export default function FeedPage() {
  const { posts, loading, createPost, deletePost, addReaction, removeReaction } = usePosts()
  const { user } = useAuth()
  const [content, setContent] = useState('')
  const [submitting, setSubmitting] = useState(false)
  const [showReactions, setShowReactions] = useState<string | null>(null)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!content.trim()) return
    if (!isSupabaseConfigured) {
      toast.error('Supabase not configured')
      return
    }
    setSubmitting(true)
    try {
      await createPost(content.trim())
      setContent('')
      toast.success('Post shared!')
    } catch {
      toast.error('Failed to post')
    } finally {
      setSubmitting(false)
    }
  }

  const handleDelete = async (id: string) => {
    await deletePost(id)
    toast.success('Post deleted')
  }

  const handleReaction = async (postId: string, emoji: string) => {
    if (!user) return
    const post = posts.find((p) => p.id === postId)
    if (!post) return
    const existing = post.post_reactions.find(
      (r) => r.user_id === user.id && r.emoji === emoji
    )
    if (existing) {
      await removeReaction(postId, emoji)
    } else {
      await addReaction(postId, emoji)
    }
    setShowReactions(null)
  }

  return (
    <div className="max-w-2xl mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-6">Family Feed 💬</h1>

      {/* Create post */}
      <Card className="mb-6">
        <CardContent className="p-4">
          {!isSupabaseConfigured && (
            <div className="mb-3 p-2 bg-amber-50 border border-amber-200 rounded text-xs text-amber-700">
              Configure Supabase to enable posting
            </div>
          )}
          <form onSubmit={handleSubmit}>
            <Textarea
              placeholder="What's on your mind? Share with the family..."
              value={content}
              onChange={(e) => setContent(e.target.value)}
              className="resize-none mb-3"
              rows={3}
            />
            <div className="flex justify-end">
              <Button
                type="submit"
                disabled={submitting || !content.trim()}
                className="gap-2"
              >
                <Send className="h-4 w-4" />
                Share
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>

      {/* Posts */}
      {loading ? (
        <div className="space-y-4">
          {[1, 2, 3].map((i) => (
            <div key={i} className="h-32 rounded-xl bg-gray-100 animate-pulse" />
          ))}
        </div>
      ) : posts.length === 0 ? (
        <Card>
          <CardContent className="p-8 text-center text-gray-500">
            <p className="text-4xl mb-2">📝</p>
            <p className="font-medium">No posts yet</p>
            <p className="text-sm mt-1">Be the first to share something with the family!</p>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-4">
          {posts.map((post) => {
            const authorName = post.profiles?.display_name || post.profiles?.full_name || 'Family Member'
            const reactionGroups = post.post_reactions.reduce((acc, r) => {
              acc[r.emoji] = (acc[r.emoji] || 0) + 1
              return acc
            }, {} as Record<string, number>)

            return (
              <Card key={post.id} className="shadow-sm">
                <CardContent className="p-4">
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex items-start gap-3 flex-1">
                      <Avatar className="h-9 w-9">
                        <AvatarImage src={post.profiles?.avatar_url || undefined} />
                        <AvatarFallback className="bg-[#4A90D9]/10 text-[#4A90D9] text-sm">
                          {getInitials(authorName)}
                        </AvatarFallback>
                      </Avatar>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2">
                          <span className="font-semibold text-sm">{authorName}</span>
                          <span className="text-xs text-gray-400">
                            {formatDate(post.created_at)}
                          </span>
                        </div>
                        <p className="mt-1 text-sm text-gray-800 whitespace-pre-wrap">{post.content}</p>
                        {post.image_url && (
                          // eslint-disable-next-line @next/next/no-img-element
                          <img
                            src={post.image_url}
                            alt="Post image"
                            className="mt-2 rounded-lg max-h-64 object-cover w-full"
                          />
                        )}
                      </div>
                    </div>
                    {user?.id === post.author_id && (
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8 text-gray-400 hover:text-red-500"
                        onClick={() => handleDelete(post.id)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    )}
                  </div>

                  {/* Reactions */}
                  <div className="mt-3 flex items-center gap-2 flex-wrap">
                    {Object.entries(reactionGroups).map(([emoji, count]) => (
                      <button
                        key={emoji}
                        onClick={() => handleReaction(post.id, emoji)}
                        className="flex items-center gap-1 text-xs bg-gray-100 hover:bg-gray-200 px-2 py-1 rounded-full transition-colors"
                      >
                        <span>{emoji}</span>
                        <span className="font-medium">{count}</span>
                      </button>
                    ))}
                    <div className="relative">
                      <button
                        onClick={() => setShowReactions(showReactions === post.id ? null : post.id)}
                        className="flex items-center gap-1 text-xs text-gray-400 hover:text-gray-600 px-2 py-1 rounded-full hover:bg-gray-100 transition-colors"
                      >
                        <Smile className="h-3.5 w-3.5" />
                        <Heart className="h-3.5 w-3.5" />
                      </button>
                      {showReactions === post.id && (
                        <div className="absolute bottom-8 left-0 bg-white border rounded-lg shadow-lg p-2 flex gap-1 z-10">
                          {REACTION_EMOJIS.map((emoji) => (
                            <button
                              key={emoji}
                              onClick={() => handleReaction(post.id, emoji)}
                              className="text-xl hover:scale-125 transition-transform p-1"
                            >
                              {emoji}
                            </button>
                          ))}
                        </div>
                      )}
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
