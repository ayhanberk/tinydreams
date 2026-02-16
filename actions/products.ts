'use server';

import { createClient } from '@/lib/supabase/server';

export async function getFeaturedProducts() {
    const supabase = await createClient();

    const { data, error } = await supabase
        .from('products')
        .select(`
            id,
            title,
            price,
            image_url,
            slug,
            category,
            categories (
                slug,
                name
            )
        `)
        .eq('is_featured', true)
        .limit(4);

    if (error) {
        console.error('Error fetching featured products:', error);
        return [];
    }

    return data.map((p: any) => ({
        id: p.id,
        title: p.title,
        price: p.price,
        image: p.image_url || '/placeholder.png', // Adapter for ProductCard
        category: p.categories?.name || p.category,
        categorySlug: p.categories?.slug || p.category?.toLowerCase(),
        slug: p.slug
    }));
}

export async function getRelatedProducts(categoryId: string, currentProductId: string) {
    const supabase = await createClient();

    const { data, error } = await supabase
        .from('products')
        .select(`
            id,
            title,
            price,
            image_url,
            slug,
            category,
            categories (
                slug,
                name
            )
        `)
        .eq('category', categoryId)
        .neq('id', currentProductId)
        .limit(4);

    if (error) {
        console.error('Error fetching related products:', error);
        return [];
    }

    return data.map((p: any) => ({
        id: p.id,
        title: p.title,
        price: p.price,
        image: p.image_url || '/placeholder.png',
        category: p.categories?.name || p.category,
        categorySlug: p.categories?.slug || p.category?.toLowerCase(),
        slug: p.slug
    }));
}
