'use server';

import { createClient } from '@/lib/supabase/server';
import { revalidatePath } from 'next/cache';

export async function addToWishlist(productId: string) {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
        throw new Error('You must be logged in to add items to your wishlist.');
    }

    const { error } = await supabase
        .from('wishlists')
        .insert({ user_id: user.id, product_id: productId })
        .single();

    if (error) {
        // Ignore duplicate key error (already in wishlist)
        if (error.code === '23505') return { success: true };
        throw new Error(error.message);
    }

    revalidatePath('/wishlist');
    revalidatePath(`/shop/${productId}`); // Revalidate product page
    return { success: true };
}

export async function removeFromWishlist(productId: string) {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) throw new Error('Unauthorized');

    const { error } = await supabase
        .from('wishlists')
        .delete()
        .match({ user_id: user.id, product_id: productId });

    if (error) throw new Error(error.message);

    revalidatePath('/wishlist');
    revalidatePath(`/shop/${productId}`);
    return { success: true };
}

export async function getWishlist() {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) return [];

    const { data, error } = await supabase
        .from('wishlists')
        .select(`
            product_id,
            products (
                id,
                title,
                price,
                images,
                slug,
                category,
                categories (
                    slug,
                    name
                )
            )
        `)
        .eq('user_id', user.id);

    if (error) throw new Error(error.message);

    // Flatten and Map structure for ProductCard
    return data.map((item: any) => {
        const p = item.products;
        return {
            id: p.id,
            title: p.title,
            price: p.price,
            image: p.images?.[0] || '/placeholder.png',
            category: p.categories?.name || p.category,
            categorySlug: p.categories?.slug || p.category?.toLowerCase(),
            slug: p.slug
        };
    });
}

export async function checkInWishlist(productId: string) {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) return false;

    const { data, error } = await supabase
        .from('wishlists')
        .select('id')
        .match({ user_id: user.id, product_id: productId })
        .single();

    return !!data;
}
