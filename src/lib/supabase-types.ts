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
      posts: {
        Row: {
          id: string
          created_at: string
          content: string
          platform: 'instagram' | 'twitter' | 'facebook' | 'linkedin'
          scheduled_for: string
          image_url?: string
          status: 'draft' | 'scheduled' | 'published'
          user_id: string
        }
        Insert: {
          id?: string
          created_at?: string
          content: string
          platform: 'instagram' | 'twitter' | 'facebook' | 'linkedin'
          scheduled_for: string
          image_url?: string
          status: 'draft' | 'scheduled' | 'published'
          user_id: string
        }
        Update: {
          id?: string
          created_at?: string
          content?: string
          platform?: 'instagram' | 'twitter' | 'facebook' | 'linkedin'
          scheduled_for?: string
          image_url?: string
          status?: 'draft' | 'scheduled' | 'published'
          user_id?: string
        }
      }
    }
  }
}