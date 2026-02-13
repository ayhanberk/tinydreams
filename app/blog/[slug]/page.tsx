import { getBlogPostBySlug } from '@/actions/blog';
import { notFound } from 'next/navigation';
import Image from 'next/image';
import { Calendar, ArrowLeft } from 'lucide-react';
import Link from 'next/link';
// import ReactMarkdown from 'react-markdown'; 
// Since we don't have react-markdown installed yet, I'll render as simple text/html or install it.
// For simplicity in this step, I will just render text, or dangerouslySetInnerHTML if we assume admin content is safe (it usually is if limited to admins).
// Let's stick to safe text for now or simple paragraphs.

export default async function BlogPostPage({ params }: { params: Promise<{ slug: string }> }) {
    // Await params as required in Next.js 15+
    const { slug } = await params;

    const post = await getBlogPostBySlug(slug);

    if (!post) return notFound();

    return (
        <article className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
            <Link href="/blog" className="inline-flex items-center gap-2 text-gray-500 hover:text-primary mb-8 transition-colors">
                <ArrowLeft className="w-4 h-4" />
                Back to Blog
            </Link>

            <header className="mb-8 text-center">
                <div className="flex items-center justify-center gap-2 text-gray-500 text-sm mb-4">
                    <Calendar className="w-4 h-4" />
                    <time>{new Date(post.published_at || post.created_at).toLocaleDateString(undefined, { dateStyle: 'long' })}</time>
                </div>
                <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-gray-900 mb-6 font-heading leading-tight">
                    {post.title}
                </h1>
            </header>

            {post.cover_image && (
                <div className="relative aspect-[2/1] w-full rounded-3xl overflow-hidden mb-12 shadow-md">
                    <Image
                        src={post.cover_image}
                        alt={post.title}
                        fill
                        className="object-cover"
                        priority
                    />
                </div>
            )}

            <div className="prose prose-lg prose-blue mx-auto text-gray-700">
                {/* 
                   For now, simply rendering content. 
                   In a real app, use a markdown renderer like 'react-markdown' 
                */}
                <div className="whitespace-pre-wrap">{post.content}</div>
            </div>
        </article>
    );
}
