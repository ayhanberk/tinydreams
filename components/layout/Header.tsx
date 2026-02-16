'use client';

import Link from 'next/link';
import { useState, useEffect } from 'react';
import { Menu, X, ShoppingCart, User, Settings, Heart } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useCart } from '@/context/CartContext';
import { useAuth } from '@/context/AuthContext';
import { supabase } from '@/lib/supabase';
import NotificationCenter from '@/components/layout/NotificationCenter';

const Header = () => {
    const [isOpen, setIsOpen] = useState(false);
    const [scrolled, setScrolled] = useState(false);
    const { toggleCart, cartCount } = useCart();
    const { user, profile, signOut } = useAuth();
    const [categories, setCategories] = useState<any[]>([]);
    const [showShopMenu, setShowShopMenu] = useState(false);

    useEffect(() => {
        const handleScroll = () => {
            setScrolled(window.scrollY > 20);
        };
        window.addEventListener('scroll', handleScroll);

        // Fetch categories for menu
        const fetchCategories = async () => {
            const { data } = await supabase
                .from('categories')
                .select('*')
                .is('parent_id', null) // Fetch top-level categories
                .order('name');
            if (data) setCategories(data);
        };
        fetchCategories();

        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    const navLinks = [
        { name: 'Home', href: '/' },
        // Shop link is special now
        { name: 'About', href: '/about' },
        { name: 'Contact', href: '/contact' },
    ];

    return (
        <header
            className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${scrolled ? 'glass shadow-sm py-2' : 'bg-transparent py-4'
                }`}
        >
            <div className="container mx-auto px-4 flex justify-between items-center">
                {/* Logo */}
                <Link href="/" className="text-2xl font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
                    TinyDreams
                </Link>

                {/* Desktop Nav */}
                <nav className="hidden md:flex items-center space-x-8">
                    {navLinks.map((link, idx) => (
                        // Insert Shop Dropdown before About
                        idx === 1 ? (
                            <div
                                key="shop-menu"
                                className="relative group"
                                onMouseEnter={() => setShowShopMenu(true)}
                                onMouseLeave={() => setShowShopMenu(false)}
                            >
                                <Link
                                    href="/shop"
                                    className="text-foreground hover:text-primary transition-colors font-medium flex items-center gap-1 py-4"
                                >
                                    Shop
                                </Link>

                                <AnimatePresence>
                                    {showShopMenu && (
                                        <motion.div
                                            initial={{ opacity: 0, y: 10 }}
                                            animate={{ opacity: 1, y: 0 }}
                                            exit={{ opacity: 0, y: 10 }}
                                            className="absolute top-full left-0 w-64 bg-white/90 backdrop-blur-md shadow-xl rounded-xl overflow-hidden border border-white/20 p-2"
                                        >
                                            <div className="flex flex-col">
                                                <Link href="/shop" className="px-4 py-2 hover:bg-primary/5 rounded-lg text-sm font-semibold text-gray-700">All Products</Link>
                                                <div className="h-px bg-gray-100 my-1" />
                                                {categories.map(cat => (
                                                    <Link
                                                        key={cat.id}
                                                        href={`/shop?category=${cat.id}`}
                                                        className="px-4 py-2 hover:bg-primary/5 rounded-lg text-sm text-gray-600 transition-colors"
                                                    >
                                                        {cat.name}
                                                    </Link>
                                                ))}
                                            </div>
                                        </motion.div>
                                    )}
                                </AnimatePresence>
                            </div>
                        ) : null
                    ))}
                    {navLinks.map((link) => (
                        <Link
                            key={link.name}
                            href={link.href}
                            className="text-foreground hover:text-primary transition-colors font-medium"
                        >
                            {link.name}
                        </Link>
                    ))}
                </nav>

                {/* Icons */}
                <div className="hidden md:flex items-center space-x-2">
                    <NotificationCenter />
                    <button
                        className="p-2 hover:bg-secondary/10 rounded-full transition-colors relative"
                        onClick={toggleCart}
                    >
                        <ShoppingCart className="w-5 h-5 text-foreground" />
                        {cartCount > 0 && (
                            <span className="absolute top-0 right-0 w-4 h-4 bg-accent text-accent-foreground text-xs rounded-full flex items-center justify-center animate-pulse">
                                {cartCount}
                            </span>
                        )}
                    </button>
                    {user ? (
                        <div className="flex items-center space-x-4">
                            {profile?.role === 'admin' && (
                                <Link href="/admin/overview" className="p-2 hover:bg-purple-50 rounded-full transition-colors group" title="Admin Panel">
                                    <Settings className="w-5 h-5 text-purple-600 group-hover:rotate-45 transition-transform" />
                                </Link>
                            )}
                            <Link href="/profile" className="p-2 hover:bg-secondary/10 rounded-full transition-colors">
                                <User className="w-5 h-5 text-primary font-bold" />
                            </Link>
                            <button onClick={signOut} className="text-sm text-gray-500 hover:text-red-500 transition-colors">
                                Sign Out
                            </button>
                        </div>
                    ) : (
                        <Link href="/auth/login" className="p-2 hover:bg-secondary/10 rounded-full transition-colors">
                            <User className="w-5 h-5 text-foreground" />
                        </Link>
                    )}
                </div>

                {/* Mobile Menu Button */}
                <button
                    className="md:hidden p-2"
                    onClick={() => setIsOpen(!isOpen)}
                >
                    {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
                </button>
            </div>

            {/* Mobile Nav */}
            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        exit={{ opacity: 0, height: 0 }}
                        className="md:hidden glass border-t border-glass-border overflow-hidden"
                    >
                        <div className="container mx-auto px-4 py-4 flex flex-col space-y-4">
                            {navLinks.map((link) => (
                                <Link
                                    key={link.name}
                                    href={link.href}
                                    className="text-foreground hover:text-primary transition-colors py-2 block"
                                    onClick={() => setIsOpen(false)}
                                >
                                    {link.name}
                                </Link>
                            ))}
                            <div className="flex items-center space-x-4 pt-4 border-t border-dashed border-gray-200">
                                <button
                                    className="flex items-center space-x-2 text-foreground"
                                    onClick={() => { setIsOpen(false); toggleCart(); }}
                                >
                                    <ShoppingCart className="w-5 h-5" />
                                    <span>Cart ({cartCount})</span>
                                </button>
                                {user ? (
                                    <>
                                        {profile?.role === 'admin' && (
                                            <Link href="/admin/overview" className="flex items-center space-x-2 text-purple-600 font-medium" onClick={() => setIsOpen(false)}>
                                                <Settings className="w-5 h-5" />
                                                <span>Admin Panel</span>
                                            </Link>
                                        )}
                                        <Link href="/profile" className="flex items-center space-x-2 text-foreground" onClick={() => setIsOpen(false)}>
                                            <User className="w-5 h-5" />
                                            <span>Dashboard</span>
                                        </Link>
                                        <Link href="/profile/family" className="flex items-center space-x-2 text-foreground" onClick={() => setIsOpen(false)}>
                                            <Heart className="w-5 h-5" />
                                            <span>My Family</span>
                                        </Link>
                                        <button onClick={() => { signOut(); setIsOpen(false); }} className="flex items-center space-x-2 text-red-500">
                                            <span>Sign Out</span>
                                        </button>
                                    </>
                                ) : (
                                    <Link href="/auth/login" className="flex items-center space-x-2 text-foreground" onClick={() => setIsOpen(false)}>
                                        <User className="w-5 h-5" />
                                        <span>Login</span>
                                    </Link>
                                )}
                            </div>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </header >
    );
};

export default Header;
