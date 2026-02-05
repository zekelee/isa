import { create } from 'zustand'
import type { Database } from '@/types'
import { supabase } from '@/api/supabaseClient'
import { v4 as uuidv4 } from 'uuid'

type Item = Database['public']['Tables']['items']['Row']
type ItemInsert = Database['public']['Tables']['items']['Insert']

interface ItemState {
  items: Item[]
  fetchItems: () => Promise<void>
  addItem: (item: Omit<ItemInsert, 'id'>) => Promise<void>
  updateItem: (itemId: string, itemUpdate: Partial<Item>) => Promise<void>
  removeItem: (itemId: string) => Promise<void>
}

export const useItemStore = create<ItemState>((set, get) => ({
  items: [],
  fetchItems: async () => {
    const { data, error } = await supabase.from('items').select('*');
    if (error) {
      console.error('Error fetching items:', error);
    } else {
      set({ items: data });
    }
  },
  addItem: async (item) => {
    const defaults = {
      width: 0,
      depth: 0,
      price: null,
      status: 'todo' as const,
      purchase_url: null,
    };
    const newItem: Item = {
      ...defaults,
      ...item,
      id: uuidv4(), // id는 항상 새로 생성하여 덮어씁니다.
    };

    const oldItems = get().items;
    set({ items: [...oldItems, newItem] });

    const { error } = await supabase.from('items').insert(newItem);
    if (error) {
      console.error('Error adding item:', error);
      set({ items: oldItems }); // 에러 발생 시 롤백
    }
  },
  updateItem: async (itemId, itemUpdate) => {
    const oldItems = get().items;
    set(state => ({
      items: state.items.map(i => i.id === itemId ? { ...i, ...itemUpdate } : i)
    }));

    const { error } = await supabase.from('items').update(itemUpdate).eq('id', itemId);
    if (error) {
      console.error('Error updating item:', error);
      set({ items: oldItems });
    }
  },
  removeItem: async (itemId) => {
    const oldItems = get().items;
    set(state => ({ items: state.items.filter(i => i.id !== itemId) }));

    const { error } = await supabase.from('items').delete().eq('id', itemId);
    if (error) {
      console.error('Error removing item:', error);
      set({ items: oldItems });
    }
  },
}));
