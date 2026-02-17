'use client';

import { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/lib/supabase';
import { Button } from '@/components/ui/Button';
import { Search, Eye, Clock, CheckCircle, Truck, XCircle } from 'lucide-react';
import Link from 'next/link';

const statusColors: Record<string, string> = {
    pending: 'bg-yellow-50 text-yellow-700 border-yellow-100',
    processing: 'bg-blue-50 text-blue-700 border-blue-100',
    shipped: 'bg-purple-50 text-purple-700 border-purple-100',
    delivered: 'bg-green-50 text-green-700 border-green-100',
    cancelled: 'bg-red-50 text-red-700 border-red-100',
};

const statusIcons: Record<string, React.ComponentType<{ className?: string }>> = {
    pending: Clock,
    processing: Clock,
    shipped: Truck,
    delivered: CheckCircle,
    cancelled: XCircle,
};

interface Order {
    id: string;
    status: string;
    total_amount: number;
    created_at: string;
    shipping_address?: { fullName?: string };
    profiles?: { email?: string; full_name?: string };
}

export default function AdminOrders() {
    const [orders, setOrders] = useState<Order[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [searchTerm, setSearchTerm] = useState('');
    const [statusFilter, setStatusFilter] = useState('all');
    const [page, setPage] = useState(1);
    const [hasMore, setHasMore] = useState(true);
    const ORDERS_PER_PAGE = 20;

    const fetchOrders = useCallback(async () => {
        setLoading(true);
        try {
            let query = supabase
                .from('orders')
                .select('*, profiles(email, full_name)', { count: 'exact' })
                .order('created_at', { ascending: false });

            if (statusFilter !== 'all') {
                query = query.eq('status', statusFilter);
            }

            // Calculate range for pagination
            const from = (page - 1) * ORDERS_PER_PAGE;
            const to = from + ORDERS_PER_PAGE - 1;

            const { data, error, count } = await query.range(from, to);

            if (error) throw error;

            setOrders(data || []);
            // Check if there are more items
            setHasMore(count ? from + ORDERS_PER_PAGE < count : false);
            setError(null);
        } catch (err: unknown) {
            console.error('Error fetching orders:', err);
            setError(err instanceof Error ? err.message : 'An error occurred');
        } finally {
            setLoading(false);
        }
    }, [page, statusFilter, supabase]);

    useEffect(() => {
        fetchOrders();
    }, [fetchOrders]);

    // Reset page when filter changes
    useEffect(() => {
        setPage(1);
    }, [statusFilter]);


    const filteredOrders = orders.filter(order =>
        order.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (order.profiles?.email || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
        (order.shipping_address?.fullName || '').toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900">Orders</h1>
                    <p className="text-gray-500">Track and manage customer orders</p>
                </div>
            </div>

            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
                <div className="p-4 border-b border-gray-100 flex flex-col md:flex-row gap-4">
                    <div className="relative flex-1">
                        <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                        <input
                            type="text"
                            placeholder="Search by ID, email or name..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="w-full pl-10 pr-4 py-2 border rounded-xl text-sm focus:ring-2 focus:ring-primary/20 outline-none"
                        />
                    </div>

                    <select
                        value={statusFilter}
                        onChange={(e) => setStatusFilter(e.target.value)}
                        className="px-4 py-2 border rounded-xl text-sm focus:ring-2 focus:ring-primary/20 outline-none bg-white text-gray-600"
                    >
                        <option value="all">All Statuses</option>
                        <option value="pending">Pending</option>
                        <option value="processing">Processing</option>
                        <option value="shipped">Shipped</option>
                        <option value="delivered">Delivered</option>
                        <option value="cancelled">Cancelled</option>
                    </select>
                </div>

                {error && (
                    <div className="p-4 mx-4 my-2 bg-red-50 border border-red-100 rounded-xl text-red-600 text-sm">
                        <b>Error loading orders:</b> {error}
                    </div>
                )}

                <div className="overflow-x-auto">
                    <table className="w-full text-left">
                        <thead className="bg-gray-50 text-gray-500 text-xs uppercase">
                            <tr>
                                <th className="p-4">Order ID</th>
                                <th className="p-4">Customer</th>
                                <th className="p-4">Date</th>
                                <th className="p-4">Total</th>
                                <th className="p-4">Status</th>
                                <th className="p-4 text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100">
                            {loading ? (
                                <tr><td colSpan={6} className="p-8 text-center text-gray-400">Loading...</td></tr>
                            ) : filteredOrders.length === 0 ? (
                                <tr><td colSpan={6} className="p-8 text-center text-gray-400">No orders found.</td></tr>
                            ) : (
                                filteredOrders.map(order => {
                                    const StatusIcon = statusIcons[order.status] || Clock;
                                    return (
                                        <tr key={order.id} className="hover:bg-gray-50/50 transition-colors">
                                            <td className="p-4">
                                                <span className="font-mono text-xs font-medium text-gray-600">
                                                    #{order.id.slice(0, 8)}
                                                </span>
                                            </td>
                                            <td className="p-4">
                                                <div className="flex flex-col">
                                                    <span className="font-medium text-gray-900 text-sm">
                                                        {order.shipping_address?.fullName || 'Guest User'}
                                                    </span>
                                                    <span className="text-xs text-gray-500">
                                                        {order.profiles?.email || 'N/A'}
                                                    </span>
                                                </div>
                                            </td>
                                            <td className="p-4 text-gray-500 text-sm">
                                                {new Date(order.created_at).toLocaleDateString()}
                                            </td>
                                            <td className="p-4 font-bold text-gray-900">
                                                ${order.total_amount.toFixed(2)}
                                            </td>
                                            <td className="p-4">
                                                <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold border ${statusColors[order.status] || statusColors.pending}`}>
                                                    <StatusIcon className="w-3 h-3" />
                                                    {order.status.charAt(0)?.toUpperCase() + order.status.slice(1)}
                                                </span>
                                            </td>
                                            <td className="p-4 text-right">
                                                <Link href={`/admin/orders/${order.id}`}>
                                                    <Button variant="outline" size="sm" className="gap-2">
                                                        <Eye className="w-4 h-4" /> View
                                                    </Button>
                                                </Link>
                                            </td>
                                        </tr>
                                    );
                                })
                            )}
                        </tbody>
                    </table>
                </div>

                {/* Pagination Controls */}
                <div className="p-4 border-t border-gray-100 flex items-center justify-between bg-gray-50">
                    <span className="text-sm text-gray-500">
                        Page {page}
                    </span>
                    <div className="flex gap-2">
                        <Button
                            variant="outline"
                            size="sm"
                            disabled={page === 1 || loading}
                            onClick={() => setPage(p => Math.max(1, p - 1))}
                        >
                            Previous
                        </Button>
                        <Button
                            variant="outline"
                            size="sm"
                            disabled={!hasMore || loading}
                            onClick={() => setPage(p => p + 1)}
                        >
                            Next
                        </Button>
                    </div>
                </div>
            </div>
        </div>
    );
}
