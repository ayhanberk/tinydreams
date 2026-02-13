'use client';

import { useParams } from 'next/navigation';
import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Star, Truck, ShieldCheck, ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import Link from 'next/link';
import Image from 'next/image';
import { useCart } from '@/context/CartContext';
import { supabase } from '@/lib/supabase';
import Reviews from '@/components/product/Reviews';
import WishlistButton from '@/components/product/WishlistButton';

export default function ProductDetailsPage() {
    const params = useParams();
    const id = params.id as string;
    const [product, setProduct] = useState<any>(null);
    const [loading, setLoading] = useState(true);
    const [quantity, setQuantity] = useState(1);
    const { addToCart } = useCart();

    useEffect(() => {
        const fetchProduct = async () => {
            if (!id) return;
            const { data, error } = await supabase
                .from('products')
                .select('*')
                .eq('id', id)
                .single();

            if (error) {
                console.error('Error fetching product:', error);
            } else {
                setProduct(data);
            }
            setLoading(false);
        };
        fetchProduct();
    }, [id]);

    if (loading) {
        return <div className="min-h-screen flex items-center justify-center">Loading product...</div>;
    }

    if (!product) {
        return <div className="p-20 text-center">Product not found</div>;
    }

    const handleAddToCart = () => {
        addToCart({
            id: product.id,
            title: product.title,
            price: product.price,
            image: product.image_url || product.image, // Fallback for legacy
            quantity: quantity,
            category: product.category,
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
                    <div className="aspect-square bg-white rounded-3xl overflow-hidden shadow-sm border border-gray-100 p-8 flex items-center justify-center relative">
                        {product.image_url ? (
                            <Image
                                src={product.image_url}
                                alt={product.title}
                                fill
                                className="object-contain p-8 hover:scale-105 transition-transform duration-500"
                                sizes="(max-width: 768px) 100vw, 50vw"
                                priority
                            />
                        ) : (
                            <div className="w-full h-full bg-gray-100 flex items-center justify-center text-gray-400 font-medium">No Image</div>
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
                    <div className="space-y-4 pt-6 border-t border-gray-100">
                        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-4">
                            <div className="flex items-center border border-gray-200 rounded-lg justify-between sm:justify-start">
                                <button
                                    className="px-6 py-3 hover:bg-gray-50 text-xl"
                                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                                >-</button>
                                <span className="px-4 font-medium min-w-[3rem] text-center">{quantity}</span>
                                <button
                                    className="px-6 py-3 hover:bg-gray-50 text-xl"
                                    onClick={() => setQuantity(quantity + 1)}
                                >+</button>
                            </div>
                            <Button size="lg" className="flex-1 py-6 rounded-xl shadow-lg shadow-primary/20 text-lg" onClick={handleAddToCart}>
                                Add to Cart - ${(product.price * quantity).toFixed(2)}
                            </Button>
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

            {/* Suggestions Section Placeholder */}
            {/* ... */}
        </div>
    );
}
