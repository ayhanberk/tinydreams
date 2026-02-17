'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { createClient } from '@/lib/supabase/client';
import { Button } from '@/components/ui/Button';
import { Loader2, ArrowLeft } from 'lucide-react';
import Link from 'next/link';
import { useToast } from '@/context/ToastContext';

interface BlogPostData {
    id?: string;
    title?: string;
    slug?: string;
    content?: string;
    excerpt?: string;
    cover_image?: string;
    is_published?: boolean;
}

interface BlogFormProps {
    initialData?: BlogPostData;
}

export default function BlogForm({ initialData }: BlogFormProps) {
    const router = useRouter();
    const { showToast } = useToast();
    const [isLoading, setIsLoading] = useState(false);
    const [formData, setFormData] = useState({
        title: initialData?.title || '',
        slug: initialData?.slug || '',
        content: initialData?.content || '',
        excerpt: initialData?.excerpt || '',
        cover_image: initialData?.cover_image || '',
        is_published: initialData?.is_published || false
    });

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleSlugGen = () => {
        const slug = formData.title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, '');
        setFormData(prev => ({ ...prev, slug }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);
        const supabase = createClient();

        try {
            if (initialData?.id) {
                // Update
                const { error } = await supabase
                    .from('blog_posts')
                    .update(formData)
                    .eq('id', initialData.id);
                if (error) throw error;
                showToast('Post updated successfully', 'success');
            } else {
                // Create
                const { error } = await supabase
                    .from('blog_posts')
                    .insert(formData);
                if (error) throw error;
                showToast('Post created successfully', 'success');
            }
            router.push('/admin/blog');
            router.refresh();
        } catch (error: unknown) {
            console.error(error);
            showToast(error instanceof Error ? error.message : 'An error occurred', 'error');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-6 max-w-4xl bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
            <div className="flex justify-between items-center mb-4">
                <Link href="/admin/blog" className="text-gray-500 hover:text-gray-700 flex items-center gap-2">
                    <ArrowLeft className="w-4 h-4" /> Back
                </Link>
                <div className="flex items-center gap-2">
                    <label className="flex items-center gap-2 cursor-pointer">
                        <input
                            type="checkbox"
                            name="is_published"
                            checked={formData.is_published}
                            onChange={(e) => setFormData(prev => ({ ...prev, is_published: e.target.checked }))}
                            className="w-4 h-4 text-primary rounded border-gray-300"
                        />
                        <span className="text-sm font-medium text-gray-700">Publish immediately</span>
                    </label>
                </div>
            </div>

            <div className="grid grid-cols-1 gap-6">
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Title</label>
                    <input
                        type="text"
                        name="title"
                        value={formData.title}
                        onChange={handleChange}
                        onBlur={!initialData ? handleSlugGen : undefined}
                        required
                        className="w-full px-4 py-2 border border-gray-200 rounded-xl focus:ring-2 focus:ring-primary/20 outline-none"
                    />
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Slug</label>
                    <input
                        type="text"
                        name="slug"
                        value={formData.slug}
                        onChange={handleChange}
                        required
                        className="w-full px-4 py-2 border border-gray-200 rounded-xl focus:ring-2 focus:ring-primary/20 outline-none bg-gray-50"
                    />
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Cover Image URL</label>
                    <input
                        type="text"
                        name="cover_image"
                        value={formData.cover_image}
                        onChange={handleChange}
                        className="w-full px-4 py-2 border border-gray-200 rounded-xl focus:ring-2 focus:ring-primary/20 outline-none"
                    />
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Excerpt</label>
                    <textarea
                        name="excerpt"
                        value={formData.excerpt}
                        onChange={handleChange}
                        rows={3}
                        className="w-full px-4 py-2 border border-gray-200 rounded-xl focus:ring-2 focus:ring-primary/20 outline-none"
                    />
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Content (Markdown)</label>
                    <textarea
                        name="content"
                        value={formData.content}
                        onChange={handleChange}
                        required
                        rows={15}
                        className="w-full px-4 py-2 border border-gray-200 rounded-xl focus:ring-2 focus:ring-primary/20 outline-none font-mono text-sm"
                    />
                    <p className="text-xs text-gray-500 mt-2">Supports basic Markdown formatting.</p>
                </div>
            </div>

            <div className="pt-4 border-t border-gray-100 flex justify-end">
                <Button type="submit" disabled={isLoading} className="w-32">
                    {isLoading ? <Loader2 className="animate-spin w-5 h-5" /> : 'Save Post'}
                </Button>
            </div>
        </form>
    );
}
