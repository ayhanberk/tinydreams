import { ShieldCheck, Truck, RotateCcw, Headphones } from 'lucide-react';

const features = [
    {
        icon: ShieldCheck,
        title: 'Safety Certified',
        description: 'All products meet strict safety standards'
    },
    {
        icon: Truck,
        title: 'Free Shipping',
        description: 'On all orders over $50'
    },
    {
        icon: RotateCcw,
        title: 'Easy Returns',
        description: '30-day money back guarantee'
    },
    {
        icon: Headphones,
        title: 'Expert Support',
        description: 'Here to help 24/7'
    }
];

export default function TrustSignals() {
    return (
        <section className="py-16 bg-gray-50 border-y border-gray-100">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                    {features.map((feature, idx) => (
                        <div key={idx} className="flex items-center gap-4 p-4 rounded-xl hover:bg-white hover:shadow-sm transition-all">
                            <div className="p-3 bg-white border border-gray-100 rounded-full shadow-sm text-primary">
                                <feature.icon className="w-6 h-6" />
                            </div>
                            <div>
                                <h3 className="font-bold text-gray-900">{feature.title}</h3>
                                <p className="text-sm text-gray-500">{feature.description}</p>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}
