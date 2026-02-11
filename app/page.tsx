import HeroSection from '@/components/layout/HeroSection';
import ProductCard from '@/components/ui/ProductCard';

export default function Home() {
  const featuredProducts = [
    {
      id: '1',
      title: 'Ergonomic Baby Carrier',
      price: 129.99,
      category: 'Gear',
      slug: 'ergonomic-baby-carrier',
      categorySlug: 'gear',
      image: 'https://images.unsplash.com/photo-1544126566-475a10629b37?w=800&q=80',
    },
    {
      id: '2',
      title: 'Organic Cotton Onesie Set',
      price: 45.00,
      category: 'Clothing',
      slug: 'organic-cotton-onesie-set',
      categorySlug: 'clothing',
      image: 'https://images.unsplash.com/photo-1522771930-78848d50259b?w=800&q=80',
    },
    {
      id: '3',
      title: 'Wooden Educational Blocks',
      price: 35.50,
      category: 'Toys',
      slug: 'wooden-educational-blocks',
      categorySlug: 'toys',
      image: 'https://images.unsplash.com/photo-1596461404969-9ae70f2830c1?w=800&q=80',
    },
    {
      id: '4',
      title: 'Soft Plush Teddy Bear',
      price: 25.99,
      category: 'Toys',
      slug: 'soft-plush-teddy-bear',
      categorySlug: 'toys',
      image: 'https://images.unsplash.com/photo-1559454403-b8fb9850611f?w=800&q=80',
    }
  ];

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
            {featuredProducts.map((product) => (
              <ProductCard
                key={product.id}
                {...product}
              />
            ))}
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
