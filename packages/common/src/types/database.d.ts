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
          operationName?: string
          query?: string
          variables?: Json
          extensions?: Json
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
      [_ in never]: never
    }
    Views: {
      elwood_activity: {
        Row: {
          asset_id: string | null
          asset_type: string | null
          attachments: Json | null
          created_at: string | null
          id: string | null
          is_deleted: boolean | null
          is_resolved: boolean | null
          member_id: string | null
          text: string | null
          type: "COMMENT" | "REACTION" | "LIKE" | null
          updated_at: string | null
          user_id: string | null
        }
        Insert: {
          asset_id?: string | null
          asset_type?: string | null
          attachments?: Json | null
          created_at?: string | null
          id?: string | null
          is_deleted?: boolean | null
          is_resolved?: boolean | null
          member_id?: string | null
          text?: string | null
          type?: "COMMENT" | "REACTION" | "LIKE" | null
          updated_at?: string | null
          user_id?: string | null
        }
        Update: {
          asset_id?: string | null
          asset_type?: string | null
          attachments?: Json | null
          created_at?: string | null
          id?: string | null
          is_deleted?: boolean | null
          is_resolved?: boolean | null
          member_id?: string | null
          text?: string | null
          type?: "COMMENT" | "REACTION" | "LIKE" | null
          updated_at?: string | null
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "elwood_activity_member_id"
            columns: ["member_id"]
            isOneToOne: false
            referencedRelation: "member"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "elwood_activity_member_id"
            columns: ["member_id"]
            isOneToOne: false
            referencedRelation: "elwood_member"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "elwood_activity_user_id"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      elwood_bookmark: {
        Row: {
          asset_id: string | null
          asset_type: string | null
          created_at: string | null
          id: string | null
          is_active: boolean | null
          is_subscribed: boolean | null
          member_id: string | null
          updated_at: string | null
          user_id: string | null
        }
        Insert: {
          asset_id?: string | null
          asset_type?: string | null
          created_at?: string | null
          id?: string | null
          is_active?: boolean | null
          is_subscribed?: boolean | null
          member_id?: string | null
          updated_at?: string | null
          user_id?: string | null
        }
        Update: {
          asset_id?: string | null
          asset_type?: string | null
          created_at?: string | null
          id?: string | null
          is_active?: boolean | null
          is_subscribed?: boolean | null
          member_id?: string | null
          updated_at?: string | null
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "elwood_activity_member_id"
            columns: ["member_id"]
            isOneToOne: false
            referencedRelation: "member"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "elwood_activity_member_id"
            columns: ["member_id"]
            isOneToOne: false
            referencedRelation: "elwood_member"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "elwood_activity_user_id"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      elwood_member: {
        Row: {
          added_by_user_id: string | null
          created_at: string | null
          display_name: string | null
          id: string | null
          role: "ADMIN" | "MANAGER" | "MEMBER" | null
          type: Database["public"]["Enums"]["elwood_member_type"] | null
          updated_at: string | null
          user_id: string | null
          username: string | null
        }
        Insert: {
          added_by_user_id?: string | null
          created_at?: string | null
          display_name?: string | null
          id?: string | null
          role?: "ADMIN" | "MANAGER" | "MEMBER" | null
          type?: Database["public"]["Enums"]["elwood_member_type"] | null
          updated_at?: string | null
          user_id?: string | null
          username?: string | null
        }
        Update: {
          added_by_user_id?: string | null
          created_at?: string | null
          display_name?: string | null
          id?: string | null
          role?: "ADMIN" | "MANAGER" | "MEMBER" | null
          type?: Database["public"]["Enums"]["elwood_member_type"] | null
          updated_at?: string | null
          user_id?: string | null
          username?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "elwood_member_added_by_user_id"
            columns: ["added_by_user_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "elwood_member_user_id"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
    }
    Functions: {
      elwood_get_node: {
        Args: {
          p_path: string[]
          p_limit?: number
          p_offset?: number
        }
        Returns: Json
      }
      elwood_get_node_tree: {
        Args: {
          p_path: string[]
        }
        Returns: Json
      }
    }
    Enums: {
      elwood_member_type: "USER" | "TEAM"
      elwood_node_type: "TREE" | "BLOB" | "BUCKET"
    }
    CompositeTypes: {
      elwood_get_node_result: {
        node: Database["public"]["CompositeTypes"]["elwood_node"] | null
        parent: Database["public"]["CompositeTypes"]["elwood_node"] | null
        children: Database["public"]["CompositeTypes"]["elwood_node"][] | null
        key_children: string[] | null
      }
      elwood_get_node_tree_result: {
        rootNodeId: string | null
        expandedIds: string[] | null
        tree: Database["public"]["CompositeTypes"]["elwood_node_tree"][] | null
      }
      elwood_node: {
        id: string | null
        object_id: string | null
        type: Database["public"]["Enums"]["elwood_node_type"] | null
        prefix: string[] | null
        name: string | null
        mime_type: string | null
        size: number | null
      }
      elwood_node_tree: {
        node: Database["public"]["CompositeTypes"]["elwood_node"] | null
        id: string | null
        parent: string | null
      }
      elwood_storage_search_result: {
        name: string | null
        id: string | null
        updated_at: string | null
        created_at: string | null
        last_accessed_at: string | null
        metadata: Json | null
      }
    }
  }
  storage: {
    Tables: {
      buckets: {
        Row: {
          allowed_mime_types: string[] | null
          avif_autodetection: boolean | null
          created_at: string | null
          file_size_limit: number | null
          id: string
          name: string
          owner: string | null
          owner_id: string | null
          public: boolean | null
          updated_at: string | null
        }
        Insert: {
          allowed_mime_types?: string[] | null
          avif_autodetection?: boolean | null
          created_at?: string | null
          file_size_limit?: number | null
          id: string
          name: string
          owner?: string | null
          owner_id?: string | null
          public?: boolean | null
          updated_at?: string | null
        }
        Update: {
          allowed_mime_types?: string[] | null
          avif_autodetection?: boolean | null
          created_at?: string | null
          file_size_limit?: number | null
          id?: string
          name?: string
          owner?: string | null
          owner_id?: string | null
          public?: boolean | null
          updated_at?: string | null
        }
        Relationships: []
      }
      migrations: {
        Row: {
          executed_at: string | null
          hash: string
          id: number
          name: string
        }
        Insert: {
          executed_at?: string | null
          hash: string
          id: number
          name: string
        }
        Update: {
          executed_at?: string | null
          hash?: string
          id?: number
          name?: string
        }
        Relationships: []
      }
      objects: {
        Row: {
          bucket_id: string | null
          created_at: string | null
          id: string
          last_accessed_at: string | null
          metadata: Json | null
          name: string | null
          owner: string | null
          owner_id: string | null
          path_tokens: string[] | null
          updated_at: string | null
          version: string | null
        }
        Insert: {
          bucket_id?: string | null
          created_at?: string | null
          id?: string
          last_accessed_at?: string | null
          metadata?: Json | null
          name?: string | null
          owner?: string | null
          owner_id?: string | null
          path_tokens?: string[] | null
          updated_at?: string | null
          version?: string | null
        }
        Update: {
          bucket_id?: string | null
          created_at?: string | null
          id?: string
          last_accessed_at?: string | null
          metadata?: Json | null
          name?: string | null
          owner?: string | null
          owner_id?: string | null
          path_tokens?: string[] | null
          updated_at?: string | null
          version?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "objects_bucketId_fkey"
            columns: ["bucket_id"]
            isOneToOne: false
            referencedRelation: "buckets"
            referencedColumns: ["id"]
          },
        ]
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      can_insert_object: {
        Args: {
          bucketid: string
          name: string
          owner: string
          metadata: Json
        }
        Returns: undefined
      }
      extension: {
        Args: {
          name: string
        }
        Returns: string
      }
      filename: {
        Args: {
          name: string
        }
        Returns: string
      }
      foldername: {
        Args: {
          name: string
        }
        Returns: string[]
      }
      get_size_by_bucket: {
        Args: Record<PropertyKey, never>
        Returns: {
          size: number
          bucket_id: string
        }[]
      }
      search: {
        Args: {
          prefix: string
          bucketname: string
          limits?: number
          levels?: number
          offsets?: number
          search?: string
          sortcolumn?: string
          sortorder?: string
        }
        Returns: {
          name: string
          id: string
          updated_at: string
          created_at: string
          last_accessed_at: string
          metadata: Json
        }[]
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

