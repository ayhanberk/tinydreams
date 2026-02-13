import { createBrowserClient } from '@supabase/ssr';

export function createClient() {
    return createBrowserClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
    );
}

export const supabase = createClient();

// Also export a singleton for legacy usage if needed, though createClient() is preferred for SSR/Cookies.
// But forcing function usage is better now.
