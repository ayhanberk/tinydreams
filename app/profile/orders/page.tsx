import { getUserOrders } from '@/actions/profile';
import { Package, ChevronRight } from 'lucide-react';
import Link from 'next/link';

export default async function OrdersPage() {
    const orders = await getUserOrders();

    return (
        <div className="space-y-6">
            <h1 className="text-2xl font-bold text-gray-900">My Orders</h1>

            {orders.length === 0 ? (
                <div className="bg-white p-12 rounded-2xl shadow-sm border border-gray-100 text-center">
                    <Package className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                    <h2 className="text-xl font-semibold text-gray-900 mb-2">No orders yet</h2>
                    <p className="text-gray-500 mb-8 max-w-md mx-auto">
                        Looks like you haven't placed any orders yet. Once you do, they will appear here.
                    </p>
                    <Link
                        href="/shop"
                        className="inline-flex items-center justify-center px-8 py-3 text-base font-medium text-white bg-primary rounded-xl hover:bg-primary/90 transition-colors shadow-lg shadow-primary/25"
                    >
                        Start Shopping
                    </Link>
                </div>
            ) : (
                <div className="space-y-4">
                    {orders.map((order: any) => (
                        <div key={order.id} className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
                            <div className="bg-gray-50 border-b border-gray-100 p-4 flex flex-wrap items-center justify-between gap-4">
                                <div className="space-y-1">
                                    <p className="text-sm text-gray-500">Order Placed</p>
                                    <p className="font-medium text-gray-900">{new Date(order.created_at).toLocaleDateString()}</p>
                                </div>
                                <div className="space-y-1">
                                    <p className="text-sm text-gray-500">Total Amount</p>
                                    <p className="font-medium text-gray-900">${order.total_amount?.toFixed(2)}</p>
                                </div>
                                <div className="space-y-1">
                                    <p className="text-sm text-gray-500">Order #</p>
                                    <p className="font-medium text-gray-900">{order.id.slice(0, 8)}</p>
                                </div>
                                <div>
                                    <span className={`inline-block px-3 py-1 rounded-full text-xs font-semibold capitalize
                                        ${order.status === 'delivered' ? 'bg-green-100 text-green-700' :
                                            order.status === 'processing' ? 'bg-blue-100 text-blue-700' :
                                                order.status === 'cancelled' ? 'bg-red-100 text-red-700' :
                                                    'bg-yellow-100 text-yellow-700'
                                        }`}>
                                        {order.status}
                                    </span>
                                </div>
                            </div>

                            <div className="p-4 space-y-4">
                                {order.order_items?.map((item: any) => (
                                    <div key={item.id} className="flex items-center gap-4">
                                        <div className="w-16 h-16 bg-gray-100 rounded-lg overflow-hidden flex-shrink-0 relative">
                                            {/* eslint-disable-next-line @next/next/no-img-element */}
                                            <img
                                                src={item.products?.images?.[0] || '/placeholder.png'}
                                                alt={item.products?.name}
                                                className="w-full h-full object-cover"
                                            />
                                        </div>
                                        <div className="flex-1">
                                            <h4 className="font-medium text-gray-900 line-clamp-1">{item.products?.name}</h4>
                                            <p className="text-sm text-gray-500">Qty: {item.quantity}</p>
                                        </div>
                                        <div className="text-right">
                                            <p className="font-medium text-gray-900">${item.price?.toFixed(2)}</p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}
