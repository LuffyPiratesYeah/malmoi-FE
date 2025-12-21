import { createClient, type SupabaseClient } from '@supabase/supabase-js';
import { getCloudflareContext } from "@opennextjs/cloudflare";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;

let supabaseAdminPromise: Promise<SupabaseClient> | null = null;

async function getServiceRoleKey() {
  try {
    const { env } = await getCloudflareContext({ async: true });
    const secretBinding = env?.SUPABASE_SERVICE_ROLE_KEY;

    if (secretBinding && typeof secretBinding.get === 'function') {
      return await secretBinding.get();
    }
  } catch {
    // Ignore errors when Cloudflare context is not available (e.g., during static builds)
  }

  const fallbackKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (fallbackKey) {
    return fallbackKey;
  }

  throw new Error('Missing Supabase service role key');
}

async function createSupabaseAdmin() {
  if (!supabaseUrl) {
    throw new Error('Missing Supabase environment variables');
  }

  const supabaseServiceKey = await getServiceRoleKey();

  return createClient(supabaseUrl, supabaseServiceKey, {
    auth: {
      autoRefreshToken: false,
      persistSession: false
    },
    global: {
      fetch: (url, options = {}) => {
        return fetch(url, {
          ...options,
          // Set a reasonable timeout (30 seconds)
          signal: AbortSignal.timeout(30000)
        });
      }
    }
  });
}

export function getSupabaseAdmin() {
  if (!supabaseAdminPromise) {
    supabaseAdminPromise = createSupabaseAdmin();
  }

  return supabaseAdminPromise;
}
