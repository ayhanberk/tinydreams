'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
    TrendingUp,
    LayoutDashboard,
    Package,
    Users,
    Megaphone,
    Bell,
    Settings,
    LogOut,
    FolderTree,
    ShoppingBag,
    Star,
    X,
    Globe
} from 'lucide-react';
import { useAuth } from '@/context/AuthContext';

interface AdminSidebarProps {
    isOpen?: boolean;
    onClose?: () => void;
}

export default function AdminSidebar({ isOpen, onClose }: AdminSidebarProps) {
    const pathname = usePathname();
    const { signOut } = useAuth();

    const links = [
        { name: 'Overview', href: '/admin/overview', icon: LayoutDashboard },
        { name: 'Analytics', href: '/admin/analytics', icon: TrendingUp },
        { name: 'Orders', href: '/admin/orders', icon: ShoppingBag },
        { name: 'Inventory', href: '/admin/inventory', icon: Package },
        { name: 'Products', href: '/admin/products', icon: Package },
        { name: 'Categories', href: '/admin/categories', icon: FolderTree },
        { name: 'Users', href: '/admin/users', icon: Users },
        { name: 'Blog', href: '/admin/blog', icon: Megaphone },
        { name: 'Reviews', href: '/admin/reviews', icon: Star },
        { name: 'Banners', href: '/admin/banners', icon: Megaphone }, // Maybe remove Banners if Blog covers it, or keep both? Keep both.
        { name: 'Notifications', href: '/admin/notifications', icon: Bell },
        { name: 'Translations', href: '/admin/translations', icon: Globe },
        { name: 'Settings', href: '/admin/settings', icon: Settings },
    ];

    return (
        <>
            {/* Backdrop for mobile */}
            {isOpen && (
                <div
                    className="fixed inset-0 bg-black/50 z-40 lg:hidden backdrop-blur-sm transition-opacity"
                    onClick={onClose}
                />
            )}

            <aside className={`fixed left-0 top-0 bottom-0 w-64 bg-white border-r border-gray-100 z-50 flex flex-col transition-transform duration-300 ease-in-out lg:translate-x-0 ${isOpen ? 'translate-x-0' : '-translate-x-full'
                }`}>
                <div className="p-6 border-b border-gray-100 flex items-center justify-between">
                    <div className="flex items-center gap-2">
                        <div className="w-8 h-8 bg-gradient-to-br from-primary to-secondary rounded-lg flex items-center justify-center text-white font-bold">
                            TD
                        </div>
                        <span className="font-bold text-gray-800 text-lg">TinyAdmin</span>
                    </div>
                    {/* Close button for mobile */}
                    <button
                        onClick={onClose}
                        className="p-2 -mr-2 text-gray-400 hover:text-gray-600 lg:hidden"
                    >
                        <X className="w-5 h-5" />
                    </button>
                </div>

                <nav className="flex-1 p-4 space-y-1 overflow-y-auto">
                    {links.map((link) => {
                        const isActive = pathname.startsWith(link.href);
                        return (
                            <Link
                                key={link.href}
                                href={link.href}
                                onClick={onClose}
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
        </>
    );
}
