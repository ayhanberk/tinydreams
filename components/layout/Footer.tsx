'use client';

import Link from 'next/link';
import { Facebook, Instagram, Twitter } from 'lucide-react';
import TrustBadges from '../ui/TrustBadges';
import { useTranslation } from '@/context/LanguageContext';

const Footer = () => {
    const { t } = useTranslation();

    return (
        <footer className="bg-white border-t border-gray-100 pt-16 pb-8">
            <div className="container mx-auto px-4">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-12">
                    {/* Brand */}
                    <div className="space-y-4">
                        <Link href="/" className="text-2xl font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
                            TinyDreams
                        </Link>
                        <p className="text-gray-500 text-sm leading-relaxed">
                            {t('footer.brand_desc') || 'Premium essentials for your little ones. Crafted with love, designed for comfort and safety.'}
                        </p>
                        <div className="flex space-x-4">
                            <a href="#" className="text-gray-400 hover:text-primary transition-colors">
                                <Instagram className="w-5 h-5" />
                            </a>
                            <a href="#" className="text-gray-400 hover:text-primary transition-colors">
                                <Facebook className="w-5 h-5" />
                            </a>
                            <a href="#" className="text-gray-400 hover:text-primary transition-colors">
                                <Twitter className="w-5 h-5" />
                            </a>
                        </div>
                    </div>

                    {/* Shop */}
                    <div>
                        <h4 className="font-semibold text-gray-900 mb-4">{t('nav.shop')}</h4>
                        <ul className="space-y-2 text-sm text-gray-500">
                            <li><Link href="/shop/clothing" className="hover:text-primary transition-colors">{t('footer.clothing') || 'Clothing'}</Link></li>
                            <li><Link href="/shop/accessories" className="hover:text-primary transition-colors">{t('footer.accessories') || 'Accessories'}</Link></li>
                            <li><Link href="/shop/toys" className="hover:text-primary transition-colors">{t('footer.toys') || 'Toys'}</Link></li>
                            <li><Link href="/shop/nursery" className="hover:text-primary transition-colors">{t('footer.nursery') || 'Nursery'}</Link></li>
                        </ul>
                    </div>

                    {/* Support */}
                    <div>
                        <h4 className="font-semibold text-gray-900 mb-4">{t('footer.support') || 'Support'}</h4>
                        <ul className="space-y-2 text-sm text-gray-500">
                            <li><Link href="/contact" className="hover:text-primary transition-colors">{t('nav.contact')}</Link></li>
                            <li><Link href="/faq" className="hover:text-primary transition-colors">FAQs</Link></li>
                            <li><Link href="/shipping" className="hover:text-primary transition-colors">Shipping & Returns</Link></li>
                            <li><Link href="/privacy" className="hover:text-primary transition-colors">Privacy Policy</Link></li>
                        </ul>
                    </div>

                    {/* Newsletter */}
                    <div>
                        <h4 className="font-semibold text-gray-900 mb-4">{t('footer.stay_in_touch') || 'Stay in touch'}</h4>
                        <p className="text-gray-500 text-sm mb-4">{t('footer.subscribe_desc') || 'Subscribe to get special offers, free giveaways, and once-in-a-lifetime deals.'}</p>
                        <form className="flex">
                            <input
                                type="email"
                                placeholder={t('footer.enter_email') || 'Enter your email'}
                                className="flex-1 px-4 py-2 border border-gray-200 rounded-l-lg focus:outline-none focus:border-primary text-sm"
                            />
                            <button className="bg-primary text-white px-4 py-2 rounded-r-lg hover:bg-secondary transition-colors text-sm font-medium">
                                {t('footer.join') || 'Join'}
                            </button>
                        </form>
                    </div>
                </div>

                {/* Trust Badges */}
                <TrustBadges />

                <div className="border-t border-gray-100 pt-8 flex flex-col md:flex-row justify-between items-center">
                    <p className="text-gray-400 text-xs">
                        &copy; {new Date().getFullYear()} TinyDreams. All rights reserved.
                    </p>
                    <div className="flex space-x-4 mt-4 md:mt-0">
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img src="https://upload.wikimedia.org/wikipedia/commons/thumb/5/5e/Visa_Inc._logo.svg/2560px-Visa_Inc._logo.svg.png" alt="Visa" className="h-4 object-contain opacity-50 grayscale" />
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img src="https://upload.wikimedia.org/wikipedia/commons/thumb/2/2a/Mastercard-logo.svg/1280px-Mastercard-logo.svg.png" alt="Mastercard" className="h-4 object-contain opacity-50 grayscale" />
                    </div>
                </div>
            </div>
        </footer>
    );
};

export default Footer;
