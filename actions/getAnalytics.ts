'use server';

import { createClient } from '@/lib/supabase/server';

export async function getAnalyticsData() {
    const supabase = await createClient();

    // 1. Total Users
    const { count: totalUsers, error: usersError } = await supabase
        .from('profiles')
        .select('*', { count: 'exact', head: true });

    if (usersError) throw new Error(usersError.message);

    // 2. Total Orders & Revenue
    const { data: orders, error: ordersError } = await supabase
        .from('orders')
        .select('id, total_amount, created_at, status');

    if (ordersError) throw new Error(ordersError.message);

    const totalOrders = orders.length;

    interface Order {
        id: number;
        total_amount: number | null;
        created_at: string;
        status: string;
    }

    // Calculate Total Revenue (excluding cancelled)
    const validOrders = (orders as Order[]).filter(o => o.status !== 'cancelled');
    const totalRevenue = validOrders.reduce((acc, order) => acc + (order.total_amount || 0), 0);

    // 3. Low Stock Products
    const { count: lowStockCount, error: stockError } = await supabase
        .from('products')
        .select('*', { count: 'exact', head: true })
        .lt('stock', 5);

    if (stockError) throw new Error(stockError.message);

    // 4. Chart Data: Revenue Last 30 Days
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

    const recentOrders = validOrders.filter(o => new Date(o.created_at) >= thirtyDaysAgo);

    // Group by Date
    const salesByDate: Record<string, number> = {};
    recentOrders.forEach(order => {
        const date = new Date(order.created_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
        salesByDate[date] = (salesByDate[date] || 0) + (order.total_amount || 0);
    });

    const revenueChartData = Object.entries(salesByDate).map(([date, amount]) => ({
        name: date,
        revenue: amount
    })).sort((a, b) => new Date(a.name).getTime() - new Date(b.name).getTime());

    return {
        totalUsers: totalUsers || 0,
        totalOrders: totalOrders || 0,
        totalRevenue: totalRevenue || 0,
        lowStockCount: lowStockCount || 0,
        revenueChartData
    };
}
