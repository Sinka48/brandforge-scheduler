import { createClient } from '@supabase/supabase-js'
import { Database } from './supabase-types'

const supabaseUrl = 'https://oqdkzxnxkcsqwynsbthb.supabase.co'
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im9xZGt6eG54a2NzcXd5bnNidGhiIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MDk2NTk1NzgsImV4cCI6MjAyNTIzNTU3OH0.XB6mxXgDRQB4ZLwxq4vn1vn69mOhkVbxQ9NSXQtf0Yw'

if (!supabaseUrl || !supabaseKey) {
  throw new Error('Missing Supabase configuration')
}

export const supabase = createClient<Database>(supabaseUrl, supabaseKey)