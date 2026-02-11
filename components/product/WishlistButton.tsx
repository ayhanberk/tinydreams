'use client';

import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import { Heart } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import { motion } from 'framer-motion';

interface WishlistButtonProps {
    productId: string;
    className?: string;
}

export default function WishlistButton({ productId, className = '' }: WishlistButtonProps) {
    const { user } = useAuth();
    const [isWishlisted, setIsWishlisted] = useState(false);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        const checkWishlist = async () => {
            if (!user) return;
            const { data } = await supabase
                .from('wishlist')
                .select('id')
                .eq('user_id', user.id)
                .eq('product_id', productId)
                .single();

            if (data) setIsWishlisted(true);
        };
        checkWishlist();
    }, [user, productId]);

    const toggleWishlist = async (e: React.MouseEvent) => {
        e.preventDefault(); // Prevent link navigation if inside a card link
        e.stopPropagation();

        if (!user) {
            alert('Please login to add to wishlist');
            return;
        }

        if (loading) return;
        setLoading(true);

        const newState = !isWishlisted;
        setIsWishlisted(newState); // Optimistic update

        if (newState) {
            const { error } = await supabase.from('wishlist').insert({ user_id: user.id, product_id: productId });
            if (error) setIsWishlisted(false); // Revert on error
        } else {
            const { error } = await supabase.from('wishlist').delete().eq('user_id', user.id).eq('product_id', productId);
            if (error) setIsWishlisted(true); // Revert on error
        }
        setLoading(false);
    };

    return (
        <button
            onClick={toggleWishlist}
            className={`p-2 rounded-full transition-all active:scale-95 ${className} ${isWishlisted ? 'bg-red-50 text-red-500' : 'bg-white/80 hover:bg-white text-gray-500 hover:text-red-400'}`}
        >
            <Heart
                className={`w-5 h-5 transition-colors ${isWishlisted ? 'fill-red-500' : ''}`}
            />
        </button>
    );
}
