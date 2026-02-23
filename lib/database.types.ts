export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export interface Database {
  public: {
    Tables: {
      profiles: {
        Row: {
          id: string
          full_name: string | null
          display_name: string | null
          avatar_url: string | null
          bio: string | null
          role: string | null
          mood: string | null
          mood_message: string | null
          birthday: string | null
          phone: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id: string
          full_name?: string | null
          display_name?: string | null
          avatar_url?: string | null
          bio?: string | null
          role?: string | null
          mood?: string | null
          mood_message?: string | null
          birthday?: string | null
          phone?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          full_name?: string | null
          display_name?: string | null
          avatar_url?: string | null
          bio?: string | null
          role?: string | null
          mood?: string | null
          mood_message?: string | null
          birthday?: string | null
          phone?: string | null
          created_at?: string
          updated_at?: string
        }
      }
      posts: {
        Row: {
          id: string
          author_id: string
          content: string
          image_url: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          author_id: string
          content: string
          image_url?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          author_id?: string
          content?: string
          image_url?: string | null
          created_at?: string
          updated_at?: string
        }
      }
      post_reactions: {
        Row: {
          id: string
          post_id: string
          user_id: string
          emoji: string
          created_at: string
        }
        Insert: {
          id?: string
          post_id: string
          user_id: string
          emoji: string
          created_at?: string
        }
        Update: {
          id?: string
          post_id?: string
          user_id?: string
          emoji?: string
          created_at?: string
        }
      }
      events: {
        Row: {
          id: string
          title: string
          description: string | null
          start_time: string
          end_time: string
          location: string | null
          color: string | null
          created_by: string
          all_day: boolean | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          title: string
          description?: string | null
          start_time: string
          end_time: string
          location?: string | null
          color?: string | null
          created_by: string
          all_day?: boolean | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          title?: string
          description?: string | null
          start_time?: string
          end_time?: string
          location?: string | null
          color?: string | null
          created_by?: string
          all_day?: boolean | null
          created_at?: string
          updated_at?: string
        }
      }
      tasks: {
        Row: {
          id: string
          title: string
          description: string | null
          assigned_to: string | null
          created_by: string
          status: string
          priority: string
          due_date: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          title: string
          description?: string | null
          assigned_to?: string | null
          created_by: string
          status?: string
          priority?: string
          due_date?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          title?: string
          description?: string | null
          assigned_to?: string | null
          created_by?: string
          status?: string
          priority?: string
          due_date?: string | null
          created_at?: string
          updated_at?: string
        }
      }
      birthdays: {
        Row: {
          id: string
          profile_id: string | null
          name: string
          date: string
          type: string
          notes: string | null
          created_by: string
          created_at: string
        }
        Insert: {
          id?: string
          profile_id?: string | null
          name: string
          date: string
          type?: string
          notes?: string | null
          created_by: string
          created_at?: string
        }
        Update: {
          id?: string
          profile_id?: string | null
          name?: string
          date?: string
          type?: string
          notes?: string | null
          created_by?: string
          created_at?: string
        }
      }
      photos: {
        Row: {
          id: string
          url: string
          caption: string | null
          album: string | null
          uploaded_by: string
          created_at: string
        }
        Insert: {
          id?: string
          url: string
          caption?: string | null
          album?: string | null
          uploaded_by: string
          created_at?: string
        }
        Update: {
          id?: string
          url?: string
          caption?: string | null
          album?: string | null
          uploaded_by?: string
          created_at?: string
        }
      }
      notifications: {
        Row: {
          id: string
          user_id: string
          title: string
          message: string | null
          type: string
          read: boolean
          link: string | null
          created_at: string
        }
        Insert: {
          id?: string
          user_id: string
          title: string
          message?: string | null
          type?: string
          read?: boolean
          link?: string | null
          created_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          title?: string
          message?: string | null
          type?: string
          read?: boolean
          link?: string | null
          created_at?: string
        }
      }
    }
  }
}

export type Profile = Database['public']['Tables']['profiles']['Row']
export type Post = Database['public']['Tables']['posts']['Row']
export type PostReaction = Database['public']['Tables']['post_reactions']['Row']
export type Event = Database['public']['Tables']['events']['Row']
export type Task = Database['public']['Tables']['tasks']['Row']
export type Birthday = Database['public']['Tables']['birthdays']['Row']
export type Photo = Database['public']['Tables']['photos']['Row']
export type Notification = Database['public']['Tables']['notifications']['Row']
