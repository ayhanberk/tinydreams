import { getAllBlogPostsAdmin } from '@/actions/blog';
import { Button } from '@/components/ui/Button';
import Link from 'next/link';
import { Plus, Edit } from 'lucide-react';
import Image from 'next/image';

export default async function AdminBlogPage() {
    // We need to implement getAllBlogPostsAdmin in actions/blog.ts properly first.
    // Assuming it's implemented or I will implement it now.
    const posts = await getAllBlogPostsAdmin();

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900">Blog Posts</h1>
                    <p className="text-gray-500">Manage your blog content and stories.</p>
                </div>
                <Link href="/admin/blog/new">
                    <Button className="flex items-center gap-2 rounded-xl shadow-lg shadow-primary/20">
                        <Plus className="w-5 h-5" />
                        New Post
                    </Button>
                </Link>
            </div>

            <div className="grid grid-cols-1 gap-6">
                {/* eslint-disable-next-line @typescript-eslint/no-explicit-any */}
                {posts.map((post: any) => (
                    <div key={post.id} className="bg-white p-4 rounded-xl border border-gray-100 flex gap-6 items-center shadow-sm hover:shadow-md transition-all">
                        <div className="w-24 h-16 bg-gray-100 rounded-lg overflow-hidden relative shrink-0">
                            {post.cover_image ? (
                                <Image src={post.cover_image} alt={post.title} fill className="object-cover" />
                            ) : (
                                <div className="w-full h-full flex items-center justify-center text-gray-300">TD</div>
                            )}
                        </div>
                        <div className="flex-1">
                            <h3 className="font-bold text-gray-900 line-clamp-1">{post.title}</h3>
                            <p className="text-sm text-gray-500 line-clamp-1">{post.excerpt}</p>
                            <div className="flex items-center gap-2 mt-2 text-xs">
                                <span className={`px-2 py-0.5 rounded-full ${post.is_published ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'}`}>
                                    {post.is_published ? 'Published' : 'Draft'}
                                </span>
                                <span className="text-gray-400">
                                    {new Date(post.created_at).toLocaleDateString()}
                                </span>
                            </div>
                        </div>
                        <div className="flex items-center gap-2">
                            <Link href={`/admin/blog/${post.id}`}>
                                <Button variant="outline" size="sm" className="h-9 w-9 p-0 rounded-lg">
                                    <Edit className="w-4 h-4" />
                                </Button>
                            </Link>
                            {/* Delete button would go here */}
                        </div>
                    </div>
                ))}

                {posts.length === 0 && (
                    <div className="text-center py-12 bg-gray-50 rounded-2xl border border-dashed border-gray-200">
                        <p className="text-gray-500">No blog posts found. Create one to get started!</p>
                    </div>
                )}
            </div>
        </div>
    );
}
