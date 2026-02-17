'use client';

import { useState, useRef, useEffect } from 'react';
import { useTranslation } from '@/context/LanguageContext';
import { ChevronDown, Check } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export default function LanguageSwitcher() {
    const { locale, setLocale, languages } = useTranslation();
    const [isOpen, setIsOpen] = useState(false);
    const dropdownRef = useRef<HTMLDivElement>(null);

    const currentLang = languages.find(l => l.code === locale);

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
                setIsOpen(false);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    if (languages.length === 0) return null;

    return (
        <div className="relative z-50" ref={dropdownRef}>
            <button
                onClick={() => setIsOpen(!isOpen)}
                className="flex items-center gap-2 px-3 py-1.5 rounded-full hover:bg-gray-100 transition-colors text-sm font-medium text-gray-700 bg-white/50 backdrop-blur-sm border border-gray-200/50"
            >
                <span className="text-lg leading-none">{currentLang?.flag || '🌐'}</span>
                <span className="hidden sm:inline">{currentLang?.code.toUpperCase()}</span>
                <ChevronDown className={`w-3 h-3 transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`} />
            </button>

            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        initial={{ opacity: 0, y: 5 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: 5 }}
                        className="absolute right-0 mt-2 w-40 bg-white rounded-xl shadow-lg border border-gray-100 overflow-hidden py-1"
                    >
                        {languages.map((lang) => (
                            <button
                                key={lang.code}
                                onClick={() => {
                                    setLocale(lang.code);
                                    setIsOpen(false);
                                }}
                                className="w-full text-left px-4 py-2.5 text-sm hover:bg-gray-50 flex items-center justify-between group transition-colors"
                            >
                                <span className="flex items-center gap-3">
                                    <span className="text-xl leading-none">{lang.flag}</span>
                                    <span className={`${lang.code === locale ? 'font-semibold text-gray-900' : 'text-gray-600'}`}>
                                        {lang.name}
                                    </span>
                                </span>
                                {lang.code === locale && (
                                    <Check className="w-4 h-4 text-primary" />
                                )}
                            </button>
                        ))}
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}
