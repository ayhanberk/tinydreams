'use client';

import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import { Button } from '@/components/ui/Button';
import { Search, AlertTriangle, RefreshCw, Layers } from 'lucide-react';
import { useToast } from '@/context/ToastContext';
import ConfirmDialog from '@/components/ui/ConfirmDialog';

interface InventoryItem {
    id: string;
    product_id: string;
    color: string | null;
    size: string | null;
    stock_quantity: number;
    sku: string | null;
    created_at: string;
    products?: {
        title: string;
        image_url: string;
        category: string;
    };
}

export default function AdminInventory() {
    const [inventory, setInventory] = useState<InventoryItem[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [updating, setUpdating] = useState<string | null>(null);
    const [showSyncConfirm, setShowSyncConfirm] = useState(false);
    const { showToast } = useToast();

    const fetchInventory = async () => {
        setLoading(true);
        // Fetch product variants joined with product details
        const { data, error } = await supabase
            .from('product_variants')
            .select('*, products(title, image_url, category)')
            .order('created_at', { ascending: false });

        if (error) {
            console.error('Error fetching inventory:', error);
        } else {
            setInventory(data || []);
        }
        setLoading(false);
    };

    const syncVariants = async () => {
        setLoading(true);
        try {
            // 1. Fetch all products
            const { data: products, error: pError } = await supabase
                .from('products')
                .select('id, title, colors, sizes, slug');

            if (pError) throw pError;

            let createdCount = 0;
            for (const product of products || []) {
                const colors = product.colors || [null];
                const sizes = product.sizes || [null];

                for (const color of colors) {
                    for (const size of sizes) {
                        // Check if variant already exists
                        const { data: existing } = await supabase
                            .from('product_variants')
                            .select('id')
                            .eq('product_id', product.id)
                            .eq('color', color)
                            .eq('size', size)
                            .maybeSingle();

                        if (!existing) {
                            const sku = `${product.slug}-${color || 'NA'}-${size || 'NA'}`.toUpperCase();
                            const { error: insError } = await supabase
                                .from('product_variants')
                                .insert({
                                    product_id: product.id,
                                    color,
                                    size,
                                    stock_quantity: 0,
                                    sku
                                });
                            if (!insError) createdCount++;
                        }
                    }
                }
            }
            showToast(`Sync complete! Created ${createdCount} new variant entries.`, 'success');
            fetchInventory();
        } catch (error: unknown) {
            console.error('Sync Error:', error);
            showToast('Sync failed: ' + (error instanceof Error ? error.message : 'Unknown error'), 'error');
        } finally {
            setLoading(false);
            setShowSyncConfirm(false);
        }
    };

    useEffect(() => {
        fetchInventory();
    }, []);

    const handleStockUpdate = async (id: string, newQuantity: number) => {
        setUpdating(id);
        const { error } = await supabase
            .from('product_variants')
            .update({ stock_quantity: newQuantity })
            .eq('id', id);

        if (error) {
            showToast('Failed to update stock', 'error');
        } else {
            setInventory(prev => prev.map(item => item.id === id ? { ...item, stock_quantity: newQuantity } : item));
            showToast('Stock updated successfully', 'success');
        }
        setUpdating(null);
    };

    const filteredInventory = inventory.filter(item =>
        (item.products?.title || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
        (item.sku || '').toLowerCase().includes(searchTerm.toLowerCase())
    );

    // Grouping by product title for cleaner display
    const groupedInventory: Record<string, InventoryItem[]> = {};
    filteredInventory.forEach(item => {
        const title = item.products?.title || 'Unknown Product';
        if (!groupedInventory[title]) groupedInventory[title] = [];
        groupedInventory[title].push(item);
    });

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900">Inventory Management</h1>
                    <p className="text-gray-500">Monitor and update stock levels for all product variants</p>
                </div>
                <div className="flex gap-2">
                    <Button onClick={() => setShowSyncConfirm(true)} variant="outline" className="gap-2 text-primary border-primary hover:bg-primary/5" disabled={loading}>
                        <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
                        Sync Variants from Products
                    </Button>
                    <Button onClick={fetchInventory} variant="ghost" className="gap-2">
                        <RefreshCw className="w-4 h-4" />
                        Refresh
                    </Button>
                </div>
            </div>

            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
                <div className="p-4 border-b border-gray-100 flex gap-4">
                    <div className="relative flex-1">
                        <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                        <input
                            type="text"
                            placeholder="Search by product name or SKU..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="w-full pl-10 pr-4 py-2 border rounded-xl text-sm focus:ring-2 focus:ring-primary/20 outline-none"
                        />
                    </div>
                </div>

                <div className="overflow-x-auto">
                    <table className="w-full text-left">
                        <thead className="bg-gray-50 text-gray-500 text-xs uppercase">
                            <tr>
                                <th className="p-4">Product & Variant</th>
                                <th className="p-4">SKU</th>
                                <th className="p-4">Color</th>
                                <th className="p-4">Size</th>
                                <th className="p-4">Current Stock</th>
                                <th className="p-4 text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100">
                            {loading ? (
                                <tr><td colSpan={6} className="p-8 text-center text-gray-400">Loading inventory...</td></tr>
                            ) : inventory.length === 0 ? (
                                <tr>
                                    <td colSpan={6} className="p-12 text-center">
                                        <div className="flex flex-col items-center gap-3">
                                            <Layers className="w-12 h-12 text-gray-200" />
                                            <p className="text-gray-500">No variants found in inventory.</p>
                                            <p className="text-sm text-gray-400 max-w-xs">Existing products need to be synced or manually assigned variants with stock levels.</p>
                                        </div>
                                    </td>
                                </tr>
                            ) : filteredInventory.length === 0 ? (
                                <tr><td colSpan={6} className="p-8 text-center text-gray-400">No results matching your search.</td></tr>
                            ) : (
                                filteredInventory.map(item => (
                                    <tr key={item.id} className="hover:bg-gray-50/50 transition-colors">
                                        <td className="p-4">
                                            <div className="flex items-center gap-3">
                                                <div className="w-10 h-10 rounded-lg bg-gray-100 overflow-hidden border border-gray-200 flex-shrink-0">
                                                    {/* eslint-disable-next-line @next/next/no-img-element */}
                                                    {item.products?.image_url && <img src={item.products.image_url} alt={item.products.title} className="w-full h-full object-cover" />}
                                                </div>
                                                <div className="flex flex-col">
                                                    <span className="font-bold text-gray-900 text-sm">{item.products?.title}</span>
                                                    <span className="text-xs text-gray-500">{item.products?.category}</span>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="p-4 text-sm font-mono text-gray-500">
                                            {item.sku || 'N/A'}
                                        </td>
                                        <td className="p-4">
                                            {item.color ? (
                                                <span className="px-2 py-1 bg-blue-50 text-blue-600 rounded text-xs font-semibold">
                                                    {item.color}
                                                </span>
                                            ) : '-'}
                                        </td>
                                        <td className="p-4">
                                            {item.size ? (
                                                <span className="px-2 py-1 bg-purple-50 text-purple-600 rounded text-xs font-semibold">
                                                    {item.size}
                                                </span>
                                            ) : '-'}
                                        </td>
                                        <td className="p-4">
                                            <div className="flex items-center gap-2">
                                                <input
                                                    type="number"
                                                    className={`w-20 px-2 py-1 border rounded text-center text-sm font-bold ${item.stock_quantity < 10 ? 'border-red-300 text-red-600' : 'border-gray-200 text-gray-900'}`}
                                                    defaultValue={item.stock_quantity}
                                                    onBlur={(e) => {
                                                        const val = parseInt(e.target.value);
                                                        if (val !== item.stock_quantity) handleStockUpdate(item.id, val);
                                                    }}
                                                />
                                                {item.stock_quantity < 10 && (
                                                    <AlertTriangle className="w-4 h-4 text-amber-500" />
                                                )}
                                            </div>
                                        </td>
                                        <td className="p-4 text-right">
                                            <Button
                                                variant="outline"
                                                size="sm"
                                                className="h-8 w-8 p-0"
                                                onClick={() => { }} // Could trigger a detail view or logs
                                            >
                                                <RefreshCw className={`w-3 h-3 ${updating === item.id ? 'animate-spin' : ''}`} />
                                            </Button>
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>
            </div>

            <ConfirmDialog
                isOpen={showSyncConfirm}
                title="Sync Variants"
                message="This will scan all products and create missing variants (color/size combinations) with 0 stock. This process cannot be undone. Continue?"
                confirmLabel="Sync Now"
                type="info"
                onConfirm={syncVariants}
                onCancel={() => setShowSyncConfirm(false)}
            />
        </div>
    );
}
