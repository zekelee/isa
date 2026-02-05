import { create } from 'zustand'
import type { Database } from '@/types'
import { supabase } from '@/api/supabaseClient'

type Placement = Database['public']['Tables']['placements']['Row']

interface PlacementState {
  placements: Placement[]
  fetchPlacements: () => Promise<void>
  setPlacement: (placement: Placement) => void
  updatePlacement: (itemId: string, placementUpdate: Partial<Placement>) => void
}

export const usePlacementStore = create<PlacementState>((set) => ({
  placements: [],
  fetchPlacements: async () => {
    const { data, error } = await supabase.from('placements').select('*');
    if (error) {
      console.error('Error fetching placements:', error);
    } else {
      set({ placements: data });
    }
  },
  setPlacement: (placement) =>
    set((state) => {
      const exists = state.placements.find(p => p.item_id === placement.item_id);
      if (exists) {
        return {
          placements: state.placements.map(p =>
            p.item_id === placement.item_id ? placement : p
          ),
        };
      }
      return { placements: [...state.placements, placement] };
    }),
  updatePlacement: (itemId, placementUpdate) =>
    set((state) => ({
      placements: state.placements.map((p) =>
        p.item_id === itemId ? { ...p, ...placementUpdate } : p
      ),
    })),
}));
