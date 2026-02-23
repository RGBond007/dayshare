'use client'

import { useState, useEffect, useCallback } from 'react'
import { createClient } from '@/lib/supabase'
import type { Post } from '@/lib/database.types'

type PostWithProfile = Post & {
  profiles: { display_name: string | null; full_name: string | null; avatar_url: string | null } | null
  post_reactions: { id: string; emoji: string; user_id: string }[]
}

export function usePosts() {
  const [posts, setPosts] = useState<PostWithProfile[]>([])
  const [loading, setLoading] = useState(true)

  const fetchPosts = useCallback(async () => {
    const supabase = createClient()
    if (!supabase) { setLoading(false); return }
    try {
      const { data } = await supabase
        .from('posts')
        .select('*, profiles(display_name, full_name, avatar_url), post_reactions(id, emoji, user_id)')
        .order('created_at', { ascending: false })
        .limit(50)
      setPosts((data as PostWithProfile[]) || [])
    } catch {
      // ignore
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => { fetchPosts() }, [fetchPosts])

  async function createPost(content: string, imageUrl?: string) {
    const supabase = createClient()
    if (!supabase) return
    const { data: { session } } = await supabase.auth.getSession()
    if (!session) return
    await supabase.from('posts').insert({
      content,
      author_id: session.user.id,
      image_url: imageUrl,
    })
    fetchPosts()
  }

  async function deletePost(id: string) {
    const supabase = createClient()
    if (!supabase) return
    await supabase.from('posts').delete().eq('id', id)
    fetchPosts()
  }

  async function addReaction(postId: string, emoji: string) {
    const supabase = createClient()
    if (!supabase) return
    const { data: { session } } = await supabase.auth.getSession()
    if (!session) return
    await supabase.from('post_reactions').upsert({
      post_id: postId,
      user_id: session.user.id,
      emoji,
    })
    fetchPosts()
  }

  async function removeReaction(postId: string, emoji: string) {
    const supabase = createClient()
    if (!supabase) return
    const { data: { session } } = await supabase.auth.getSession()
    if (!session) return
    await supabase.from('post_reactions')
      .delete()
      .eq('post_id', postId)
      .eq('user_id', session.user.id)
      .eq('emoji', emoji)
    fetchPosts()
  }

  return { posts, loading, createPost, deletePost, addReaction, removeReaction, refetch: fetchPosts }
}
