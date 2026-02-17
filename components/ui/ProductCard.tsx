'use client';

import { motion } from 'framer-motion';
import { ShoppingBag } from 'lucide-react';
import Link from 'next/link';
import Image from 'next/image';
import { Button } from '@/components/ui/Button';
import WishlistButton from '@/components/wishlist/WishlistButton';


import { useState } from 'react';
import { useCart } from '@/context/CartContext';
import { X, Check } from 'lucide-react';

interface ProductCardProps {
    id: string;
    title: string;
    price: number;
    image: string;
    category: string;
    slug?: string;
    categorySlug?: string;
    colors?: string[];
    sizes?: string[];
}

const ProductCard = ({ id, title, price, image, category, slug, categorySlug, colors, sizes }: ProductCardProps) => {
    const { addToCart } = useCart();
    const [showQuickAdd, setShowQuickAdd] = useState(false);
    const [selectedColor, setSelectedColor] = useState<string | null>(null);
    const [selectedSize, setSelectedSize] = useState<string | null>(null);
    const [isAdding, setIsAdding] = useState(false);

    const hasVariants = (colors && colors.length > 0) || (sizes && sizes.length > 0);

    const handleAddToCartClick = (e: React.MouseEvent) => {
        e.preventDefault(); // Prevent navigation
        e.stopPropagation();

        if (hasVariants) {
            setShowQuickAdd(true);
        } else {
            addItemToCart();
        }
    };

    const addItemToCart = () => {
        setIsAdding(true);
        addToCart({
            id,
            title,
            price,
            image,
            quantity: 1,
            category,
            color: selectedColor || undefined,
            size: selectedSize || undefined
        });

        // Simulate loading / feedback
        setTimeout(() => {
            setIsAdding(false);
            setShowQuickAdd(false);
            // Optional: Show toast or success icon?
            // Global toast handles it mostly.
        }, 500);
    };

    const handleConfirmVariant = (e: React.MouseEvent) => {
        e.preventDefault();
        e.stopPropagation();

        // Validation
        if (colors && colors.length > 0 && !selectedColor) return;
        if (sizes && sizes.length > 0 && !selectedSize) return;

        addItemToCart();
    };

    const closeQuickAdd = (e: React.MouseEvent) => {
        e.preventDefault();
        e.stopPropagation();
        setShowQuickAdd(false);
        setSelectedColor(null);
        setSelectedSize(null);
    };

    return (
        <motion.div
            whileHover={{ y: -5 }}
            className="group relative bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 border border-gray-100 h-full flex flex-col"
        >
            {/* Image Container */}
            <div className="relative aspect-[4/5] overflow-hidden bg-gray-100 group">
                <Image
                    src={image}
                    alt={title}
                    fill
                    className="object-cover transition-transform duration-500 group-hover:scale-110"
                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                />
                <div className="absolute top-3 right-3 opacity-0 group-hover:opacity-100 transition-opacity z-10">
                    <WishlistButton productId={id} />
                </div>

                <div className="absolute top-3 left-3 bg-white/90 backdrop-blur-sm px-2 py-1 rounded-md text-xs font-semibold text-gray-700 z-10">
                    {category}
                </div>

                {/* Quick Add Overlay */}
                {showQuickAdd && (
                    <div
                        className="absolute inset-0 bg-white/95 z-20 flex flex-col p-4 animate-in fade-in"
                        onClick={(e) => { e.preventDefault(); e.stopPropagation(); }}
                    >
                        <div className="flex justify-between items-center mb-2">
                            <h4 className="text-sm font-bold text-gray-900">Select Options</h4>
                            <button onClick={closeQuickAdd} className="p-1 hover:bg-gray-100 rounded-full">
                                <X className="w-4 h-4 text-gray-500" />
                            </button>
                        </div>

                        <div className="flex-1 overflow-y-auto space-y-3 no-scrollbar">
                            {colors && colors.length > 0 && (
                                <div>
                                    <span className="text-xs font-medium text-gray-500 block mb-1">Color</span>
                                    <div className="flex flex-wrap gap-2">
                                        {colors.map(c => (
                                            <button
                                                key={c}
                                                onClick={() => setSelectedColor(c)}
                                                className={`px-2 py-1 text-xs border rounded-md transition-colors ${selectedColor === c ? 'border-primary bg-primary/10 text-primary' : 'border-gray-200 hover:border-gray-300'}`}
                                            >
                                                {c}
                                            </button>
                                        ))}
                                    </div>
                                </div>
                            )}

                            {sizes && sizes.length > 0 && (
                                <div>
                                    <span className="text-xs font-medium text-gray-500 block mb-1">Size</span>
                                    <div className="flex flex-wrap gap-2">
                                        {sizes.map(s => (
                                            <button
                                                key={s}
                                                onClick={() => setSelectedSize(s)}
                                                className={`w-8 h-8 flex items-center justify-center text-xs border rounded-md transition-colors ${selectedSize === s ? 'border-primary bg-primary/10 text-primary' : 'border-gray-200 hover:border-gray-300'}`}
                                            >
                                                {s}
                                            </button>
                                        ))}
                                    </div>
                                </div>
                            )}
                        </div>

                        <Button
                            size="sm"
                            className="w-full mt-2"
                            onClick={handleConfirmVariant}
                            disabled={
                                (colors && colors.length > 0 && !selectedColor) ||
                                (sizes && sizes.length > 0 && !selectedSize) ||
                                isAdding
                            }
                        >
                            {isAdding ? 'Adding...' : 'Add to Cart'}
                        </Button>
                    </div>
                )}
            </div>

            {/* Content */}
            <div className="p-4 flex-1 flex flex-col">
                <div className="flex justify-between items-start mb-2">
                    <h3 className="font-bold text-gray-800 line-clamp-1 group-hover:text-primary transition-colors">{title}</h3>
                </div>

                <div className="mt-auto flex justify-between items-center">
                    <p className="text-lg font-bold text-primary">
                        ${price.toFixed(2)}
                    </p>
                    <Button
                        size="sm"
                        className={`rounded-full w-8 h-8 p-0 flex items-center justify-center transition-transform active:scale-95 ${showQuickAdd ? 'bg-gray-200 text-gray-500' : ''}`}
                        onClick={handleAddToCartClick}
                    >
                        {isAdding ? <Check className="w-4 h-4" /> : <ShoppingBag className="w-4 h-4" />}
                    </Button>
                </div>
            </div>

            <Link
                href={`/products/${categorySlug || 'general'}/${slug || id}`}
                className="absolute inset-0 z-0"
                aria-label={`View ${title}`}
                onClick={(e) => {
                    if (showQuickAdd) {
                        e.preventDefault();
                    }
                }}
            />
        </motion.div >
    );
};

export default ProductCard;
