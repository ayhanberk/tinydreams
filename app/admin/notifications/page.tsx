'use client';

import NotificationSender from '@/components/admin/NotificationSender';

export default function AdminNotificationsPage() {
    return (
        <div className="space-y-6">
            <div>
                <h1 className="text-2xl font-bold text-gray-900">Notifications</h1>
                <p className="text-gray-500">Send push notifications to your users</p>
            </div>
            <NotificationSender />
        </div>
    );
}
