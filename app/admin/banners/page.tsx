'use client';

import BannerManager from '@/components/admin/BannerManager';

export default function AdminBannersPage() {
    return (
        <div className="space-y-6">
            <div>
                <h1 className="text-2xl font-bold text-gray-900">Banner Management</h1>
                <p className="text-gray-500">Create and manage site-wide announcements</p>
            </div>
            <BannerManager />
        </div>
    );
}
