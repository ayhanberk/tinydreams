import Link from 'next/link';
import { ArrowRight } from 'lucide-react';
import { getBlogPosts } from '@/actions/blog';
import Image from 'next/image';

export default async function BlogPreview() {
    // Fetch only latest 3 posts
    const allPosts = await getBlogPosts();
    const latestPosts = allPosts.slice(0, 3);

    if (latestPosts.length === 0) return null;

    return (
        <section className="py-20 bg-white">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between items-end mb-12">
                    <div>
                        <h2 className="text-3xl font-bold text-gray-900 mb-2">TinyDreams Journal</h2>
                        <p className="text-gray-500">Tips, guides, and stories for modern parents.</p>
                    </div>
                    <Link href="/blog" className="hidden md:flex items-center gap-2 text-primary font-medium hover:underline">
                        View All Posts <ArrowRight className="w-4 h-4" />
                    </Link>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    {latestPosts.map((post: any) => (
                        <Link
                            href={`/blog/${post.slug}`}
                            key={post.id}
                            className="group block"
                        >
                            <div className="relative aspect-[4/3] rounded-2xl overflow-hidden mb-4 bg-gray-100">
                                {post.cover_image ? (
                                    <Image
                                        src={post.cover_image}
                                        alt={post.title}
                                        fill
                                        className="object-cover transition-transform duration-500 group-hover:scale-105"
                                    />
                                ) : (
                                    <div className="w-full h-full flex items-center justify-center text-gray-300 text-xl font-bold">TD</div>
                                )}
                            </div>
                            <h3 className="text-xl font-bold text-gray-900 mb-2 group-hover:text-primary transition-colors">
                                {post.title}
                            </h3>
                            <p className="text-gray-600 line-clamp-2 text-sm">
                                {post.excerpt}
                            </p>
                        </Link>
                    ))}
                </div>

                <div className="mt-8 text-center md:hidden">
                    <Link href="/blog" className="inline-flex items-center gap-2 text-primary font-medium">
                        View All Posts <ArrowRight className="w-4 h-4" />
                    </Link>
                </div>
            </div>
        </section>
    );
}
