'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/Button';
import { X } from 'lucide-react';
import { supabase } from '@/lib/supabase';

interface ProductFormProps {
    onClose: () => void;
    onSuccess: () => void;
    initialData?: any;
}

export default function ProductForm({ onClose, onSuccess, initialData }: ProductFormProps) {
    const [loading, setLoading] = useState(false);
    const [formData, setFormData] = useState({
        title: initialData?.title || '',
        description: initialData?.description || '',
        price: initialData?.price || '',
        category: initialData?.category_id || initialData?.category || '',
        image_url: initialData?.image_url || '',
        stock: initialData?.stock || 0,
    });

    const [categories, setCategories] = useState<any[]>([]);

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
            const payload = {
                ...formData,
                // Ensure category_id is set. If we are still using 'category' text column as fallback, keep it synced or migrated.
                // For now we assume we want to save the ID into category_id.
                // We might also want to save the name into 'category' for backward compat or just switch fully.
                // Let's assume we are switching to category_id mostly, but keeping 'category' text for display if needed.
                category_id: formData.category, // We are storing the ID in the category field of form data for simplicity of dropdown
                // category: categories.find(c => c.id === formData.category)?.name // Optional: store name too if schema requires
            };

            // NOTE: Adjusting payload to match schema.
            // If schema has both 'category' (text) and 'category_id' (uuid), we should populate both or switch.
            // Let's populate 'category_id' with the UUID and 'category' with the Name for safety.
            const selectedCat = categories.find(c => c.id === formData.category);
            const dbPayload = {
                title: formData.title,
                description: formData.description,
                price: formData.price,
                stock: formData.stock,
                image_url: formData.image_url,
                category_id: formData.category, // UUID
                category: selectedCat?.name || '' // Text Name
            };

            if (initialData?.id) {
                // Update
                const { error } = await supabase
                    .from('products')
                    .update(dbPayload)
                    .eq('id', initialData.id);
                if (error) throw error;
            } else {
                // Create
                const { error } = await supabase
                    .from('products')
                    .insert([dbPayload]);
                if (error) throw error;
            }
            onSuccess();
            onClose();
        } catch (error) {
            console.error('Error saving product:', error);
            alert('Error saving product');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-2xl w-full max-w-lg p-6 relative animate-in fade-in zoom-in duration-200">
                <button
                    onClick={onClose}
                    className="absolute top-4 right-4 p-2 hover:bg-gray-100 rounded-full transition-colors"
                >
                    <X className="w-5 h-5 text-gray-500" />
                </button>

                <h2 className="text-2xl font-bold mb-6">{initialData ? 'Edit Product' : 'Add New Product'}</h2>

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

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Category</label>
                        <select
                            name="category"
                            value={formData.category} // This will hold the ID now
                            onChange={handleChange}
                            required
                            className="w-full p-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none"
                        >
                            <option value="">Select Category</option>
                            {categories.map(cat => (
                                <option key={cat.id} value={cat.id}>{cat.name}</option>
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
            </div>
        </div>
    );
}
