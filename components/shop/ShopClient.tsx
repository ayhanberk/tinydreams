'use client';

import { useState, useEffect, Suspense } from 'react';
import { motion } from 'framer-motion';
import ProductCard from '@/components/ui/ProductCard';
import { Button } from '@/components/ui/Button';
import { Filter, SlidersHorizontal, Search, X } from 'lucide-react';
import { supabase } from '@/lib/supabase';
import { useSearchParams, useRouter } from 'next/navigation';


const AGE_RANGES = [
    { id: 'all', label: 'All Ages', min: 0, max: 999 },
    { id: '0-3', label: '0-3 Months', min: 0, max: 3 },
    { id: '3-6', label: '3-6 Months', min: 3, max: 6 },
    { id: '6-12', label: '6-12 Months', min: 6, max: 12 },
    { id: '12-24', label: '12-24 Months', min: 12, max: 24 },
    { id: '24+', label: '2 Years +', min: 24, max: 999 },
];

function ShopContent() {
    const searchParams = useSearchParams();
    const router = useRouter();

    const categoryParam = searchParams.get('category');
    const searchParam = searchParams.get('search') || '';
    const ageParam = searchParams.get('age') || 'all';

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const [products, setProducts] = useState<any[]>([]);
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const [categories, setCategories] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [selectedCategory, setSelectedCategory] = useState(categoryParam || 'All');
    const [searchQuery, setSearchQuery] = useState(searchParam);
    const [priceRange, setPriceRange] = useState(500);
    const [selectedAgeRange, setSelectedAgeRange] = useState(ageParam);
    const [isFilterOpen, setIsFilterOpen] = useState(false);

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
    /* eslint-disable react-hooks/set-state-in-effect */
    useEffect(() => {
        setSelectedCategory(categoryParam || 'All');
        setSearchQuery(searchParam);
        setSelectedAgeRange(ageParam);
    }, [categoryParam, searchParam, ageParam]);
    /* eslint-enable react-hooks/set-state-in-effect */

    // Fetch Products
    useEffect(() => {
        const fetchProducts = async () => {
            setLoading(true);
            // Select products with category details
            let query = supabase.from('products').select('*, categories(slug, name)');

            if (selectedCategory !== 'All') {
                query = query.eq('category_id', selectedCategory);
            }

            if (searchQuery) {
                query = query.ilike('title', `%${searchQuery}%`);
            }

            const { data, error } = await query;

            if (error) {
                console.error('Error fetching products', error);
            } else {
                // Map data and filter
                // eslint-disable-next-line @typescript-eslint/no-explicit-any
                const mappedData = (data || []).map((p: any) => ({
                    ...p,
                    image: p.image_url || p.image,
                    category: p.categories?.name || p.category,
                    categorySlug: p.categories?.slug,
                    slug: p.slug,
                    colors: p.colors,
                    sizes: p.sizes
                    // eslint-disable-next-line @typescript-eslint/no-explicit-any
                })).filter((p: any) => {
                    // Price Filter
                    if (p.price > priceRange) return false;

                    // Age Filter
                    if (selectedAgeRange === 'all') return true;

                    const range = AGE_RANGES.find(r => r.id === selectedAgeRange);
                    if (!range) return true;

                    // Product min/max (handle nulls)
                    const pMin = p.min_age_months !== null ? p.min_age_months : 0;
                    const pMax = p.max_age_months !== null ? p.max_age_months : 999;

                    // Overlap check: (StartA <= EndB) and (EndA >= StartB)
                    return pMin <= range.max && pMax >= range.min;
                });

                setProducts(mappedData);
            }
            setLoading(false);
        };

        fetchProducts();
    }, [selectedCategory, searchQuery, priceRange, selectedAgeRange]);

    const handleCategoryChange = (categoryId: string) => {
        updateParams({ category: categoryId === 'All' ? null : categoryId });
    };

    const handleAgeChange = (ageId: string) => {
        updateParams({ age: ageId === 'all' ? null : ageId });
    };

    const handleSearch = (e: React.FormEvent) => {
        e.preventDefault();
        updateParams({ search: searchQuery || null });
    };

    const updateParams = (updates: Record<string, string | null>) => {
        const params = new URLSearchParams(searchParams.toString());
        Object.entries(updates).forEach(([key, value]) => {
            if (value === null) {
                params.delete(key);
            } else {
                params.set(key, value);
            }
        });
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
                        <Button
                            variant="outline"
                            size="sm"
                            className="flex items-center space-x-2 lg:hidden"
                            onClick={() => setIsFilterOpen(true)}
                        >
                            <Filter className="w-4 h-4" />
                            <span>Filter</span>
                        </Button>
                        <Button variant="outline" size="sm" className="hidden lg:flex items-center space-x-2">
                            <SlidersHorizontal className="w-4 h-4" />
                            <span>Sort</span>
                        </Button>
                    </div>
                </div>
            </div>

            <div className="flex flex-col lg:flex-row gap-8">
                {/* Backdrop for mobile filters */}
                {isFilterOpen && (
                    <div
                        className="fixed inset-0 bg-black/50 z-50 lg:hidden backdrop-blur-sm transition-opacity"
                        onClick={() => setIsFilterOpen(false)}
                    />
                )}

                {/* Sidebar / Drawer */}
                <aside className={`
                    fixed inset-y-0 left-0 w-80 bg-white z-[60] p-6 space-y-8 transform transition-transform duration-300 lg:static lg:w-64 lg:p-0 lg:bg-transparent lg:z-0 lg:translate-x-0
                    ${isFilterOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
                `}>
                    <div className="flex items-center justify-between mb-6 lg:hidden">
                        <h2 className="text-xl font-bold">Filters</h2>
                        <Button variant="ghost" size="sm" onClick={() => setIsFilterOpen(false)} className="p-1">
                            <X className="w-6 h-6" />
                            <span className="sr-only">Close</span>
                        </Button>
                    </div>

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
                                    onChange={() => { handleCategoryChange('All'); setIsFilterOpen(false); }}
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
                                        onChange={() => { handleCategoryChange(category.id); setIsFilterOpen(false); }}
                                        className="text-primary focus:ring-primary"
                                    />
                                    <label htmlFor={category.id} className="ml-2 text-gray-600 cursor-pointer hover:text-primary">
                                        {category.name}
                                    </label>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Age Range Filter */}
                    <div className="bg-white p-6 rounded-xl border border-gray-100 shadow-sm">
                        <h3 className="font-semibold mb-4">Age Range</h3>
                        <div className="space-y-2">
                            {AGE_RANGES.map(range => (
                                <div key={range.id} className="flex items-center">
                                    <input
                                        type="radio"
                                        id={`age-${range.id}`}
                                        name="age"
                                        checked={selectedAgeRange === range.id}
                                        onChange={() => { handleAgeChange(range.id); setIsFilterOpen(false); }}
                                        className="text-primary focus:ring-primary"
                                    />
                                    <label htmlFor={`age-${range.id}`} className="ml-2 text-gray-600 cursor-pointer hover:text-primary">
                                        {range.label}
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
                            <Button variant="outline" className="mt-4" onClick={() => {
                                updateParams({ category: null, age: null, search: null });
                                setPriceRange(500);
                            }}>
                                Clear Filters
                            </Button>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}

export default function ShopClient() {
    return (
        <Suspense fallback={<div className="min-h-screen"></div>}>
            <ShopContent />
        </Suspense>
    );
}
