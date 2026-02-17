'use client';

import { useState } from 'react';
import { useCart } from '@/context/CartContext';
import { useAuth } from '@/context/AuthContext';
import { supabase } from '@/lib/supabase';
import { useRouter } from 'next/navigation';
import { useTranslation } from '@/context/LanguageContext';
import { Button } from '@/components/ui/Button';
import { motion } from 'framer-motion';
import Link from 'next/link';
import Image from 'next/image';
import { Loader2, CheckCircle, AlertCircle, FileText } from 'lucide-react';
import { generateDistanceSalesAgreement } from '@/utils/pdfGenerator';

export default function CheckoutPage() {
    const { items, cartTotal, clearCart } = useCart();
    const { user } = useAuth();
    const router = useRouter();

    const [loading, setLoading] = useState(false);
    const [success, setSuccess] = useState(false);
    const [agreementChecked, setAgreementChecked] = useState(false);

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

    const { t } = useTranslation();

    const handleViewAgreement = async () => {
        await generateDistanceSalesAgreement({
            orderNumber: `PRE-${Date.now().toString().slice(-6)}`, // Temporary ID for preview
            date: new Date().toLocaleDateString(),
            buyerName: formData.fullName || 'Misafir Kullanici',
            buyerEmail: user?.email || 'email@example.com',
            buyerAddress: `${formData.address}, ${formData.city}, ${formData.country}`,
            items: items.map(item => ({
                name: item.title,
                quantity: item.quantity,
                price: item.price
            })),
            totalAmount: cartTotal
        });
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!agreementChecked) {
            setError(t('checkout.agreement_error') || 'Lutfen Mesafeli Satis Sozlesmesini onaylayiniz.');
            return;
        }

        setLoading(true);
        setError(null);

        if (!user) {
            router.push('/auth/login?redirect=/checkout');
            return;
        }

        try {
            // 1. Create Order
            const { data: order, error: orderError } = await supabase
                .from('orders')
                .insert({
                    user_id: user.id,
                    status: 'pending',
                    total_amount: cartTotal,
                    shipping_address: formData
                })
                .select();

            if (orderError) {
                throw new Error(`Order creation failed: ${orderError.message}`);
            }

            if (!order || order.length === 0) {
                throw new Error('Failed to create order. No data returned.');
            }

            const newOrder = order[0];

            // 2. Create Order Items
            const orderItems = items.map(item => {
                let realId = item.productId;
                if (!realId) {
                    const parts = item.id.split('-');
                    if (parts.length > 1 && parts[0].length > 20) {
                        realId = parts[0];
                    } else {
                        realId = item.id;
                    }
                }

                return {
                    order_id: newOrder.id,
                    product_id: realId,
                    quantity: item.quantity,
                    price_at_purchase: item.price,
                    color: item.color,
                    size: item.size
                };
            });

            const { error: itemsError } = await supabase
                .from('order_items')
                .insert(orderItems);

            if (itemsError) {
                throw new Error(`Order items creation failed: ${itemsError.message}`);
            }

            // 3. Clear Cart
            await clearCart();

            // 4. Success State
            setSuccess(true);
            setTimeout(() => {
                router.push('/profile');
            }, 2000);

        } catch (err: unknown) {
            console.error('Checkout error:', err);
            const errorMessage = err instanceof Error ? err.message : (t('checkout.generic_error') || 'Failed to place order.');
            setError(errorMessage);
        } finally {
            setLoading(false);
        }
    };

    if (items.length === 0 && !success) {
        return (
            <div className="min-h-screen flex flex-col items-center justify-center p-4 text-center">
                <h2 className="text-2xl font-bold mb-4">{t('checkout.empty_cart') || 'Your cart is empty'}</h2>
                <Link href="/shop">
                    <Button>{t('checkout.return_shop') || 'Return to Shop'}</Button>
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
                <h2 className="text-2xl font-bold mb-2">{t('checkout.success_title') || 'Order Placed Successfully!'}</h2>
                <p className="text-gray-500 mb-4">{t('checkout.redirecting') || 'Redirecting to your orders...'}</p>
            </div>
        );
    }

    return (
        <div className="container mx-auto px-4 py-12">
            <h1 className="text-3xl font-bold mb-8 text-center">{t('nav.checkout') || 'Checkout'}</h1>

            <div className="grid md:grid-cols-2 gap-12 max-w-4xl mx-auto">
                {/* Order Summary */}
                <div className="bg-gray-50 p-6 rounded-2xl h-fit">
                    <h2 className="text-xl font-semibold mb-4">{t('checkout.order_summary') || 'Order Summary'}</h2>
                    <div className="space-y-4 max-h-96 overflow-y-auto pr-2">
                        {items.map((item) => (
                            <div key={item.id} className="flex gap-4 items-center">
                                <div className="w-16 h-16 bg-white rounded-lg overflow-hidden border border-gray-200 flex-shrink-0 relative">
                                    <Image src={item.image} alt={item.title} fill className="object-cover" sizes="64px" />
                                </div>
                                <div className="flex-1">
                                    <h3 className="font-medium text-sm line-clamp-1">{item.title}</h3>
                                    <p className="text-xs text-gray-500">
                                        {t('common.qty') || 'Qty'}: {item.quantity}
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
                            <span>{t('cart.subtotal') || 'Subtotal'}</span>
                            <span>${cartTotal.toFixed(2)}</span>
                        </div>
                        <div className="flex justify-between text-sm text-gray-600">
                            <span>{t('cart.shipping') || 'Shipping'}</span>
                            <span className="text-green-600">{t('cart.free') || 'Free'}</span>
                        </div>
                        <div className="flex justify-between font-bold text-lg pt-2 border-t border-gray-200 mt-2">
                            <span>{t('cart.total') || 'Total'}</span>
                            <span>${cartTotal.toFixed(2)}</span>
                        </div>
                    </div>
                </div>

                {/* Shipping Form */}
                <div>
                    <h2 className="text-xl font-semibold mb-6">{t('checkout.shipping_info') || 'Shipping Information'}</h2>
                    <form onSubmit={handleSubmit} className="space-y-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">{t('checkout.full_name') || 'Full Name'}</label>
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
                            <label className="block text-sm font-medium text-gray-700 mb-1">{t('checkout.address') || 'Address'}</label>
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
                                <label className="block text-sm font-medium text-gray-700 mb-1">{t('checkout.city') || 'City'}</label>
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
                                <label className="block text-sm font-medium text-gray-700 mb-1">{t('checkout.postal_code') || 'Postal Code'}</label>
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
                            <label className="block text-sm font-medium text-gray-700 mb-1">{t('checkout.country') || 'Country'}</label>
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

                        {/* Distance Sales Agreement Checkbox */}
                        <div className="bg-gray-50 p-4 rounded-lg border border-gray-200 mt-6">
                            <div className="flex items-start gap-3">
                                <input
                                    type="checkbox"
                                    id="agreement"
                                    checked={agreementChecked}
                                    onChange={(e) => setAgreementChecked(e.target.checked)}
                                    className="mt-1 w-4 h-4 text-primary border-gray-300 rounded focus:ring-primary"
                                />
                                <div className="text-sm text-gray-600">
                                    <label htmlFor="agreement" className="font-medium text-gray-900 cursor-pointer">
                                        {t('checkout.pre_info_conditions') || 'On Bilgilendirme Kosullarini'}
                                    </label>
                                    {' '}{t('common.and') || 've'}{' '}
                                    <button
                                        type="button"
                                        onClick={handleViewAgreement}
                                        className="text-primary hover:underline font-medium inline-flex items-center gap-1"
                                    >
                                        <FileText className="w-3 h-3" /> {t('checkout.sales_agreement') || 'Mesafeli Satis Sozlesmesini'}
                                    </button>
                                    {' '}{t('checkout.read_accept') || 'okudum, onayliyorum.'}
                                </div>
                            </div>
                        </div>

                        {error && (
                            <div className="bg-red-50 text-red-600 p-4 rounded-lg mb-4 text-sm border border-red-100 flex items-center">
                                <AlertCircle className="w-4 h-4 mr-2 flex-shrink-0" />
                                {error}
                            </div>
                        )}
                        <Button
                            type="submit"
                            className="w-full py-4 text-lg mt-4 shadow-lg shadow-primary/20"
                            disabled={loading}
                        >
                            {loading ? (
                                <span className="flex items-center justify-center">
                                    <Loader2 className="w-5 h-5 animate-spin mr-2" />
                                    {t('common.processing') || 'Processing...'}
                                </span>
                            ) : (
                                `${t('checkout.place_order') || 'Place Order'} - $${cartTotal.toFixed(2)}`
                            )}
                        </Button>
                    </form>
                </div>
            </div>
        </div>
    );
}

