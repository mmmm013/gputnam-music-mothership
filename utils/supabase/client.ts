import { createClient as createSupabaseClient, SupabaseClient } from '@supabase/supabase-js';

export const createClient = (): SupabaseClient | null => {
  if (typeof window === 'undefined') return null;
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  if (!url || !anonKey) {
    console.warn('Missing NEXT_PUBLIC_SUPABASE_URL or NEXT_PUBLIC_SUPABASE_ANON_KEY; returning null supabase client.');
    return null;
  }
  return createSupabaseClient(url, anonKey);
};
export default createClient;