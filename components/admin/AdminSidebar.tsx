'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
    LayoutDashboard,
    Package,
    Users,
    Megaphone,
    Bell,
    Settings,
    LogOut,
    FolderTree,
    ShoppingBag
} from 'lucide-react';
import { useAuth } from '@/context/AuthContext';

export default function AdminSidebar() {
    const pathname = usePathname();
    const { signOut } = useAuth();

    const links = [
        { name: 'Overview', href: '/admin/overview', icon: LayoutDashboard },
        { name: 'Products', href: '/admin/products', icon: Package },
        { name: 'Categories', href: '/admin/categories', icon: FolderTree },
        { name: 'Users', href: '/admin/users', icon: Users },
        { name: 'Banners', href: '/admin/banners', icon: Megaphone },
        { name: 'Notifications', href: '/admin/notifications', icon: Bell },
    ];

    return (
        <aside className="fixed left-0 top-0 bottom-0 w-64 bg-white border-r border-gray-100 z-50 flex flex-col">
            <div className="p-6 border-b border-gray-100 flex items-center gap-2">
                <div className="w-8 h-8 bg-gradient-to-br from-primary to-secondary rounded-lg flex items-center justify-center text-white font-bold">
                    TD
                </div>
                <span className="font-bold text-gray-800 text-lg">TinyAdmin</span>
            </div>

            <nav className="flex-1 p-4 space-y-1 overflow-y-auto">
                {links.map((link) => {
                    const isActive = pathname.startsWith(link.href);
                    return (
                        <Link
                            key={link.href}
                            href={link.href}
                            className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${isActive
                                    ? 'bg-primary/10 text-primary font-medium shadow-sm'
                                    : 'text-gray-500 hover:bg-gray-50 hover:text-gray-900 disconnect'
                                }`}
                        >
                            <link.icon className={`w-5 h-5 ${isActive ? 'text-primary' : 'text-gray-400'}`} />
                            {link.name}
                        </Link>
                    )
                })}
            </nav>

            <div className="p-4 border-t border-gray-100 space-y-2">
                <Link
                    href="/"
                    className="flex items-center gap-3 px-4 py-3 rounded-xl text-gray-500 hover:bg-gray-50 hover:text-gray-900 transition-all"
                >
                    <ShoppingBag className="w-5 h-5 text-gray-400" />
                    Back to Store
                </Link>
                <button
                    onClick={signOut}
                    className="flex items-center gap-3 px-4 py-3 rounded-xl text-red-500 hover:bg-red-50 w-full transition-all"
                >
                    <LogOut className="w-5 h-5" />
                    Sign Out
                </button>
            </div>
        </aside>
    );
}
