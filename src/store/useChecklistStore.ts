import { create } from 'zustand'
import type { Database } from '@/types'
import { supabase } from '@/api/supabaseClient'; //
import { v4 as uuidv4 } from 'uuid';


type ChecklistItem = Database['public']['Tables']['checklists']['Row']

interface ChecklistState {
  tasks: ChecklistItem[];
  fetchTasks: () => Promise<void>;
  addTask: (taskText: string) => Promise<void>;
  toggleTask: (taskId: string) => Promise<void>;
  removeTask: (taskId: string) => Promise<void>;
}

export const useChecklistStore = create<ChecklistState>((set, get) => ({
  tasks: [],
  fetchTasks: async () => {
    const { data, error } = await supabase.from('checklists').select('*').order('created_at');
    if (error) {
      console.error('Error fetching tasks:', error);
    } else {
      set({ tasks: data });
    }
  },
  addTask: async (taskText) => {
    const newTask: ChecklistItem = {
      id: uuidv4(),
      task: taskText,
      completed: false,
      created_at: new Date().toISOString(),
    };
    set((state) => ({ tasks: [...state.tasks, newTask] }));
    const { error } = await supabase.from('checklists').insert(newTask);
    if (error) {
      console.error('Error adding task:', error);
      // Revert state on error
      set((state) => ({ tasks: state.tasks.filter(t => t.id !== newTask.id) }));
    }
  },
  toggleTask: async (taskId) => {
    const task = get().tasks.find(t => t.id === taskId);
    if (!task) return;

    const updatedTask = { ...task, completed: !task.completed };
    set(state => ({
      tasks: state.tasks.map(t => t.id === taskId ? updatedTask : t)
    }));

    const { error } = await supabase.from('checklists').update({ completed: updatedTask.completed }).eq('id', taskId);
    if (error) {
      console.error('Error toggling task:', error);
      // Revert state on error
      set(state => ({
        tasks: state.tasks.map(t => t.id === taskId ? task : t)
      }));
    }
  },
  removeTask: async (taskId) => {
    const oldTasks = get().tasks;
    set(state => ({ tasks: state.tasks.filter(t => t.id !== taskId) }));

    const { error } = await supabase.from('checklists').delete().eq('id', taskId);
    if (error) {
      console.error('Error removing task:', error);
      // Revert state on error
      set({ tasks: oldTasks });
    }
  }
}));
