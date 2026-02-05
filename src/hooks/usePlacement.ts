// src/hooks/usePlacement.ts
import { useCallback } from 'react';
import { supabase } from '@/api/supabaseClient';
import { usePlacementStore } from '@/store/usePlacementStore';

export const usePlacement = () => {
  const { setPlacement } = usePlacementStore();

  const updatePlacement = useCallback(
    async (itemId: string, x: number, y: number) => {
      const { data, error } = await supabase
        .from('placements')
        .upsert(
          { item_id: itemId, x, y },
          { onConflict: 'item_id' }
        )
        .select()
        .single(); // .single() to get the upserted row back

      if (error) {
        console.error('Error updating placement:', error);
        return;
      }

      if (data) {
        // Zustand 스토어 업데이트
        setPlacement(data);
      }
    },
    [setPlacement]
  );

  return { updatePlacement };
};