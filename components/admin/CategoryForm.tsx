'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/Button';
import { X } from 'lucide-react';
import { supabase } from '@/lib/supabase';
import { useToast } from '@/context/ToastContext';

interface CategoryData {
    id?: string;
    name?: string;
    slug?: string;
    parent_id?: string;
    image_url?: string;
}

interface CategoryFormProps {
    onClose: () => void;
    onSuccess: () => void;
    initialData?: CategoryData;
}

export default function CategoryForm({ onClose, onSuccess, initialData }: CategoryFormProps) {
    const [loading, setLoading] = useState(false);
    const { showToast } = useToast();
    const [categories, setCategories] = useState<{ id: string; name: string }[]>([]);
    const [formData, setFormData] = useState({
        name: initialData?.name || '',
        slug: initialData?.slug || '',
        parent_id: initialData?.parent_id || '',
        image_url: initialData?.image_url || '',
    });

    useEffect(() => {
        const fetchCategories = async () => {
            const { data } = await supabase.from('categories').select('id, name');
            if (data) setCategories(data.filter((c: { id: string }) => c.id !== initialData?.id)); // Prevent setting self as parent
        };
        fetchCategories();
    }, [initialData]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));

        // Auto-generate slug from name if slug is empty
        if (name === 'name' && !formData.slug && !initialData) {
            setFormData(prev => ({
                ...prev,
                slug: value.toLowerCase().replace(/ /g, '-').replace(/[^\w-]+/g, '')
            }));
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);

        const payload = {
            ...formData,
            parent_id: formData.parent_id === '' ? null : formData.parent_id
        };

        try {
            if (initialData?.id) {
                const { error } = await supabase
                    .from('categories')
                    .update(payload)
                    .eq('id', initialData.id);
                if (error) throw error;
            } else {
                const { error } = await supabase
                    .from('categories')
                    .insert([payload]);
                if (error) throw error;
            }
            onSuccess();
            showToast(`Category ${initialData?.id ? 'updated' : 'created'} successfully`, 'success');
            onClose();
        } catch (error: unknown) {
            console.error('Error saving category:', error);
            showToast('Error saving category: ' + (error instanceof Error ? error.message : 'Unknown error'), 'error');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-2xl w-full max-w-md p-6 relative animate-in fade-in zoom-in duration-200">
                <button
                    onClick={onClose}
                    className="absolute top-4 right-4 p-2 hover:bg-gray-100 rounded-full transition-colors"
                >
                    <X className="w-5 h-5 text-gray-500" />
                </button>

                <h2 className="text-2xl font-bold mb-6">{initialData ? 'Edit Category' : 'Add Category'}</h2>

                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Name</label>
                        <input
                            type="text"
                            name="name"
                            value={formData.name}
                            onChange={handleChange}
                            required
                            className="w-full p-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none"
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Slug (URL)</label>
                        <input
                            type="text"
                            name="slug"
                            value={formData.slug}
                            onChange={handleChange}
                            required
                            className="w-full p-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none"
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Parent Category</label>
                        <select
                            name="parent_id"
                            value={formData.parent_id}
                            onChange={handleChange}
                            className="w-full p-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none"
                        >
                            <option value="">None (Top Level)</option>
                            {categories.map(cat => (
                                <option key={cat.id} value={cat.id}>{cat.name}</option>
                            ))}
                        </select>
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Image URL (Optional)</label>
                        <input
                            type="url"
                            name="image_url"
                            value={formData.image_url}
                            onChange={handleChange}
                            className="w-full p-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none"
                        />
                    </div>

                    <div className="pt-4 flex space-x-3">
                        <Button type="button" variant="ghost" onClick={onClose} className="flex-1">Cancel</Button>
                        <Button type="submit" className="flex-1" disabled={loading}>
                            {loading ? 'Saving...' : 'Save Category'}
                        </Button>
                    </div>
                </form>
            </div>
        </div>
    );
}
