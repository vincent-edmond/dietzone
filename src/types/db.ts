export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  __InternalSupabase: {
    PostgrestVersion: "14.5"
  }
  public: {
    Tables: {
      brands: {
        Row: {
          created_at: string
          id: string
          logo_url: string | null
          name: string
          slug: string
        }
        Insert: {
          created_at?: string
          id?: string
          logo_url?: string | null
          name: string
          slug: string
        }
        Update: {
          created_at?: string
          id?: string
          logo_url?: string | null
          name?: string
          slug?: string
        }
        Relationships: []
      }
      categories: {
        Row: {
          created_at: string
          id: string
          name: string
          position: number
          slug: string
        }
        Insert: {
          created_at?: string
          id?: string
          name: string
          position?: number
          slug: string
        }
        Update: {
          created_at?: string
          id?: string
          name?: string
          position?: number
          slug?: string
        }
        Relationships: []
      }
      objectives: {
        Row: {
          id: string
          name: string
          slug: string
        }
        Insert: {
          id?: string
          name: string
          slug: string
        }
        Update: {
          id?: string
          name?: string
          slug?: string
        }
        Relationships: []
      }
      product_objectives: {
        Row: {
          objective_id: string
          product_id: string
        }
        Insert: {
          objective_id: string
          product_id: string
        }
        Update: {
          objective_id?: string
          product_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "product_objectives_objective_id_fkey"
            columns: ["objective_id"]
            isOneToOne: false
            referencedRelation: "objectives"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "product_objectives_product_id_fkey"
            columns: ["product_id"]
            isOneToOne: false
            referencedRelation: "products"
            referencedColumns: ["id"]
          },
        ]
      }
      product_variants: {
        Row: {
          created_at: string
          id: string
          is_active: boolean
          label: string
          price_cents: number
          product_id: string
          sku: string | null
          stock_qty: number
        }
        Insert: {
          created_at?: string
          id?: string
          is_active?: boolean
          label: string
          price_cents: number
          product_id: string
          sku?: string | null
          stock_qty?: number
        }
        Update: {
          created_at?: string
          id?: string
          is_active?: boolean
          label?: string
          price_cents?: number
          product_id?: string
          sku?: string | null
          stock_qty?: number
        }
        Relationships: [
          {
            foreignKeyName: "product_variants_product_id_fkey"
            columns: ["product_id"]
            isOneToOne: false
            referencedRelation: "products"
            referencedColumns: ["id"]
          },
        ]
      }
      products: {
        Row: {
          brand_id: string | null
          category_id: string | null
          created_at: string
          description: string
          id: string
          images: string[]
          is_active: boolean
          name: string
          slug: string
        }
        Insert: {
          brand_id?: string | null
          category_id?: string | null
          created_at?: string
          description?: string
          id?: string
          images?: string[]
          is_active?: boolean
          name: string
          slug: string
        }
        Update: {
          brand_id?: string | null
          category_id?: string | null
          created_at?: string
          description?: string
          id?: string
          images?: string[]
          is_active?: boolean
          name?: string
          slug?: string
        }
        Relationships: [
          {
            foreignKeyName: "products_brand_id_fkey"
            columns: ["brand_id"]
            isOneToOne: false
            referencedRelation: "brands"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "products_category_id_fkey"
            columns: ["category_id"]
            isOneToOne: false
            referencedRelation: "categories"
            referencedColumns: ["id"]
          },
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
