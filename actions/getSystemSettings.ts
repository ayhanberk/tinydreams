'use server';

import { createClient } from '@/lib/supabase/server';

export async function getSystemSettings() {
    const supabase = await createClient();

    const { data, error } = await supabase
        .from('system_settings')
        .select('*');

    if (error) throw new Error(error.message);

    // Transform array to object for easier consumption
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const settings: Record<string, any> = {};
    data.forEach(item => {
        settings[item.key] = item.value;
    });

    return settings;
}
