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
          width: number
          depth: number
          price: number | null
          status: 'todo' | 'bought' | 'installed' | null
          purchase_url: string | null
        }
        Insert: {
          id?: string
          name: string
          width: number
          depth: number
          price?: number | null
          status?: 'todo' | 'bought' | 'installed' | null
          purchase_url?: string | null
        }
        Update: {
          id?: string
          name?: string
          width?: number
          depth?: number
          price?: number | null
          status?: 'todo' | 'bought' | 'installed' | null
          purchase_url?: string | null
        }
        Relationships: []
      }
      checklists: {
        Row: {
          id: string
          task: string
          completed: boolean
          created_at: string
        }
        Insert: {
          id?: string
          task: string
          completed?: boolean
          created_at?: string
        }
        Update: {
          id?: string
          task?: string
          completed?: boolean
          created_at?: string
        }
        Relationships: []
      }
      placements: {
        Row: {
          item_id: string
          x: number
          y: number
          rotation: number
        }
        Insert: {
          item_id: string
          x?: number
          y?: number
          rotation?: number
        }
        Update: {
          item_id?: string
          x?: number
          y?: number
          rotation?: number
        }
        Relationships: [
          {
            foreignKeyName: "placements_item_id_fkey"
            columns: ["item_id"]
            referencedRelation: "items"
            referencedColumns: ["id"]
          }
        ]
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
