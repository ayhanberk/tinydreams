'use server';

import { createClient } from '@/lib/supabase/server';
import { revalidatePath } from 'next/cache';

// --- Profile ---

export async function getUserProfile() {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) return null;

    const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', user.id)
        .single();

    if (error) {
        // If profile doesn't exist, might need to handle or return partial user data
        return null;
    }

    return { ...data, email: user.email };
}

// --- Orders ---

export async function getUserOrders() {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) return [];

    const { data, error } = await supabase
        .from('orders')
        .select(`
            id,
            total_amount,
            status,
            created_at,
            order_items (
                id,
                quantity,
                price,
                product_id,
                products (
                    name,
                    images
                )
            )
        `)
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });

    if (error) throw new Error(error.message);

    return data;
}

// --- Addresses ---

export async function getUserAddresses() {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) return [];

    const { data, error } = await supabase
        .from('addresses')
        .select('*')
        .eq('user_id', user.id)
        .order('is_default', { ascending: false });

    if (error) throw new Error(error.message);

    return data;
}

export async function addUserAddress(address: any) {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) throw new Error('Unauthorized');

    // If setting as default, unset others first
    if (address.is_default) {
        await supabase
            .from('addresses')
            .update({ is_default: false })
            .eq('user_id', user.id);
    }

    const { error } = await supabase
        .from('addresses')
        .insert({ ...address, user_id: user.id });

    if (error) throw new Error(error.message);

    revalidatePath('/profile/addresses');
    return { success: true };
}

export async function deleteUserAddress(id: string) {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) throw new Error('Unauthorized');

    const { error } = await supabase
        .from('addresses')
        .delete()
        .match({ id, user_id: user.id });

    if (error) throw new Error(error.message);

    revalidatePath('/profile/addresses');
    return { success: true };
}
