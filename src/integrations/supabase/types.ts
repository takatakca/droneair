export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  // Allows to automatically instantiate createClient with right options
  // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
  __InternalSupabase: {
    PostgrestVersion: "14.15"
  }
  public: {
    Tables: {
      client_file_events: {
        Row: {
          client_file_id: string
          created_at: string
          event_type: string
          id: string
          user_id: string | null
        }
        Insert: {
          client_file_id: string
          created_at?: string
          event_type: string
          id?: string
          user_id?: string | null
        }
        Update: {
          client_file_id?: string
          created_at?: string
          event_type?: string
          id?: string
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "client_file_events_client_file_id_fkey"
            columns: ["client_file_id"]
            isOneToOne: false
            referencedRelation: "client_files"
            referencedColumns: ["id"]
          },
        ]
      }
      client_files: {
        Row: {
          category: string
          client_id: string
          created_at: string
          description: string | null
          display_name: string
          id: string
          is_archived: boolean
          is_visible_to_client: boolean
          mime_type: string | null
          original_filename: string | null
          project_id: string | null
          published_at: string | null
          size_bytes: number | null
          storage_path: string
          updated_at: string
          upload_verified: boolean
          uploaded_by: string | null
          version: number
        }
        Insert: {
          category?: string
          client_id: string
          created_at?: string
          description?: string | null
          display_name: string
          id?: string
          is_archived?: boolean
          is_visible_to_client?: boolean
          mime_type?: string | null
          original_filename?: string | null
          project_id?: string | null
          published_at?: string | null
          size_bytes?: number | null
          storage_path: string
          updated_at?: string
          upload_verified?: boolean
          uploaded_by?: string | null
          version?: number
        }
        Update: {
          category?: string
          client_id?: string
          created_at?: string
          description?: string | null
          display_name?: string
          id?: string
          is_archived?: boolean
          is_visible_to_client?: boolean
          mime_type?: string | null
          original_filename?: string | null
          project_id?: string | null
          published_at?: string | null
          size_bytes?: number | null
          storage_path?: string
          updated_at?: string
          upload_verified?: boolean
          uploaded_by?: string | null
          version?: number
        }
        Relationships: [
          {
            foreignKeyName: "client_files_client_id_fkey"
            columns: ["client_id"]
            isOneToOne: false
            referencedRelation: "clients"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "client_files_project_id_fkey"
            columns: ["project_id"]
            isOneToOne: false
            referencedRelation: "client_projects"
            referencedColumns: ["id"]
          },
        ]
      }
      client_memberships: {
        Row: {
          client_id: string
          created_at: string
          id: string
          membership_role: string
          user_id: string
        }
        Insert: {
          client_id: string
          created_at?: string
          id?: string
          membership_role?: string
          user_id: string
        }
        Update: {
          client_id?: string
          created_at?: string
          id?: string
          membership_role?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "client_memberships_client_id_fkey"
            columns: ["client_id"]
            isOneToOne: false
            referencedRelation: "clients"
            referencedColumns: ["id"]
          },
        ]
      }
      client_projects: {
        Row: {
          client_id: string
          completed_at: string | null
          created_at: string
          description: string | null
          id: string
          location: string | null
          mission_request_id: string | null
          project_reference: string | null
          service_type: string | null
          status: string
          title: string
          updated_at: string
        }
        Insert: {
          client_id: string
          completed_at?: string | null
          created_at?: string
          description?: string | null
          id?: string
          location?: string | null
          mission_request_id?: string | null
          project_reference?: string | null
          service_type?: string | null
          status?: string
          title: string
          updated_at?: string
        }
        Update: {
          client_id?: string
          completed_at?: string | null
          created_at?: string
          description?: string | null
          id?: string
          location?: string | null
          mission_request_id?: string | null
          project_reference?: string | null
          service_type?: string | null
          status?: string
          title?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "client_projects_client_id_fkey"
            columns: ["client_id"]
            isOneToOne: false
            referencedRelation: "clients"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "client_projects_mission_request_id_fkey"
            columns: ["mission_request_id"]
            isOneToOne: false
            referencedRelation: "mission_requests"
            referencedColumns: ["id"]
          },
        ]
      }
      clients: {
        Row: {
          created_at: string
          id: string
          name: string
          status: string
          updated_at: string
        }
        Insert: {
          created_at?: string
          id?: string
          name: string
          status?: string
          updated_at?: string
        }
        Update: {
          created_at?: string
          id?: string
          name?: string
          status?: string
          updated_at?: string
        }
        Relationships: []
      }
      mission_email_events: {
        Row: {
          created_at: string
          error_code: string | null
          error_summary: string | null
          event_type: string
          id: string
          mission_request_id: string
          provider: string | null
          provider_message_id: string | null
          recipient: string | null
          status: string
        }
        Insert: {
          created_at?: string
          error_code?: string | null
          error_summary?: string | null
          event_type: string
          id?: string
          mission_request_id: string
          provider?: string | null
          provider_message_id?: string | null
          recipient?: string | null
          status: string
        }
        Update: {
          created_at?: string
          error_code?: string | null
          error_summary?: string | null
          event_type?: string
          id?: string
          mission_request_id?: string
          provider?: string | null
          provider_message_id?: string | null
          recipient?: string | null
          status?: string
        }
        Relationships: [
          {
            foreignKeyName: "mission_email_events_mission_request_id_fkey"
            columns: ["mission_request_id"]
            isOneToOne: false
            referencedRelation: "mission_requests"
            referencedColumns: ["id"]
          },
        ]
      }
      mission_requests: {
        Row: {
          ai_draft_created_at: string | null
          ai_draft_reply: string | null
          ai_follow_up_questions: string[] | null
          ai_response_status: string
          ai_summary: string | null
          approximate_area: string | null
          attachment_url: string | null
          company: string | null
          consent: boolean
          created_at: string
          customer_ack_status: string
          description: string
          desired_date: string | null
          email: string
          email_attempts: number
          email_notification_status: string
          email_thread_id: string | null
          human_review_required: boolean
          id: string
          ip_hash: string | null
          lead_priority: string
          lead_type: string
          name: string
          preferred_language: string
          project_location: string
          reply_received_at: string | null
          service_type: string
          source_page: string | null
          submission_status: string
          telephone: string
        }
        Insert: {
          ai_draft_created_at?: string | null
          ai_draft_reply?: string | null
          ai_follow_up_questions?: string[] | null
          ai_response_status?: string
          ai_summary?: string | null
          approximate_area?: string | null
          attachment_url?: string | null
          company?: string | null
          consent?: boolean
          created_at?: string
          customer_ack_status?: string
          description: string
          desired_date?: string | null
          email: string
          email_attempts?: number
          email_notification_status?: string
          email_thread_id?: string | null
          human_review_required?: boolean
          id?: string
          ip_hash?: string | null
          lead_priority?: string
          lead_type?: string
          name: string
          preferred_language?: string
          project_location: string
          reply_received_at?: string | null
          service_type: string
          source_page?: string | null
          submission_status?: string
          telephone: string
        }
        Update: {
          ai_draft_created_at?: string | null
          ai_draft_reply?: string | null
          ai_follow_up_questions?: string[] | null
          ai_response_status?: string
          ai_summary?: string | null
          approximate_area?: string | null
          attachment_url?: string | null
          company?: string | null
          consent?: boolean
          created_at?: string
          customer_ack_status?: string
          description?: string
          desired_date?: string | null
          email?: string
          email_attempts?: number
          email_notification_status?: string
          email_thread_id?: string | null
          human_review_required?: boolean
          id?: string
          ip_hash?: string | null
          lead_priority?: string
          lead_type?: string
          name?: string
          preferred_language?: string
          project_location?: string
          reply_received_at?: string | null
          service_type?: string
          source_page?: string | null
          submission_status?: string
          telephone?: string
        }
        Relationships: []
      }
      profiles: {
        Row: {
          created_at: string
          email: string | null
          first_name: string | null
          id: string
          last_name: string | null
          preferred_language: string
          updated_at: string
        }
        Insert: {
          created_at?: string
          email?: string | null
          first_name?: string | null
          id: string
          last_name?: string | null
          preferred_language?: string
          updated_at?: string
        }
        Update: {
          created_at?: string
          email?: string | null
          first_name?: string | null
          id?: string
          last_name?: string | null
          preferred_language?: string
          updated_at?: string
        }
        Relationships: []
      }
      user_roles: {
        Row: {
          created_at: string
          id: string
          role: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          role: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Update: {
          created_at?: string
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
      has_role: {
        Args: {
          _role: Database["public"]["Enums"]["app_role"]
          _user_id: string
        }
        Returns: boolean
      }
      is_client_member: {
        Args: { _client_id: string; _user_id: string }
        Returns: boolean
      }
    }
    Enums: {
      app_role: "admin" | "client"
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DatabaseWithoutInternals = Omit<Database, "__InternalSupabase">

type DefaultSchema = DatabaseWithoutInternals[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
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
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
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
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
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
    | { schema: keyof DatabaseWithoutInternals },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof DatabaseWithoutInternals },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {
      app_role: ["admin", "client"],
    },
  },
} as const
