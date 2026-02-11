'use client';

import { Button } from '@/components/ui/Button';
import Link from 'next/link';
import { motion } from 'framer-motion';

export default function SignupPage() {
    return (
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-secondary/10 to-primary/5 px-4">
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                className="w-full max-w-md bg-white/80 backdrop-blur-xl p-8 rounded-2xl shadow-xl border border-white/50"
            >
                <div className="text-center mb-8">
                    <h1 className="text-3xl font-bold text-gray-900 mb-2">Create Account</h1>
                    <p className="text-gray-500">Join TinyDreams for exclusive rewards</p>
                </div>

                <form className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">First Name</label>
                            <input
                                type="text"
                                className="w-full px-4 py-3 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all bg-white/50"
                                placeholder="John"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">Last Name</label>
                            <input
                                type="text"
                                className="w-full px-4 py-3 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all bg-white/50"
                                placeholder="Doe"
                            />
                        </div>
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Email Address</label>
                        <input
                            type="email"
                            className="w-full px-4 py-3 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all bg-white/50"
                            placeholder="you@example.com"
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Password</label>
                        <input
                            type="password"
                            className="w-full px-4 py-3 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all bg-white/50"
                            placeholder="••••••••"
                        />
                        <p className="text-xs text-gray-400 mt-1">Must be at least 8 characters</p>
                    </div>

                    <div className="flex items-center space-x-2">
                        <input type="checkbox" id="terms" className="rounded border-gray-300 text-primary focus:ring-primary" />
                        <label htmlFor="terms" className="text-sm text-gray-600">I agree to the <Link href="/terms" className="text-primary hover:underline">Terms</Link> and <Link href="/privacy" className="text-primary hover:underline">Privacy Policy</Link></label>
                    </div>

                    <Button className="w-full py-6 text-lg font-semibold shadow-lg shadow-primary/20">
                        Create Account
                    </Button>
                </form>

                <div className="mt-8 text-center text-sm text-gray-500">
                    <p>Already have an account? <Link href="/auth/login" className="text-primary font-semibold hover:underline">Sign in</Link></p>
                </div>
            </motion.div>
        </div>
    );
}
