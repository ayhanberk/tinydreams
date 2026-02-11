'use client';

import UserManagement from '@/components/admin/UserManagement';

export default function AdminUsersPage() {
    return (
        <div className="space-y-6">
            <div>
                <h1 className="text-2xl font-bold text-gray-900">User Management</h1>
                <p className="text-gray-500">Manage user roles and permissions</p>
            </div>
            <UserManagement />
        </div>
    );
}
