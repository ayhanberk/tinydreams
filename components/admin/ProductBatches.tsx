'use client';

import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import { Button } from '@/components/ui/Button';
import { Trash2, Plus } from 'lucide-react';

interface Batch {
    id: string;
    batch_number: string;
    expiry_date: string | null;
    quantity: number;
    created_at: string;
}

interface ProductBatchesProps {
    productId: string;
}

export default function ProductBatches({ productId }: ProductBatchesProps) {
    const [batches, setBatches] = useState<Batch[]>([]);
    const [loading, setLoading] = useState(true);
    const [newBatch, setNewBatch] = useState({
        batch_number: '',
        expiry_date: '',
        quantity: 0
    });
    const [isAdding, setIsAdding] = useState(false);

    const fetchBatches = async () => {
        setLoading(true);
        const { data, error } = await supabase
            .from('inventory_batches')
            .select('*')
            .eq('product_id', productId)
            .order('expiry_date', { ascending: true }); // Expiring soonest first

        if (error) {
            console.error('Error fetching batches:', error);
            // alert('Error loading batches: ' + error.message); // Optional: keep or remove alert based on preference
        }

        if (data) {
            setBatches(data);
        }
        setLoading(false);
    };

    /* eslint-disable react-hooks/set-state-in-effect, react-hooks/exhaustive-deps */
    useEffect(() => {
        fetchBatches();
    }, [productId]);
    /* eslint-enable react-hooks/set-state-in-effect, react-hooks/exhaustive-deps */

    const handleAddBatch = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsAdding(true);

        const { data, error } = await supabase
            .from('inventory_batches')
            .insert([{
                product_id: productId,
                batch_number: newBatch.batch_number,
                expiry_date: newBatch.expiry_date || null,
                quantity: newBatch.quantity
            }])
            .select()
            .single();

        if (error) {
            console.error('Error adding batch:', error);
            alert('Failed to add batch: ' + error.message);
        } else if (data) {
            setBatches(prev => [...prev, data as Batch].sort((a, b) => {
                if (!a.expiry_date) return 1;
                if (!b.expiry_date) return -1;
                return new Date(a.expiry_date).getTime() - new Date(b.expiry_date).getTime();
            }));
            setNewBatch({ batch_number: '', expiry_date: '', quantity: 0 });
        }
        setIsAdding(false);
    };

    const handleDeleteBatch = async (id: string) => {
        if (!confirm('Are you sure you want to delete this batch?')) return;

        const { error } = await supabase
            .from('inventory_batches')
            .delete()
            .eq('id', id);

        if (!error) {
            setBatches(prev => prev.filter(b => b.id !== id));
        }
    };

    const isExpired = (dateString: string | null) => {
        if (!dateString) return false;
        return new Date(dateString) < new Date();
    };

    return (
        <div className="space-y-6">
            <div className="bg-gray-50 p-4 rounded-xl border border-gray-100">
                <h3 className="font-semibold text-gray-900 mb-4 flex items-center gap-2">
                    <Plus className="w-4 h-4" /> Add New Batch
                </h3>
                <form onSubmit={handleAddBatch} className="grid grid-cols-1 md:grid-cols-3 gap-4 items-end">
                    <div>
                        <label className="block text-xs font-medium text-gray-500 mb-1">Batch Number</label>
                        <input
                            type="text"
                            required
                            placeholder="e.g. LOT-2024-001"
                            value={newBatch.batch_number}
                            onChange={e => setNewBatch({ ...newBatch, batch_number: e.target.value })}
                            className="w-full p-2 border border-gray-200 rounded-lg text-sm bg-white"
                        />
                    </div>
                    <div>
                        <label className="block text-xs font-medium text-gray-500 mb-1">Expiry Date</label>
                        <input
                            type="date"
                            value={newBatch.expiry_date}
                            onChange={e => setNewBatch({ ...newBatch, expiry_date: e.target.value })}
                            className="w-full p-2 border border-gray-200 rounded-lg text-sm bg-white"
                        />
                    </div>
                    <div>
                        <label className="block text-xs font-medium text-gray-500 mb-1">Quantity</label>
                        <input
                            type="number"
                            required
                            min="0"
                            value={newBatch.quantity}
                            onChange={e => setNewBatch({ ...newBatch, quantity: parseInt(e.target.value) || 0 })}
                            className="w-full p-2 border border-gray-200 rounded-lg text-sm bg-white"
                        />
                    </div>
                    <Button type="submit" disabled={isAdding} size="sm" className="md:col-span-3 w-full">
                        {isAdding ? 'Adding...' : 'Add Batch'}
                    </Button>
                </form>
            </div>

            <div className="space-y-3">
                <h3 className="font-semibold text-gray-900">Current Inventory Batches</h3>
                {loading ? (
                    <p className="text-sm text-gray-500">Loading batches...</p>
                ) : batches.length === 0 ? (
                    <p className="text-sm text-gray-500 italic">No batches recorded for this product.</p>
                ) : (
                    <div className="space-y-2 max-h-60 overflow-y-auto pr-1">
                        {batches.map(batch => {
                            const expired = isExpired(batch.expiry_date);
                            return (
                                <div
                                    key={batch.id}
                                    className={`flex items-center justify-between p-3 rounded-lg border ${expired ? 'bg-red-50 border-red-100' : 'bg-white border-gray-100'}`}
                                >
                                    <div className="flex-1 min-w-0 grid grid-cols-3 gap-2 text-sm">
                                        <div>
                                            <span className="text-gray-500 text-xs block">Batch #</span>
                                            <span className="font-medium truncate">{batch.batch_number}</span>
                                        </div>
                                        <div>
                                            <span className="text-gray-500 text-xs block">Expiry</span>
                                            <span className={`font-medium ${expired ? 'text-red-600' : ''}`}>
                                                {batch.expiry_date ? new Date(batch.expiry_date).toLocaleDateString() : 'N/A'}
                                                {expired && <span className="ml-1 text-xs font-bold">(Expired)</span>}
                                            </span>
                                        </div>
                                        <div>
                                            <span className="text-gray-500 text-xs block">Qty</span>
                                            <span className="font-medium">{batch.quantity}</span>
                                        </div>
                                    </div>
                                    <button
                                        onClick={() => handleDeleteBatch(batch.id)}
                                        className="p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-full transition-colors ml-2"
                                    >
                                        <Trash2 className="w-4 h-4" />
                                    </button>
                                </div>
                            );
                        })}
                    </div>
                )}
            </div>
        </div>
    );
}
