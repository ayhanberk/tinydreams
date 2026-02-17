'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';

interface LanguageContextType {
    locale: string;
    setLocale: (locale: string) => void;
    t: (key: string) => string;
    languages: SupportedLanguage[];
    loading: boolean;
}

interface SupportedLanguage {
    code: string;
    name: string;
    flag: string;
    is_default: boolean;
}

interface Translation {
    namespace: string;
    key: string;
    value: string;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export const LanguageProvider = ({ children }: { children: React.ReactNode }) => {
    const [locale, setLocaleState] = useState('en');
    const [languages, setLanguages] = useState<SupportedLanguage[]>([]);
    const [translations, setTranslations] = useState<Record<string, string>>({});
    const [loading, setLoading] = useState(true);

    const fetchTranslations = async (langCode: string) => {
        const { data } = await supabase
            .from('translations')
            .select('namespace, key, value')
            .eq('locale', langCode);

        if (data) {
            const transMap: Record<string, string> = {};
            data.forEach((item: Translation) => {
                // Key format: "namespace.key" -> "value"
                transMap[`${item.namespace}.${item.key}`] = item.value;
            });
            setTranslations(transMap);
        }
    };

    // Initial load
    useEffect(() => {
        const init = async () => {
            // 1. Fetch supported languages
            const { data: langs } = await supabase
                .from('supported_languages')
                .select('*')
                .order('is_default', { ascending: false }); // Default first

            if (langs && langs.length > 0) {
                setLanguages(langs);

                // 2. Determine initial locale
                const stored = typeof window !== 'undefined' ? localStorage.getItem('app-locale') : null;
                const defaultLang = langs.find(l => l.is_default)?.code || 'en';
                const initialLocale = stored || defaultLang;

                setLocaleState(initialLocale);
                await fetchTranslations(initialLocale);
            }
            setLoading(false);
        };

        init();
    }, []);

    const setLocale = (newLocale: string) => {
        setLocaleState(newLocale);
        localStorage.setItem('app-locale', newLocale);
        fetchTranslations(newLocale);
    };

    const t = (path: string): string => {
        // translations are stored as "namespace.key"
        return translations[path] || path;
    };

    return (
        <LanguageContext.Provider value={{ locale, setLocale, t, languages, loading }}>
            {children}
        </LanguageContext.Provider>
    );
};

export const useTranslation = () => {
    const context = useContext(LanguageContext);
    if (context === undefined) {
        throw new Error('useTranslation must be used within a LanguageProvider');
    }
    return context;
};
