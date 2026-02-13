import BlogForm from '@/components/admin/BlogForm';

export default function NewBlogPostPage() {
    return (
        <div className="space-y-6">
            <h1 className="text-2xl font-bold text-gray-900">Create New Post</h1>
            <BlogForm />
        </div>
    );
}
