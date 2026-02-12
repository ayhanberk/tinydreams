'use client';

import { useState, useEffect, Suspense } from 'react';
import { motion } from 'framer-motion';
import ProductCard from '@/components/ui/ProductCard';
import { Button } from '@/components/ui/Button';
import { Filter, SlidersHorizontal, Search } from 'lucide-react';
import { supabase } from '@/lib/supabase';
import { useSearchParams, useRouter } from 'next/navigation';

function ShopContent() {
    const searchParams = useSearchParams();
    const router = useRouter();

    const categoryParam = searchParams.get('category');
    const searchParam = searchParams.get('search') || '';

    const [products, setProducts] = useState<any[]>([]);
    const [categories, setCategories] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [selectedCategory, setSelectedCategory] = useState(categoryParam || 'All');
    const [searchQuery, setSearchQuery] = useState(searchParam);
    const [priceRange, setPriceRange] = useState(500);

    // Fetch Categories
    useEffect(() => {
        const fetchCategories = async () => {
            const { data } = await supabase
                .from('categories')
                .select('*')
                .order('name');
            if (data) setCategories(data);
        };
        fetchCategories();
    }, []);

    // Sync state with URL params
    useEffect(() => {
        setSelectedCategory(categoryParam || 'All');
        setSearchQuery(searchParam);
    }, [categoryParam, searchParam]);

    // Fetch Products
    useEffect(() => {
        const fetchProducts = async () => {
            setLoading(true);
            // Select products with category details
            let query = supabase.from('products').select('*, categories(slug, name)');

            if (selectedCategory !== 'All') {
                // We filter by category_id directly on products table if it exists there as FK
                // Schema check: create_phase3 didn't show products. 
                // Assuming products.category_id exists based on previous code usage
                query = query.eq('category_id', selectedCategory);
            }

            if (searchQuery) {
                query = query.ilike('title', `%${searchQuery}%`);
            }

            const { data, error } = await query;

            if (error) {
                console.error('Error fetching products', error);
            } else {
                // Map data to flattened structure for ProductCard
                const mappedData = (data || []).map((p: any) => ({
                    ...p,
                    image: p.image_url || p.image, // Ensure image is passed correctly
                    category: p.categories?.name || p.category,
                    categorySlug: p.categories?.slug,
                    slug: p.slug
                })).filter((p: any) => p.price <= priceRange);

                setProducts(mappedData);
            }
            setLoading(false);
        };

        fetchProducts();
    }, [selectedCategory, searchQuery, priceRange]);

    const handleCategoryChange = (categoryId: string) => {
        setSelectedCategory(categoryId);
        const params = new URLSearchParams(searchParams.toString());
        if (categoryId === 'All') {
            params.delete('category');
        } else {
            params.set('category', categoryId);
        }
        router.push(`/shop?${params.toString()}`);
    };

    const handleSearch = (e: React.FormEvent) => {
        e.preventDefault();
        const params = new URLSearchParams(searchParams.toString());
        if (searchQuery) {
            params.set('search', searchQuery);
        } else {
            params.delete('search');
        }
        router.push(`/shop?${params.toString()}`);
    };

    return (
        <div className="container mx-auto px-4 py-12">
            <div className="flex flex-col md:flex-row justify-between items-end mb-8 gap-4">
                <div>
                    <h1 className="text-3xl font-bold mb-2">Shop All</h1>
                    <p className="text-gray-500">Discover premium essentials for your little one.</p>
                </div>

                <div className="flex flex-col md:flex-row gap-4 items-center w-full md:w-auto">
                    {/* Search Bar */}
                    <form onSubmit={handleSearch} className="relative w-full md:w-64">
                        <input
                            type="text"
                            placeholder="Search products..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none"
                        />
                        <Search className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
                    </form>

                    <div className="flex space-x-2">
                        <Button variant="outline" size="sm" className="flex items-center space-x-2">
                            <Filter className="w-4 h-4" />
                            <span>Filter</span>
                        </Button>
                        <Button variant="outline" size="sm" className="flex items-center space-x-2">
                            <SlidersHorizontal className="w-4 h-4" />
                            <span>Sort</span>
                        </Button>
                    </div>
                </div>
            </div>

            <div className="flex flex-col lg:flex-row gap-8">
                {/* Sidebar */}
                <aside className="w-full lg:w-64 space-y-8">
                    {/* Categories */}
                    <div className="bg-white p-6 rounded-xl border border-gray-100 shadow-sm">
                        <h3 className="font-semibold mb-4">Categories</h3>
                        <div className="space-y-2">
                            <div className="flex items-center">
                                <input
                                    type="radio"
                                    id="all-cats"
                                    name="category"
                                    checked={selectedCategory === 'All'}
                                    onChange={() => handleCategoryChange('All')}
                                    className="text-primary focus:ring-primary"
                                />
                                <label htmlFor="all-cats" className="ml-2 text-gray-600 cursor-pointer hover:text-primary">
                                    All
                                </label>
                            </div>
                            {categories.map(category => (
                                <div key={category.id} className="flex items-center">
                                    <input
                                        type="radio"
                                        id={category.id}
                                        name="category"
                                        checked={selectedCategory === category.id}
                                        onChange={() => handleCategoryChange(category.id)}
                                        className="text-primary focus:ring-primary"
                                    />
                                    <label htmlFor={category.id} className="ml-2 text-gray-600 cursor-pointer hover:text-primary">
                                        {category.name}
                                    </label>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Price Filter */}
                    <div className="bg-white p-6 rounded-xl border border-gray-100 shadow-sm">
                        <h3 className="font-semibold mb-4">Max Price: ${priceRange}</h3>
                        <input
                            type="range"
                            min="0"
                            max="500"
                            value={priceRange}
                            onChange={(e) => setPriceRange(Number(e.target.value))}
                            className="w-full accent-primary"
                        />
                        <div className="flex justify-between text-xs text-gray-500 mt-2">
                            <span>$0</span>
                            <span>$500+</span>
                        </div>
                    </div>
                </aside>

                {/* Product Grid */}
                <div className="flex-1">
                    {loading ? (
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                            {[1, 2, 3].map(i => (
                                <div key={i} className="h-80 bg-gray-100 rounded-xl animate-pulse" />
                            ))}
                        </div>
                    ) : (
                        <motion.div
                            layout
                            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6"
                        >
                            {products.map(product => (
                                <ProductCard key={product.id} {...product} />
                            ))}
                        </motion.div>
                    )}

                    {!loading && products.length === 0 && (
                        <div className="text-center py-20">
                            <p className="text-gray-500">No products found matching your criteria.</p>
                            <Button variant="outline" className="mt-4" onClick={() => { handleCategoryChange('All'); setPriceRange(500); setSearchQuery(''); }}>
                                Clear Filters
                            </Button>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}

export default function ShopPage() {
    return (
        <Suspense fallback={<div className="min-h-screen"></div>}>
            <ShopContent />
        </Suspense>
    );
}
