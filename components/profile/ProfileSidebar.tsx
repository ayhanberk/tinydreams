'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { User, Package, MapPin, Heart, LogOut } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';

export default function ProfileSidebar() {
    const pathname = usePathname();
    const { signOut } = useAuth();

    const links = [
        { name: 'Dashboard', href: '/profile', icon: User },
        { name: 'My Orders', href: '/profile/orders', icon: Package },
        { name: 'Addresses', href: '/profile/addresses', icon: MapPin },
        { name: 'Wishlist', href: '/wishlist', icon: Heart },
    ];

    return (
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-4 sticky top-24">
            <nav className="space-y-1">
                {links.map((link) => {
                    const isActive = pathname === link.href;
                    return (
                        <Link
                            key={link.href}
                            href={link.href}
                            className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${isActive
                                    ? 'bg-primary/10 text-primary font-medium'
                                    : 'text-gray-500 hover:bg-gray-50 hover:text-gray-900'
                                }`}
                        >
                            <link.icon className={`w-5 h-5 ${isActive ? 'text-primary' : 'text-gray-400'}`} />
                            {link.name}
                        </Link>
                    )
                })}

                <hr className="my-4 border-gray-100" />

                <button
                    onClick={signOut}
                    className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-red-500 hover:bg-red-50 transition-all text-left"
                >
                    <LogOut className="w-5 h-5" />
                    Sign Out
                </button>
            </nav>
        </div>
    );
}
