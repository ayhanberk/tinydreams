'use client';

import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import { Button } from '@/components/ui/Button';
import { Plus, Edit, Trash2, Search, Filter } from 'lucide-react';
import ProductForm from '@/components/admin/ProductForm';
import { useToast } from '@/context/ToastContext';
import ConfirmDialog from '@/components/ui/ConfirmDialog';

export default function AdminProducts() {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const [products, setProducts] = useState<any[]>([]);
    const [showForm, setShowForm] = useState(false);
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const [editingProduct, setEditingProduct] = useState<any>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [deleteId, setDeleteId] = useState<string | null>(null);
    const { showToast } = useToast();

    const fetchProducts = async () => {
        setLoading(true);
        const { data, error } = await supabase
            .from('products')
            .select('*, categories(name)')
            .order('created_at', { ascending: false });

        if (error) {
            console.error('Error fetching products:', error);
            setError(error.message);
        }
        else {
            setProducts(data || []);
            setError(null);
        }
        setLoading(false);
    };

    /* eslint-disable react-hooks/set-state-in-effect */
    useEffect(() => {
        fetchProducts();
    }, []);
    /* eslint-enable react-hooks/set-state-in-effect */

    const handleDelete = async () => {
        if (!deleteId) return;
        const { error } = await supabase.from('products').delete().eq('id', deleteId);
        if (!error) {
            fetchProducts();
            showToast('Product deleted successfully', 'success');
        } else {
            showToast('Failed to delete product', 'error');
        }
        setDeleteId(null);
    };

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900">Products</h1>
                    <p className="text-gray-500">Manage your product inventory</p>
                </div>
                <Button onClick={() => { setEditingProduct(null); setShowForm(true); }} className="gap-2">
                    <Plus className="w-4 h-4" /> Add Product
                </Button>
            </div>

            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
                <div className="p-4 border-b border-gray-100 flex gap-4">
                    <div className="relative flex-1">
                        <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                        <input type="text" placeholder="Search products..." className="w-full pl-10 pr-4 py-2 border rounded-xl text-sm focus:ring-2 focus:ring-primary/20 outline-none" />
                    </div>
                    <Button variant="outline" className="gap-2 text-gray-600">
                        <Filter className="w-4 h-4" /> Filter
                    </Button>
                </div>

                {error && (
                    <div className="p-4 mx-4 my-2 bg-red-50 border border-red-100 rounded-xl text-red-600 text-sm">
                        <b>Error loading products:</b> {error}
                    </div>
                )}

                <div className="overflow-x-auto">
                    <table className="w-full text-left">
                        <thead className="bg-gray-50 text-gray-500 text-xs uppercase">
                            <tr>
                                <th className="p-4">Product</th>
                                <th className="p-4">Category</th>
                                <th className="p-4">Price</th>
                                <th className="p-4">Stock</th>
                                <th className="p-4 text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100">
                            {loading ? (
                                <tr><td colSpan={5} className="p-8 text-center text-gray-400">Loading...</td></tr>
                            ) : products.length === 0 ? (
                                <tr><td colSpan={5} className="p-8 text-center text-gray-400">No products found.</td></tr>
                            ) : (
                                products.map(product => (
                                    <tr key={product.id} className="hover:bg-gray-50/50">
                                        <td className="p-4 font-medium flex items-center gap-3">
                                            <div className="w-10 h-10 rounded-lg bg-gray-100 overflow-hidden flex-shrink-0 border border-gray-200">
                                                {/* eslint-disable-next-line @next/next/no-img-element */}
                                                {product.image_url && <img src={product.image_url} alt={product.title} className="w-full h-full object-cover" />}
                                            </div>
                                            {product.title}
                                        </td>
                                        <td className="p-4 text-gray-500 text-sm">
                                            <span className="px-2 py-1 bg-gray-100 rounded-md">
                                                {product.categories?.name || '-'}
                                            </span>
                                        </td>
                                        <td className="p-4 font-medium text-gray-900">${product.price.toFixed(2)}</td>
                                        <td className="p-4">
                                            <span className={`px-2 py-1 rounded-full text-xs font-semibold ${product.stock < 10 ? 'bg-red-50 text-red-600' : 'bg-green-50 text-green-600'}`}>
                                                {product.stock} Stock
                                            </span>
                                        </td>
                                        <td className="p-4 text-right space-x-2">
                                            <button onClick={() => { setEditingProduct(product); setShowForm(true); }} className="p-2 hover:bg-blue-50 text-blue-600 rounded-lg transition-colors">
                                                <Edit className="w-4 h-4" />
                                            </button>
                                            <button onClick={() => setDeleteId(product.id)} className="p-2 hover:bg-red-50 text-red-600 rounded-lg transition-colors">
                                                <Trash2 className="w-4 h-4" />
                                            </button>
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>
            </div>

            {showForm && (
                <ProductForm
                    onClose={() => { setShowForm(false); setEditingProduct(null); }}
                    onSuccess={() => { fetchProducts(); setShowForm(false); setEditingProduct(null); }}
                    initialData={editingProduct}
                />
            )}

            <ConfirmDialog
                isOpen={!!deleteId}
                title="Delete Product"
                message="Are you sure you want to delete this product? This action cannot be undone."
                confirmLabel="Delete"
                onConfirm={handleDelete}
                onCancel={() => setDeleteId(null)}
            />
        </div>
    );
}
