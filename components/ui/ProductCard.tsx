'use client';

import { motion } from 'framer-motion';
import { ShoppingBag, Star } from 'lucide-react';
import Link from 'next/link';
import { Button } from '@/components/ui/Button';
import WishlistButton from '@/components/product/WishlistButton';

interface ProductCardProps {
    id: string;
    title: string;
    price: number;
    image: string;
    category: string;
    slug?: string;
    categorySlug?: string;
}

const ProductCard = ({ id, title, price, image, category, slug, categorySlug }: ProductCardProps) => {
    return (
        <motion.div
            whileHover={{ y: -5 }}
            className="group relative bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 border border-gray-100"
        >
            {/* Image Container */}
            <div className="relative aspect-[4/5] overflow-hidden bg-gray-100 group">
                <img
                    src={image}
                    alt={title}
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                />
                <div className="absolute top-3 right-3 opacity-0 group-hover:opacity-100 transition-opacity z-10">
                    <WishlistButton productId={id} />
                </div>

                {/* Overlay Actions */}
                <div className="absolute inset-0 bg-black/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center space-x-2">
                    {/* Add quick view or quick add buttons here if needed */}
                </div>

                <div className="absolute top-3 left-3 bg-white/90 backdrop-blur-sm px-2 py-1 rounded-md text-xs font-semibold text-gray-700">
                    {category}
                </div>
            </div>
            {/* Content */}
            <div className="p-4">
                <div className="flex justify-between items-start mb-2">
                    <h3 className="font-bold text-gray-800 line-clamp-1">{title}</h3>
                    <div className="flex items-center space-x-1 text-yellow-400">
                        <Star className="w-3 h-3 fill-current" />
                        <span className="text-xs text-gray-500 font-medium">4.9</span>
                    </div>
                </div>

                <div className="flex justify-between items-center mt-3">
                    <p className="text-lg font-bold text-primary">
                        ${price.toFixed(2)}
                    </p>
                    <Button size="sm" className="rounded-full w-8 h-8 p-0 flex items-center justify-center">
                        <ShoppingBag className="w-4 h-4" />
                    </Button>
                </div>
            </div>

            <Link
                href={`/products/${categorySlug || 'general'}/${slug || id}`}
                className="absolute inset-0 z-10"
                aria-label={`View ${title}`}
            />
        </motion.div >
    );
};

export default ProductCard;
