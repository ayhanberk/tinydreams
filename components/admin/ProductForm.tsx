'use client';


import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/Button';
import { X, Package, Layers } from 'lucide-react';
import { supabase } from '@/lib/supabase';
import { useToast } from '@/context/ToastContext';
import ProductBatches from './ProductBatches';

interface ProductData {
    id?: string;
    title?: string;
    description?: string;
    price?: string | number;
    category_id?: string;
    category?: string;
    image_url?: string;
    stock?: number;
    min_age_months?: string | number;
    max_age_months?: string | number;
    certifications?: string[];
}

interface ProductFormProps {
    onClose: () => void;
    onSuccess: () => void;
    initialData?: ProductData;
}

export default function ProductForm({ onClose, onSuccess, initialData }: ProductFormProps) {
    const [loading, setLoading] = useState(false);
    const { showToast } = useToast();
    const [activeTab, setActiveTab] = useState<'details' | 'batches'>('details');

    const [formData, setFormData] = useState({
        title: initialData?.title || '',
        description: initialData?.description || '',
        price: initialData?.price || '',
        category: initialData?.category_id || initialData?.category || '',
        image_url: initialData?.image_url || '',
        stock: initialData?.stock || 0,
        min_age_months: initialData?.min_age_months || '',
        max_age_months: initialData?.max_age_months || '',
        certifications: initialData?.certifications || [],
    });

    const [certString, setCertString] = useState(
        Array.isArray(initialData?.certifications) ? initialData.certifications.join(', ') : ''
    );

    const [categories, setCategories] = useState<{ id: string; name: string }[]>([]);

    useEffect(() => {
        if (initialData?.certifications) {
            setCertString(Array.isArray(initialData.certifications) ? initialData.certifications.join(', ') : '');
        }
    }, [initialData]);

    useEffect(() => {
        const fetchCategories = async () => {
            // Fetch all categories
            const { data } = await supabase
                .from('categories')
                .select('id, name')
                .order('name');
            if (data) setCategories(data);
        };
        fetchCategories();
    }, []);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);

        try {
            const selectedCat = categories.find(c => c.id === formData.category);
            const dbPayload = {
                title: formData.title,
                description: formData.description,
                price: formData.price,
                stock: formData.stock,
                image_url: formData.image_url,
                category_id: formData.category, // UUID
                category: selectedCat?.name || '', // Text Name
                min_age_months: formData.min_age_months === '' ? null : Number(formData.min_age_months),
                max_age_months: formData.max_age_months === '' ? null : Number(formData.max_age_months),
                certifications: formData.certifications
            };

            if (initialData?.id) {
                // Update
                const { error } = await supabase
                    .from('products')
                    .update(dbPayload)
                    .eq('id', initialData.id as string);
                if (error) throw error;
            } else {
                // Create
                const { error } = await supabase
                    .from('products')
                    .insert([dbPayload]);
                if (error) throw error;
            }
            onSuccess();
            showToast(`Product ${initialData?.id ? 'updated' : 'created'} successfully`, 'success');
            onClose();
        } catch (error: unknown) {
            console.error('Error saving product:', error);
            showToast('Error saving product: ' + (error instanceof Error ? error.message : 'Unknown error'), 'error');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-2xl w-full max-w-lg overflow-hidden flex flex-col max-h-[90vh] animate-in fade-in zoom-in duration-200">
                {/* Header */}
                <div className="px-6 py-4 border-b border-gray-100 flex justify-between items-center bg-gray-50/50">
                    <h2 className="text-xl font-bold">{initialData ? 'Edit Product' : 'Add New Product'}</h2>
                    <button
                        onClick={onClose}
                        className="p-2 hover:bg-gray-100 rounded-full transition-colors"
                    >
                        <X className="w-5 h-5 text-gray-500" />
                    </button>
                </div>

                {/* Tabs */}
                {initialData && (
                    <div className="flex border-b border-gray-100">
                        <button
                            onClick={() => setActiveTab('details')}
                            className={`flex-1 py-3 text-sm font-medium flex items-center justify-center gap-2 border-b-2 transition-colors
                                ${activeTab === 'details' ? 'border-primary text-primary bg-primary/5' : 'border-transparent text-gray-500 hover:text-gray-700'}`}
                        >
                            <Layers className="w-4 h-4" /> Details
                        </button>
                        <button
                            onClick={() => setActiveTab('batches')}
                            className={`flex-1 py-3 text-sm font-medium flex items-center justify-center gap-2 border-b-2 transition-colors
                                ${activeTab === 'batches' ? 'border-primary text-primary bg-primary/5' : 'border-transparent text-gray-500 hover:text-gray-700'}`}
                        >
                            <Package className="w-4 h-4" /> Inventory Batches
                        </button>
                    </div>
                )}

                {/* Content - Scrollable */}
                <div className="p-6 overflow-y-auto custom-scrollbar flex-1">
                    {activeTab === 'details' ? (
                        <form onSubmit={handleSubmit} className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Title</label>
                                <input
                                    type="text"
                                    name="title"
                                    value={formData.title}
                                    onChange={handleChange}
                                    required
                                    className="w-full p-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none"
                                />
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Price</label>
                                    <input
                                        type="number"
                                        name="price"
                                        step="0.01"
                                        value={formData.price}
                                        onChange={handleChange}
                                        required
                                        className="w-full p-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Stock</label>
                                    <input
                                        type="number"
                                        name="stock"
                                        value={formData.stock}
                                        onChange={handleChange}
                                        required
                                        className="w-full p-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none"
                                    />
                                </div>
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Min Age (Months)</label>
                                    <input
                                        type="number"
                                        name="min_age_months"
                                        value={formData.min_age_months}
                                        onChange={handleChange}
                                        placeholder="0"
                                        className="w-full p-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Max Age (Months)</label>
                                    <input
                                        type="number"
                                        name="max_age_months"
                                        value={formData.max_age_months}
                                        onChange={handleChange}
                                        placeholder="12"
                                        className="w-full p-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none"
                                    />
                                </div>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Certifications</label>
                                <p className="text-xs text-gray-500 mb-1">Enter certifications separated by commas (e.g. GOTS, Organic)</p>
                                <input
                                    type="text"
                                    placeholder="GOTS, PEFC, Organic"
                                    value={certString}
                                    onChange={(e) => {
                                        const val = e.target.value;
                                        setCertString(val);
                                        const certArray = val.split(',').map(s => s.trim()).filter(Boolean);
                                        setFormData(prev => ({ ...prev, certifications: certArray }));
                                    }}
                                    className="w-full p-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none text-gray-900"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Category</label>
                                <select
                                    name="category"
                                    value={formData.category} // This will hold the ID now
                                    onChange={handleChange}
                                    required
                                    className="w-full p-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none text-gray-900 bg-white"
                                >
                                    <option value="" className="text-gray-500">Select Category</option>
                                    {categories.map(cat => (
                                        <option key={cat.id} value={cat.id} className="text-gray-900">{cat.name}</option>
                                    ))}
                                </select>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Image URL</label>
                                <input
                                    type="url"
                                    name="image_url"
                                    value={formData.image_url}
                                    onChange={handleChange}
                                    placeholder="https://..."
                                    className="w-full p-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                                <textarea
                                    name="description"
                                    value={formData.description}
                                    onChange={handleChange}
                                    rows={3}
                                    className="w-full p-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none resize-none"
                                />
                            </div>

                            <div className="pt-4 flex space-x-3">
                                <Button type="button" variant="ghost" onClick={onClose} className="flex-1">Cancel</Button>
                                <Button type="submit" className="flex-1" disabled={loading}>
                                    {loading ? 'Saving...' : 'Save Product'}
                                </Button>
                            </div>
                        </form>
                    ) : (
                        <ProductBatches productId={initialData?.id as string} />
                    )}
                </div>
            </div >
        </div >
    );
}

