'use client';

import { motion } from 'framer-motion';
import { Heart, Shield, Star, Users } from 'lucide-react';

export default function AboutPage() {
    return (
        <div className="min-h-screen pt-20">
            {/* Hero Section */}
            <section className="relative h-[60vh] flex items-center justify-center overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-br from-primary/10 to-secondary/10" />
                <div className="container mx-auto px-4 relative z-10 text-center">
                    <motion.h1
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="text-5xl md:text-7xl font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent mb-6"
                    >
                        Our Story
                    </motion.h1>
                    <motion.p
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.2 }}
                        className="text-xl text-gray-600 max-w-2xl mx-auto leading-relaxed"
                    >
                        TinyDreams was born from a simple belief: every little dream deserves the perfect start. We curate the safest, most innovative products for your growing family.
                    </motion.p>
                </div>
            </section>

            {/* Values Section */}
            <section className="py-20 bg-white">
                <div className="container mx-auto px-4">
                    <div className="grid md:grid-cols-3 gap-12">
                        {[
                            { icon: Shield, title: 'Safety First', desc: 'Every product undergoes rigorous safety testing. We prioritize non-toxic, organic materials for your peace of mind.' },
                            { icon: Heart, title: 'Made with Love', desc: 'We hand-pick items that we would use for our own children. Careful curation is at the heart of what we do.' },
                            { icon: Users, title: 'Community', desc: 'We are more than a store; we are a community of parents supporting each other through the journey of raising little ones.' }
                        ].map((item, idx) => (
                            <motion.div
                                key={idx}
                                initial={{ opacity: 0, y: 20 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ delay: idx * 0.2 }}
                                className="text-center space-y-4 p-8 rounded-2xl bg-gray-50 hover:shadow-lg transition-shadow duration-300"
                            >
                                <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center mx-auto shadow-sm text-primary">
                                    <item.icon className="w-8 h-8" />
                                </div>
                                <h3 className="text-xl font-bold text-gray-900">{item.title}</h3>
                                <p className="text-gray-600 leading-relaxed">{item.desc}</p>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Stats/Trust Section */}
            <section className="py-20 bg-gradient-to-br from-indigo-900 to-purple-900 text-white">
                <div className="container mx-auto px-4 text-center">
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
                        <div>
                            <div className="text-4xl font-bold mb-2">10k+</div>
                            <div className="text-white/70">Happy Families</div>
                        </div>
                        <div>
                            <div className="text-4xl font-bold mb-2">500+</div>
                            <div className="text-white/70">Premium Products</div>
                        </div>
                        <div>
                            <div className="text-4xl font-bold mb-2">4.9</div>
                            <div className="text-white/70 flex items-center justify-center gap-1"><Star className="w-4 h-4 fill-current" /> Rating</div>
                        </div>
                        <div>
                            <div className="text-4xl font-bold mb-2">24/7</div>
                            <div className="text-white/70">Support</div>
                        </div>
                    </div>
                </div>
            </section>
        </div>
    );
}
