'use client';

import { motion } from 'framer-motion';
import { Button } from '@/components/ui/Button';
import Link from 'next/link';

const HeroSection = () => {
    return (
        <section className="relative h-[90vh] flex items-center overflow-hidden bg-gradient-to-br from-primary/10 to-secondary/20">
            {/* Background Decorations */}
            <div className="absolute top-0 left-0 w-full h-full overflow-hidden z-0 pointer-events-none">
                <motion.div
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 0.2, scale: 1 }}
                    transition={{ duration: 2, repeat: Infinity, repeatType: "reverse" }}
                    className="absolute -top-20 -left-20 w-96 h-96 bg-primary rounded-full blur-3xl"
                />
                <motion.div
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 0.2, scale: 1 }}
                    transition={{ duration: 3, repeat: Infinity, repeatType: "reverse", delay: 1 }}
                    className="absolute top-1/2 right-0 w-[30rem] h-[30rem] bg-accent rounded-full blur-3xl"
                />
            </div>

            <div className="container mx-auto px-4 grid md:grid-cols-2 gap-12 items-center relative z-10">
                {/* Text Content */}
                <motion.div
                    initial={{ opacity: 0, x: -50 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.8, ease: "easeOut" }}
                    className="space-y-6"
                >
                    <h1 className="text-5xl md:text-6xl font-extrabold leading-tight text-foreground">
                        Dream Big, <br />
                        <span className="text-primary">Little One.</span>
                    </h1>
                    <p className="text-lg md:text-xl text-gray-600 max-w-lg">
                        Discover improved comfort and innovative essentials for your baby unique journey. Premium quality, designed with love.
                    </p>
                    <div className="flex space-x-4">
                        <Link href="/shop">
                            <Button size="lg" className="rounded-full shadow-xl shadow-primary/20">
                                Shop Now
                            </Button>
                        </Link>
                        <Link href="/about">
                            <Button variant="outline" size="lg" className="rounded-full border-2">
                                Our Story
                            </Button>
                        </Link>
                    </div>

                    {/* Trust Badges */}
                    <div className="pt-8 flex items-center space-x-6 text-sm font-medium text-gray-500">
                        <div className="flex items-center space-x-2">
                            <span className="w-2 h-2 bg-green-500 rounded-full"></span>
                            <span>Eco-Friendly</span>
                        </div>
                        <div className="flex items-center space-x-2">
                            <span className="w-2 h-2 bg-blue-500 rounded-full"></span>
                            <span>Certified Safe</span>
                        </div>
                    </div>
                </motion.div>

                {/* Hero Image/Visual */}
                <motion.div
                    initial={{ opacity: 0, x: 50 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.8, ease: "easeOut", delay: 0.2 }}
                    className="relative"
                >
                    <div className="relative z-10 glass-card p-4 rounded-3xl transform rotate-3 hover:rotate-0 transition-transform duration-500">
                        {/* Placeholder for Hero Image - In a real app, use next/image */}
                        <div className="aspect-[4/5] bg-gray-200 rounded-2xl overflow-hidden relative">
                            {/* Gradient Overlay */}
                            <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent z-10" />
                            <img
                                src="https://images.unsplash.com/photo-1519689680058-324335c77eba?q=80&w=1000&auto=format&fit=crop"
                                alt="Baby sleeping peacefully"
                                className="w-full h-full object-cover"
                            />
                        </div>

                        {/* Floating Badge */}
                        <motion.div
                            initial={{ y: 20, opacity: 0 }}
                            animate={{ y: 0, opacity: 1 }}
                            transition={{ delay: 0.8 }}
                            className="absolute bottom-10 -left-6 bg-white p-4 rounded-xl shadow-lg flex items-center space-x-3"
                        >
                            <div className="bg-orange-100 p-2 rounded-full">
                                <span className="text-xl">⭐</span>
                            </div>
                            <div>
                                <p className="text-xs text-gray-400">Top Rated</p>
                                <p className="font-bold text-gray-800">5-Star Comfort</p>
                            </div>
                        </motion.div>
                    </div>
                </motion.div>
            </div>
        </section>
    );
};

export default HeroSection;
