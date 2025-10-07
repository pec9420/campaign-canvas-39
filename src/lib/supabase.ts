import { createClient } from '@supabase/supabase-js';

// Environment detection
const isLocal = import.meta.env.MODE === 'development';

// Supabase client configuration with environment detection
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL ||
  (isLocal ? 'http://127.0.0.1:54321' : '');

const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || '';

// Create Supabase client
export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// Check if Supabase is configured
export const isSupabaseConfigured = () => {
  return Boolean(supabaseUrl && supabaseAnonKey);
};

// Get current environment
export const getSupabaseEnvironment = () => {
  if (!isSupabaseConfigured()) return 'not-configured';
  if (supabaseUrl.includes('127.0.0.1') || supabaseUrl.includes('localhost')) {
    return 'local';
  }
  return 'cloud';
};

// Debug helper (only in development)
if (isLocal && import.meta.env.DEV) {
  console.log('🔧 Supabase Environment:', getSupabaseEnvironment());
  console.log('🔗 Supabase URL:', supabaseUrl || 'Not configured');
  console.log('🔑 Anon Key:', supabaseAnonKey ? '✓ Present' : '✗ Missing');
}
