import { create } from 'zustand'
import { v4 as uuidv4 } from 'uuid'
import type { Database } from '@/types'
import { supabase } from '@/api/supabaseClient'

type Item = Database['public']['Tables']['items']['Row']
type ItemInsert = Database['public']['Tables']['items']['Insert']
type ItemUpdate = Database['public']['Tables']['items']['Update']

interface ItemState {
  items: Item[]
  fetchItems: () => Promise<void>
  addItem: (item: Omit<ItemInsert, 'id'>) => Promise<void>
  updateItem: (itemId: string, itemUpdate: ItemUpdate) => Promise<void>
  removeItem: (itemId: string) => Promise<void>
}

export const useItemStore = create<ItemState>((set, get) => ({
  items: [],
  fetchItems: async () => {
    const { data, error } = await supabase.from('items').select('*').order('sort_order')
    if (error) {
      console.error('Error fetching items:', error)
      return
    }
    set({ items: data })
  },
  addItem: async (item) => {
    const maxOrder = get().items.reduce((max, current) => Math.max(max, current.sort_order), 0)
    const newItem: Item = {
      id: uuidv4(),
      name: item.name,
      price: item.price ?? null,
      memo: item.memo ?? null,
      purchased: item.purchased ?? false,
      sort_order: item.sort_order ?? maxOrder + 1
    }

    const oldItems = get().items
    set({ items: [...oldItems, newItem] })

    const { error } = await supabase.from('items').insert(newItem)
    if (error) {
      console.error('Error adding item:', error)
      set({ items: oldItems })
    }
  },
  updateItem: async (itemId, itemUpdate) => {
    const oldItems = get().items
    set((state) => ({
      items: state.items.map((i) => (i.id === itemId ? { ...i, ...itemUpdate } : i))
    }))

    const { error } = await supabase.from('items').update(itemUpdate).eq('id', itemId)
    if (error) {
      console.error('Error updating item:', error)
      set({ items: oldItems })
    }
  },
  removeItem: async (itemId) => {
    const oldItems = get().items
    set((state) => ({ items: state.items.filter((i) => i.id !== itemId) }))

    const { error } = await supabase.from('items').delete().eq('id', itemId)
    if (error) {
      console.error('Error removing item:', error)
      set({ items: oldItems })
    }
  }
}))
