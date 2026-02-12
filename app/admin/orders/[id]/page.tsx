'use client';

import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import { useParams, useRouter } from 'next/navigation';
import { Button } from '@/components/ui/Button';
import {
    ChevronLeft,
    Package,
    Truck,
    CheckCircle,
    XCircle,
    Clock,
    User,
    MapPin,
    CreditCard,
    AlertCircle
} from 'lucide-react';
import { motion } from 'framer-motion';
import { useToast } from '@/context/ToastContext';

const statusOptions = [
    { value: 'pending', label: 'Pending', icon: Clock, color: 'text-yellow-600' },
    { value: 'processing', label: 'Processing', icon: Clock, color: 'text-blue-600' },
    { value: 'shipped', label: 'Shipped', icon: Truck, color: 'text-purple-600' },
    { value: 'delivered', label: 'Delivered', icon: CheckCircle, color: 'text-green-600' },
    { value: 'cancelled', label: 'Cancelled', icon: XCircle, color: 'text-red-600' },
];

export default function AdminOrderDetails() {
    const { id } = useParams();
    const router = useRouter();
    const [order, setOrder] = useState<any>(null);
    const [items, setItems] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [updating, setUpdating] = useState(false);
    const { showToast } = useToast();

    const fetchOrderDetails = async () => {
        setLoading(true);
        try {
            // Fetch Order
            const { data: orderData, error: orderError } = await supabase
                .from('orders')
                .select('*, profiles(*)')
                .eq('id', id)
                .single();

            if (orderError) throw orderError;
            setOrder(orderData);

            // Fetch Items
            const { data: itemsData, error: itemsError } = await supabase
                .from('order_items')
                .select('*, products(*)')
                .eq('order_id', id);

            if (itemsError) throw itemsError;
            setItems(itemsData || []);
        } catch (error) {
            console.error('Error fetching order:', error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchOrderDetails();
    }, [id]);

    const handleStatusUpdate = async (newStatus: string) => {
        setUpdating(true);
        const { error } = await supabase
            .from('orders')
            .update({ status: newStatus })
            .eq('id', id);

        if (error) {
            showToast('Failed to update status', 'error');
        } else {
            setOrder((prev: any) => ({ ...prev, status: newStatus }));
            showToast('Order status updated successfully', 'success');
        }
        setUpdating(false);
    };

    if (loading) return <div className="p-8 text-center text-gray-500">Loading order details...</div>;
    if (!order) return <div className="p-8 text-center text-red-500">Order not found.</div>;

    const currentStatus = statusOptions.find(opt => opt.value === order.status) || statusOptions[0];

    return (
        <div className="max-w-5xl mx-auto pb-12">
            <button
                onClick={() => router.back()}
                className="flex items-center text-gray-500 hover:text-gray-900 mb-6 transition-colors"
            >
                <ChevronLeft className="w-4 h-4 mr-1" /> Back to Orders
            </button>

            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
                <div>
                    <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-3">
                        Order #{order.id.slice(0, 8)}
                    </h1>
                    <p className="text-gray-500 mt-1">
                        Placed on {new Date(order.created_at).toLocaleString()}
                    </p>
                </div>

                <div className="flex items-center gap-3 bg-white p-2 rounded-2xl border border-gray-100 shadow-sm">
                    {statusOptions.map((opt) => (
                        <button
                            key={opt.value}
                            disabled={updating}
                            onClick={() => handleStatusUpdate(opt.value)}
                            className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all ${order.status === opt.value
                                ? 'bg-primary text-white shadow-md'
                                : 'text-gray-400 hover:bg-gray-50'
                                }`}
                        >
                            {opt.label}
                        </button>
                    ))}
                </div>
            </div>

            <div className="grid md:grid-cols-3 gap-8">
                {/* Left Column: Items */}
                <div className="md:col-span-2 space-y-6">
                    <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
                        <div className="p-6 border-b border-gray-100 flex items-center gap-2">
                            <Package className="w-5 h-5 text-gray-400" />
                            <h2 className="font-bold text-gray-900">Order Items</h2>
                            <span className="ml-auto bg-gray-100 px-2 py-0.5 rounded text-xs text-gray-500 font-medium">
                                {items.length} Items
                            </span>
                        </div>
                        <div className="divide-y divide-gray-100">
                            {items.map((item) => (
                                <div key={item.id} className="p-6 flex gap-4">
                                    <div className="w-20 h-20 bg-gray-50 rounded-xl overflow-hidden border border-gray-100 flex-shrink-0">
                                        <img
                                            src={item.products?.image_url || item.products?.image}
                                            alt={item.products?.title}
                                            className="w-full h-full object-cover"
                                        />
                                    </div>
                                    <div className="flex-1">
                                        <h3 className="font-bold text-gray-900">{item.products?.title}</h3>
                                        <div className="flex flex-wrap gap-2 mt-1">
                                            {item.color && (
                                                <span className="text-xs bg-gray-100 px-2 py-0.5 rounded text-gray-600">Color: {item.color}</span>
                                            )}
                                            {item.size && (
                                                <span className="text-xs bg-gray-100 px-2 py-0.5 rounded text-gray-600">Size: {item.size}</span>
                                            )}
                                        </div>
                                        <div className="mt-3 flex justify-between items-end">
                                            <p className="text-sm text-gray-500">
                                                ${item.price_at_purchase.toFixed(2)} × {item.quantity}
                                            </p>
                                            <p className="font-bold text-gray-900">
                                                ${(item.price_at_purchase * item.quantity).toFixed(2)}
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                        <div className="p-6 bg-gray-50 border-t border-gray-100 space-y-2">
                            <div className="flex justify-between text-gray-500">
                                <span>Subtotal</span>
                                <span>${order.total_amount.toFixed(2)}</span>
                            </div>
                            <div className="flex justify-between text-gray-500">
                                <span>Shipping</span>
                                <span className="text-green-600 font-medium">Free</span>
                            </div>
                            <div className="flex justify-between text-xl font-bold text-gray-900 pt-2 border-t border-gray-200">
                                <span>Total</span>
                                <span>${order.total_amount.toFixed(2)}</span>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Right Column: Customer & Shipping */}
                <div className="space-y-6">
                    {/* Customer Info */}
                    <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
                        <div className="flex items-center gap-2 mb-4">
                            <User className="w-5 h-5 text-gray-400" />
                            <h2 className="font-bold text-gray-900">Customer</h2>
                        </div>
                        <div className="space-y-3">
                            <div>
                                <p className="text-xs text-gray-500 uppercase font-bold tracking-wider">Full Name</p>
                                <p className="text-gray-900 font-medium">{order.shipping_address?.fullName || order.profiles?.full_name || 'Anonymous'}</p>
                            </div>
                            <div>
                                <p className="text-xs text-gray-500 uppercase font-bold tracking-wider">Email</p>
                                <p className="text-gray-900 font-medium">{order.profiles?.email || 'N/A'}</p>
                            </div>
                        </div>
                    </div>

                    {/* Shipping Address */}
                    <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
                        <div className="flex items-center gap-2 mb-4">
                            <MapPin className="w-5 h-5 text-gray-400" />
                            <h2 className="font-bold text-gray-900">Shipping Address</h2>
                        </div>
                        <div className="text-gray-600 space-y-1 text-sm leading-relaxed">
                            <p className="font-medium text-gray-900">{order.shipping_address?.fullName}</p>
                            <p>{order.shipping_address?.address}</p>
                            <p>{order.shipping_address?.city}, {order.shipping_address?.postalCode}</p>
                            <p>{order.shipping_address?.country}</p>
                        </div>
                    </div>

                    {/* Order Status History */}
                    <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
                        <div className="flex items-center gap-2 mb-4">
                            <Clock className="w-5 h-5 text-gray-400" />
                            <h2 className="font-bold text-gray-900">Order History</h2>
                        </div>
                        <div className="space-y-4">
                            <div className="flex gap-3">
                                <div className={`w-2 h-2 rounded-full mt-1.5 flex-shrink-0 ${currentStatus.color.replace('text-', 'bg-')}`}></div>
                                <div>
                                    <p className="text-sm font-bold text-gray-900">Current Status: {currentStatus.label}</p>
                                    <p className="text-xs text-gray-500">Updated recently</p>
                                </div>
                            </div>
                            <div className="flex gap-3">
                                <div className="w-2 h-2 rounded-full mt-1.5 flex-shrink-0 bg-gray-300"></div>
                                <div>
                                    <p className="text-sm font-medium text-gray-600">Order Placed</p>
                                    <p className="text-xs text-gray-500">{new Date(order.created_at).toLocaleString()}</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
