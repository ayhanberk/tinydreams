'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/Button';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { supabase } from '@/lib/supabase';

export default function LoginPage() {
    const [loading, setLoading] = useState(false);

    const handleGoogleLogin = async () => {
        setLoading(true);
        const { error } = await supabase.auth.signInWithOAuth({
            provider: 'google',
            options: {
                redirectTo: `${window.location.origin}/auth/callback`,
            },
        });
        if (error) {
            console.error('Error logging in with Google:', error.message);
            setLoading(false);
        }
    };
    return (
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-primary/5 to-secondary/10 px-4">
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                className="w-full max-w-md bg-white/80 backdrop-blur-xl p-8 rounded-2xl shadow-xl border border-white/50"
            >
                <div className="text-center mb-8">
                    <h1 className="text-3xl font-bold text-gray-900 mb-2">Welcome Back</h1>
                    <p className="text-gray-500">Sign in to continue your shopping journey</p>
                </div>

                <form className="space-y-6">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Email Address</label>
                        <input
                            type="email"
                            className="w-full px-4 py-3 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all bg-white/50"
                            placeholder="you@example.com"
                        />
                    </div>
                    <div>
                        <div className="flex justify-between items-center mb-2">
                            <label className="block text-sm font-medium text-gray-700">Password</label>
                            <Link href="#" className="text-sm text-primary hover:underline">Forgot password?</Link>
                        </div>
                        <input
                            type="password"
                            className="w-full px-4 py-3 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all bg-white/50"
                            placeholder="••••••••"
                        />
                    </div>

                    <Button className="w-full py-6 text-lg font-semibold shadow-lg shadow-primary/20">
                        Sign In
                    </Button>
                </form>

                <div className="mt-8 text-center text-sm text-gray-500">
                    <p>Don't have an account? <Link href="/auth/signup" className="text-primary font-semibold hover:underline">Sign up</Link></p>
                </div>

                <div className="mt-8 relative flex items-center justify-center">
                    <div className="border-t border-gray-200 w-full absolute"></div>
                    <span className="bg-white/80 px-4 relative text-sm text-gray-400">Or continue with</span>
                </div>

                <div className="mt-6">
                    <button
                        onClick={handleGoogleLogin}
                        disabled={loading}
                        className="w-full flex items-center justify-center px-4 py-3 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors bg-white shadow-sm"
                    >
                        <img src="https://www.svgrepo.com/show/475656/google-color.svg" className="h-5 w-5 mr-3" alt="Google" />
                        <span className="text-sm font-medium text-gray-700">Sign in with Google</span>
                    </button>
                </div>
            </motion.div>
        </div>
    );
}
