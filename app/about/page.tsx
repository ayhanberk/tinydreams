import Image from 'next/image';
import { Heart, ShieldCheck, Smile } from 'lucide-react';

export default function AboutPage() {
    return (
        <div className="bg-white">
            {/* Hero Section */}
            <div className="relative py-20 bg-rose-50 overflow-hidden">
                <div className="absolute inset-0 opacity-10">
                    <svg className="h-full w-full" viewBox="0 0 100 100" preserveAspectRatio="none">
                        <path d="M0 100 C 20 0 50 0 100 100 Z" fill="currentColor" className="text-rose-200" />
                    </svg>
                </div>
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-center">
                    <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6 font-heading">
                        Dreaming Big for Little Ones
                    </h1>
                    <p className="text-xl text-gray-600 max-w-2xl mx-auto leading-relaxed">
                        At TinyDreams, we believe every child deserves a world filled with comfort, safety, and imagination. Our journey began with a simple promise: to create products that parents trust and babies love.
                    </p>
                </div>
            </div>

            {/* Mission Section */}
            <div className="py-16 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
                    <div className="relative aspect-square rounded-3xl overflow-hidden shadow-2xl rotate-3 hover:rotate-0 transition-transform duration-500">
                        <Image
                            src="https://images.unsplash.com/photo-1519689680058-324335c77eba?q=80&w=1600&auto=format&fit=crop"
                            alt="TinyDreams Philosophy"
                            fill
                            className="object-cover"
                        />
                    </div>
                    <div className="space-y-6">
                        <h2 className="text-3xl font-bold text-gray-900">Our Mission</h2>
                        <p className="text-gray-600 text-lg leading-relaxed">
                            We are dedicated to providing premium quality baby products that blend functionality with beautiful design. We understand the joys and challenges of parenting, which is why every item in our collection is carefully curated and rigorously tested.
                        </p>
                        <p className="text-gray-600 text-lg leading-relaxed">
                            From our softest organic cottons to our innovative nursery essentials, we are here to support you through every milestone of your little one&apos;s growth.
                        </p>
                    </div>
                </div>
            </div>

            {/* Values Section */}
            <div className="bg-gray-50 py-20">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="text-center mb-16">
                        <h2 className="text-3xl font-bold text-gray-900">Why Parents Trust Us</h2>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                        <div className="bg-white p-8 rounded-2xl shadow-sm text-center transform hover:-translate-y-2 transition-transform duration-300">
                            <div className="w-16 h-16 bg-blue-50 rounded-full flex items-center justify-center mx-auto mb-6">
                                <ShieldCheck className="w-8 h-8 text-blue-500" />
                            </div>
                            <h3 className="text-xl font-bold text-gray-900 mb-4">Safety First</h3>
                            <p className="text-gray-600">
                                All our products meet or exceed international safety standards. We use non-toxic materials and rigorous testing protocols.
                            </p>
                        </div>
                        <div className="bg-white p-8 rounded-2xl shadow-sm text-center transform hover:-translate-y-2 transition-transform duration-300">
                            <div className="w-16 h-16 bg-rose-50 rounded-full flex items-center justify-center mx-auto mb-6">
                                <Heart className="w-8 h-8 text-rose-500" />
                            </div>
                            <h3 className="text-xl font-bold text-gray-900 mb-4">Made with Love</h3>
                            <p className="text-gray-600">
                                Crafted with care and attention to detail. We choose soft, durable fabrics that are gentle on your baby&apos;s delicate skin.
                            </p>
                        </div>
                        <div className="bg-white p-8 rounded-2xl shadow-sm text-center transform hover:-translate-y-2 transition-transform duration-300">
                            <div className="w-16 h-16 bg-green-50 rounded-full flex items-center justify-center mx-auto mb-6">
                                <Smile className="w-8 h-8 text-green-500" />
                            </div>
                            <h3 className="text-xl font-bold text-gray-900 mb-4">Customer Happiness</h3>
                            <p className="text-gray-600">
                                We are committed to your satisfaction. Our friendly support team is always ready to help you find the perfect product.
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
