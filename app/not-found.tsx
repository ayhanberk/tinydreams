import Link from 'next/link';
import { Button } from '@/components/ui/Button';
import { ArrowLeft } from 'lucide-react';

export default function NotFound() {
    return (
        <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50 text-center px-4">
            <h1 className="text-9xl font-bold text-primary opacity-20 select-none">404</h1>
            <div className="absolute">
                <h2 className="text-4xl font-bold text-gray-900 mb-4">Page Not Found</h2>
                <p className="text-gray-600 mb-8 max-w-md mx-auto">
                    Oops! It seems like you've wandered into a dreamy void. The page you are looking for doesn't exist or has been moved.
                </p>
                <Link href="/">
                    <Button size="lg" className="shadow-lg shadow-primary/25 gap-2">
                        <ArrowLeft className="w-4 h-4" />
                        Back to Home
                    </Button>
                </Link>
            </div>
        </div>
    );
}
