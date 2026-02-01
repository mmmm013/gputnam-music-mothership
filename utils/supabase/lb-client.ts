/**
 * Supabase Client Configuration for lb Schema
 * 
 * This file shows how to configure the Supabase client to work with
 * the lb (Library/Licensing Backend) schema.
 */

import { createClient as createSupabaseClient } from '@supabase/supabase-js';
import type { Database } from '@/types/database';

/**
 * Create a Supabase client configured for the lb schema
 * 
 * Note: When using tables from the lb schema, reference them by table name only.
 * The schema is configured in supabase/config.toml to be exposed in the API
 * and added to the search path.
 * 
 * Example:
 *   supabase.from('tracks')        // ✅ Correct
 *   supabase.from('lb.tracks')     // ❌ Incorrect - will fail
 */
export function createClient() {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

  return createSupabaseClient<Database>(supabaseUrl, supabaseAnonKey, {
    db: {
      schema: 'lb', // Set default schema to lb
    },
  });
}

/**
 * Alternative: Create client with public schema as default
 * Use this if you need to access both public and lb schemas
 */
export function createMultiSchemaClient() {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

  return createSupabaseClient<Database>(supabaseUrl, supabaseAnonKey);
}

/**
 * Usage examples:
 */

// Example 1: Using lb schema as default
async function exampleLbDefault() {
  const supabase = createClient();
  
  // All queries default to lb schema
  const { data: tracks } = await supabase
    .from('tracks')
    .select('*');
    
  const { data: works } = await supabase
    .from('works')
    .select('*');
    
  // Call RPC functions from lb schema
  const { data: summary } = await supabase
    .rpc('compliance_summary_per_work');
    
  return { tracks, works, summary };
}

// Example 2: Using multi-schema approach
async function exampleMultiSchema() {
  const supabase = createMultiSchemaClient();
  
  // Explicitly specify schema using schema() method
  const { data: tracks } = await supabase
    .schema('lb')
    .from('tracks')
    .select('*');
    
  // Or use public schema
  const { data: users } = await supabase
    .schema('public')
    .from('users')
    .select('*');
    
  return { tracks, users };
}

/**
 * Important Notes:
 * 
 * 1. Table References:
 *    - Use table name only: .from('tracks')
 *    - Do NOT use: .from('lb.tracks')
 * 
 * 2. RPC Functions:
 *    - Call directly: .rpc('compliance_sweep')
 *    - The lb schema is in the search_path (configured in config.toml)
 * 
 * 3. Row Level Security:
 *    - All RLS policies are enforced based on auth.uid()
 *    - Organization context is determined by lb.get_org_id()
 * 
 * 4. Storage Buckets:
 *    - Use bucket names directly: .from('tracks')
 *    - Follow folder convention: {org_id}/{user_id}/filename
 */
