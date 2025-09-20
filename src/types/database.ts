export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  graphql_public: {
    Tables: {
      [_ in never]: never
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      graphql: {
        Args: {
          extensions?: Json
          operationName?: string
          query?: string
          variables?: Json
        }
        Returns: Json
      }
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
  public: {
    Tables: {
      audio_summary: {
        Row: {
          created_at: string | null
          id: string
          link: string | null
          note_id: string | null
          segments: Json | null
          status: Database["public"]["Enums"]["type_status"] | null
          transcript: string | null
          updated_at: string | null
          user_id: string | null
        }
        Insert: {
          created_at?: string | null
          id?: string
          link?: string | null
          note_id?: string | null
          segments?: Json | null
          status?: Database["public"]["Enums"]["type_status"] | null
          transcript?: string | null
          updated_at?: string | null
          user_id?: string | null
        }
        Update: {
          created_at?: string | null
          id?: string
          link?: string | null
          note_id?: string | null
          segments?: Json | null
          status?: Database["public"]["Enums"]["type_status"] | null
          transcript?: string | null
          updated_at?: string | null
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "audio_summary_note_id_fkey"
            columns: ["note_id"]
            isOneToOne: false
            referencedRelation: "notes"
            referencedColumns: ["id"]
          },
        ]
      }
      chat_messages: {
        Row: {
          chat_id: string | null
          created_at: string | null
          id: string
          is_system: boolean
          message: string
          metadata: Json | null
          note_id: string | null
          role: Database["public"]["Enums"]["message_role"]
          updated_at: string | null
          user_id: string | null
        }
        Insert: {
          chat_id?: string | null
          created_at?: string | null
          id?: string
          is_system?: boolean
          message: string
          metadata?: Json | null
          note_id?: string | null
          role: Database["public"]["Enums"]["message_role"]
          updated_at?: string | null
          user_id?: string | null
        }
        Update: {
          chat_id?: string | null
          created_at?: string | null
          id?: string
          is_system?: boolean
          message?: string
          metadata?: Json | null
          note_id?: string | null
          role?: Database["public"]["Enums"]["message_role"]
          updated_at?: string | null
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "chat_messages_chat_id_fkey"
            columns: ["chat_id"]
            isOneToOne: false
            referencedRelation: "chats"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "chat_messages_note_id_fkey"
            columns: ["note_id"]
            isOneToOne: false
            referencedRelation: "notes"
            referencedColumns: ["id"]
          },
        ]
      }
      chats: {
        Row: {
          created_at: string | null
          id: string
          is_archived: boolean | null
          last_message_at: string | null
          message_count: number | null
          note_id: string | null
          thread_id: string | null
          title: string | null
          updated_at: string | null
          user_id: string | null
        }
        Insert: {
          created_at?: string | null
          id?: string
          is_archived?: boolean | null
          last_message_at?: string | null
          message_count?: number | null
          note_id?: string | null
          thread_id?: string | null
          title?: string | null
          updated_at?: string | null
          user_id?: string | null
        }
        Update: {
          created_at?: string | null
          id?: string
          is_archived?: boolean | null
          last_message_at?: string | null
          message_count?: number | null
          note_id?: string | null
          thread_id?: string | null
          title?: string | null
          updated_at?: string | null
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "chats_note_id_fkey"
            columns: ["note_id"]
            isOneToOne: false
            referencedRelation: "notes"
            referencedColumns: ["id"]
          },
        ]
      }
      flashcards: {
        Row: {
          count: number | null
          created_at: string | null
          data: Json | null
          id: string
          note_id: string | null
          process_endtime: string | null
          process_start: string | null
          status: Database["public"]["Enums"]["flashcard_status"]
          updated_at: string | null
          user_id: string | null
        }
        Insert: {
          count?: number | null
          created_at?: string | null
          data?: Json | null
          id?: string
          note_id?: string | null
          process_endtime?: string | null
          process_start?: string | null
          status?: Database["public"]["Enums"]["flashcard_status"]
          updated_at?: string | null
          user_id?: string | null
        }
        Update: {
          count?: number | null
          created_at?: string | null
          data?: Json | null
          id?: string
          note_id?: string | null
          process_endtime?: string | null
          process_start?: string | null
          status?: Database["public"]["Enums"]["flashcard_status"]
          updated_at?: string | null
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "flashcards_note_id_fkey"
            columns: ["note_id"]
            isOneToOne: false
            referencedRelation: "notes"
            referencedColumns: ["id"]
          },
        ]
      }
      folders: {
        Row: {
          count: number
          created_at: string | null
          description: string | null
          id: string
          title: string | null
          updated_at: string | null
          user_id: string | null
        }
        Insert: {
          count?: number
          created_at?: string | null
          description?: string | null
          id?: string
          title?: string | null
          updated_at?: string | null
          user_id?: string | null
        }
        Update: {
          count?: number
          created_at?: string | null
          description?: string | null
          id?: string
          title?: string | null
          updated_at?: string | null
          user_id?: string | null
        }
        Relationships: []
      }
      image_summary: {
        Row: {
          created_at: string | null
          data: Json | null
          id: string
          note_id: string | null
          status: Database["public"]["Enums"]["type_status"] | null
          updated_at: string | null
          url: string | null
          user_id: string | null
        }
        Insert: {
          created_at?: string | null
          data?: Json | null
          id?: string
          note_id?: string | null
          status?: Database["public"]["Enums"]["type_status"] | null
          updated_at?: string | null
          url?: string | null
          user_id?: string | null
        }
        Update: {
          created_at?: string | null
          data?: Json | null
          id?: string
          note_id?: string | null
          status?: Database["public"]["Enums"]["type_status"] | null
          updated_at?: string | null
          url?: string | null
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "image_summary_note_id_fkey"
            columns: ["note_id"]
            isOneToOne: false
            referencedRelation: "notes"
            referencedColumns: ["id"]
          },
        ]
      }
      note_chunks: {
        Row: {
          chunk_index: number | null
          content: string | null
          created_at: string | null
          embedding: string | null
          id: string
          meta: Json | null
          note_id: string | null
          note_type: Database["public"]["Enums"]["note_type"] | null
          updated_at: string | null
          user_id: string | null
        }
        Insert: {
          chunk_index?: number | null
          content?: string | null
          created_at?: string | null
          embedding?: string | null
          id?: string
          meta?: Json | null
          note_id?: string | null
          note_type?: Database["public"]["Enums"]["note_type"] | null
          updated_at?: string | null
          user_id?: string | null
        }
        Update: {
          chunk_index?: number | null
          content?: string | null
          created_at?: string | null
          embedding?: string | null
          id?: string
          meta?: Json | null
          note_id?: string | null
          note_type?: Database["public"]["Enums"]["note_type"] | null
          updated_at?: string | null
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "note_chunks_note_id_fkey"
            columns: ["note_id"]
            isOneToOne: false
            referencedRelation: "notes"
            referencedColumns: ["id"]
          },
        ]
      }
      notes: {
        Row: {
          created_at: string | null
          favorite: boolean
          folder_id: string | null
          id: string
          language: string | null
          process_endtime: number | null
          process_start: number | null
          status: Database["public"]["Enums"]["note_status"] | null
          summary: string | null
          title: string | null
          type: Database["public"]["Enums"]["note_type"] | null
          updated_at: string | null
          user_id: string | null
        }
        Insert: {
          created_at?: string | null
          favorite?: boolean
          folder_id?: string | null
          id?: string
          language?: string | null
          process_endtime?: number | null
          process_start?: number | null
          status?: Database["public"]["Enums"]["note_status"] | null
          summary?: string | null
          title?: string | null
          type?: Database["public"]["Enums"]["note_type"] | null
          updated_at?: string | null
          user_id?: string | null
        }
        Update: {
          created_at?: string | null
          favorite?: boolean
          folder_id?: string | null
          id?: string
          language?: string | null
          process_endtime?: number | null
          process_start?: number | null
          status?: Database["public"]["Enums"]["note_status"] | null
          summary?: string | null
          title?: string | null
          type?: Database["public"]["Enums"]["note_type"] | null
          updated_at?: string | null
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "notes_folder_id_fkey"
            columns: ["folder_id"]
            isOneToOne: false
            referencedRelation: "folders"
            referencedColumns: ["id"]
          },
        ]
      }
      pdf_summary: {
        Row: {
          created_at: string | null
          data: Json | null
          id: string
          is_exported: boolean
          link: string | null
          note_id: string | null
          pages: Json | null
          pages_count: number | null
          size: number | null
          status: Database["public"]["Enums"]["type_status"] | null
          updated_at: string | null
          user_id: string | null
        }
        Insert: {
          created_at?: string | null
          data?: Json | null
          id?: string
          is_exported?: boolean
          link?: string | null
          note_id?: string | null
          pages?: Json | null
          pages_count?: number | null
          size?: number | null
          status?: Database["public"]["Enums"]["type_status"] | null
          updated_at?: string | null
          user_id?: string | null
        }
        Update: {
          created_at?: string | null
          data?: Json | null
          id?: string
          is_exported?: boolean
          link?: string | null
          note_id?: string | null
          pages?: Json | null
          pages_count?: number | null
          size?: number | null
          status?: Database["public"]["Enums"]["type_status"] | null
          updated_at?: string | null
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "pdf_summary_note_id_fkey"
            columns: ["note_id"]
            isOneToOne: false
            referencedRelation: "notes"
            referencedColumns: ["id"]
          },
        ]
      }
      quizz_history: {
        Row: {
          correct_count: number
          correct_questions: Json
          created_at: string
          id: string
          note_id: string
          quizz_id: string
          total: number
          user_id: string
          wrong_count: number
          wrong_questions: Json
        }
        Insert: {
          correct_count?: number
          correct_questions?: Json
          created_at?: string
          id?: string
          note_id: string
          quizz_id: string
          total?: number
          user_id: string
          wrong_count?: number
          wrong_questions?: Json
        }
        Update: {
          correct_count?: number
          correct_questions?: Json
          created_at?: string
          id?: string
          note_id?: string
          quizz_id?: string
          total?: number
          user_id?: string
          wrong_count?: number
          wrong_questions?: Json
        }
        Relationships: [
          {
            foreignKeyName: "quizz_history_note_id_fkey"
            columns: ["note_id"]
            isOneToOne: false
            referencedRelation: "notes"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "quizz_history_quizz_id_fkey"
            columns: ["quizz_id"]
            isOneToOne: false
            referencedRelation: "quizzes"
            referencedColumns: ["id"]
          },
        ]
      }
      quizzes: {
        Row: {
          count: number | null
          created_at: string | null
          data: Json | null
          id: string
          note_id: string | null
          process_endtime: string | null
          process_start: string | null
          status: Database["public"]["Enums"]["quiz_status"]
          updated_at: string | null
          user_id: string | null
        }
        Insert: {
          count?: number | null
          created_at?: string | null
          data?: Json | null
          id?: string
          note_id?: string | null
          process_endtime?: string | null
          process_start?: string | null
          status?: Database["public"]["Enums"]["quiz_status"]
          updated_at?: string | null
          user_id?: string | null
        }
        Update: {
          count?: number | null
          created_at?: string | null
          data?: Json | null
          id?: string
          note_id?: string | null
          process_endtime?: string | null
          process_start?: string | null
          status?: Database["public"]["Enums"]["quiz_status"]
          updated_at?: string | null
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "quizzes_note_id_fkey"
            columns: ["note_id"]
            isOneToOne: false
            referencedRelation: "notes"
            referencedColumns: ["id"]
          },
        ]
      }
      templates: {
        Row: {
          color: string | null
          created_at: string | null
          group_id: string | null
          icon: string | null
          id: string
          language: string | null
          name: string
          order: number | null
          prompt: string
          slug: string | null
        }
        Insert: {
          color?: string | null
          created_at?: string | null
          group_id?: string | null
          icon?: string | null
          id?: string
          language?: string | null
          name: string
          order?: number | null
          prompt: string
          slug?: string | null
        }
        Update: {
          color?: string | null
          created_at?: string | null
          group_id?: string | null
          icon?: string | null
          id?: string
          language?: string | null
          name?: string
          order?: number | null
          prompt?: string
          slug?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "templates_group_id_fkey"
            columns: ["group_id"]
            isOneToOne: false
            referencedRelation: "templates_group"
            referencedColumns: ["id"]
          },
        ]
      }
      templates_group: {
        Row: {
          color: string | null
          icon: string | null
          id: string
          language: string | null
          name: string
          slug: string | null
        }
        Insert: {
          color?: string | null
          icon?: string | null
          id?: string
          language?: string | null
          name: string
          slug?: string | null
        }
        Update: {
          color?: string | null
          icon?: string | null
          id?: string
          language?: string | null
          name?: string
          slug?: string | null
        }
        Relationships: []
      }
      text_summary: {
        Row: {
          created_at: string | null
          data: string | null
          id: string
          note_id: string | null
          status: Database["public"]["Enums"]["type_status"] | null
          updated_at: string | null
          user_id: string | null
        }
        Insert: {
          created_at?: string | null
          data?: string | null
          id?: string
          note_id?: string | null
          status?: Database["public"]["Enums"]["type_status"] | null
          updated_at?: string | null
          user_id?: string | null
        }
        Update: {
          created_at?: string | null
          data?: string | null
          id?: string
          note_id?: string | null
          status?: Database["public"]["Enums"]["type_status"] | null
          updated_at?: string | null
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "text_summary_note_id_fkey"
            columns: ["note_id"]
            isOneToOne: false
            referencedRelation: "notes"
            referencedColumns: ["id"]
          },
        ]
      }
      user_generated_templates: {
        Row: {
          created_at: string | null
          id: string
          status: Database["public"]["Enums"]["template_status"] | null
          template_id: string | null
          text: string
          updated_at: string | null
          user_id: string | null
        }
        Insert: {
          created_at?: string | null
          id?: string
          status?: Database["public"]["Enums"]["template_status"] | null
          template_id?: string | null
          text: string
          updated_at?: string | null
          user_id?: string | null
        }
        Update: {
          created_at?: string | null
          id?: string
          status?: Database["public"]["Enums"]["template_status"] | null
          template_id?: string | null
          text?: string
          updated_at?: string | null
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "user_generated_templates_template_id_fkey"
            columns: ["template_id"]
            isOneToOne: false
            referencedRelation: "templates"
            referencedColumns: ["id"]
          },
        ]
      }
      user_templates: {
        Row: {
          created_at: string | null
          icon: string | null
          id: string
          language: string | null
          name: string
          prompt: string
          user_id: string | null
        }
        Insert: {
          created_at?: string | null
          icon?: string | null
          id?: string
          language?: string | null
          name: string
          prompt: string
          user_id?: string | null
        }
        Update: {
          created_at?: string | null
          icon?: string | null
          id?: string
          language?: string | null
          name?: string
          prompt?: string
          user_id?: string | null
        }
        Relationships: []
      }
      users: {
        Row: {
          device_id: string | null
          device_type: Database["public"]["Enums"]["device_type"] | null
          email: string | null
          first_name: string | null
          id: string
          is_premium: boolean
          lang: string
          last_name: string | null
          onboarding_completed: boolean
          premium_type: Database["public"]["Enums"]["premium_type"]
          push_notification_token: string | null
          push_notifications_enabled: boolean | null
        }
        Insert: {
          device_id?: string | null
          device_type?: Database["public"]["Enums"]["device_type"] | null
          email?: string | null
          first_name?: string | null
          id: string
          is_premium?: boolean
          lang?: string
          last_name?: string | null
          onboarding_completed?: boolean
          premium_type?: Database["public"]["Enums"]["premium_type"]
          push_notification_token?: string | null
          push_notifications_enabled?: boolean | null
        }
        Update: {
          device_id?: string | null
          device_type?: Database["public"]["Enums"]["device_type"] | null
          email?: string | null
          first_name?: string | null
          id?: string
          is_premium?: boolean
          lang?: string
          last_name?: string | null
          onboarding_completed?: boolean
          premium_type?: Database["public"]["Enums"]["premium_type"]
          push_notification_token?: string | null
          push_notifications_enabled?: boolean | null
        }
        Relationships: []
      }
      youtube_summary: {
        Row: {
          available_langs: Json | null
          created_at: string | null
          id: string
          lang: string | null
          multiple: boolean | null
          note_id: string | null
          title: string | null
          transcripted_data: Json | null
          updated_at: string | null
          url: string | null
          user_id: string | null
        }
        Insert: {
          available_langs?: Json | null
          created_at?: string | null
          id?: string
          lang?: string | null
          multiple?: boolean | null
          note_id?: string | null
          title?: string | null
          transcripted_data?: Json | null
          updated_at?: string | null
          url?: string | null
          user_id?: string | null
        }
        Update: {
          available_langs?: Json | null
          created_at?: string | null
          id?: string
          lang?: string | null
          multiple?: boolean | null
          note_id?: string | null
          title?: string | null
          transcripted_data?: Json | null
          updated_at?: string | null
          url?: string | null
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "youtube_summary_note_id_fkey"
            columns: ["note_id"]
            isOneToOne: false
            referencedRelation: "notes"
            referencedColumns: ["id"]
          },
        ]
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      binary_quantize: {
        Args: { "": string } | { "": unknown }
        Returns: unknown
      }
      halfvec_avg: {
        Args: { "": number[] }
        Returns: unknown
      }
      halfvec_out: {
        Args: { "": unknown }
        Returns: unknown
      }
      halfvec_send: {
        Args: { "": unknown }
        Returns: string
      }
      halfvec_typmod_in: {
        Args: { "": unknown[] }
        Returns: number
      }
      hnsw_bit_support: {
        Args: { "": unknown }
        Returns: unknown
      }
      hnsw_halfvec_support: {
        Args: { "": unknown }
        Returns: unknown
      }
      hnsw_sparsevec_support: {
        Args: { "": unknown }
        Returns: unknown
      }
      hnswhandler: {
        Args: { "": unknown }
        Returns: unknown
      }
      ivfflat_bit_support: {
        Args: { "": unknown }
        Returns: unknown
      }
      ivfflat_halfvec_support: {
        Args: { "": unknown }
        Returns: unknown
      }
      ivfflathandler: {
        Args: { "": unknown }
        Returns: unknown
      }
      l2_norm: {
        Args: { "": unknown } | { "": unknown }
        Returns: number
      }
      l2_normalize: {
        Args: { "": string } | { "": unknown } | { "": unknown }
        Returns: unknown
      }
      match_note_chunks: {
        Args: {
          match_count?: number
          match_threshold?: number
          note_id_param: string
          query_embedding: string
          user_id_param: string
        }
        Returns: {
          chunk_index: number
          content: string
          id: string
          meta: Json
          note_type: Database["public"]["Enums"]["note_type"]
          similarity: number
        }[]
      }
      sparsevec_out: {
        Args: { "": unknown }
        Returns: unknown
      }
      sparsevec_send: {
        Args: { "": unknown }
        Returns: string
      }
      sparsevec_typmod_in: {
        Args: { "": unknown[] }
        Returns: number
      }
      vector_avg: {
        Args: { "": number[] }
        Returns: string
      }
      vector_dims: {
        Args: { "": string } | { "": unknown }
        Returns: number
      }
      vector_norm: {
        Args: { "": string }
        Returns: number
      }
      vector_out: {
        Args: { "": string }
        Returns: unknown
      }
      vector_send: {
        Args: { "": string }
        Returns: string
      }
      vector_typmod_in: {
        Args: { "": unknown[] }
        Returns: number
      }
    }
    Enums: {
      device_type: "ios" | "android"
      flashcard_status: "created" | "running" | "failed" | "completed"
      message_role: "user" | "assistant" | "system"
      note_status: "created" | "running" | "failed" | "completed"
      note_type:
        | "youtube"
        | "pdf"
        | "audio"
        | "website"
        | "image"
        | "meet"
        | "zoom"
        | "teams"
        | "text"
      premium_type: "none" | "pro" | "business"
      quiz_status: "created" | "running" | "failed" | "completed"
      template_status: "created" | "running" | "failed" | "completed"
      type_status: "created" | "running" | "failed" | "completed"
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
  graphql_public: {
    Enums: {},
  },
  public: {
    Enums: {
      device_type: ["ios", "android"],
      flashcard_status: ["created", "running", "failed", "completed"],
      message_role: ["user", "assistant", "system"],
      note_status: ["created", "running", "failed", "completed"],
      note_type: [
        "youtube",
        "pdf",
        "audio",
        "website",
        "image",
        "meet",
        "zoom",
        "teams",
        "text",
      ],
      premium_type: ["none", "pro", "business"],
      quiz_status: ["created", "running", "failed", "completed"],
      template_status: ["created", "running", "failed", "completed"],
      type_status: ["created", "running", "failed", "completed"],
    },
  },
} as const

