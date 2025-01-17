import { createClient } from '@supabase/supabase-js'
import { Database } from './supabase-types'

const supabaseUrl = 'https://oqdkzxnxkcsqwynsbthb.supabase.co'
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im9xZGt6eG54a2NzcXd5bnNidGhiIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MzcxNDg2NjgsImV4cCI6MjA1MjcyNDY2OH0.bGkE_j5Nu7SxcIC-AmkYP3jEhJqAdJawKXf4ZgUavZs'

if (!supabaseUrl || !supabaseKey) {
  throw new Error('Missing Supabase configuration')
}

export const supabase = createClient<Database>(supabaseUrl, supabaseKey)