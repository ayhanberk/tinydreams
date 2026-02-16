'use client';

import { useState, useEffect } from 'react';
import { getBabyProfiles, deleteBabyProfile } from '@/actions/family';
import { Button } from '@/components/ui/Button';
import { Plus, Trash2, Baby } from 'lucide-react';
import { useToast } from '@/context/ToastContext';
import { BabyProfileForm } from '@/components/profile/BabyProfileForm';

export default function FamilyPage() {
    const [profiles, setProfiles] = useState<any[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [isFormOpen, setIsFormOpen] = useState(false);
    const [editingProfile, setEditingProfile] = useState<any>(null);
    const { showToast } = useToast();

    useEffect(() => {
        loadProfiles();
    }, []);

    async function loadProfiles() {
        try {
            const data = await getBabyProfiles();
            setProfiles(data);
        } catch (error) {
            console.error(error);
            showToast('Failed to load profiles', 'error');
        } finally {
            setIsLoading(false);
        }
    }

    async function handleDelete(id: string) {
        if (!confirm('Are you sure?')) return;
        try {
            await deleteBabyProfile(id);
            setProfiles(profiles.filter(p => p.id !== id));
            showToast('Profile deleted', 'success');
        } catch (error) {
            showToast('Failed to delete profile', 'error');
        }
    }

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <h1 className="text-2xl font-bold font-heading text-gray-900">My Family</h1>
                <Button onClick={() => { setEditingProfile(null); setIsFormOpen(true); }}>
                    <Plus className="w-4 h-4 mr-2" />
                    Add Child
                </Button>
            </div>

            {isLoading ? (
                <div>Loading...</div>
            ) : profiles.length === 0 ? (
                <div className="text-center py-12 bg-gray-50 rounded-2xl border border-dashed border-gray-200">
                    <Baby className="w-12 h-12 text-gray-300 mx-auto mb-4" />
                    <h3 className="text-lg font-medium text-gray-900">No profiles yet</h3>
                    <p className="text-gray-500 mb-6">Add your little ones to get personalized recommendations.</p>
                    <Button onClick={() => setIsFormOpen(true)}>Add Child</Button>
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {profiles.map((profile) => (
                        <div key={profile.id} className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 flex justify-between items-start">
                            <div>
                                <h3 className="text-lg font-bold text-gray-900">{profile.name}</h3>
                                <p className="text-sm text-gray-500">Born: {new Date(profile.birth_date).toLocaleDateString()}</p>
                                <p className="text-xs text-gray-400 mt-1 capitalize">{profile.gender} • {profile.relationship}</p>
                            </div>
                            <div className="flex gap-2">
                                <button
                                    onClick={() => { setEditingProfile(profile); setIsFormOpen(true); }}
                                    className="p-2 text-gray-400 hover:text-blue-500 transition-colors"
                                >
                                    Edit
                                </button>
                                <button
                                    onClick={() => handleDelete(profile.id)}
                                    className="p-2 text-gray-400 hover:text-red-500 transition-colors"
                                >
                                    <Trash2 className="w-4 h-4" />
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            )}

            {isFormOpen && (
                <BabyProfileForm
                    isOpen={isFormOpen}
                    onClose={() => { setIsFormOpen(false); loadProfiles(); }}
                    initialData={editingProfile}
                />
            )}
        </div>
    );
}
