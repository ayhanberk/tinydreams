'use client';

import { useParams } from 'next/navigation';
import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Star, Truck, ShieldCheck, ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import Link from 'next/link';
import { useCart } from '@/context/CartContext';
import { supabase } from '@/lib/supabase';
import Reviews from '@/components/product/Reviews';
import WishlistButton from '@/components/product/WishlistButton';

export default function ProductDetailsPage() {
    const params = useParams();
    // params.slug is the last segment, params.category is the second to last
    const { slug, category } = params as { slug: string; category: string };

    const [product, setProduct] = useState<any>(null);
    const [loading, setLoading] = useState(true);
    const [quantity, setQuantity] = useState(1);
    const { addToCart } = useCart();

    const [selectedColor, setSelectedColor] = useState<string | null>(null);
    const [selectedSize, setSelectedSize] = useState<string | null>(null);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchProduct = async () => {
            if (!slug) return;
            // Fetch by slug
            const { data, error } = await supabase
                .from('products')
                .select('*, categories(name, slug)')
                .eq('slug', slug)
                .single();

            if (error) {
                console.error('Error fetching product:', error);
            } else {
                setProduct({
                    ...data,
                    category: data.categories?.name || data.category,
                    categorySlug: data.categories?.slug
                });
            }
            setLoading(false);
        };
        fetchProduct();
    }, [slug]);

    if (loading) {
        return <div className="min-h-screen flex items-center justify-center">Loading product...</div>;
    }

    if (!product) {
        return (
            <div className="min-h-screen flex flex-col items-center justify-center p-20 text-center">
                <h2 className="text-2xl font-bold mb-4">Product not found</h2>
                <Link href="/shop">
                    <Button>Return to Shop</Button>
                </Link>
            </div>
        );
    }

    const handleAddToCart = () => {
        if (product.colors && product.colors.length > 0 && !selectedColor) {
            setError('Please select a color');
            return;
        }
        if (product.sizes && product.sizes.length > 0 && !selectedSize) {
            setError('Please select a size');
            return;
        }
        setError(null);

        addToCart({
            id: product.id,
            title: product.title,
            price: product.price,
            image: product.image_url || product.image,
            quantity: quantity,
            category: product.category,
            color: selectedColor || undefined,
            size: selectedSize || undefined,
        });
    };

    return (
        <div className="container mx-auto px-4 py-12">
            <Link href="/shop" className="inline-flex items-center text-gray-500 hover:text-primary mb-8 transition-colors">
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back to Shop
            </Link>

            <div className="grid md:grid-cols-2 gap-12">
                {/* Image Gallery */}
                <motion.div
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    className="space-y-4"
                >
                    <div className="aspect-square bg-white rounded-3xl overflow-hidden shadow-sm border border-gray-100 p-8 flex items-center justify-center">
                        {product.image_url ? (
                            <img
                                src={product.image_url}
                                alt={product.title}
                                className="max-w-full max-h-full object-contain hover:scale-105 transition-transform duration-500"
                            />
                        ) : (
                            <div className="w-full h-full bg-gray-100 flex items-center justify-center text-gray-400">No Image</div>
                        )}

                    </div>
                </motion.div>

                {/* Product Info */}
                <motion.div
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    className="space-y-8"
                >
                    <div>
                        <div className="flex items-center space-x-2 text-yellow-500 mb-4">
                            <Star className="w-5 h-5 fill-current" />
                            <Star className="w-5 h-5 fill-current" />
                            <Star className="w-5 h-5 fill-current" />
                            <Star className="w-5 h-5 fill-current" />
                            <Star className="w-5 h-5 fill-current" />
                            <span className="text-gray-400 text-sm ml-2">(12 reviews)</span>
                        </div>
                        <h1 className="text-4xl font-bold text-gray-900 mb-4">{product.title}</h1>
                        <p className="text-2xl font-bold text-primary">${product.price.toFixed(2)}</p>
                    </div>

                    <p className="text-gray-600 leading-relaxed text-lg">
                        {product.description}
                    </p>

                    {/* Actions */}
                    <div className="space-y-6 pt-6 border-t border-gray-100">

                        {/* Variants Selection */}
                        <div className="space-y-4">
                            {product.colors && product.colors.length > 0 && (
                                <div>
                                    <h3 className="text-sm font-medium text-gray-900 mb-2">Color</h3>
                                    <div className="flex flex-wrap gap-2">
                                        {product.colors.map((color: string) => (
                                            <button
                                                key={color}
                                                onClick={() => { setSelectedColor(color); setError(null); }}
                                                className={`px-4 py-2 rounded-lg border text-sm font-medium transition-all
                                                    ${selectedColor === color
                                                        ? 'border-primary bg-primary/5 text-primary ring-1 ring-primary'
                                                        : 'border-gray-200 text-gray-600 hover:border-gray-300 hover:bg-gray-50'
                                                    }`}
                                            >
                                                {color}
                                            </button>
                                        ))}
                                    </div>
                                </div>
                            )}

                            {product.sizes && product.sizes.length > 0 && (
                                <div>
                                    <h3 className="text-sm font-medium text-gray-900 mb-2">Size</h3>
                                    <div className="flex flex-wrap gap-2">
                                        {product.sizes.map((size: string) => (
                                            <button
                                                key={size}
                                                onClick={() => { setSelectedSize(size); setError(null); }}
                                                className={`w-12 h-12 rounded-lg border text-sm font-medium flex items-center justify-center transition-all
                                                    ${selectedSize === size
                                                        ? 'border-primary bg-primary/5 text-primary ring-1 ring-primary'
                                                        : 'border-gray-200 text-gray-600 hover:border-gray-300 hover:bg-gray-50'
                                                    }`}
                                            >
                                                {size}
                                            </button>
                                        ))}
                                    </div>
                                </div>
                            )}

                            {error && (
                                <p className="text-red-500 text-sm animate-pulse">
                                    {error}
                                </p>
                            )}
                        </div>

                        <div className="flex items-center space-x-4">
                            <div className="flex items-center border border-gray-200 rounded-lg">
                                <button
                                    className="px-4 py-2 hover:bg-gray-50 text-xl"
                                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                                >-</button>
                                <span className="px-4 font-medium">{quantity}</span>
                                <button
                                    className="px-4 py-2 hover:bg-gray-50 text-xl"
                                    onClick={() => setQuantity(quantity + 1)}
                                >+</button>
                            </div>
                            <Button size="lg" className="flex-1 rounded-xl shadow-lg shadow-primary/20" onClick={handleAddToCart}>
                                Add to Cart - ${(product.price * quantity).toFixed(2)}
                            </Button>
                            {/* Wishlist Button with custom styling */}
                            <WishlistButton productId={product.id} className="w-14 h-14 border border-gray-200 flex items-center justify-center !rounded-xl !bg-transparent hover:!bg-red-50 hover:!border-red-200" />
                        </div>
                    </div>

                    {/* Features */}
                    <div className="grid grid-cols-2 gap-4 text-sm text-gray-500 pt-4">
                        <div className="flex items-center space-x-3 bg-blue-50/50 p-4 rounded-xl">
                            <Truck className="w-5 h-5 text-blue-500" />
                            <span>Free Shipping</span>
                        </div>
                        <div className="flex items-center space-x-3 bg-green-50/50 p-4 rounded-xl">
                            <ShieldCheck className="w-5 h-5 text-green-500" />
                            <span>2 Year Warranty</span>
                        </div>
                    </div>
                </motion.div>
            </div>

            {/* Reviews Section */}
            <div className="mt-20">
                <Reviews productId={product.id} />
            </div>
        </div>
    );
}
