'use client';

import { motion } from 'framer-motion';
import { Mail, MapPin, Phone, Send } from 'lucide-react';
import { Button } from '@/components/ui/Button';

export default function ContactPage() {
    return (
        <div className="min-h-screen pt-20 bg-gray-50">
            <div className="container mx-auto px-4 py-12">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="text-center mb-16"
                >
                    <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">Get in Touch</h1>
                    <p className="text-gray-600 max-w-xl mx-auto">We&apos;d love to hear from you. Whether you have a question about our products, need assistance, or just want to say hello.</p>
                </motion.div>

                <div className="grid md:grid-cols-2 gap-8 max-w-5xl mx-auto">
                    {/* Contact Info */}
                    <motion.div
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.2 }}
                        className="space-y-6"
                    >
                        <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100">
                            <h3 className="text-xl font-bold mb-6">Contact Information</h3>
                            <div className="space-y-6">
                                <div className="flex items-start space-x-4">
                                    <div className="p-3 bg-primary/10 rounded-lg text-primary">
                                        <Mail className="w-6 h-6" />
                                    </div>
                                    <div>
                                        <p className="font-semibold text-gray-900">Email Us</p>
                                        <p className="text-gray-500">hello@tinydreams.com</p>
                                        <p className="text-gray-500">support@tinydreams.com</p>
                                    </div>
                                </div>
                                <div className="flex items-start space-x-4">
                                    <div className="p-3 bg-primary/10 rounded-lg text-primary">
                                        <Phone className="w-6 h-6" />
                                    </div>
                                    <div>
                                        <p className="font-semibold text-gray-900">Call Us</p>
                                        <p className="text-gray-500">+1 (555) 123-4567</p>
                                        <p className="text-sm text-gray-400">Mon-Fri 9am-6pm</p>
                                    </div>
                                </div>
                                <div className="flex items-start space-x-4">
                                    <div className="p-3 bg-primary/10 rounded-lg text-primary">
                                        <MapPin className="w-6 h-6" />
                                    </div>
                                    <div>
                                        <p className="font-semibold text-gray-900">Visit Us</p>
                                        <p className="text-gray-500">123 Dreamy Lane</p>
                                        <p className="text-gray-500">Cloud City, SP 90210</p>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Map Placeholder */}
                        <div className="h-64 bg-gray-200 rounded-2xl flex items-center justify-center text-gray-400">
                            Map Integration Placeholder
                        </div>
                    </motion.div>

                    {/* Contact Form */}
                    <motion.div
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.4 }}
                        className="bg-white p-8 rounded-2xl shadow-lg border border-gray-100"
                    >
                        <h3 className="text-xl font-bold mb-6">Send us a Message</h3>
                        <form className="space-y-4">
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">First Name</label>
                                    <input type="text" className="w-full p-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all" />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Last Name</label>
                                    <input type="text" className="w-full p-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all" />
                                </div>
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                                <input type="email" className="w-full p-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all" />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Message</label>
                                <textarea rows={4} className="w-full p-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all" />
                            </div>
                            <Button className="w-full py-4 text-lg mt-4 flex items-center justify-center gap-2">
                                <Send className="w-4 h-4" />
                                Send Message
                            </Button>
                        </form>
                    </motion.div>
                </div>
            </div>
        </div>
    );
}
