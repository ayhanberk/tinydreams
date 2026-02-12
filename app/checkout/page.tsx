'use client';

import { useState } from 'react';
import { useCart } from '@/context/CartContext';
import { useAuth } from '@/context/AuthContext';
import { supabase } from '@/lib/supabase';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/Button';
import { motion } from 'framer-motion';
import Link from 'next/link';
import { Loader2, CheckCircle, AlertCircle } from 'lucide-react';

export default function CheckoutPage() {
    const { items, cartTotal, clearCart } = useCart();
    const { user } = useAuth();
    const router = useRouter();

    const [loading, setLoading] = useState(false);
    const [success, setSuccess] = useState(false);
    const [formData, setFormData] = useState({
        fullName: '',
        address: '',
        city: '',
        postalCode: '',
        country: ''
    });

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const [error, setError] = useState<string | null>(null);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError(null);
        console.log('--- Checkout Started ---');
        console.log('User:', user?.id);
        console.log('Items to order:', items);

        if (!user) {
            console.error('No user found');
            router.push('/auth/login?redirect=/checkout');
            return;
        }

        try {
            // 1. Create Order
            console.log('1. Creating Order...');
            const { data: order, error: orderError } = await supabase
                .from('orders')
                .insert({
                    user_id: user.id,
                    status: 'pending',
                    total_amount: cartTotal,
                    shipping_address: formData
                })
                .select(); // Remove .single() to be safer, handle it manually

            if (orderError) {
                console.error('Order Error:', orderError);
                throw new Error(`Order creation failed: ${orderError.message}`);
            }

            if (!order || order.length === 0) {
                console.error('No order returned after insert');
                throw new Error('Failed to create order. No data returned.');
            }

            const newOrder = order[0];
            console.log('Order created successfully:', newOrder.id);

            // 2. Create Order Items
            console.log('2. Creating Order Items...');
            const orderItems = items.map(item => {
                // Determine real product UUID
                let realId = item.productId;
                if (!realId) {
                    // Try to extract from composite ID if productId is missing
                    const parts = item.id.split('-');
                    if (parts.length > 1 && parts[0].length > 20) { // Simple UUID check
                        realId = parts[0];
                    } else {
                        realId = item.id;
                    }
                }

                console.log(`Mapping item: ${item.title}, ID: ${item.id} -> Real ID: ${realId}`);

                return {
                    order_id: newOrder.id,
                    product_id: realId,
                    quantity: item.quantity,
                    price_at_purchase: item.price,
                    color: item.color,
                    size: item.size
                };
            });

            console.log('Inserting order items:', orderItems);
            const { error: itemsError } = await supabase
                .from('order_items')
                .insert(orderItems);

            if (itemsError) {
                console.error('Order Items Error:', itemsError);
                throw new Error(`Order items creation failed: ${itemsError.message}`);
            }

            console.log('Order items created successfully');

            // 3. Clear Cart
            console.log('3. Clearing Cart...');
            await clearCart();
            console.log('Cart cleared');

            // 4. Success State
            console.log('4. Success!');
            setSuccess(true);
            setTimeout(() => {
                router.push('/dashboard');
            }, 2000);

        } catch (err: any) {
            console.error('Checkout error stack:', err);
            setError(err.message || 'Failed to place order.');
        } finally {
            console.log('--- Checkout Finished ---');
            setLoading(false);
        }
    };

    if (items.length === 0 && !success) {
        return (
            <div className="min-h-screen flex flex-col items-center justify-center p-4 text-center">
                <h2 className="text-2xl font-bold mb-4">Your cart is empty</h2>
                <Link href="/shop">
                    <Button>Return to Shop</Button>
                </Link>
            </div>
        );
    }

    if (success) {
        return (
            <div className="min-h-screen flex flex-col items-center justify-center p-4 text-center">
                <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    className="text-green-500 mb-4"
                >
                    <CheckCircle className="w-16 h-16" />
                </motion.div>
                <h2 className="text-2xl font-bold mb-2">Order Placed Successfully!</h2>
                <p className="text-gray-500 mb-4">Redirecting to your orders...</p>
            </div>
        );
    }

    return (
        <div className="container mx-auto px-4 py-12">
            <h1 className="text-3xl font-bold mb-8 text-center">Checkout</h1>

            <div className="grid md:grid-cols-2 gap-12 max-w-4xl mx-auto">
                {/* Order Summary */}
                <div className="bg-gray-50 p-6 rounded-2xl h-fit">
                    <h2 className="text-xl font-semibold mb-4">Order Summary</h2>
                    <div className="space-y-4 max-h-96 overflow-y-auto pr-2">
                        {items.map((item) => (
                            <div key={item.id} className="flex gap-4 items-center">
                                <div className="w-16 h-16 bg-white rounded-lg overflow-hidden border border-gray-200 flex-shrink-0">
                                    <img src={item.image} alt={item.title} className="w-full h-full object-cover" />
                                </div>
                                <div className="flex-1">
                                    <h3 className="font-medium text-sm line-clamp-1">{item.title}</h3>
                                    <p className="text-xs text-gray-500">
                                        Qty: {item.quantity}
                                        {item.color && ` • ${item.color}`}
                                        {item.size && ` • ${item.size}`}
                                    </p>
                                </div>
                                <div className="font-semibold text-sm">
                                    ${(item.price * item.quantity).toFixed(2)}
                                </div>
                            </div>
                        ))}
                    </div>

                    <div className="border-t border-gray-200 mt-6 pt-4 space-y-2">
                        <div className="flex justify-between text-sm text-gray-600">
                            <span>Subtotal</span>
                            <span>${cartTotal.toFixed(2)}</span>
                        </div>
                        <div className="flex justify-between text-sm text-gray-600">
                            <span>Shipping</span>
                            <span className="text-green-600">Free</span>
                        </div>
                        <div className="flex justify-between font-bold text-lg pt-2 border-t border-gray-200 mt-2">
                            <span>Total</span>
                            <span>${cartTotal.toFixed(2)}</span>
                        </div>
                    </div>
                </div>

                {/* Shipping Form */}
                <div>
                    <h2 className="text-xl font-semibold mb-6">Shipping Information</h2>
                    <form onSubmit={handleSubmit} className="space-y-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Full Name</label>
                            <input
                                type="text"
                                name="fullName"
                                required
                                value={formData.fullName}
                                onChange={handleInputChange}
                                className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-primary focus:border-transparent outline-none transition-all"
                                placeholder="John Doe"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Address</label>
                            <input
                                type="text"
                                name="address"
                                required
                                value={formData.address}
                                onChange={handleInputChange}
                                className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-primary focus:border-transparent outline-none transition-all"
                                placeholder="123 Main St, Apt 4B"
                            />
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">City</label>
                                <input
                                    type="text"
                                    name="city"
                                    required
                                    value={formData.city}
                                    onChange={handleInputChange}
                                    className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-primary focus:border-transparent outline-none transition-all"
                                    placeholder="New York"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Postal Code</label>
                                <input
                                    type="text"
                                    name="postalCode"
                                    required
                                    value={formData.postalCode}
                                    onChange={handleInputChange}
                                    className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-primary focus:border-transparent outline-none transition-all"
                                    placeholder="10001"
                                />
                            </div>
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Country</label>
                            <input
                                type="text"
                                name="country"
                                required
                                value={formData.country}
                                onChange={handleInputChange}
                                className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-primary focus:border-transparent outline-none transition-all"
                                placeholder="United States"
                            />
                        </div>

                        {error && (
                            <div className="bg-red-50 text-red-600 p-4 rounded-lg mb-4 text-sm border border-red-100 flex items-center">
                                <AlertCircle className="w-4 h-4 mr-2 flex-shrink-0" />
                                {error}
                            </div>
                        )}
                        <Button
                            type="submit"
                            className="w-full py-4 text-lg mt-8 shadow-lg shadow-primary/20"
                            disabled={loading}
                        >
                            {loading ? (
                                <span className="flex items-center justify-center">
                                    <Loader2 className="w-5 h-5 animate-spin mr-2" />
                                    Processing...
                                </span>
                            ) : (
                                `Place Order - $${cartTotal.toFixed(2)}`
                            )}
                        </Button>
                    </form>
                </div>
            </div>
        </div>
    );
}
