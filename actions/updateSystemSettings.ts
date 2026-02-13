'use server';

import { createClient } from '@/lib/supabase/server';
import { revalidatePath } from 'next/cache';

export async function updateSystemSettings(key: string, value: any) {
    const supabase = await createClient();

    // Check if admin (RLS handles this too, but good for early exit)
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw new Error('Unauthorized');

    const { error } = await supabase
        .from('system_settings')
        .update({ value, updated_at: new Date().toISOString() })
        .eq('key', key);

    if (error) throw new Error(error.message);

    revalidatePath('/admin/settings');
    return { success: true };
}
