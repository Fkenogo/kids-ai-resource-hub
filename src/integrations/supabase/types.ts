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
      blog_comments: {
        Row: {
          author_id: string
          content: string
          created_at: string
          id: string
          is_approved: boolean | null
          like_count: number | null
          parent_comment_id: string | null
          post_id: string
          updated_at: string
        }
        Insert: {
          author_id: string
          content: string
          created_at?: string
          id?: string
          is_approved?: boolean | null
          like_count?: number | null
          parent_comment_id?: string | null
          post_id: string
          updated_at?: string
        }
        Update: {
          author_id?: string
          content?: string
          created_at?: string
          id?: string
          is_approved?: boolean | null
          like_count?: number | null
          parent_comment_id?: string | null
          post_id?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "blog_comments_author_id_fkey"
            columns: ["author_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "blog_comments_parent_comment_id_fkey"
            columns: ["parent_comment_id"]
            isOneToOne: false
            referencedRelation: "blog_comments"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "blog_comments_post_id_fkey"
            columns: ["post_id"]
            isOneToOne: false
            referencedRelation: "blog_posts"
            referencedColumns: ["id"]
          },
        ]
      }
      blog_posts: {
        Row: {
          author_id: string
          category: string
          content: string
          created_at: string
          excerpt: string | null
          id: string
          image_url: string | null
          is_featured: boolean | null
          is_published: boolean | null
          published_at: string | null
          read_time: number | null
          slug: string
          tags: string[] | null
          title: string
          updated_at: string
          view_count: number | null
        }
        Insert: {
          author_id: string
          category: string
          content: string
          created_at?: string
          excerpt?: string | null
          id?: string
          image_url?: string | null
          is_featured?: boolean | null
          is_published?: boolean | null
          published_at?: string | null
          read_time?: number | null
          slug: string
          tags?: string[] | null
          title: string
          updated_at?: string
          view_count?: number | null
        }
        Update: {
          author_id?: string
          category?: string
          content?: string
          created_at?: string
          excerpt?: string | null
          id?: string
          image_url?: string | null
          is_featured?: boolean | null
          is_published?: boolean | null
          published_at?: string | null
          read_time?: number | null
          slug?: string
          tags?: string[] | null
          title?: string
          updated_at?: string
          view_count?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "blog_posts_author_id_fkey"
            columns: ["author_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      community_posts: {
        Row: {
          author_id: string
          category: Database["public"]["Enums"]["community_category"]
          content: string
          created_at: string | null
          id: string
          images: string[] | null
          is_locked: boolean | null
          is_sticky: boolean | null
          last_activity: string | null
          like_count: number | null
          reply_count: number | null
          tags: string[] | null
          title: string
          updated_at: string | null
          view_count: number | null
        }
        Insert: {
          author_id: string
          category: Database["public"]["Enums"]["community_category"]
          content: string
          created_at?: string | null
          id?: string
          images?: string[] | null
          is_locked?: boolean | null
          is_sticky?: boolean | null
          last_activity?: string | null
          like_count?: number | null
          reply_count?: number | null
          tags?: string[] | null
          title: string
          updated_at?: string | null
          view_count?: number | null
        }
        Update: {
          author_id?: string
          category?: Database["public"]["Enums"]["community_category"]
          content?: string
          created_at?: string | null
          id?: string
          images?: string[] | null
          is_locked?: boolean | null
          is_sticky?: boolean | null
          last_activity?: string | null
          like_count?: number | null
          reply_count?: number | null
          tags?: string[] | null
          title?: string
          updated_at?: string | null
          view_count?: number | null
        }
        Relationships: []
      }
      community_replies: {
        Row: {
          author_id: string
          content: string
          created_at: string | null
          id: string
          is_solution: boolean | null
          like_count: number | null
          parent_reply_id: string | null
          post_id: string
          updated_at: string | null
        }
        Insert: {
          author_id: string
          content: string
          created_at?: string | null
          id?: string
          is_solution?: boolean | null
          like_count?: number | null
          parent_reply_id?: string | null
          post_id: string
          updated_at?: string | null
        }
        Update: {
          author_id?: string
          content?: string
          created_at?: string | null
          id?: string
          is_solution?: boolean | null
          like_count?: number | null
          parent_reply_id?: string | null
          post_id?: string
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "community_replies_parent_reply_id_fkey"
            columns: ["parent_reply_id"]
            isOneToOne: false
            referencedRelation: "community_replies"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "community_replies_post_id_fkey"
            columns: ["post_id"]
            isOneToOne: false
            referencedRelation: "community_posts"
            referencedColumns: ["id"]
          },
        ]
      }
      products: {
        Row: {
          affiliate_url: string | null
          age_range: string
          category: Database["public"]["Enums"]["product_category"]
          created_at: string | null
          currency: string | null
          description: string
          features: string[] | null
          id: string
          image_url: string | null
          images: string[] | null
          in_stock: boolean | null
          is_affiliate: boolean | null
          is_bestseller: boolean | null
          is_featured: boolean | null
          original_price: number | null
          price: number
          price_type: Database["public"]["Enums"]["price_type"]
          rating: number | null
          requirements: string[] | null
          review_count: number | null
          seller: string
          short_description: string | null
          stock_count: number | null
          tags: string[] | null
          title: string
          updated_at: string | null
        }
        Insert: {
          affiliate_url?: string | null
          age_range: string
          category: Database["public"]["Enums"]["product_category"]
          created_at?: string | null
          currency?: string | null
          description: string
          features?: string[] | null
          id?: string
          image_url?: string | null
          images?: string[] | null
          in_stock?: boolean | null
          is_affiliate?: boolean | null
          is_bestseller?: boolean | null
          is_featured?: boolean | null
          original_price?: number | null
          price: number
          price_type: Database["public"]["Enums"]["price_type"]
          rating?: number | null
          requirements?: string[] | null
          review_count?: number | null
          seller: string
          short_description?: string | null
          stock_count?: number | null
          tags?: string[] | null
          title: string
          updated_at?: string | null
        }
        Update: {
          affiliate_url?: string | null
          age_range?: string
          category?: Database["public"]["Enums"]["product_category"]
          created_at?: string | null
          currency?: string | null
          description?: string
          features?: string[] | null
          id?: string
          image_url?: string | null
          images?: string[] | null
          in_stock?: boolean | null
          is_affiliate?: boolean | null
          is_bestseller?: boolean | null
          is_featured?: boolean | null
          original_price?: number | null
          price?: number
          price_type?: Database["public"]["Enums"]["price_type"]
          rating?: number | null
          requirements?: string[] | null
          review_count?: number | null
          seller?: string
          short_description?: string | null
          stock_count?: number | null
          tags?: string[] | null
          title?: string
          updated_at?: string | null
        }
        Relationships: []
      }
      profiles: {
        Row: {
          avatar_url: string | null
          bio: string | null
          created_at: string | null
          date_joined: string | null
          display_name: string | null
          email: string | null
          id: string
          is_verified: boolean | null
          preferences: Json | null
          settings: Json | null
          updated_at: string | null
          username: string
        }
        Insert: {
          avatar_url?: string | null
          bio?: string | null
          created_at?: string | null
          date_joined?: string | null
          display_name?: string | null
          email?: string | null
          id: string
          is_verified?: boolean | null
          preferences?: Json | null
          settings?: Json | null
          updated_at?: string | null
          username: string
        }
        Update: {
          avatar_url?: string | null
          bio?: string | null
          created_at?: string | null
          date_joined?: string | null
          display_name?: string | null
          email?: string | null
          id?: string
          is_verified?: boolean | null
          preferences?: Json | null
          settings?: Json | null
          updated_at?: string | null
          username?: string
        }
        Relationships: []
      }
      resource_comments: {
        Row: {
          content: string
          created_at: string | null
          id: string
          is_pinned: boolean | null
          like_count: number | null
          parent_comment_id: string | null
          resource_id: string
          updated_at: string | null
          user_id: string
        }
        Insert: {
          content: string
          created_at?: string | null
          id?: string
          is_pinned?: boolean | null
          like_count?: number | null
          parent_comment_id?: string | null
          resource_id: string
          updated_at?: string | null
          user_id: string
        }
        Update: {
          content?: string
          created_at?: string | null
          id?: string
          is_pinned?: boolean | null
          like_count?: number | null
          parent_comment_id?: string | null
          resource_id?: string
          updated_at?: string | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "resource_comments_parent_comment_id_fkey"
            columns: ["parent_comment_id"]
            isOneToOne: false
            referencedRelation: "resource_comments"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "resource_comments_resource_id_fkey"
            columns: ["resource_id"]
            isOneToOne: false
            referencedRelation: "resources"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "resource_comments_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      resource_reviews: {
        Row: {
          comment: string | null
          created_at: string | null
          helpful_count: number | null
          id: string
          is_verified_purchase: boolean | null
          rating: number
          resource_id: string
          updated_at: string | null
          user_id: string
        }
        Insert: {
          comment?: string | null
          created_at?: string | null
          helpful_count?: number | null
          id?: string
          is_verified_purchase?: boolean | null
          rating: number
          resource_id: string
          updated_at?: string | null
          user_id: string
        }
        Update: {
          comment?: string | null
          created_at?: string | null
          helpful_count?: number | null
          id?: string
          is_verified_purchase?: boolean | null
          rating?: number
          resource_id?: string
          updated_at?: string | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "resource_reviews_resource_id_fkey"
            columns: ["resource_id"]
            isOneToOne: false
            referencedRelation: "resources"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "resource_reviews_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      resources: {
        Row: {
          added_by: string
          age_ranges: Database["public"]["Enums"]["age_range"][]
          average_rating: number | null
          comment_count: number | null
          cost: Database["public"]["Enums"]["cost_type"]
          created_at: string | null
          description: string
          format: string | null
          id: string
          image_url: string | null
          is_approved: boolean | null
          is_featured: boolean | null
          key_features: string[] | null
          learning_outcomes: string[] | null
          like_count: number | null
          moderation_notes: string | null
          requirements: string[] | null
          resource_type: Database["public"]["Enums"]["resource_type"]
          review_count: number | null
          save_count: number | null
          share_count: number | null
          skills_attained: string[] | null
          title: string
          updated_at: string | null
          url: string
          view_count: number | null
        }
        Insert: {
          added_by: string
          age_ranges: Database["public"]["Enums"]["age_range"][]
          average_rating?: number | null
          comment_count?: number | null
          cost: Database["public"]["Enums"]["cost_type"]
          created_at?: string | null
          description: string
          format?: string | null
          id?: string
          image_url?: string | null
          is_approved?: boolean | null
          is_featured?: boolean | null
          key_features?: string[] | null
          learning_outcomes?: string[] | null
          like_count?: number | null
          moderation_notes?: string | null
          requirements?: string[] | null
          resource_type: Database["public"]["Enums"]["resource_type"]
          review_count?: number | null
          save_count?: number | null
          share_count?: number | null
          skills_attained?: string[] | null
          title: string
          updated_at?: string | null
          url: string
          view_count?: number | null
        }
        Update: {
          added_by?: string
          age_ranges?: Database["public"]["Enums"]["age_range"][]
          average_rating?: number | null
          comment_count?: number | null
          cost?: Database["public"]["Enums"]["cost_type"]
          created_at?: string | null
          description?: string
          format?: string | null
          id?: string
          image_url?: string | null
          is_approved?: boolean | null
          is_featured?: boolean | null
          key_features?: string[] | null
          learning_outcomes?: string[] | null
          like_count?: number | null
          moderation_notes?: string | null
          requirements?: string[] | null
          resource_type?: Database["public"]["Enums"]["resource_type"]
          review_count?: number | null
          save_count?: number | null
          share_count?: number | null
          skills_attained?: string[] | null
          title?: string
          updated_at?: string | null
          url?: string
          view_count?: number | null
        }
        Relationships: []
      }
      user_engagements: {
        Row: {
          created_at: string | null
          engagement_type: string
          id: string
          target_id: string
          target_type: string
          user_id: string
        }
        Insert: {
          created_at?: string | null
          engagement_type: string
          id?: string
          target_id: string
          target_type: string
          user_id: string
        }
        Update: {
          created_at?: string | null
          engagement_type?: string
          id?: string
          target_id?: string
          target_type?: string
          user_id?: string
        }
        Relationships: []
      }
      user_follows: {
        Row: {
          created_at: string | null
          follower_id: string
          following_id: string
          id: string
        }
        Insert: {
          created_at?: string | null
          follower_id: string
          following_id: string
          id?: string
        }
        Update: {
          created_at?: string | null
          follower_id?: string
          following_id?: string
          id?: string
        }
        Relationships: []
      }
      user_roles: {
        Row: {
          assigned_at: string | null
          assigned_by: string | null
          id: string
          role: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Insert: {
          assigned_at?: string | null
          assigned_by?: string | null
          id?: string
          role: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Update: {
          assigned_at?: string | null
          assigned_by?: string | null
          id?: string
          role?: Database["public"]["Enums"]["app_role"]
          user_id?: string
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      get_current_user_role: {
        Args: Record<PropertyKey, never>
        Returns: Database["public"]["Enums"]["app_role"]
      }
      has_role: {
        Args: {
          _user_id: string
          _role: Database["public"]["Enums"]["app_role"]
        }
        Returns: boolean
      }
    }
    Enums: {
      age_range: "5-7" | "8-10" | "11-13" | "14-17"
      app_role: "admin" | "moderator" | "user"
      community_category:
        | "getting-started"
        | "age-specific"
        | "troubleshooting"
        | "project-showcase"
        | "curriculum-ideas"
        | "resource-requests"
      cost_type: "free" | "paid" | "subscription" | "freemium"
      price_type: "one-time" | "subscription" | "free"
      product_category:
        | "books"
        | "courses"
        | "videos"
        | "tools"
        | "games"
        | "kits"
      resource_type:
        | "online_course"
        | "book"
        | "interactive_tool"
        | "game"
        | "video"
        | "tutorial"
        | "activity"
        | "camp"
        | "ai_tool"
        | "curriculum"
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DefaultSchema = Database[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof (Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        Database[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? (Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      Database[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] &
        DefaultSchema["Views"])
    ? (DefaultSchema["Tables"] &
        DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    | keyof DefaultSchema["Enums"]
    | { schema: keyof Database },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof Database },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends { schema: keyof Database }
  ? Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {
      age_range: ["5-7", "8-10", "11-13", "14-17"],
      app_role: ["admin", "moderator", "user"],
      community_category: [
        "getting-started",
        "age-specific",
        "troubleshooting",
        "project-showcase",
        "curriculum-ideas",
        "resource-requests",
      ],
      cost_type: ["free", "paid", "subscription", "freemium"],
      price_type: ["one-time", "subscription", "free"],
      product_category: [
        "books",
        "courses",
        "videos",
        "tools",
        "games",
        "kits",
      ],
      resource_type: [
        "online_course",
        "book",
        "interactive_tool",
        "game",
        "video",
        "tutorial",
        "activity",
        "camp",
        "ai_tool",
        "curriculum",
      ],
    },
  },
} as const
