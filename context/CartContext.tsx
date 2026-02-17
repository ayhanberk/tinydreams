'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import { useAuth } from '@/context/AuthContext';

export interface CartItem {
    id: string; // Composite ID for frontend uniqueness
    productId?: string; // Real Product ID
    title: string;
    price: number;
    image: string;
    quantity: number;
    color?: string;
    size?: string;
    category?: string;
}

interface CartContextType {
    items: CartItem[];
    addToCart: (item: CartItem) => void;
    removeFromCart: (id: string) => void;
    updateQuantity: (id: string, quantity: number) => void;
    clearCart: () => void;
    cartTotal: number;
    cartCount: number;
    isCartOpen: boolean;
    toggleCart: () => void;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export const CartProvider = ({ children }: { children: React.ReactNode }) => {
    const [items, setItems] = useState<CartItem[]>([]);
    const [isCartOpen, setIsCartOpen] = useState(false);
    const [isMounted, setIsMounted] = useState(false);
    const { user } = useAuth();

    // Load from Local Storage on Mount
    /* eslint-disable react-hooks/set-state-in-effect */
    useEffect(() => {
        setIsMounted(true);
        const savedCart = localStorage.getItem('cart');
        if (savedCart) {
            try {
                const parsed = JSON.parse(savedCart);
                // Migrating old/incomplete data
                const migrated = parsed.map((item: Partial<CartItem>) => ({
                    ...item,
                    productId: item.productId || (item.id || '').split('-')[0] // Fallback to id if productId missing
                }));
                setItems(migrated);
            } catch (e) {
                console.error("Failed to parse cart", e);
            }
        }
    }, []);
    /* eslint-enable react-hooks/set-state-in-effect */

    const generateCartId = (productId: string, color?: string, size?: string) => {
        return `${productId}-${color || 'default'}-${size || 'default'}`;
    };

    // Sync with Database when User Changes
    useEffect(() => {
        if (!user) return;

        const fetchRemoteCart = async () => {
            const { data, error } = await supabase
                .from('cart_items')
                .select('*, products(*)')
                .eq('user_id', user.id);

            if (error) {
                console.error('Error fetching cart:', error);
                return;
            }

            if (data) {
                // Map DB items to CartItem format
                // eslint-disable-next-line @typescript-eslint/no-explicit-any
                const dbItems: CartItem[] = data.map((item: any) => ({
                    id: generateCartId(item.products.id, item.color, item.size), // Composite ID
                    productId: item.products.id, // Keep original Product ID
                    title: item.products.title,
                    price: item.products.price,
                    image: item.products.image_url || item.products.image,
                    quantity: item.quantity,
                    category: item.products.category,
                    color: item.color,
                    size: item.size
                }));
                setItems(dbItems);
            }
        };

        fetchRemoteCart();
    }, [user]);

    // Save to Local Storage (Always)
    useEffect(() => {
        if (isMounted) {
            localStorage.setItem('cart', JSON.stringify(items));
        }
    }, [items, isMounted]);

    const addToCart = async (newItem: CartItem) => {
        const cartId = generateCartId(newItem.id, newItem.color, newItem.size);
        const itemWithCompositeId = { ...newItem, id: cartId, productId: newItem.id }; // Store real product ID separately

        // Optimistic Update
        setItems(prev => {
            const existing = prev.find(item => item.id === cartId);
            if (existing) {
                return prev.map(item =>
                    item.id === cartId
                        ? { ...item, quantity: item.quantity + newItem.quantity }
                        : item
                );
            }
            return [...prev, itemWithCompositeId];
        });
        setIsCartOpen(true);

        // DB Sync
        if (user) {
            // Check if item exists in DB
            let query = supabase
                .from('cart_items')
                .select('id, quantity')
                .eq('user_id', user.id)
                .eq('product_id', newItem.id);

            if (newItem.color) query = query.eq('color', newItem.color);
            else query = query.is('color', null);

            if (newItem.size) query = query.eq('size', newItem.size);
            else query = query.is('size', null);

            const { data: existing } = await query.maybeSingle(); // Use maybeSingle to avoid 406 or error on 0 rows

            if (existing) {
                await supabase
                    .from('cart_items')
                    .update({ quantity: existing.quantity + newItem.quantity })
                    .eq('id', existing.id);
            } else {
                await supabase
                    .from('cart_items')
                    .insert({
                        user_id: user.id,
                        product_id: newItem.id,
                        quantity: newItem.quantity,
                        color: newItem.color,
                        size: newItem.size
                    });
            }
        }
    };

    const removeFromCart = async (id: string) => {
        // id is composite here
        const itemToRemove = items.find(item => item.id === id);
        if (!itemToRemove) return;

        setItems(prev => prev.filter(item => item.id !== id));

        const realProductId = itemToRemove.productId || itemToRemove.id; // Fallback for legacy items before migration?

        if (user) {
            let query = supabase
                .from('cart_items')
                .delete()
                .eq('user_id', user.id)
                .eq('product_id', realProductId);

            if (itemToRemove.color) query = query.eq('color', itemToRemove.color);
            else query = query.is('color', null);

            if (itemToRemove.size) query = query.eq('size', itemToRemove.size);
            else query = query.is('size', null);

            await query;
        }
    };

    const updateQuantity = async (id: string, quantity: number) => {
        if (quantity < 1) {
            removeFromCart(id);
            return;
        }

        const itemToUpdate = items.find(item => item.id === id);
        if (!itemToUpdate) return;

        setItems(prev => prev.map(item =>
            item.id === id ? { ...item, quantity } : item
        ));

        const realProductId = itemToUpdate.productId || itemToUpdate.id;

        if (user) {
            let query = supabase
                .from('cart_items')
                .update({ quantity })
                .eq('user_id', user.id)
                .eq('product_id', realProductId);

            if (itemToUpdate.color) query = query.eq('color', itemToUpdate.color);
            else query = query.is('color', null);

            if (itemToUpdate.size) query = query.eq('size', itemToUpdate.size);
            else query = query.is('size', null);

            await query;
        }
    };

    const clearCart = async () => {
        setItems([]);
        if (user) {
            await supabase
                .from('cart_items')
                .delete()
                .eq('user_id', user.id);
        }
    };

    const toggleCart = () => setIsCartOpen(!isCartOpen);

    const cartTotal = items.reduce((total, item) => total + (item.price * item.quantity), 0);
    const cartCount = items.reduce((count, item) => count + item.quantity, 0);

    return (
        <CartContext.Provider value={{
            items,
            addToCart,
            removeFromCart,
            updateQuantity,
            clearCart,
            cartTotal,
            cartCount,
            isCartOpen,
            toggleCart
        }}>
            {children}
        </CartContext.Provider>
    );
};

export const useCart = () => {
    const context = useContext(CartContext);
    if (!context) {
        throw new Error('useCart must be used within a CartProvider');
    }
    return context;
};
