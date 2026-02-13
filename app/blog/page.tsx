import { getBlogPosts } from '@/actions/blog';
import Link from 'next/link';
import Image from 'next/image';
import { Calendar, User } from 'lucide-react';

export default async function BlogPage() {
    const posts = await getBlogPosts();

    return (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
            <div className="text-center mb-12">
                <h1 className="text-4xl font-bold text-gray-900 mb-4 font-heading">TinyDreams Blog</h1>
                <p className="text-xl text-gray-600 max-w-2xl mx-auto">
                    Expert advice, parenting tips, and updates from the TinyDreams family.
                </p>
            </div>

            {posts.length === 0 ? (
                <div className="text-center py-20 bg-gray-50 rounded-3xl border border-gray-100">
                    <p className="text-gray-500 text-lg">No stories yet. Stay tuned!</p>
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {posts.map((post: any) => (
                        <Link href={`/blog/${post.slug}`} key={post.id} className="group flex flex-col h-full bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 border border-gray-100">
                            <div className="relative aspect-[16/9] overflow-hidden bg-gray-100">
                                {post.cover_image ? (
                                    <Image
                                        src={post.cover_image}
                                        alt={post.title}
                                        fill
                                        className="object-cover transition-transform duration-500 group-hover:scale-105"
                                    />
                                ) : (
                                    <div className="flex items-center justify-center h-full bg-blue-50 text-blue-200">
                                        <div className="text-4xl font-bold">TD</div>
                                    </div>
                                )}
                            </div>
                            <div className="p-6 flex-1 flex flex-col">
                                <h2 className="text-xl font-bold text-gray-900 mb-3 group-hover:text-primary transition-colors line-clamp-2">
                                    {post.title}
                                </h2>
                                <p className="text-gray-600 mb-4 line-clamp-3 flex-1">
                                    {post.excerpt || 'Read the full story to learn more...'}
                                </p>
                                <div className="flex items-center justify-between text-sm text-gray-400 mt-auto pt-4 border-t border-gray-50">
                                    <div className="flex items-center gap-2">
                                        <Calendar className="w-4 h-4" />
                                        <span>{new Date(post.published_at || post.created_at).toLocaleDateString()}</span>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <span className="font-medium text-primary">Read More</span>
                                    </div>
                                </div>
                            </div>
                        </Link>
                    ))}
                </div>
            )}
        </div>
    );
}
