'use server';

import { createClient } from '@/lib/supabase/server';

export async function getBlogPosts() {
    const supabase = await createClient();

    const { data, error } = await supabase
        .from('blog_posts')
        .select('*')
        .eq('is_published', true)
        .order('published_at', { ascending: false });

    if (error) throw new Error(error.message);

    return data;
}

export async function getBlogPostBySlug(slug: string) {
    const supabase = await createClient();

    const { data, error } = await supabase
        .from('blog_posts')
        .select('*')
        .eq('slug', slug)
        .eq('is_published', true)
        .single();

    if (error) return null;

    return data;
}

// Admin actions (to be implemented later in Admin Panel enhancements)
export async function getAllBlogPostsAdmin() {
    const supabase = await createClient();

    // Check admin role logic here if strictly needed per action, 
    // but RLS should handle the "select all" restriction if properly set.

    const { data, error } = await supabase
        .from('blog_posts')
        .select('*')
        .order('created_at', { ascending: false });

    if (error) throw new Error(error.message);

    return data;
}
