'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';

interface ProductTabsProps {
    description: string;
    specifications?: Record<string, string>; // Key-value pairs
}

export default function ProductTabs({ description, specifications }: ProductTabsProps) {
    const [activeTab, setActiveTab] = useState('description');

    const tabs = [
        { id: 'description', label: 'Description' },
        { id: 'specs', label: 'Specifications' },
        { id: 'care', label: 'Care Instructions' },
        { id: 'shipping', label: 'Shipping & Returns' },
    ];

    return (
        <div className="mt-16 bg-white rounded-3xl p-8 shadow-sm border border-gray-100">
            {/* Tab Headers */}
            <div className="flex flex-wrap gap-8 border-b border-gray-100 pb-4 mb-8">
                {tabs.map((tab) => (
                    <button
                        key={tab.id}
                        onClick={() => setActiveTab(tab.id)}
                        className={`text-lg font-medium transition-colors relative pb-4 -mb-4 ${activeTab === tab.id
                                ? 'text-primary'
                                : 'text-gray-500 hover:text-gray-800'
                            }`}
                    >
                        {tab.label}
                        {activeTab === tab.id && (
                            <motion.div
                                layoutId="activeTab"
                                className="absolute bottom-0 left-0 right-0 h-0.5 bg-primary"
                            />
                        )}
                    </button>
                ))}
            </div>

            {/* Tab Content */}
            <div className="min-h-[200px] text-gray-600 leading-relaxed">
                {activeTab === 'description' && (
                    <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: 10 }}
                    >
                        <p className="whitespace-pre-line">{description}</p>
                    </motion.div>
                )}

                {activeTab === 'specs' && (
                    <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                    >
                        {specifications ? (
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                {Object.entries(specifications).map(([key, value]) => (
                                    <div key={key} className="flex border-b border-gray-50 pb-2">
                                        <span className="font-semibold w-1/3 text-gray-800">{key}</span>
                                        <span className="w-2/3">{value}</span>
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <p>No specific specifications available for this product.</p>
                        )}
                    </motion.div>
                )}

                {activeTab === 'care' && (
                    <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                    >
                        <ul className="list-disc pl-5 space-y-2">
                            <li>Machine wash cold with like colors</li>
                            <li>Tumble dry low</li>
                            <li>Do not bleach</li>
                            <li>Cool iron if needed</li>
                        </ul>
                    </motion.div>
                )}

                {activeTab === 'shipping' && (
                    <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                    >
                        <p className="mb-4">
                            <strong>Free Shipping:</strong> On all orders over $50.
                        </p>
                        <p className="mb-4">
                            <strong>Delivery:</strong> Standard delivery takes 3-5 business days.
                        </p>
                        <p>
                            <strong>Returns:</strong> We accept returns within 30 days of purchase. Items must be in original condition.
                        </p>
                    </motion.div>
                )}
            </div>
        </div>
    );
}
