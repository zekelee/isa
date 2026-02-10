import { create } from 'zustand'
import { v4 as uuidv4 } from 'uuid'
import type { Database } from '@/types'
import { supabase } from '@/api/supabaseClient'

type Todo = Database['public']['Tables']['todos']['Row']
type TodoInsert = Database['public']['Tables']['todos']['Insert']
type TodoUpdate = Database['public']['Tables']['todos']['Update']

interface TodoState {
  todos: Todo[]
  fetchTodos: () => Promise<void>
  addTodo: (task: string) => Promise<void>
  toggleTodo: (todoId: string) => Promise<void>
  updateTodo: (todoId: string, update: TodoUpdate) => Promise<void>
  removeTodo: (todoId: string) => Promise<void>
}

export const useTodoStore = create<TodoState>((set, get) => ({
  todos: [],
  fetchTodos: async () => {
    const { data, error } = await supabase.from('todos').select('*').order('sort_order')
    if (error) {
      console.error('Error fetching todos:', error)
      return
    }
    set({ todos: data })
  },
  addTodo: async (task) => {
    const maxOrder = get().todos.reduce((max, current) => Math.max(max, current.sort_order), 0)
    const newTodo: TodoInsert = {
      id: uuidv4(),
      task,
      completed: false,
      created_at: new Date().toISOString(),
      sort_order: maxOrder + 1
    }

    set((state) => ({ todos: [...state.todos, newTodo as Todo] }))

    const { error } = await supabase.from('todos').insert(newTodo)
    if (error) {
      console.error('Error adding todo:', error)
      set((state) => ({ todos: state.todos.filter((t) => t.id !== newTodo.id) }))
    }
  },
  toggleTodo: async (todoId) => {
    const todo = get().todos.find((t) => t.id === todoId)
    if (!todo) return

    const updated = { ...todo, completed: !todo.completed }
    set((state) => ({
      todos: state.todos.map((t) => (t.id === todoId ? updated : t))
    }))

    const { error } = await supabase
      .from('todos')
      .update({ completed: updated.completed })
      .eq('id', todoId)
    if (error) {
      console.error('Error toggling todo:', error)
      set((state) => ({
        todos: state.todos.map((t) => (t.id === todoId ? todo : t))
      }))
    }
  },
  updateTodo: async (todoId, update) => {
    const oldTodos = get().todos
    set((state) => ({
      todos: state.todos.map((t) => (t.id === todoId ? { ...t, ...update } : t))
    }))

    const { error } = await supabase.from('todos').update(update).eq('id', todoId)
    if (error) {
      console.error('Error updating todo:', error)
      set({ todos: oldTodos })
    }
  },
  removeTodo: async (todoId) => {
    const oldTodos = get().todos
    set((state) => ({ todos: state.todos.filter((t) => t.id !== todoId) }))

    const { error } = await supabase.from('todos').delete().eq('id', todoId)
    if (error) {
      console.error('Error removing todo:', error)
      set({ todos: oldTodos })
    }
  }
}))
