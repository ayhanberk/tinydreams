import { getUserProfile, getUserOrders } from '@/actions/profile';
import { Package, MapPin, Heart, Settings } from 'lucide-react';
import Link from 'next/link';
import FamilySection from '@/components/profile/FamilySection';

export default async function ProfileDashboard() {
    const profile = await getUserProfile();
    const orders = await getUserOrders();

    // Get recent order
    const recentOrder = orders[0];

    return (
        <div className="space-y-6">
            <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
                <h1 className="text-2xl font-bold text-gray-900 mb-2">
                    Welcome back, {profile?.full_name || 'Dreamer'}!
                </h1>
                <p className="text-gray-500">
                    Manage your family, orders, and addresses here.
                </p>
            </div>

            {/* Quick Family Access */}
            <FamilySection />

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 pt-6 border-t border-gray-100">
                <Link href="/profile/orders" className="block group">
                    <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 h-full hover:border-blue-200 transition-colors">
                        <div className="flex items-center gap-4 mb-4">
                            <div className="p-3 bg-blue-50 rounded-xl group-hover:bg-blue-100 transition-colors">
                                <Package className="w-6 h-6 text-blue-500" />
                            </div>
                            <h2 className="text-lg font-semibold text-gray-800">Recent Order</h2>
                        </div>
                        {recentOrder ? (
                            <div>
                                <p className="text-sm text-gray-500 mb-1">Order #{recentOrder.id.slice(0, 8)}</p>
                                <p className="font-medium text-gray-900 flex justify-between">
                                    <span>{new Date(recentOrder.created_at).toLocaleDateString()}</span>
                                    <span className="text-green-600 font-bold">${recentOrder.total_amount?.toFixed(2)}</span>
                                </p>
                            </div>
                        ) : (
                            <p className="text-gray-500">No orders yet. Start shopping!</p>
                        )}
                    </div>
                </Link>

                <Link href="/profile/wishlist" className="block group">
                    <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 h-full hover:border-rose-200 transition-colors">
                        <div className="flex items-center gap-4 mb-4">
                            <div className="p-3 bg-rose-50 rounded-xl group-hover:bg-rose-100 transition-colors">
                                <Heart className="w-6 h-6 text-rose-500" />
                            </div>
                            <h2 className="text-lg font-semibold text-gray-800">Wishlist</h2>
                        </div>
                        <p className="text-gray-500">
                            Keep track of products you love.
                        </p>
                    </div>
                </Link>

                <Link href="/profile/addresses" className="block group">
                    <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 h-full hover:border-purple-200 transition-colors">
                        <div className="flex items-center gap-4 mb-4">
                            <div className="p-3 bg-purple-50 rounded-xl group-hover:bg-purple-100 transition-colors">
                                <MapPin className="w-6 h-6 text-purple-500" />
                            </div>
                            <h2 className="text-lg font-semibold text-gray-800">Addresses</h2>
                        </div>
                        <p className="text-gray-500">
                            Manage your shipping and billing addresses.
                        </p>
                    </div>
                </Link>

                <Link href="/profile/settings" className="block group">
                    <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 h-full hover:border-gray-200 transition-colors">
                        <div className="flex items-center gap-4 mb-4">
                            <div className="p-3 bg-gray-50 rounded-xl group-hover:bg-gray-100 transition-colors">
                                <Settings className="w-6 h-6 text-gray-600" />
                            </div>
                            <h2 className="text-lg font-semibold text-gray-800">Settings</h2>
                        </div>
                        <p className="text-gray-500">
                            Update your personal info and security.
                        </p>
                    </div>
                </Link>
            </div>
        </div>
    );
}
