import { createClient } from '@supabase/supabase-js'
import { Database } from './supabase-types'

// Default to development values if environment variables are not set
const supabaseUrl = 'https://xyzcompany.supabase.co'
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...'

if (!supabaseUrl || !supabaseKey) {
  throw new Error('Missing Supabase URL or Key')
}

export const supabase = createClient<Database>(supabaseUrl, supabaseKey)