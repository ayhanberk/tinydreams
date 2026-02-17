import { Metadata } from 'next';
import ShopClient from '@/components/shop/ShopClient';

export const metadata: Metadata = {
    title: 'Shop Premium Baby Products',
    description: 'Explore our curated collection of safe, high-quality baby essentials. From organic clothing to innovative gear, find everything for your little one.',
    openGraph: {
        title: 'Shop Premium Baby Products | TinyDreams',
        description: 'Explore our curated collection of safe, high-quality baby essentials.',
        url: 'https://tinydreams.store/shop',
    }
};

export default function ShopPage() {
    return <ShopClient />;
}
