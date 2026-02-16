'use client';

import {
    LineChart,
    Line,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    ResponsiveContainer,
    BarChart,
    Bar,
    Legend
} from 'recharts';
import { Users, ShoppingBag, DollarSign, AlertTriangle } from 'lucide-react';
import { motion } from 'framer-motion';

interface AnalyticsData {
    totalUsers: number;
    totalOrders: number;
    totalRevenue: number;
    lowStockCount: number;
    revenueChartData: { name: string; revenue: number }[];
}

export default function AdminAnalyticsDashboard({ data }: { data: AnalyticsData }) {
    const stats = [
        {
            title: 'Total Revenue',
            value: `$${data.totalRevenue.toLocaleString()}`,
            icon: DollarSign,
            color: 'bg-green-500',
            textColor: 'text-green-500',
            bgColor: 'bg-green-50'
        },
        {
            title: 'Total Orders',
            value: data.totalOrders,
            icon: ShoppingBag,
            color: 'bg-blue-500',
            textColor: 'text-blue-500',
            bgColor: 'bg-blue-50'
        },
        {
            title: 'Total Users',
            value: data.totalUsers,
            icon: Users,
            color: 'bg-purple-500',
            textColor: 'text-purple-500',
            bgColor: 'bg-purple-50'
        },
        {
            title: 'Low Stock Items',
            value: data.lowStockCount,
            icon: AlertTriangle,
            color: 'bg-orange-500',
            textColor: 'text-orange-500',
            bgColor: 'bg-orange-50'
        }
    ];

    return (
        <div className="space-y-8">
            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {stats.map((stat, index) => (
                    <motion.div
                        key={stat.title}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: index * 0.1 }}
                        className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100"
                    >
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-gray-500 text-sm font-medium">{stat.title}</p>
                                <h3 className="text-2xl font-bold mt-1 text-gray-900">{stat.value}</h3>
                            </div>
                            <div className={`p-3 rounded-xl ${stat.bgColor}`}>
                                <stat.icon className={`w-6 h-6 ${stat.textColor}`} />
                            </div>
                        </div>
                    </motion.div>
                ))}
            </div>

            {/* Charts Section */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Revenue Chart */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.4 }}
                    className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 lg:col-span-2"
                >
                    <h3 className="text-lg font-bold text-gray-800 mb-6">Revenue Overview (Last 30 Days)</h3>
                    <div className="h-[350px] w-full">
                        <ResponsiveContainer width="100%" height="100%">
                            <LineChart data={data.revenueChartData}>
                                <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                                <XAxis
                                    dataKey="name"
                                    stroke="#888888"
                                    fontSize={12}
                                    tickLine={false}
                                    axisLine={false}
                                />
                                <YAxis
                                    stroke="#888888"
                                    fontSize={12}
                                    tickLine={false}
                                    axisLine={false}
                                    tickFormatter={(value) => `$${value}`}
                                />
                                <Tooltip
                                    contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }}
                                    formatter={(value: any) => [`$${value.toLocaleString()}`, 'Revenue']}
                                />
                                <Legend />
                                <Line
                                    type="monotone"
                                    dataKey="revenue"
                                    stroke="#3b82f6"
                                    strokeWidth={3}
                                    dot={{ r: 4, strokeWidth: 2, fill: '#fff' }}
                                    activeDot={{ r: 6, strokeWidth: 0 }}
                                />
                            </LineChart>
                        </ResponsiveContainer>
                    </div>
                </motion.div>

                {/* Additional Info / Future Chart Placeholders */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.5 }}
                    className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 lg:col-span-1"
                >
                    <h3 className="text-lg font-bold text-gray-800 mb-6">Quick Insights</h3>
                    <div className="space-y-6">
                        <div className="p-4 rounded-xl bg-blue-50 border border-blue-100">
                            <h4 className="font-semibold text-blue-700 mb-1">Growth Tip</h4>
                            <p className="text-sm text-blue-600">
                                Your revenue is looking good! Try promoting items with low sales to boost overall performance.
                            </p>
                        </div>
                        <div className="p-4 rounded-xl bg-purple-50 border border-purple-100">
                            <h4 className="font-semibold text-purple-700 mb-1">User Engagement</h4>
                            <p className="text-sm text-purple-600">
                                You have gained {data.totalUsers > 0 ? 'new' : 'no'} users recently. Keep your catalog fresh to retain them.
                            </p>
                        </div>
                    </div>
                </motion.div>
            </div>
        </div>
    );
}
