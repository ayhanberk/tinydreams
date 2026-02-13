'use client';

import { useState } from 'react';
import { useAuth } from '@/context/AuthContext';
import { notFound } from 'next/navigation';
import AdminSidebar from '@/components/admin/AdminSidebar';
import { Loader2, Menu } from 'lucide-react';

export default function AdminLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    const { profile, loading } = useAuth();
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);

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
            <AdminSidebar
                isOpen={isSidebarOpen}
                onClose={() => setIsSidebarOpen(false)}
            />

            <div className="flex-1 flex flex-col min-w-0">
                {/* Mobile Header */}
                <header className="lg:hidden bg-white border-b border-gray-100 p-4 sticky top-0 z-40 flex items-center justify-between">
                    <div className="flex items-center gap-2">
                        <div className="w-8 h-8 bg-gradient-to-br from-primary to-secondary rounded-lg flex items-center justify-center text-white font-bold text-sm">
                            TD
                        </div>
                        <span className="font-bold text-gray-800">Admin</span>
                    </div>
                    <button
                        onClick={() => setIsSidebarOpen(true)}
                        className="p-2 text-gray-500 hover:bg-gray-50 rounded-lg transition-colors"
                    >
                        <Menu className="w-6 h-6" />
                    </button>
                </header>

                <main className="flex-1 lg:ml-64 p-4 lg:p-8 overflow-y-auto">
                    <div className="max-w-7xl mx-auto">
                        {children}
                    </div>
                </main>
            </div>
        </div>
    );
}
