import { Metadata } from 'next';
import { supabase } from '@/lib/supabase';
import ProductDetailsClient from '@/components/product/ProductDetailsClient';
import { notFound } from 'next/navigation';

interface Props {
    params: Promise<{
        category: string;
        slug: string;
    }>;
}

// Function to fetch product data
async function getProduct(slug: string) {
    const { data: product, error } = await supabase
        .from('products')
        .select('*, categories(name, slug)')
        .eq('slug', slug)
        .single();

    if (error || !product) {
        return null;
    }

    return {
        ...product,
        category: product.categories?.name || product.category,
        categorySlug: product.categories?.slug
    };
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
    const { slug } = await params;
    const product = await getProduct(slug);

    if (!product) {
        return {
            title: 'Product Not Found',
        };
    }

    return {
        title: product.title,
        description: product.description.substring(0, 160),
        openGraph: {
            title: `${product.title} | TinyDreams`,
            description: product.description.substring(0, 160),
            images: product.image_url ? [product.image_url] : [],
        },
    };
}

export default async function ProductDetailsPage({ params }: Props) {
    const { slug } = await params;
    const product = await getProduct(slug);

    if (!product) {
        notFound();
    }

    return <ProductDetailsClient product={product} />;
}
