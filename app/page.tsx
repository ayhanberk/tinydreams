'use client';

import { useState, useEffect } from 'react';
import HeroSection from '@/components/layout/HeroSection';
import ProductCard from '@/components/ui/ProductCard';
import { supabase } from '@/lib/supabase';

export default function Home() {
  const [featuredProducts, setFeaturedProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchFeatured = async () => {
      const { data, error } = await supabase
        .from('products')
        .select('*, categories(slug, name)')
        .eq('is_featured', true)
        .limit(4);

      if (error) {
        console.error('Error fetching featured products:', error);
      } else {
        const mappedData = (data || []).map((p: any) => ({
          ...p,
          id: p.id,
          title: p.title,
          price: p.price,
          image: p.image_url || p.image,
          category: p.categories?.name || p.category,
          categorySlug: p.categories?.slug || p.category?.toLowerCase(),
          slug: p.slug
        }));
        setFeaturedProducts(mappedData);
      }
      setLoading(false);
    };

    fetchFeatured();
  }, []);

  return (
    <div className="min-h-screen">
      <HeroSection />

      {/* Featured Products Section */}
      <section className="py-20 bg-background">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Trending Now</h2>
            <p className="text-gray-500 max-w-2xl mx-auto">
              Handpicked essentials loved by parents and babies alike. Discover our most popular items this season.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {loading ? (
              [1, 2, 3, 4].map((i) => (
                <div key={i} className="h-80 bg-gray-100 rounded-2xl animate-pulse" />
              ))
            ) : featuredProducts.length > 0 ? (
              featuredProducts.map((product) => (
                <ProductCard
                  key={product.id}
                  {...product}
                />
              ))
            ) : (
              <div className="col-span-full text-center text-gray-400 py-10">
                No featured products currently available.
              </div>
            )}
          </div>
        </div>
      </section>

      {/* Call to Action Section */}
      <section className="py-20 bg-secondary/10 relative overflow-hidden">
        <div className="container mx-auto px-4 text-center relative z-10">
          <h2 className="text-3xl md:text-4xl font-bold mb-6">Join the TinyDreams Family</h2>
          <p className="text-lg text-gray-600 mb-8 max-w-2xl mx-auto">
            Sign up for our newsletter and get 10% off your first order, plus exclusive access to new arrivals.
          </p>
          <form className="max-w-md mx-auto flex gap-4">
            <input
              type="email"
              placeholder="Your email address"
              className="flex-1 px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-primary/50"
            />
            <button className="bg-primary text-white px-6 py-3 rounded-xl hover:bg-primary/90 transition-colors font-medium shadow-lg shadow-primary/20">
              Subscribe
            </button>
          </form>
        </div>

        {/* Background blobs */}
        <div className="absolute top-0 left-0 w-64 h-64 bg-primary/5 rounded-full blur-3xl -translate-x-1/2 -translate-y-1/2" />
        <div className="absolute bottom-0 right-0 w-96 h-96 bg-accent/5 rounded-full blur-3xl translate-x-1/3 translate-y-1/3" />
      </section>
    </div>
  );
}
