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
      items: {
        Row: {
          id: string
          name: string
          price: number | null
          memo: string | null
          purchased: boolean
          sort_order: number
        }
        Insert: {
          id?: string
          name: string
          price?: number | null
          memo?: string | null
          purchased?: boolean
          sort_order?: number
        }
        Update: {
          id?: string
          name?: string
          price?: number | null
          memo?: string | null
          purchased?: boolean
          sort_order?: number
        }
        Relationships: []
      }
      todos: {
        Row: {
          id: string
          task: string
          completed: boolean
          created_at: string
          sort_order: number
        }
        Insert: {
          id?: string
          task: string
          completed?: boolean
          created_at?: string
          sort_order?: number
        }
        Update: {
          id?: string
          task?: string
          completed?: boolean
          created_at?: string
          sort_order?: number
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}
