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
            title,
            price,
            image_url,
            slug,
            colors,
            sizes,
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

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    return data.map((p: any) => ({
        id: p.id,
        title: p.title,
        price: p.price,
        image: p.image_url || '/placeholder.png', // Adapter for ProductCard
        category: p.categories?.name || p.category,
        categorySlug: p.categories?.slug || p.category?.toLowerCase(),
        slug: p.slug,
        colors: p.colors,
        sizes: p.sizes
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
            title,
            price,
            image_url,
            slug,
            colors,
            sizes,
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

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    return data.map((p: any) => ({
        id: p.id,
        title: p.title,
        price: p.price,
        image: p.image_url || '/placeholder.png',
        category: p.categories?.name || p.category,
        categorySlug: p.categories?.slug || p.category?.toLowerCase(),
        slug: p.slug,
        colors: p.colors,
        sizes: p.sizes
    }));
}

export async function getRecommendedProducts(userId: string) {
    const supabase = await createClient();

    // 1. Get user's baby profiles
    const { data: profiles } = await supabase
        .from('baby_profiles')
        .select('birth_date')
        .eq('user_id', userId);

    if (!profiles || profiles.length === 0) return [];

    // 2. Calculate ages in months
    const today = new Date();
    const agesInMonths = profiles.map(p => {
        const birth = new Date(p.birth_date);
        let months = (today.getFullYear() - birth.getFullYear()) * 12;
        months -= birth.getMonth();
        months += today.getMonth();
        return months < 0 ? 0 : months; // Treat future dates (due dates) as 0
    });

    if (agesInMonths.length === 0) return [];

    // 3. Find products matching ANY of the ages
    // Logic: min_age <= age <= max_age
    // OR products with no age restriction (general) - optional, but let's focus on age-specific first.

    // Constructing an OR query for each child's age might be complex in Supabase JS syntax directly if strictly typed.
    // Easier approach: Get all products with age ranges, then filter in memory if dataset is small, 
    // OR use specific range queries.
    // Let's try to find products that overlap with the age range of the children.

    // Simplifying for MVP: Find products suitable for the youngest child (or widely applicable).
    // Better: Fetch products where min_age is defined.

    const { data: products, error } = await supabase
        .from('products')
        .select(`
            id,
            title,
            price,
            image_url,
            slug,
            category,
            min_age_months,
            max_age_months,
            colors,
            sizes,
            categories (slug, name)
        `)
        .not('min_age_months', 'is', null) // Only age-specific products
        .limit(20);

    if (error || !products) return [];

    // Filter in JS for flexible matching
    const recommended = products.filter(p => {
        const min = p.min_age_months || 0;
        // If max is null, it means "min and up", so infinite.
        const max = p.max_age_months || 999;

        // Check if ANY child fits this product
        return agesInMonths.some(age => age >= min && age <= max);
    }).slice(0, 4); // Limit to top 4

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    return recommended.map((p: any) => ({
        id: p.id,
        title: p.title,
        price: p.price,
        image: p.image_url || '/placeholder.png',
        category: p.categories?.name || p.category,
        categorySlug: p.categories?.slug || p.category?.toLowerCase(),
        slug: p.slug,
        colors: p.colors,
        sizes: p.sizes
    }));
}
