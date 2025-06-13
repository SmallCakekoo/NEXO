import { createClient } from '@supabase/supabase-js'

const supabaseUrl = 'https://memzodwtovttlhzniqyt.supabase.co'
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im1lbXpvZHd0b3Z0dGxoem5pcXl0Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDk2MTMzMzIsImV4cCI6MjA2NTE4OTMzMn0.jQurabPC3Ua2sctyZ9z5Ys_rAXpVquc4pmCTylwRpPM'

export const supabase = createClient(supabaseUrl, supabaseKey)