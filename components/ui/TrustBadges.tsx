import React from 'react';
import { ShieldCheck, Lock, RefreshCw, CreditCard } from 'lucide-react';
import { useTranslation } from '@/context/LanguageContext';

export default function TrustBadges() {
    const { t } = useTranslation();

    return (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 py-6 border-t border-gray-100 mt-8">
            <div className="flex flex-col items-center text-center p-4 bg-gray-50 rounded-xl hover:bg-white hover:shadow-md transition-all duration-300">
                <div className="p-3 bg-green-100 text-green-600 rounded-full mb-3">
                    <ShieldCheck className="w-6 h-6" />
                </div>
                <h4 className="font-semibold text-gray-900 text-sm">{t('trust.ssl_secure') || 'SSL Secure'}</h4>
                <p className="text-xs text-gray-500 mt-1">{t('trust.ssl_desc') || '256-bit Encryption'}</p>
            </div>

            <div className="flex flex-col items-center text-center p-4 bg-gray-50 rounded-xl hover:bg-white hover:shadow-md transition-all duration-300">
                <div className="p-3 bg-blue-100 text-blue-600 rounded-full mb-3">
                    <CreditCard className="w-6 h-6" />
                </div>
                <h4 className="font-semibold text-gray-900 text-sm">{t('trust.safe_payment') || 'Safe Payment'}</h4>
                <p className="text-xs text-gray-500 mt-1">{t('trust.payment_desc') || '100% Secure Checkout'}</p>
            </div>

            <div className="flex flex-col items-center text-center p-4 bg-gray-50 rounded-xl hover:bg-white hover:shadow-md transition-all duration-300">
                <div className="p-3 bg-purple-100 text-purple-600 rounded-full mb-3">
                    <RefreshCw className="w-6 h-6" />
                </div>
                <h4 className="font-semibold text-gray-900 text-sm">{t('trust.free_returns') || 'Free Returns'}</h4>
                <p className="text-xs text-gray-500 mt-1">{t('trust.returns_desc') || '30-Day Money Back'}</p>
            </div>

            <div className="flex flex-col items-center text-center p-4 bg-gray-50 rounded-xl hover:bg-white hover:shadow-md transition-all duration-300">
                <div className="p-3 bg-orange-100 text-orange-600 rounded-full mb-3">
                    <Lock className="w-6 h-6" />
                </div>
                <h4 className="font-semibold text-gray-900 text-sm">{t('trust.privacy') || 'Privacy'}</h4>
                <p className="text-xs text-gray-500 mt-1">{t('trust.privacy_desc') || 'Data Protection'}</p>
            </div>
        </div>
    );
}
