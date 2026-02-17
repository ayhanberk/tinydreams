'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '@/components/ui/Button';
import Image from 'next/image';

interface StickyAddToCartProps {
    isVisible: boolean;
    product: {
        title: string;
        price: number;
        image_url?: string;
        image?: string;
    };
    onAddToCart: () => void;
}

export default function StickyAddToCart({ isVisible, product, onAddToCart }: StickyAddToCartProps) {
    return (
        <AnimatePresence>
            {isVisible && (
                <motion.div
                    initial={{ y: 100 }}
                    animate={{ y: 0 }}
                    exit={{ y: 100 }}
                    className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 p-4 shadow-lg z-50 md:hidden pb-safe"
                >
                    <div className="flex items-center justify-between gap-4">
                        <div className="flex items-center gap-3 flex-1 min-w-0">
                            <div className="relative w-12 h-12 rounded-lg overflow-hidden bg-gray-100 flex-shrink-0">
                                {(product.image_url || product.image) && (
                                    <Image
                                        src={product.image_url || product.image || ''}
                                        alt={product.title}
                                        fill
                                        className="object-cover"
                                    />
                                )}
                            </div>
                            <div className="flex flex-col min-w-0">
                                <h3 className="font-medium text-sm truncate">{product.title}</h3>
                                <span className="text-primary font-bold">${product.price.toFixed(2)}</span>
                            </div>
                        </div>
                        <Button onClick={onAddToCart} className="whitespace-nowrap shadow-md">
                            Add to Cart
                        </Button>
                    </div>
                </motion.div>
            )}
        </AnimatePresence>
    );
}
