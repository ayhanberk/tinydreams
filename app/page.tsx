import HomeHero from '@/components/home/HomeHero';
import CategoryGrid from '@/components/home/CategoryGrid';
import TrustSignals from '@/components/home/TrustSignals';
import BlogPreview from '@/components/home/BlogPreview';
import ProductCard from '@/components/ui/ProductCard';
import { getFeaturedProducts, getRecommendedProducts } from '@/actions/products';
import Link from 'next/link';
import { ArrowRight } from 'lucide-react';
import { createClient } from '@/lib/supabase/server';

export default async function Home() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  const featuredProducts = await getFeaturedProducts();
  const recommendedProducts = user ? await getRecommendedProducts(user.id) : [];

  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section */}
      <HomeHero />

      {/* Trust Signals */}
      <TrustSignals />

      {/* Categories Grid */}
      <CategoryGrid />

      {/* Smart Recommendations */}
      {recommendedProducts.length > 0 && (
        <section className="py-20 bg-white border-b border-gray-50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between items-end mb-12">
              <div className="max-w-2xl">
                <span className="text-primary font-semibold tracking-wide text-sm uppercase">Just for you</span>
                <h2 className="text-3xl md:text-4xl font-bold mb-4 text-gray-900 mt-2">Recommended for Your Little One</h2>
                <p className="text-gray-500 text-lg">
                  Curated picks based on your family profile.
                </p>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
              {recommendedProducts.map((product) => (
                <ProductCard
                  key={product.id}
                  {...product}
                />
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Featured Products Section */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-end mb-12">
            <div className="max-w-2xl">
              <h2 className="text-3xl md:text-4xl font-bold mb-4 text-gray-900">Trending Now</h2>
              <p className="text-gray-500 text-lg">
                Handpicked essentials loved by parents and babies alike.
              </p>
            </div>
            <Link href="/shop" className="hidden md:flex items-center gap-2 text-primary font-medium hover:underline">
              View All <ArrowRight className="w-4 h-4" />
            </Link>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {featuredProducts.length > 0 ? (
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

          <div className="mt-8 text-center md:hidden">
            <Link href="/shop" className="inline-flex items-center gap-2 text-primary font-medium">
              View All <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </section>

      {/* Blog Preview */}
      <BlogPreview />
    </div>
  );
}
