'use server';

import { createClient } from '@/lib/supabase/server';
import { revalidatePath } from 'next/cache';

export async function getAllReviewsAdmin() {
    const supabase = await createClient();

    const { data, error } = await supabase
        .from('reviews')
        .select(`
            id,
            rating,
            comment,
            is_approved,
            created_at,
            user_id,
            product_id,
            products (
                title,
                slug
            )
        `)
        .order('created_at', { ascending: false });

    if (error) throw new Error(error.message);

    // Fetch profiles manually as referenced before, or try relational if set up
    // For now, let's just return data. The UI can display user_id or we can fetch profiles here.
    // Fetching profiles is better for UX.

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const reviewsWithProfiles = await Promise.all(data.map(async (review: any) => {
        const { data: profile } = await supabase
            .from('profiles')
            .select('full_name, avatar_url')
            .eq('id', review.user_id)
            .single();
        return { ...review, profile };
    }));

    return reviewsWithProfiles;
}

export async function approveReview(id: string) {
    const supabase = await createClient();

    const { error } = await supabase
        .from('reviews')
        .update({ is_approved: true })
        .eq('id', id);

    if (error) throw new Error(error.message);

    revalidatePath('/admin/reviews');
    revalidatePath('/shop'); // approximate revalidation
    return { success: true };
}

export async function deleteReview(id: string) {
    const supabase = await createClient();

    const { error } = await supabase
        .from('reviews')
        .delete()
        .eq('id', id);

    if (error) throw new Error(error.message);

    revalidatePath('/admin/reviews');
    return { success: true };
}
