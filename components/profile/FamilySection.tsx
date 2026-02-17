'use client';

import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import { useAuth } from '@/context/AuthContext';
import { Plus, Gift, Calendar } from 'lucide-react';
import AddChildModal from './AddChildModal';
import { BabyProfile } from '@/types';
import { motion } from 'framer-motion';

export default function FamilySection() {
    const { user } = useAuth();
    const [profiles, setProfiles] = useState<BabyProfile[]>([]);
    const [loading, setLoading] = useState(true);
    const [isAddModalOpen, setIsAddModalOpen] = useState(false);

    const fetchProfiles = async () => {
        if (!user) return;
        setLoading(true);
        const { data, error } = await supabase
            .from('baby_profiles')
            .select('*')
            .eq('user_id', user.id)
            .order('birth_date', { ascending: false });

        if (!error && data) {
            setProfiles(data as BabyProfile[]);
        }
        setLoading(false);
    };

    /* eslint-disable react-hooks/set-state-in-effect, react-hooks/exhaustive-deps */
    useEffect(() => {
        fetchProfiles();
    }, [user]);
    /* eslint-enable react-hooks/set-state-in-effect, react-hooks/exhaustive-deps */

    const calculateAge = (birthDate: string) => {
        const today = new Date();
        const birth = new Date(birthDate);
        let months = (today.getFullYear() - birth.getFullYear()) * 12;
        months -= birth.getMonth();
        months += today.getMonth();

        if (months < 0) return 'Expecting';
        if (months === 0) return 'Newborn';
        if (months < 12) return `${months} months`;
        const years = Math.floor(months / 12);
        return `${years} year${years > 1 ? 's' : ''}`;
    };

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h2 className="text-2xl font-bold text-gray-900">My Family</h2>
                    <p className="text-gray-500">Manage profiles for personalized recommendations</p>
                </div>
                <button
                    onClick={() => setIsAddModalOpen(true)}
                    className="flex items-center gap-2 px-4 py-2 bg-primary/10 text-primary rounded-xl hover:bg-primary/20 transition-colors font-medium"
                >
                    <Plus className="w-4 h-4" />
                    Add Child
                </button>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
                {/* Profiles List */}
                {profiles.map((profile, index) => (
                    <motion.div
                        key={profile.id}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: index * 0.1 }}
                        className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm hover:shadow-md transition-shadow relative overflow-hidden group"
                    >
                        <div className={`absolute top-0 right-0 w-24 h-24 bg-gradient-to-br opacity-10 rounded-bl-full -mr-4 -mt-4 transition-transform group-hover:scale-110 
                            ${profile.gender === 'girl' ? 'from-pink-400 to-rose-500' :
                                profile.gender === 'boy' ? 'from-blue-400 to-cyan-500' :
                                    'from-yellow-400 to-orange-500'}`}
                        />

                        <div className="relative z-10">
                            <h3 className="text-xl font-bold text-gray-900 mb-1">{profile.name}</h3>
                            <div className="flex items-center gap-2 text-gray-500 text-sm mb-4">
                                <Calendar className="w-4 h-4" />
                                <span>{new Date(profile.birth_date).toLocaleDateString()}</span>
                            </div>

                            <div className="inline-flex items-center gap-2 px-3 py-1 bg-gray-50 rounded-lg text-sm font-medium text-gray-700">
                                <Gift className="w-4 h-4 text-primary" />
                                <span>{calculateAge(profile.birth_date)} old</span>
                            </div>
                        </div>
                    </motion.div>
                ))}

                {/* Empty State */}
                {!loading && profiles.length === 0 && (
                    <div className="col-span-full py-12 text-center bg-gray-50 rounded-2xl border border-dashed border-gray-200">
                        <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center mx-auto mb-4 shadow-sm">
                            <BabyProfileIcon className="w-8 h-8 text-gray-300" />
                        </div>
                        <h3 className="text-lg font-medium text-gray-900">No profiles yet</h3>
                        <p className="text-gray-500 mb-4">Add your children to get age-appropriate suggestions.</p>
                        <button
                            onClick={() => setIsAddModalOpen(true)}
                            className="text-primary font-medium hover:underline"
                        >
                            Add your first profile
                        </button>
                    </div>
                )}
            </div>

            <AddChildModal
                isOpen={isAddModalOpen}
                onClose={() => setIsAddModalOpen(false)}
                onSuccess={fetchProfiles}
            />
        </div>
    );
}

function BabyProfileIcon({ className }: { className?: string }) {
    return (
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
            <path d="M9 12h.01" /><path d="M15 12h.01" /><path d="M10 16c.5.5 1.5 1 2.5 1s2-.5 2.5-1" /><path d="M19 17a3 3 0 0 1-3 3H8a3 3 0 0 1-3-3V6a3 3 0 0 1 3-3h8a3 3 0 0 1 3 3v11Z" /><path d="M9 3v1a6 6 0 0 0 12 0V3" />
        </svg>
    )
}
