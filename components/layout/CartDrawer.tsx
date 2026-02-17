'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { useCart } from '@/context/CartContext';
import { X, Trash2, ShoppingBag } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import Link from 'next/link';
import Image from 'next/image';

const CartDrawer = () => {
    const { isCartOpen, toggleCart, items, removeFromCart, updateQuantity, cartTotal } = useCart();

    return (
        <AnimatePresence>
            {isCartOpen && (
                <>
                    {/* Backdrop */}
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={toggleCart}
                        className="fixed inset-0 bg-black/40 backdrop-blur-sm z-[60]"
                    />

                    {/* Drawer */}
                    <motion.div
                        initial={{ x: '100%' }}
                        animate={{ x: 0 }}
                        exit={{ x: '100%' }}
                        transition={{ type: 'spring', damping: 25, stiffness: 200 }}
                        className="fixed top-0 right-0 h-full w-full max-w-md bg-white shadow-2xl z-[70] flex flex-col border-l border-gray-100"
                    >
                        {/* Header */}
                        <div className="p-4 border-b border-gray-100 flex items-center justify-between bg-white/50 backdrop-blur-md">
                            <div className="flex items-center space-x-2">
                                <ShoppingBag className="w-5 h-5 text-primary" />
                                <h2 className="font-bold text-lg">Your Cart</h2>
                                <span className="bg-primary/10 text-primary text-xs px-2 py-1 rounded-full font-medium">
                                    {items.length} items
                                </span>
                            </div>
                            <button onClick={toggleCart} className="p-2 hover:bg-gray-100 rounded-full transition-colors">
                                <X className="w-5 h-5 text-gray-500" />
                            </button>
                        </div>

                        {/* Items */}
                        <div className="flex-1 overflow-y-auto p-4 space-y-4">
                            {items.length === 0 ? (
                                <div className="h-full flex flex-col items-center justify-center text-center space-y-4 text-gray-500">
                                    <ShoppingBag className="w-16 h-16 opacity-20" />
                                    <p>Your cart is empty</p>
                                    <Button onClick={toggleCart} variant="outline">Start Shopping</Button>
                                </div>
                            ) : (
                                items.map((item) => (
                                    <div key={item.id} className="flex space-x-4 p-3 bg-gray-50 rounded-xl hover:bg-white hover:shadow-sm border border-transparent hover:border-gray-100 transition-all">
                                        <div className="w-20 h-20 bg-white rounded-lg overflow-hidden border border-gray-100 flex-shrink-0 relative">
                                            <Image
                                                src={item.image}
                                                alt={item.title}
                                                fill
                                                className="object-cover"
                                                sizes="80px"
                                            />
                                        </div>
                                        <div className="flex-1 flex flex-col justify-between">
                                            <div>
                                                <h3 className="font-semibold text-sm line-clamp-1">{item.title}</h3>
                                                <p className="text-sm text-gray-500">{item.category}</p>
                                                {/* Variant Info */}
                                                {(item.color || item.size) && (
                                                    <div className="flex space-x-2 text-xs text-gray-400 mt-1">
                                                        {item.color && (
                                                            <span className="flex items-center">
                                                                <span className="w-2 h-2 rounded-full bg-gray-300 mr-1" style={{ backgroundColor: item.color.toLowerCase() }}></span>
                                                                {item.color}
                                                            </span>
                                                        )}
                                                        {item.size && (
                                                            <span className="border border-gray-200 px-1 rounded">
                                                                {item.size}
                                                            </span>
                                                        )}
                                                    </div>
                                                )}
                                            </div>
                                            <div className="flex justify-between items-center">
                                                <div className="flex items-center space-x-2">
                                                    <button
                                                        onClick={() => updateQuantity(item.id, item.quantity - 1)}
                                                        className="w-6 h-6 rounded-full bg-white border border-gray-200 flex items-center justify-center text-gray-500 hover:border-primary hover:text-primary transition-colors text-xs"
                                                    >
                                                        -
                                                    </button>
                                                    <span className="text-sm font-medium w-4 text-center">{item.quantity}</span>
                                                    <button
                                                        onClick={() => updateQuantity(item.id, item.quantity + 1)}
                                                        className="w-6 h-6 rounded-full bg-white border border-gray-200 flex items-center justify-center text-gray-500 hover:border-primary hover:text-primary transition-colors text-xs"
                                                    >
                                                        +
                                                    </button>
                                                </div>
                                                <div className="text-right">
                                                    <p className="font-bold text-sm">${(item.price * item.quantity).toFixed(2)}</p>
                                                </div>
                                            </div>
                                        </div>
                                        <button
                                            onClick={() => removeFromCart(item.id)}
                                            className="text-gray-400 hover:text-red-500 transition-colors p-1"
                                        >
                                            <Trash2 className="w-4 h-4" />
                                        </button>
                                    </div>
                                ))
                            )}
                        </div>

                        {/* Footer */}
                        {items.length > 0 && (
                            <div className="p-6 border-t border-gray-100 bg-white/50 backdrop-blur-md space-y-4">
                                <div className="space-y-2">
                                    <div className="flex justify-between text-sm text-gray-500">
                                        <span>Subtotal</span>
                                        <span>${cartTotal.toFixed(2)}</span>
                                    </div>
                                    <div className="flex justify-between text-sm text-gray-500">
                                        <span>Shipping</span>
                                        <span className="text-green-600">Free</span>
                                    </div>
                                    <div className="flex justify-between font-bold text-lg pt-2 border-t border-dashed border-gray-200">
                                        <span>Total</span>
                                        <span>${cartTotal.toFixed(2)}</span>
                                    </div>
                                </div>
                                <Link href="/checkout" onClick={toggleCart} className="block w-full">
                                    <Button className="w-full py-6 text-lg shadow-lg shadow-primary/20">
                                        Checkout
                                    </Button>
                                </Link>
                                <button onClick={toggleCart} className="w-full text-center text-sm text-gray-500 hover:text-primary transition-colors">
                                    Continue Shopping
                                </button>
                            </div>
                        )}
                    </motion.div>
                </>
            )}
        </AnimatePresence>
    );
};

export default CartDrawer;
