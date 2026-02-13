import BlogForm from '@/components/admin/BlogForm';
import { getBlogPostBySlug, getAllBlogPostsAdmin } from '@/actions/blog';
import { notFound } from 'next/navigation';
import { createClient } from '@/lib/supabase/server';

export default async function EditBlogPostPage({ params }: { params: Promise<{ id: string }> }) {
    const { id } = await params;

    // We don't have getBlogPostById action exposed, but let's just fetch directly here or add it.
    // Simplest: use supabase direct call.
    const supabase = await createClient();
    const { data: post, error } = await supabase
        .from('blog_posts')
        .select('*')
        .eq('id', id)
        .single();

    if (error || !post) return notFound();

    return (
        <div className="space-y-6">
            <h1 className="text-2xl font-bold text-gray-900">Edit Post</h1>
            <BlogForm initialData={post} />
        </div>
    );
}
