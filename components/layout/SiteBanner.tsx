'use client';

import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import { X, ArrowRight, AlertCircle, Sparkles, CheckCircle } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import Link from 'next/link';

export default function SiteBanner() {
    const [banner, setBanner] = useState<any>(null);
    const [isVisible, setIsVisible] = useState(true);

    useEffect(() => {
        const fetchBanner = async () => {
            // Fetch the most recent active banner
            const { data, error } = await supabase
                .from('banners')
                .select('*')
                .eq('is_active', true)
                .order('created_at', { ascending: false })
                .limit(1)
                .single();

            if (!error && data) {
                setBanner(data);
            }
        };

        fetchBanner();

        // Real-time subscription for immediate updates
        const channel = supabase
            .channel('public:banners')
            .on('postgres_changes', { event: '*', schema: 'public', table: 'banners' }, () => {
                fetchBanner();
            })
            .subscribe();

        return () => {
            supabase.removeChannel(channel);
        };
    }, []);

    if (!banner || !isVisible) return null;

    const styles: Record<string, string> = {
        info: 'bg-blue-600 text-white',
        success: 'bg-green-600 text-white',
        warning: 'bg-yellow-500 text-white',
        premium: 'bg-gradient-to-r from-primary to-secondary text-white',
    };

    const icons: Record<string, any> = {
        info: AlertCircle,
        success: CheckCircle,
        warning: AlertCircle,
        premium: Sparkles,
    };

    const Icon = icons[banner.style] || AlertCircle;

    return (
        <AnimatePresence>
            {isVisible && (
                <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    className={`${styles[banner.style] || styles.info} relative overflow-hidden`}
                >
                    <div className="container mx-auto px-4 py-3 flex items-center justify-center text-sm font-medium relative z-10">
                        <Icon className="w-4 h-4 mr-2" />
                        <span>{banner.content}</span>
                        {banner.link && (
                            <Link href={banner.link} className="ml-4 underline underline-offset-4 hover:opacity-80 flex items-center">
                                Learn More <ArrowRight className="w-3 h-3 ml-1" />
                            </Link>
                        )}
                        <button
                            onClick={() => setIsVisible(false)}
                            className="absolute right-4 p-1 hover:bg-white/20 rounded-full transition-colors"
                        >
                            <X className="w-4 h-4" />
                        </button>
                    </div>
                    {/* Background Pattern for generic premium feel */}
                    <div className="absolute inset-0 opacity-10 pointer-events-none bg-[url('https://www.transparenttextures.com/patterns/cubes.png')]"></div>
                </motion.div>
            )}
        </AnimatePresence>
    );
}
