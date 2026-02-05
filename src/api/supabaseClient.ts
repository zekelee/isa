import { createClient } from '@supabase/supabase-js'
import type { Database } from '@/types'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY

// Vite 환경변수가 없을 경우에 대한 예외 처리
if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error(
    'Supabase URL 또는 Anon Key가 설정되지 않았습니다. .env.local 파일을 확인하세요.'
  )
}

export const supabase = createClient<Database>(supabaseUrl, supabaseAnonKey)
