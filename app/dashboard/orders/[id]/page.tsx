'use client';

import { useParams } from 'next/navigation';
import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import { Button } from '@/components/ui/Button';
import Link from 'next/link';
import { ArrowLeft, Package, MapPin, CreditCard, Clock } from 'lucide-react';

export default function OrderDetailsPage() {
    const params = useParams();
    const { id } = params as { id: string };

    const [order, setOrder] = useState<any>(null);
    const [items, setItems] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchOrderDetails = async () => {
            if (!id) return;

            // Fetch Order
            const { data: orderData, error: orderError } = await supabase
                .from('orders')
                .select('*')
                .eq('id', id)
                .single();

            if (orderError) {
                console.error('Error fetching order:', orderError);
                setLoading(false);
                return;
            }

            setOrder(orderData);

            // Fetch Order Items with Product details
            const { data: itemsData, error: itemsError } = await supabase
                .from('order_items')
                .select('*, products(*)')
                .eq('order_id', id);

            if (itemsError) {
                console.error('Error fetching items:', itemsError);
            } else {
                setItems(itemsData || []);
            }
            setLoading(false);
        };

        fetchOrderDetails();
    }, [id]);

    if (loading) {
        return <div className="min-h-screen flex items-center justify-center">Loading order details...</div>;
    }

    if (!order) {
        return (
            <div className="min-h-screen flex flex-col items-center justify-center p-4 text-center">
                <h2 className="text-2xl font-bold mb-4">Order not found</h2>
                <Link href="/dashboard">
                    <Button>Back to Dashboard</Button>
                </Link>
            </div>
        );
    }

    // Parse shipping address if it's JSON
    const shippingAddress = typeof order.shipping_address === 'string'
        ? JSON.parse(order.shipping_address)
        : order.shipping_address;

    return (
        <div className="container mx-auto px-4 py-12">
            <Link href="/dashboard" className="inline-flex items-center text-gray-500 hover:text-primary mb-8 transition-colors">
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back to Orders
            </Link>

            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
                {/* Header */}
                <div className="p-6 md:p-8 border-b border-gray-100 bg-gray-50/50 flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <div>
                        <div className="flex items-center space-x-3 mb-2">
                            <h1 className="text-2xl font-bold break-all">Order #{order.id.slice(0, 8)}</h1>
                            <span className={`px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider
                                ${order.status === 'delivered' ? 'bg-green-100 text-green-700' :
                                    order.status === 'pending' ? 'bg-yellow-100 text-yellow-700' :
                                        'bg-blue-100 text-blue-700'
                                }`}>
                                {order.status}
                            </span>
                        </div>
                        <p className="text-gray-500 flex items-center text-sm">
                            <Clock className="w-4 h-4 mr-1" />
                            Placed on {new Date(order.created_at).toLocaleDateString()} at {new Date(order.created_at).toLocaleTimeString()}
                        </p>
                    </div>
                    {/* Admin Actions could go here */}
                </div>

                <div className="p-6 md:p-8 grid md:grid-cols-3 gap-8">
                    {/* Order Items */}
                    <div className="md:col-span-2 space-y-6">
                        <h2 className="font-semibold text-lg flex items-center">
                            <Package className="w-5 h-5 mr-2 text-primary" />
                            Items
                        </h2>
                        <div className="space-y-4">
                            {items.map((item) => (
                                <div key={item.id} className="flex gap-4 p-4 border border-gray-100 rounded-xl hover:bg-gray-50 transition-colors">
                                    <div className="w-20 h-20 bg-gray-100 rounded-lg overflow-hidden flex-shrink-0">
                                        <img
                                            src={item.products?.image_url || item.products?.image}
                                            alt={item.products?.title}
                                            className="w-full h-full object-cover"
                                        />
                                    </div>
                                    <div className="flex-1">
                                        <Link href={`/products/${item.products?.category}/${item.products?.slug}`} className="font-medium hover:text-primary transition-colors">
                                            {item.products?.title}
                                        </Link>
                                        <p className="text-sm text-gray-500 mt-1">
                                            Qty: {item.quantity} × ${item.price_at_purchase.toFixed(2)}
                                        </p>
                                        {/* Variants */}
                                        {(item.color || item.size) && (
                                            <div className="flex space-x-3 mt-2 text-xs text-gray-600">
                                                {item.color && (
                                                    <span className="bg-gray-200 px-2 py-1 rounded-md">Color: {item.color}</span>
                                                )}
                                                {item.size && (
                                                    <span className="bg-gray-200 px-2 py-1 rounded-md">Size: {item.size}</span>
                                                )}
                                            </div>
                                        )}
                                    </div>
                                    <div className="font-semibold">
                                        ${(item.quantity * item.price_at_purchase).toFixed(2)}
                                    </div>
                                </div>
                            ))}
                        </div>

                        {/* Order Totals */}
                        <div className="border-t border-gray-100 pt-4 flex justify-end">
                            <div className="w-full md:w-1/2 space-y-2">
                                <div className="flex justify-between text-gray-600">
                                    <span>Subtotal</span>
                                    <span>${order.total_amount.toFixed(2)}</span>
                                </div>
                                <div className="flex justify-between text-gray-600">
                                    <span>Shipping</span>
                                    <span className="text-green-600">Free</span>
                                </div>
                                <div className="flex justify-between font-bold text-xl pt-2 border-t border-dashed border-gray-200">
                                    <span>Total</span>
                                    <span>${order.total_amount.toFixed(2)}</span>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Sidebar Info */}
                    <div className="space-y-8">
                        {/* Shipping Address */}
                        <div className="bg-gray-50 p-6 rounded-xl border border-gray-100">
                            <h2 className="font-semibold text-lg flex items-center mb-4">
                                <MapPin className="w-5 h-5 mr-2 text-primary" />
                                Shipping Address
                            </h2>
                            {shippingAddress ? (
                                <address className="not-italic text-sm text-gray-600 space-y-1">
                                    <p className="font-medium text-gray-900">{shippingAddress.fullName}</p>
                                    <p>{shippingAddress.address}</p>
                                    <p>{shippingAddress.city}, {shippingAddress.postalCode}</p>
                                    <p>{shippingAddress.country}</p>
                                </address>
                            ) : (
                                <p className="text-sm text-gray-400">No address provided</p>
                            )}
                        </div>

                        {/* Payment Info (Mock) */}
                        <div className="bg-gray-50 p-6 rounded-xl border border-gray-100">
                            <h2 className="font-semibold text-lg flex items-center mb-4">
                                <CreditCard className="w-5 h-5 mr-2 text-primary" />
                                Payment Method
                            </h2>
                            <div className="flex items-center text-sm text-gray-600">
                                <div className="w-8 h-5 bg-gray-200 rounded mr-2"></div>
                                <span>Visa ending in 4242</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
