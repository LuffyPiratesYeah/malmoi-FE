import { createClient } from '@supabase/supabase-js';
import { getCloudflareContext } from "@opennextjs/cloudflare";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseServiceKey =  await getCloudflareContext().env.SUPABASE_SERVICE_ROLE_KEY.get();

if (!supabaseUrl || !supabaseServiceKey) {
  throw new Error('Missing Supabase environment variables');
}

// Server-side client with service role key for admin operations
export const supabaseAdmin = createClient(supabaseUrl, supabaseServiceKey, {
  auth: {
    autoRefreshToken: false,
    persistSession: false
  }
});
