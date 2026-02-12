'use client';

import { useEffect, useState } from 'react';
import { useAuth } from '@/context/AuthContext';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { Package, User as UserIcon, LogOut, Settings } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import Link from 'next/link';

// ... imports
import { supabase } from '@/lib/supabase';

export default function UserDashboard() {
    const { user, profile, loading, signOut } = useAuth();
    const router = useRouter();
    const [orders, setOrders] = useState<any[]>([]);

    useEffect(() => {
        if (!loading && !user) {
            router.push('/auth/login');
        }
    }, [user, loading, router]);

    useEffect(() => {
        const fetchOrders = async () => {
            if (!user) return;
            const { data, error } = await supabase
                .from('orders')
                .select('*')
                .eq('user_id', user.id)
                .order('created_at', { ascending: false });

            if (error) {
                console.error('Error fetching orders:', error);
            } else {
                setOrders(data || []);
            }
        };
        fetchOrders();
    }, [user]);

    if (loading || !user) {
        return <div className="min-h-screen flex items-center justify-center">Loading...</div>;
    }

    const handleSignOut = async () => {
        await signOut();
        router.push('/');
    };

    return (
        <div className="container mx-auto px-4 py-12">
            <h1 className="text-3xl font-bold mb-8">My Account</h1>

            <div className="grid md:grid-cols-4 gap-8">
                {/* Sidebar */}
                <aside className="space-y-4">
                    <div className="bg-white p-6 rounded-xl border border-gray-100 shadow-sm text-center">
                        <div className="w-20 h-20 bg-primary/10 rounded-full mx-auto mb-4 flex items-center justify-center text-primary text-2xl font-bold">
                            {user.email?.charAt(0).toUpperCase()}
                        </div>
                        <h2 className="font-semibold break-all">{user.email}</h2>
                        <span className="text-xs px-2 py-0.5 bg-primary/10 text-primary rounded-full uppercase tracking-wider font-bold">
                            {profile?.role === 'admin' ? 'Admin' : 'Member'}
                        </span>
                    </div>

                    <nav className="space-y-2">
                        <Button variant="ghost" className="w-full justify-start text-primary bg-primary/5">
                            <Package className="w-4 h-4 mr-2" />
                            Orders
                        </Button>
                        <Button variant="ghost" className="w-full justify-start">
                            <Settings className="w-4 h-4 mr-2" />
                            Settings
                        </Button>
                        {profile?.role === 'admin' && (
                            <Link href="/admin/overview" className="w-full">
                                <Button variant="ghost" className="w-full justify-start text-purple-600 hover:text-purple-700 hover:bg-purple-50 font-bold">
                                    <Settings className="w-4 h-4 mr-2" />
                                    Admin Panel
                                </Button>
                            </Link>
                        )}
                        <Button variant="ghost" className="w-full justify-start text-red-500 hover:text-red-600 hover:bg-red-50" onClick={handleSignOut}>
                            <LogOut className="w-4 h-4 mr-2" />
                            Sign Out
                        </Button>
                    </nav>
                </aside>

                {/* Main Content */}
                <div className="md:col-span-3 space-y-6">
                    {/* Recent Orders */}
                    <div className="bg-white p-6 rounded-xl border border-gray-100 shadow-sm">
                        <h3 className="font-bold text-lg mb-4">Order History</h3>
                        {orders.length === 0 ? (
                            <p className="text-gray-500">You haven't placed any orders yet.</p>
                        ) : (
                            <div className="overflow-x-auto">
                                <table className="w-full text-left">
                                    <thead className="bg-gray-50 text-gray-500 text-xs uppercase">
                                        <tr>
                                            <th className="p-4 rounded-tl-lg">Order ID</th>
                                            <th className="p-4">Date</th>
                                            <th className="p-4">Status</th>
                                            <th className="p-4">Total</th>
                                            <th className="p-4 rounded-tr-lg">Action</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-gray-100">
                                        {orders.map(order => (
                                            <tr key={order.id} className="hover:bg-gray-50 transition-colors">
                                                <td className="p-4 font-medium text-xs font-mono">{order.id.slice(0, 8)}...</td>
                                                <td className="p-4 text-gray-500">
                                                    {new Date(order.created_at).toLocaleDateString()}
                                                </td>
                                                <td className="p-4">
                                                    <span className={`px-2 py-1 rounded-full text-xs font-medium capitalize 
                                                        ${order.status === 'delivered' ? 'bg-green-100 text-green-700' :
                                                            order.status === 'pending' ? 'bg-yellow-100 text-yellow-700' :
                                                                'bg-blue-100 text-blue-700'
                                                        }`}>
                                                        {order.status}
                                                    </span>
                                                </td>
                                                <td className="p-4">${order.total_amount.toFixed(2)}</td>
                                                <td className="p-4">
                                                    <Link href={`/dashboard/orders/${order.id}`}>
                                                        <Button size="sm" variant="outline" className="text-xs h-8">View</Button>
                                                    </Link>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}
