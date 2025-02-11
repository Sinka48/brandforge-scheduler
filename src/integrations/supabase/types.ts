export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  public: {
    Tables: {
      brand_assets: {
        Row: {
          asset_category: string | null
          asset_type: string
          created_at: string
          id: string
          metadata: Json | null
          platform_sizes: Json | null
          questionnaire_id: string
          regeneration_type: string | null
          social_asset_type: string | null
          social_bio: string | null
          social_name: string | null
          url: string
          user_id: string
          version: number | null
        }
        Insert: {
          asset_category?: string | null
          asset_type: string
          created_at?: string
          id?: string
          metadata?: Json | null
          platform_sizes?: Json | null
          questionnaire_id: string
          regeneration_type?: string | null
          social_asset_type?: string | null
          social_bio?: string | null
          social_name?: string | null
          url: string
          user_id: string
          version?: number | null
        }
        Update: {
          asset_category?: string | null
          asset_type?: string
          created_at?: string
          id?: string
          metadata?: Json | null
          platform_sizes?: Json | null
          questionnaire_id?: string
          regeneration_type?: string | null
          social_asset_type?: string | null
          social_bio?: string | null
          social_name?: string | null
          url?: string
          user_id?: string
          version?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "brand_assets_questionnaire_id_fkey"
            columns: ["questionnaire_id"]
            isOneToOne: false
            referencedRelation: "brand_questionnaires"
            referencedColumns: ["id"]
          },
        ]
      }
      brand_guidelines: {
        Row: {
          content: Json
          created_at: string
          id: string
          questionnaire_id: string
          updated_at: string
          user_id: string
          version: number | null
        }
        Insert: {
          content?: Json
          created_at?: string
          id?: string
          questionnaire_id: string
          updated_at?: string
          user_id: string
          version?: number | null
        }
        Update: {
          content?: Json
          created_at?: string
          id?: string
          questionnaire_id?: string
          updated_at?: string
          user_id?: string
          version?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "brand_guidelines_questionnaire_id_fkey"
            columns: ["questionnaire_id"]
            isOneToOne: false
            referencedRelation: "brand_questionnaires"
            referencedColumns: ["id"]
          },
        ]
      }
      brand_questionnaires: {
        Row: {
          ai_generated_parameters: Json | null
          brand_personality: string[]
          brand_story: string | null
          business_name: string
          color_preferences: string[]
          created_at: string
          description: string
          id: string
          industry: string
          is_ai_generated: boolean | null
          social_bio: string | null
          target_audience: Json
          updated_at: string
          user_id: string
          version: number | null
        }
        Insert: {
          ai_generated_parameters?: Json | null
          brand_personality?: string[]
          brand_story?: string | null
          business_name: string
          color_preferences?: string[]
          created_at?: string
          description: string
          id?: string
          industry: string
          is_ai_generated?: boolean | null
          social_bio?: string | null
          target_audience?: Json
          updated_at?: string
          user_id: string
          version?: number | null
        }
        Update: {
          ai_generated_parameters?: Json | null
          brand_personality?: string[]
          brand_story?: string | null
          business_name?: string
          color_preferences?: string[]
          created_at?: string
          description?: string
          id?: string
          industry?: string
          is_ai_generated?: boolean | null
          social_bio?: string | null
          target_audience?: Json
          updated_at?: string
          user_id?: string
          version?: number | null
        }
        Relationships: []
      }
      campaign_templates: {
        Row: {
          created_at: string
          duration: number
          hashtags: string[]
          id: string
          name: string
          platforms: string[]
          time_slots: Json
          tone: string
          topic: string
          user_id: string
        }
        Insert: {
          created_at?: string
          duration: number
          hashtags?: string[]
          id?: string
          name: string
          platforms?: string[]
          time_slots?: Json
          tone: string
          topic: string
          user_id: string
        }
        Update: {
          created_at?: string
          duration?: number
          hashtags?: string[]
          id?: string
          name?: string
          platforms?: string[]
          time_slots?: Json
          tone?: string
          topic?: string
          user_id?: string
        }
        Relationships: []
      }
      campaigns: {
        Row: {
          created_at: string
          description: string | null
          end_date: string | null
          id: string
          name: string
          platforms: string[]
          settings: Json
          start_date: string | null
          status: string
          updated_at: string
          user_id: string
        }
        Insert: {
          created_at?: string
          description?: string | null
          end_date?: string | null
          id?: string
          name: string
          platforms?: string[]
          settings?: Json
          start_date?: string | null
          status?: string
          updated_at?: string
          user_id: string
        }
        Update: {
          created_at?: string
          description?: string | null
          end_date?: string | null
          id?: string
          name?: string
          platforms?: string[]
          settings?: Json
          start_date?: string | null
          status?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      dashboard_analytics: {
        Row: {
          active_campaigns: number | null
          avg_engagement_rate: number | null
          last_updated: string | null
          platforms_used: string | null
          posts_this_week: number | null
          total_posts: number | null
          user_id: string
        }
        Insert: {
          active_campaigns?: number | null
          avg_engagement_rate?: number | null
          last_updated?: string | null
          platforms_used?: string | null
          posts_this_week?: number | null
          total_posts?: number | null
          user_id: string
        }
        Update: {
          active_campaigns?: number | null
          avg_engagement_rate?: number | null
          last_updated?: string | null
          platforms_used?: string | null
          posts_this_week?: number | null
          total_posts?: number | null
          user_id?: string
        }
        Relationships: []
      }
      post_analytics: {
        Row: {
          clicks: number | null
          engagement_rate: number | null
          id: string
          likes: number | null
          measured_at: string | null
          platform: string
          post_id: string | null
          shares: number | null
          views: number | null
        }
        Insert: {
          clicks?: number | null
          engagement_rate?: number | null
          id?: string
          likes?: number | null
          measured_at?: string | null
          platform: string
          post_id?: string | null
          shares?: number | null
          views?: number | null
        }
        Update: {
          clicks?: number | null
          engagement_rate?: number | null
          id?: string
          likes?: number | null
          measured_at?: string | null
          platform?: string
          post_id?: string | null
          shares?: number | null
          views?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "fk_post"
            columns: ["post_id"]
            isOneToOne: false
            referencedRelation: "posts"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "post_analytics_post_id_fkey"
            columns: ["post_id"]
            isOneToOne: false
            referencedRelation: "posts"
            referencedColumns: ["id"]
          },
        ]
      }
      post_templates: {
        Row: {
          content: string
          created_at: string
          id: string
          image_url: string | null
          is_favorite: boolean | null
          name: string
          platforms: string[]
          user_id: string
        }
        Insert: {
          content: string
          created_at?: string
          id?: string
          image_url?: string | null
          is_favorite?: boolean | null
          name: string
          platforms?: string[]
          user_id: string
        }
        Update: {
          content?: string
          created_at?: string
          id?: string
          image_url?: string | null
          is_favorite?: boolean | null
          name?: string
          platforms?: string[]
          user_id?: string
        }
        Relationships: []
      }
      post_time_analytics: {
        Row: {
          created_at: string
          day_of_week: number
          engagement_score: number | null
          hour_of_day: number
          id: string
          platform: string
          post_count: number | null
          updated_at: string
          user_id: string
        }
        Insert: {
          created_at?: string
          day_of_week: number
          engagement_score?: number | null
          hour_of_day: number
          id?: string
          platform: string
          post_count?: number | null
          updated_at?: string
          user_id: string
        }
        Update: {
          created_at?: string
          day_of_week?: number
          engagement_score?: number | null
          hour_of_day?: number
          id?: string
          platform?: string
          post_count?: number | null
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      posts: {
        Row: {
          batch_id: string | null
          campaign_id: string | null
          content: string
          created_at: string
          id: string
          image_url: string | null
          is_recurring: boolean | null
          parent_post_id: string | null
          platform: string
          published_at: string | null
          recurrence_end_date: string | null
          recurrence_pattern: string | null
          scheduled_for: string
          status: string
          user_id: string
        }
        Insert: {
          batch_id?: string | null
          campaign_id?: string | null
          content: string
          created_at?: string
          id?: string
          image_url?: string | null
          is_recurring?: boolean | null
          parent_post_id?: string | null
          platform: string
          published_at?: string | null
          recurrence_end_date?: string | null
          recurrence_pattern?: string | null
          scheduled_for: string
          status?: string
          user_id: string
        }
        Update: {
          batch_id?: string | null
          campaign_id?: string | null
          content?: string
          created_at?: string
          id?: string
          image_url?: string | null
          is_recurring?: boolean | null
          parent_post_id?: string | null
          platform?: string
          published_at?: string | null
          recurrence_end_date?: string | null
          recurrence_pattern?: string | null
          scheduled_for?: string
          status?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "posts_batch_id_fkey"
            columns: ["batch_id"]
            isOneToOne: false
            referencedRelation: "posts"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "posts_campaign_id_fkey"
            columns: ["campaign_id"]
            isOneToOne: false
            referencedRelation: "campaigns"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "posts_parent_post_id_fkey"
            columns: ["parent_post_id"]
            isOneToOne: false
            referencedRelation: "posts"
            referencedColumns: ["id"]
          },
        ]
      }
      social_connections: {
        Row: {
          access_token: string
          api_keys: Json | null
          created_at: string
          id: string
          platform: string
          platform_user_id: string | null
          platform_username: string | null
          refresh_token: string | null
          token_expires_at: string | null
          updated_at: string
          user_id: string
        }
        Insert: {
          access_token: string
          api_keys?: Json | null
          created_at?: string
          id?: string
          platform: string
          platform_user_id?: string | null
          platform_username?: string | null
          refresh_token?: string | null
          token_expires_at?: string | null
          updated_at?: string
          user_id: string
        }
        Update: {
          access_token?: string
          api_keys?: Json | null
          created_at?: string
          id?: string
          platform?: string
          platform_user_id?: string | null
          platform_username?: string | null
          refresh_token?: string | null
          token_expires_at?: string | null
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      ensure_dashboard_analytics_exists:
        | {
            Args: Record<PropertyKey, never>
            Returns: undefined
          }
        | {
            Args: {
              input_user_id: string
            }
            Returns: undefined
          }
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type PublicSchema = Database[Extract<keyof Database, "public">]

export type Tables<
  PublicTableNameOrOptions extends
    | keyof (PublicSchema["Tables"] & PublicSchema["Views"])
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof (Database[PublicTableNameOrOptions["schema"]]["Tables"] &
        Database[PublicTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? (Database[PublicTableNameOrOptions["schema"]]["Tables"] &
      Database[PublicTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : PublicTableNameOrOptions extends keyof (PublicSchema["Tables"] &
        PublicSchema["Views"])
    ? (PublicSchema["Tables"] &
        PublicSchema["Views"])[PublicTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  PublicTableNameOrOptions extends
    | keyof PublicSchema["Tables"]
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? Database[PublicTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : PublicTableNameOrOptions extends keyof PublicSchema["Tables"]
    ? PublicSchema["Tables"][PublicTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  PublicTableNameOrOptions extends
    | keyof PublicSchema["Tables"]
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? Database[PublicTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : PublicTableNameOrOptions extends keyof PublicSchema["Tables"]
    ? PublicSchema["Tables"][PublicTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  PublicEnumNameOrOptions extends
    | keyof PublicSchema["Enums"]
    | { schema: keyof Database },
  EnumName extends PublicEnumNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = PublicEnumNameOrOptions extends { schema: keyof Database }
  ? Database[PublicEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : PublicEnumNameOrOptions extends keyof PublicSchema["Enums"]
    ? PublicSchema["Enums"][PublicEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof PublicSchema["CompositeTypes"]
    | { schema: keyof Database },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends { schema: keyof Database }
  ? Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof PublicSchema["CompositeTypes"]
    ? PublicSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never
