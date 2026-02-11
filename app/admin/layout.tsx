'use client';

import { useAuth } from '@/context/AuthContext';
import { notFound } from 'next/navigation';
import AdminSidebar from '@/components/admin/AdminSidebar';
import { Loader2 } from 'lucide-react';

export default function AdminLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    const { profile, loading } = useAuth();

    // If still loading auth/profile, show loader
    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gray-50">
                <div className="flex flex-col items-center gap-4">
                    <Loader2 className="w-10 h-10 animate-spin text-primary" />
                    <p className="text-gray-500 font-medium animate-pulse">Verifying access...</p>
                </div>
            </div>
        );
    }

    // Security Guard: If not an admin, return 404 (Hide the existence of /admin)
    if (profile?.role !== 'admin') {
        return notFound();
    }

    return (
        <div className="min-h-screen bg-gray-50 flex font-sans">
            <AdminSidebar />
            <main className="flex-1 ml-64 p-8 overflow-y-auto h-screen">
                <div className="max-w-7xl mx-auto">
                    {children}
                </div>
            </main>
        </div>
    );
}
