'use client';

import { motion } from 'framer-motion';
import { LayoutDashboard, Package, Users, TrendingUp } from 'lucide-react';

export default function AdminOverview() {
    const stats = [
        { label: 'Total Sales', value: '$12,450', change: '+12%', icon: TrendingUp, color: 'text-green-500', bg: 'bg-green-100' },
        { label: 'Active Orders', value: '24', change: '+5', icon: Package, color: 'text-blue-500', bg: 'bg-blue-100' },
        { label: 'Total Users', value: '1,203', change: '+18%', icon: Users, color: 'text-purple-500', bg: 'bg-purple-100' },
    ];

    return (
        <div className="space-y-8">
            <div>
                <h1 className="text-3xl font-bold text-gray-900">Dashboard Overview</h1>
                <p className="text-gray-500">Welcome back, Admin. Here is what is happening today.</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {stats.map((stat, index) => (
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: index * 0.1 }}
                        key={index}
                        className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm flex items-center justify-between"
                    >
                        <div>
                            <p className="text-sm text-gray-500 mb-1 font-medium">{stat.label}</p>
                            <h2 className="text-3xl font-bold text-gray-900">{stat.value}</h2>
                            <span className="text-xs text-green-500 font-medium inline-flex items-center mt-2">
                                <TrendingUp className="w-3 h-3 mr-1" /> {stat.change} since last month
                            </span>
                        </div>
                        <div className={`p-4 rounded-xl ${stat.bg} ${stat.color}`}>
                            <stat.icon className="w-6 h-6" />
                        </div>
                    </motion.div>
                ))}
            </div>

            <div className="grid md:grid-cols-2 gap-6">
                <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm min-h-[300px]">
                    <h3 className="font-bold text-lg mb-6">Recent Sales</h3>
                    <div className="h-48 flex items-center justify-center text-gray-400 bg-gray-50 rounded-xl border border-dashed border-gray-200">
                        Chart Visualization Placeholder
                    </div>
                </div>
                <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm min-h-[300px]">
                    <h3 className="font-bold text-lg mb-6">Recent Orders</h3>
                    <div className="space-y-4">
                        {[1, 2, 3].map(i => (
                            <div key={i} className="flex items-center justify-between p-3 hover:bg-gray-50 rounded-lg transition-colors cursor-pointer">
                                <div className="flex items-center gap-3">
                                    <div className="w-10 h-10 bg-gray-200 rounded-lg"></div>
                                    <div>
                                        <p className="font-medium text-sm">Order #{1000 + i}</p>
                                        <p className="text-xs text-gray-500">2 items • $120.00</p>
                                    </div>
                                </div>
                                <span className="text-xs px-2 py-1 bg-yellow-100 text-yellow-700 rounded-full font-medium">Pending</span>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
}
