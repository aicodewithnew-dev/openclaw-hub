import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

export const supabase = createClient(supabaseUrl, supabaseAnonKey)

export type Database = {
  public: {
    Tables: {
      users: {
        Row: {
          id: string
          github_id: string
          username: string
          avatar_url: string | null
          created_at: string
        }
        Insert: {
          id?: string
          github_id: string
          username: string
          avatar_url?: string | null
          created_at?: string
        }
        Update: {
          id?: string
          github_id?: string
          username?: string
          avatar_url?: string | null
          created_at?: string
        }
      }
      agents: {
        Row: {
          id: string
          user_id: string
          name: string
          description: string | null
          soul_md: string | null
          agents_md: string | null
          tools_md: string | null
          other_files: any | null
          likes_count: number
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          user_id: string
          name: string
          description?: string | null
          soul_md?: string | null
          agents_md?: string | null
          tools_md?: string | null
          other_files?: any | null
          likes_count?: number
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          name?: string
          description?: string | null
          soul_md?: string | null
          agents_md?: string | null
          tools_md?: string | null
          other_files?: any | null
          likes_count?: number
          created_at?: string
          updated_at?: string
        }
      }
      likes: {
        Row: {
          id: string
          user_id: string
          agent_id: string
          created_at: string
        }
        Insert: {
          id?: string
          user_id: string
          agent_id: string
          created_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          agent_id?: string
          created_at?: string
        }
      }
    }
  }
}
