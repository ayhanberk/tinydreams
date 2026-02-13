'use client';

import { useEffect, useState } from 'react';
import ProductCard from '@/components/ui/ProductCard';
import { getRelatedProducts } from '@/actions/products';

interface RelatedProductsProps {
    categoryId: string;
    currentProductId: string;
}

export default function RelatedProducts({ categoryId, currentProductId }: RelatedProductsProps) {
    const [products, setProducts] = useState<any[]>([]);

    useEffect(() => {
        const fetchRelated = async () => {
            if (!categoryId) return;
            const data = await getRelatedProducts(categoryId, currentProductId);
            setProducts(data);
        };
        fetchRelated();
    }, [categoryId, currentProductId]);

    if (products.length === 0) return null;

    return (
        <section className="py-16">
            <h2 className="text-2xl font-bold text-gray-900 mb-8">You May Also Like</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
                {products.map((product) => (
                    <ProductCard key={product.id} {...product} />
                ))}
            </div>
        </section>
    );
}
