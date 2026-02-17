'use client';

import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import { Button } from '@/components/ui/Button';
import { Plus, Edit, Trash2 } from 'lucide-react';
import CategoryForm from '@/components/admin/CategoryForm';
import { useToast } from '@/context/ToastContext';
import ConfirmDialog from '@/components/ui/ConfirmDialog';

export default function AdminCategories() {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const [categories, setCategories] = useState<any[]>([]);
    const [showForm, setShowForm] = useState(false);
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const [editingCategory, setEditingCategory] = useState<any>(null);
    const [deleteId, setDeleteId] = useState<string | null>(null);
    const { showToast } = useToast();

    const fetchCategories = async () => {
        const { data, error } = await supabase
            .from('categories')
            .select('*, parent:categories(name)')
            .order('name');
        if (!error) setCategories(data || []);
    };

    /* eslint-disable react-hooks/set-state-in-effect */
    useEffect(() => {
        fetchCategories();
    }, []);
    /* eslint-enable react-hooks/set-state-in-effect */

    const handleDelete = async () => {
        if (!deleteId) return;
        const { error } = await supabase.from('categories').delete().eq('id', deleteId);
        if (!error) {
            fetchCategories();
            showToast('Category deleted successfully', 'success');
        } else {
            showToast('Failed to delete category. It might be in use.', 'error');
        }
        setDeleteId(null);
    };

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900">Categories</h1>
                    <p className="text-gray-500">Organize your products hierarchy</p>
                </div>
                <Button onClick={() => { setEditingCategory(null); setShowForm(true); }} className="gap-2">
                    <Plus className="w-4 h-4" /> Add Category
                </Button>
            </div>

            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
                <table className="w-full text-left">
                    <thead className="bg-gray-50 text-gray-500 text-xs uppercase">
                        <tr>
                            <th className="p-4">Name</th>
                            <th className="p-4">Slug</th>
                            <th className="p-4">Parent</th>
                            <th className="p-4 text-right">Actions</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100">
                        {categories.map(cat => (
                            <tr key={cat.id} className="hover:bg-gray-50/50">
                                <td className="p-4 font-medium flex items-center gap-2">
                                    {/* eslint-disable-next-line @next/next/no-img-element */}
                                    {cat.image_url && <img src={cat.image_url} alt={cat.name} className="w-8 h-8 rounded-lg object-cover bg-gray-100" />}
                                    {cat.name}
                                </td>
                                <td className="p-4 text-sm font-mono text-gray-500">{cat.slug}</td>
                                <td className="p-4 text-sm text-gray-500">{cat.parent?.name || '-'}</td>
                                <td className="p-4 text-right space-x-2">
                                    <button onClick={() => { setEditingCategory(cat); setShowForm(true); }} className="p-2 hover:bg-blue-50 text-blue-600 rounded-lg transition-colors">
                                        <Edit className="w-4 h-4" />
                                    </button>
                                    <button onClick={() => setDeleteId(cat.id)} className="p-2 hover:bg-red-50 text-red-600 rounded-lg transition-colors">
                                        <Trash2 className="w-4 h-4" />
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            {showForm && (
                <CategoryForm
                    onClose={() => { setShowForm(false); setEditingCategory(null); }}
                    onSuccess={() => { fetchCategories(); setShowForm(false); setEditingCategory(null); }}
                    initialData={editingCategory}
                />
            )}

            <ConfirmDialog
                isOpen={!!deleteId}
                title="Delete Category"
                message="Are you sure you want to delete this category? This will fail if there are products or subcategories linked to it."
                confirmLabel="Delete"
                onConfirm={handleDelete}
                onCancel={() => setDeleteId(null)}
            />
        </div>
    );
}
