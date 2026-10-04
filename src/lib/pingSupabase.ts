import { supabaseAdmin } from '@/lib/supabase';

export async function pingSupabase(): Promise<boolean> {
  if (!supabaseAdmin) return false;
  const { error } = await supabaseAdmin.from('admin_users').select('id').limit(1);
  if (error) console.error('[pingSupabase] failed:', error.message);
  return !error;
}