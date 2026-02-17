'use client';

import { useState } from 'react';
import { supabase } from '@/lib/supabase';
import { Button } from '@/components/ui/Button';
import { Send, Bell, Loader2 } from 'lucide-react';
import { useToast } from '@/context/ToastContext';

export default function NotificationSender() {
    const [loading, setLoading] = useState(false);
    const { showToast } = useToast();
    const [formData, setFormData] = useState({
        title: '',
        message: '',
        type: 'info',
        target: 'all', // all or specific
        user_id: ''
    });

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);

        const payload = {
            title: formData.title,
            message: formData.message,
            type: formData.type,
            user_id: formData.target === 'all' ? null : formData.user_id
        };

        const { error } = await supabase.from('notifications').insert([payload]);

        if (error) {
            console.error(error);
            showToast('Failed to send notification', 'error');
        } else {
            showToast('Notification sent successfully', 'success');
            setFormData(prev => ({ ...prev, title: '', message: '' })); // Reset content
        }
        setLoading(false);
    };

    return (
        <div className="max-w-2xl mx-auto space-y-6">
            <div className="text-center mb-8">
                <div className="w-16 h-16 bg-primary/10 text-primary rounded-full flex items-center justify-center mx-auto mb-4">
                    <Bell className="w-8 h-8" />
                </div>
                <h2 className="text-2xl font-bold text-gray-900">Push Notification</h2>
                <p className="text-gray-500">Send announcements or alerts to your users.</p>
            </div>

            <form onSubmit={handleSubmit} className="bg-white p-8 rounded-2xl border border-gray-100 shadow-sm space-y-6">
                <div className="grid md:grid-cols-2 gap-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Notification Type</label>
                        <select
                            className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-primary/20 outline-none"
                            value={formData.type}
                            onChange={e => setFormData({ ...formData, type: e.target.value })}
                        >
                            <option value="info">Information (Blue)</option>
                            <option value="success">Success (Green)</option>
                            <option value="warning">Warning (Yellow)</option>
                            <option value="error">Error (Red)</option>
                        </select>
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Target Audience</label>
                        <select
                            className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-primary/20 outline-none"
                            value={formData.target}
                            onChange={e => setFormData({ ...formData, target: e.target.value })}
                        >
                            <option value="all">Broadcast (All Users)</option>
                            <option value="specific">Specific User (UUID)</option>
                        </select>
                    </div>
                </div>

                {formData.target === 'specific' && (
                    <div className="animate-in fade-in slide-in-from-top-2">
                        <label className="block text-sm font-medium text-gray-700 mb-1">User UUID</label>
                        <input
                            required
                            type="text"
                            placeholder="e.g. 123e4567-e89b-12d3-a456-426614174000"
                            className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-primary/20 outline-none font-mono text-sm"
                            value={formData.user_id}
                            onChange={e => setFormData({ ...formData, user_id: e.target.value })}
                        />
                        <p className="text-xs text-gray-400 mt-1">Copy the ID from the Users tab.</p>
                    </div>
                )}

                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Title</label>
                    <input
                        required
                        type="text"
                        placeholder="e.g. Summer Sale is Live!"
                        className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-primary/20 outline-none"
                        value={formData.title}
                        onChange={e => setFormData({ ...formData, title: e.target.value })}
                    />
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Message</label>
                    <textarea
                        required
                        rows={3}
                        placeholder="Your notification message..."
                        className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-primary/20 outline-none"
                        value={formData.message}
                        onChange={e => setFormData({ ...formData, message: e.target.value })}
                    />
                </div>

                <div className="pt-2">
                    <Button type="submit" className="w-full py-3" disabled={loading}>
                        {loading ? (
                            <><Loader2 className="w-4 h-4 animate-spin mr-2" /> Sending...</>
                        ) : (
                            <><Send className="w-4 h-4 mr-2" /> Send Notification</>
                        )}
                    </Button>
                </div>
            </form>
        </div>
    );
}
