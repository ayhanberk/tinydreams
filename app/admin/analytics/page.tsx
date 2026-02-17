import { getAnalyticsData } from '@/actions/getAnalytics';
import AdminAnalyticsDashboard from '@/components/admin/AdminAnalyticsDashboard';

export default async function AnalyticsPage() {
    // Fetch data on the server
    const data = await getAnalyticsData();

    return (
        <div className="max-w-7xl mx-auto">
            <div className="mb-8">
                <h1 className="text-2xl font-bold text-gray-800">Analytics Dashboard</h1>
                <p className="text-gray-500 mt-1">Here&apos;s what&apos;s happening with your store today.</p>
            </div>

            <AdminAnalyticsDashboard data={data} />
        </div>
    );
}
