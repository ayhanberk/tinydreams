import Link from 'next/link';
import { Moon, Bath, Utensils, Shirt, Gamepad2, Heart } from 'lucide-react';

const categories = [
    { name: 'Sleep', icon: Moon, color: 'bg-indigo-100 text-indigo-600', href: '/shop/sleep' },
    { name: 'Bathtime', icon: Bath, color: 'bg-blue-100 text-blue-600', href: '/shop/bathtime' },
    { name: 'Feeding', icon: Utensils, color: 'bg-green-100 text-green-600', href: '/shop/feeding' },
    { name: 'Clothing', icon: Shirt, color: 'bg-rose-100 text-rose-600', href: '/shop/clothing' },
    { name: 'Toys', icon: Gamepad2, color: 'bg-yellow-100 text-yellow-600', href: '/shop/toys' },
    { name: 'Nursery', icon: Heart, color: 'bg-purple-100 text-purple-600', href: '/shop/nursery' },
];

export default function CategoryGrid() {
    return (
        <section className="py-20 bg-white">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="text-center mb-12">
                    <h2 className="text-3xl font-bold text-gray-900 mb-4">Shop by Category</h2>
                    <p className="text-gray-500 max-w-2xl mx-auto">
                        Everything you need for your little one, organized for easy shopping.
                    </p>
                </div>

                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6">
                    {categories.map((cat) => (
                        <Link
                            key={cat.name}
                            href={cat.href}
                            className="group flex flex-col items-center p-6 rounded-2xl bg-gray-50 hover:bg-white hover:shadow-xl transition-all duration-300 border border-transparent hover:border-gray-100"
                        >
                            <div className={`w-16 h-16 rounded-full flex items-center justify-center mb-4 transition-transform duration-300 group-hover:scale-110 ${cat.color}`}>
                                <cat.icon className="w-8 h-8" />
                            </div>
                            <span className="font-semibold text-gray-900 group-hover:text-primary transition-colors">
                                {cat.name}
                            </span>
                        </Link>
                    ))}
                </div>
            </div>
        </section>
    );
}
