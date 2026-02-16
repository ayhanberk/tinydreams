'use server';

import { createClient } from '@/lib/supabase/server';
import { revalidatePath } from 'next/cache';

export async function getBabyProfiles() {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) return [];

    const { data, error } = await supabase
        .from('baby_profiles')
        .select('*')
        .eq('user_id', user.id)
        .order('birth_date', { ascending: false });

    if (error) {
        console.error('Error fetching baby profiles:', error);
        return [];
    }

    return data;
}

export async function addBabyProfile(profile: any) {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) throw new Error('Unauthorized');

    const { error } = await supabase
        .from('baby_profiles')
        .insert({ ...profile, user_id: user.id });

    if (error) throw new Error(error.message);

    revalidatePath('/profile/family');
    return { success: true };
}

export async function updateBabyProfile(id: string, updates: any) {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) throw new Error('Unauthorized');

    const { error } = await supabase
        .from('baby_profiles')
        .update(updates)
        .match({ id, user_id: user.id });

    if (error) throw new Error(error.message);

    revalidatePath('/profile/family');
    return { success: true };
}

export async function deleteBabyProfile(id: string) {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) throw new Error('Unauthorized');

    const { error } = await supabase
        .from('baby_profiles')
        .delete()
        .match({ id, user_id: user.id });

    if (error) throw new Error(error.message);

    revalidatePath('/profile/family');
    return { success: true };
}
