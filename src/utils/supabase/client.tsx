import { createClient } from '@supabase/supabase-js';
import { projectId, publicAnonKey } from './info';

// Create a singleton Supabase client to avoid multiple instances
const supabaseClient = createClient(
  `https://${projectId}.supabase.co`,
  publicAnonKey
);

export function getSupabaseClient() {
  return supabaseClient;
}