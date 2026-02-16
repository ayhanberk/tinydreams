import { getWishlist } from '@/actions/wishlist';
import ProductCard from '@/components/ui/ProductCard';
import { Heart } from 'lucide-react';
import Link from 'next/link';

export default async function WishlistPage() {
    const wishlistItems = await getWishlist();

    return (
        <div className="space-y-6">
            <div className="flex items-center gap-3 mb-8">
                <div className="p-3 bg-rose-50 rounded-2xl">
                    <Heart className="w-8 h-8 text-rose-500 fill-rose-500" />
                </div>
                <div>
                    <h1 className="text-3xl font-bold text-gray-900">My Wishlist</h1>
                    <p className="text-gray-500 mt-1">
                        {wishlistItems.length} {wishlistItems.length === 1 ? 'item' : 'items'} saved for later
                    </p>
                </div>
            </div>

            {wishlistItems.length > 0 ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                    {wishlistItems.map((product: any) => (
                        <ProductCard key={product.id} {...product} />
                    ))}
                </div>
            ) : (
                <div className="text-center py-20 bg-gray-50 rounded-3xl border border-gray-100">
                    <Heart className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                    <h2 className="text-xl font-semibold text-gray-900 mb-2">Your wishlist is empty</h2>
                    <p className="text-gray-500 mb-8 max-w-md mx-auto">
                        Save items you love to your wishlist to keep track of them and shop them later.
                    </p>
                    <Link
                        href="/shop"
                        className="inline-flex items-center justify-center px-8 py-3 text-base font-medium text-white bg-primary rounded-xl hover:bg-primary/90 transition-colors shadow-lg shadow-primary/25"
                    >
                        Start Shopping
                    </Link>
                </div>
            )}
        </div>
    );
}
