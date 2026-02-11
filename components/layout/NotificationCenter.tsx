'use client';

import { useState, useEffect, useRef } from 'react';
import { supabase } from '@/lib/supabase';
import { Bell, X, Check, Trash2 } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '@/context/AuthContext';

export default function NotificationCenter() {
    const { user } = useAuth();
    const [notifications, setNotifications] = useState<any[]>([]);
    const [unreadCount, setUnreadCount] = useState(0);
    const [isOpen, setIsOpen] = useState(false);
    const dropdownRef = useRef<HTMLDivElement>(null);

    const fetchNotifications = async () => {
        if (!user) return;

        // Fetch notifications:
        // 1. Where user_id is current user (Specific)
        // 2. OR where user_id is null (Broadcast) - Logic handled by RLS conceptually, 
        //    but explicitly: supabase RLS policies we set up allow reading own or null.

        const { data, error } = await supabase
            .from('notifications')
            .select('*')
            .order('created_at', { ascending: false })
            .limit(10); // Limit to last 10 for dropdown

        if (!error && data) {
            setNotifications(data);
            setUnreadCount(data.filter(n => !n.is_read).length);
        }
    };

    useEffect(() => {
        fetchNotifications();

        if (!user) return;

        // Subscribe to new notifications
        const channel = supabase
            .channel(`public:notifications:${user.id}`)
            .on('postgres_changes',
                {
                    event: 'INSERT',
                    schema: 'public',
                    table: 'notifications',
                    filter: `user_id=eq.${user.id}` // Listen for my specific notifications
                },
                (payload) => {
                    setNotifications(prev => [payload.new, ...prev]);
                    setUnreadCount(prev => prev + 1);
                }
            )
            .on('postgres_changes',
                {
                    event: 'INSERT',
                    schema: 'public',
                    table: 'notifications',
                    filter: 'user_id=is.null' // Listen for broadcasts
                },
                (payload) => {
                    setNotifications(prev => [payload.new, ...prev]);
                    setUnreadCount(prev => prev + 1);
                }
            )
            .subscribe();

        return () => {
            supabase.removeChannel(channel);
        };
    }, [user]);

    // Close on click outside
    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
                setIsOpen(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    const markAsRead = async (id: string) => {
        // Optimistic update
        setNotifications(notifications.map(n => n.id === id ? { ...n, is_read: true } : n));
        setUnreadCount(prev => Math.max(0, prev - 1));

        await supabase
            .from('notifications')
            .update({ is_read: true })
            .eq('id', id);
    };

    const markAllAsRead = async () => {
        const unreadIds = notifications.filter(n => !n.is_read).map(n => n.id);
        if (unreadIds.length === 0) return;

        setNotifications(notifications.map(n => ({ ...n, is_read: true })));
        setUnreadCount(0);

        await supabase
            .from('notifications')
            .update({ is_read: true })
            .in('id', unreadIds);
    };

    const deleteNotification = async (id: string, e: React.MouseEvent) => {
        e.stopPropagation();
        setNotifications(notifications.filter(n => n.id !== id));
        if (!notifications.find(n => n.id === id)?.is_read) {
            setUnreadCount(prev => Math.max(0, prev - 1));
        }

        await supabase
            .from('notifications')
            .delete()
            .eq('id', id);
    };

    if (!user) return null;

    return (
        <div className="relative" ref={dropdownRef}>
            <button
                onClick={() => setIsOpen(!isOpen)}
                className="p-2 hover:bg-secondary/10 rounded-full transition-colors relative text-foreground"
            >
                <Bell className="w-5 h-5" />
                {unreadCount > 0 && (
                    <span className="absolute top-0 right-0 w-4 h-4 bg-red-500 text-white text-[10px] font-bold rounded-full flex items-center justify-center animate-bounce">
                        {unreadCount}
                    </span>
                )}
            </button>

            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        initial={{ opacity: 0, y: 10, scale: 0.95 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: 10, scale: 0.95 }}
                        className="absolute right-0 mt-2 w-80 md:w-96 bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden z-50 transform origin-top-right"
                    >
                        <div className="p-4 border-b border-gray-50 flex justify-between items-center bg-gray-50/50">
                            <h3 className="font-bold text-gray-900">Notifications</h3>
                            {unreadCount > 0 && (
                                <button
                                    onClick={markAllAsRead}
                                    className="text-xs text-primary hover:text-primary/80 font-medium flex items-center"
                                >
                                    <Check className="w-3 h-3 mr-1" /> Mark all read
                                </button>
                            )}
                        </div>

                        <div className="max-h-[400px] overflow-y-auto">
                            {notifications.length === 0 ? (
                                <div className="p-8 text-center text-gray-500 flex flex-col items-center">
                                    <Bell className="w-8 h-8 text-gray-200 mb-2" />
                                    <p className="text-sm">No notifications yet</p>
                                </div>
                            ) : (
                                <div className="divide-y divide-gray-50">
                                    {notifications.map(notification => (
                                        <div
                                            key={notification.id}
                                            onClick={() => markAsRead(notification.id)}
                                            className={`p-4 hover:bg-gray-50 transition-colors cursor-pointer relative group ${!notification.is_read ? 'bg-blue-50/30' : ''}`}
                                        >
                                            <div className="flex gap-3">
                                                <div className={`mt-1 w-2 h-2 rounded-full flex-shrink-0 ${!notification.is_read ? 'bg-primary' : 'bg-transparent'}`} />
                                                <div className="flex-1">
                                                    <h4 className={`text-sm ${!notification.is_read ? 'font-bold text-gray-900' : 'font-medium text-gray-700'}`}>
                                                        {notification.title}
                                                    </h4>
                                                    <p className="text-xs text-gray-500 mt-1 line-clamp-2">
                                                        {notification.message}
                                                    </p>
                                                    <span className="text-[10px] text-gray-400 mt-2 block">
                                                        {new Date(notification.created_at).toLocaleDateString()}
                                                    </span>
                                                </div>
                                                <button
                                                    onClick={(e) => deleteNotification(notification.id, e)}
                                                    className="opacity-0 group-hover:opacity-100 p-1 hover:text-red-500 text-gray-400 transition-all self-start"
                                                >
                                                    <Trash2 className="w-4 h-4" />
                                                </button>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}
