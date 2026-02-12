'use client';

import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import { Button } from '@/components/ui/Button';
import { Plus, Trash2, Power, PowerOff, Loader2, AlertCircle } from 'lucide-react';
import { useToast } from '@/context/ToastContext';
import ConfirmDialog from '@/components/ui/ConfirmDialog';

export default function BannerManager() {
    const [banners, setBanners] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [showForm, setShowForm] = useState(false);
    const [formData, setFormData] = useState({
        title: '',
        content: '',
        style: 'info',
        is_active: true,
        link: ''
    });
    const [deleteId, setDeleteId] = useState<string | null>(null);
    const { showToast } = useToast();

    const fetchBanners = async () => {
        setLoading(true);
        const { data, error } = await supabase
            .from('banners')
            .select('*')
            .order('created_at', { ascending: false });

        if (!error && data) {
            setBanners(data);
        }
        setLoading(false);
    };

    useEffect(() => {
        fetchBanners();
    }, []);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        const { error } = await supabase.from('banners').insert([formData]);

        if (!error) {
            setFormData({ title: '', content: '', style: 'info', is_active: true, link: '' });
            setShowForm(false);
            fetchBanners();
            showToast('Banner created successfully', 'success');
        } else {
            showToast('Error creating banner', 'error');
        }
    };

    const toggleActive = async (id: string, currentState: boolean) => {
        const { error } = await supabase
            .from('banners')
            .update({ is_active: !currentState })
            .eq('id', id);

        if (!error) {
            fetchBanners();
            showToast(`Banner ${!currentState ? 'activated' : 'deactivated'} successfully`, 'success');
        } else {
            showToast('Failed to update banner status', 'error');
        }
    };

    const handleDelete = async () => {
        if (!deleteId) return;
        const { error } = await supabase.from('banners').delete().eq('id', deleteId);
        if (!error) {
            fetchBanners();
            showToast('Banner deleted successfully', 'success');
        } else {
            showToast('Failed to delete banner', 'error');
        }
        setDeleteId(null);
    };

    return (
        <div className="space-y-8">
            <div className="flex items-center justify-between">
                <h2 className="text-2xl font-bold bg-gradient-to-r from-gray-800 to-gray-600 bg-clip-text text-transparent">Site Banners</h2>
                <Button onClick={() => setShowForm(!showForm)} className="gap-2">
                    <Plus className="w-4 h-4" /> New Banner
                </Button>
            </div>

            {showForm && (
                <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm animate-in fade-in slide-in-from-top-4">
                    <form onSubmit={handleSubmit} className="space-y-4">
                        <div className="grid md:grid-cols-2 gap-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Title</label>
                                <input
                                    required
                                    type="text"
                                    className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-primary/20 outline-none"
                                    value={formData.title}
                                    onChange={e => setFormData({ ...formData, title: e.target.value })}
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Style</label>
                                <select
                                    className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-primary/20 outline-none"
                                    value={formData.style}
                                    onChange={e => setFormData({ ...formData, style: e.target.value })}
                                >
                                    <option value="info">Info (Blue)</option>
                                    <option value="success">Success (Green)</option>
                                    <option value="warning">Warning (Yellow)</option>
                                    <option value="premium">Premium (Gradient)</option>
                                </select>
                            </div>
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Content</label>
                            <textarea
                                required
                                rows={2}
                                className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-primary/20 outline-none"
                                value={formData.content}
                                onChange={e => setFormData({ ...formData, content: e.target.value })}
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Link (Optional)</label>
                            <input
                                type="text"
                                placeholder="/shop?category=sale"
                                className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-primary/20 outline-none"
                                value={formData.link}
                                onChange={e => setFormData({ ...formData, link: e.target.value })}
                            />
                        </div>
                        <div className="flex justify-end gap-2">
                            <Button type="button" variant="outline" onClick={() => setShowForm(false)}>Cancel</Button>
                            <Button type="submit">Create Banner</Button>
                        </div>
                    </form>
                </div>
            )}

            <div className="grid gap-4">
                {loading ? (
                    <div className="text-center py-8 text-gray-500">Loading banners...</div>
                ) : banners.length === 0 ? (
                    <div className="text-center py-8 text-gray-500 border-2 border-dashed border-gray-100 rounded-xl">No banners created yet.</div>
                ) : (
                    banners.map(banner => (
                        <div key={banner.id} className={`p-4 rounded-xl border flex items-center justify-between group transition-all ${banner.is_active ? 'bg-white border-gray-200 shadow-sm' : 'bg-gray-50 border-gray-100 opacity-70'}`}>
                            <div className="flex items-center gap-4">
                                <div className={`w-12 h-12 rounded-lg flex items-center justify-center ${banner.style === 'premium' ? 'bg-gradient-to-br from-primary to-secondary text-white' :
                                        banner.style === 'success' ? 'bg-green-100 text-green-600' :
                                            banner.style === 'warning' ? 'bg-yellow-100 text-yellow-600' :
                                                'bg-blue-100 text-blue-600'
                                    }`}>
                                    <AlertCircle className="w-6 h-6" />
                                </div>
                                <div>
                                    <div className="flex items-center gap-2">
                                        <h3 className="font-bold text-gray-900">{banner.title}</h3>
                                        {!banner.is_active && <span className="text-xs px-2 py-0.5 bg-gray-200 text-gray-500 rounded-full">Inactive</span>}
                                    </div>
                                    <p className="text-sm text-gray-500">{banner.content}</p>
                                </div>
                            </div>
                            <div className="flex items-center gap-2">
                                <button
                                    onClick={() => toggleActive(banner.id, banner.is_active)}
                                    className={`p-2 rounded-lg transition-colors ${banner.is_active ? 'hover:bg-red-50 text-green-600 hover:text-red-500' : 'hover:bg-green-50 text-gray-400 hover:text-green-600'}`}
                                    title={banner.is_active ? 'Deactivate' : 'Activate'}
                                >
                                    {banner.is_active ? <Power className="w-5 h-5" /> : <PowerOff className="w-5 h-5" />}
                                </button>
                                <button
                                    onClick={() => setDeleteId(banner.id)}
                                    className="p-2 hover:bg-red-50 text-gray-400 hover:text-red-500 rounded-lg transition-colors"
                                >
                                    <Trash2 className="w-5 h-5" />
                                </button>
                            </div>
                        </div>
                    ))
                )}
            </div>

            <ConfirmDialog
                isOpen={!!deleteId}
                title="Delete Banner"
                message="Are you sure you want to delete this banner? This action cannot be undone."
                confirmLabel="Delete"
                onConfirm={handleDelete}
                onCancel={() => setDeleteId(null)}
            />
        </div>
    );
}
