'use client';

import { useState, useEffect } from 'react';
import { Heart } from 'lucide-react';
import { addToWishlist, removeFromWishlist, checkInWishlist } from '@/actions/wishlist';
import { useToast } from '@/context/ToastContext';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';

interface WishlistButtonProps {
    productId: string;
    className?: string;
}

export default function WishlistButton({ productId, className = '' }: WishlistButtonProps) {
    const [isInWishlist, setIsInWishlist] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const { addToast } = useToast();
    const { user } = useAuth();
    const router = useRouter();

    useEffect(() => {
        if (user) {
            checkInWishlist(productId).then(setIsInWishlist);
        }
    }, [productId, user]);

    const toggleWishlist = async (e: React.MouseEvent) => {
        e.preventDefault(); // Prevent navigating to product detail if inside a link
        e.stopPropagation();

        if (!user) {
            addToast('Please log in to use the wishlist', 'error');
            router.push('/login');
            return;
        }

        setIsLoading(true);
        try {
            if (isInWishlist) {
                await removeFromWishlist(productId);
                setIsInWishlist(false);
                addToast('Removed from wishlist', 'info');
            } else {
                await addToWishlist(productId);
                setIsInWishlist(true);
                addToast('Added to wishlist', 'success');
            }
            router.refresh();
        } catch (error) {
            console.error(error);
            addToast('Failed to update wishlist', 'error');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <button
            onClick={toggleWishlist}
            disabled={isLoading}
            className={`p-2 rounded-full transition-all duration-200 ${isInWishlist
                    ? 'bg-rose-50 text-rose-500 hover:bg-rose-100'
                    : 'bg-white/80 text-gray-400 hover:text-rose-500 hover:bg-rose-50'
                } ${className}`}
            title={isInWishlist ? "Remove from wishlist" : "Add to wishlist"}
        >
            <Heart
                className={`w-5 h-5 transition-all duration-200 ${isInWishlist ? 'fill-current scale-110' : 'scale-100'}`}
            />
        </button>
    );
}
