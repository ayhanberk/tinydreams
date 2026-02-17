'use client';

import React, { createContext, useContext, useEffect, useState } from 'react';
import { Session, User } from '@supabase/supabase-js';
import { supabase } from '@/lib/supabase';

interface Profile {
    id: string;
    email?: string;
    full_name?: string;
    avatar_url?: string;
    role?: string;
    [key: string]: unknown;
}

interface AuthContextType {
    user: User | null;
    session: Session | null;
    profile: Profile | null;
    loading: boolean;
    signOut: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
    const [user, setUser] = useState<User | null>(null);
    const [session, setSession] = useState<Session | null>(null);
    const [profile, setProfile] = useState<Profile | null>(null);
    const [loading, setLoading] = useState(true);

    const fetchProfile = async (userId: string) => {
        const { data, error } = await supabase
            .from('profiles')
            .select('*')
            .eq('id', userId)
            .single();
        if (!error && data) {
            setProfile(data);
        }
    };

    useEffect(() => {
        const setData = async () => {
            const { data: { session }, error } = await supabase.auth.getSession();
            if (error) throw error;
            setSession(session);
            setUser(session?.user ?? null);
            if (session?.user) {
                await fetchProfile(session.user.id);
            }
            setLoading(false);
        };

        const { data: listener } = supabase.auth.onAuthStateChange(async (_event, session) => {
            setSession(session);
            setUser(session?.user ?? null);
            if (session?.user) {
                await fetchProfile(session.user.id);
            } else {
                setProfile(null);
            }
            setLoading(false);
        });

        setData();

        return () => {
            listener.subscription.unsubscribe();
        };
    }, []);

    const signOut = async () => {
        await supabase.auth.signOut();
    };

    return (
        <AuthContext.Provider value={{ user, session, profile, loading, signOut }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
};
