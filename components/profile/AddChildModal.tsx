'use client';

import { useState } from 'react';
import { X, Calendar, Baby, Heart } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { supabase } from '@/lib/supabase';
import { useToast } from '@/context/ToastContext';
import { useAuth } from '@/context/AuthContext';

interface AddChildModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSuccess: () => void;
}

export default function AddChildModal({ isOpen, onClose, onSuccess }: AddChildModalProps) {
    const { user } = useAuth();
    const { showToast } = useToast();
    const [loading, setLoading] = useState(false);
    const [formData, setFormData] = useState({
        name: '',
        birth_date: '',
        gender: 'neutral',
        relationship: 'Child'
    });

    if (!isOpen) return null;

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!user) return;

        setLoading(true);
        try {
            const { error } = await supabase
                .from('baby_profiles')
                .insert([
                    {
                        user_id: user.id,
                        name: formData.name,
                        birth_date: formData.birth_date,
                        gender: formData.gender,
                        relationship: formData.relationship
                    }
                ]);

            if (error) throw error;

            showToast('Profile added successfully!', 'success');
            onSuccess();
            onClose();
        } catch (error: unknown) {
            console.error('Error adding child:', error);
            showToast('Failed to add profile', 'error');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="fixed inset-0 bg-black/50 z-[100] flex items-center justify-center p-4 backdrop-blur-sm">
            <div className="bg-white rounded-2xl w-full max-w-md p-6 relative animate-in fade-in zoom-in duration-200">
                <button
                    onClick={onClose}
                    className="absolute top-4 right-4 p-2 hover:bg-gray-100 rounded-full transition-colors"
                >
                    <X className="w-5 h-5 text-gray-500" />
                </button>

                <div className="text-center mb-6">
                    <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4 text-primary">
                        <Baby className="w-8 h-8" />
                    </div>
                    <h2 className="text-2xl font-bold text-gray-900">Add Little One</h2>
                    <p className="text-gray-500 text-sm">We&apos;ll personalize your experience based on their age.</p>
                </div>

                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Name</label>
                        <div className="relative">
                            <input
                                type="text"
                                required
                                value={formData.name}
                                onChange={e => setFormData({ ...formData, name: e.target.value })}
                                className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-xl focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none"
                                placeholder="Baby's Name"
                            />
                            <Heart className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
                        </div>
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Birth Date</label>
                        <div className="relative">
                            <input
                                type="date"
                                required
                                value={formData.birth_date}
                                onChange={e => setFormData({ ...formData, birth_date: e.target.value })}
                                className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-xl focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none"
                            />
                            <Calendar className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
                        </div>
                        <p className="text-sm text-gray-500 mb-6">Add a profile for your child to get personalized recommendations. It&apos;s quick and easy!</p>
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Gender</label>
                        <div className="grid grid-cols-3 gap-2">
                            {['boy', 'girl', 'neutral'].map(g => (
                                <button
                                    key={g}
                                    type="button"
                                    onClick={() => setFormData({ ...formData, gender: g })}
                                    className={`py-2 rounded-xl text-sm font-medium border transition-all ${formData.gender === g
                                        ? 'bg-primary/10 border-primary text-primary'
                                        : 'border-gray-200 text-gray-600 hover:bg-gray-50'
                                        }`}
                                >
                                    {g.charAt(0).toUpperCase() + g.slice(1)}
                                </button>
                            ))}
                        </div>
                    </div>

                    <Button type="submit" className="w-full py-6 text-lg rounded-xl mt-4" disabled={loading}>
                        {loading ? 'Adding...' : 'Save Profile'}
                    </Button>
                </form>
            </div>
        </div>
    );
}
