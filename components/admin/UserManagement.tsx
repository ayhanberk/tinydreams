'use client';

/* eslint-disable @next/next/no-img-element */

import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import { Shield, ShieldOff, Search, Loader2 } from 'lucide-react';
import { useToast } from '@/context/ToastContext';

export default function UserManagement() {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const [users, setUsers] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [search, setSearch] = useState('');
    const { showToast } = useToast();

    const fetchUsers = async () => {
        setLoading(true);
        const { data, error } = await supabase
            .from('profiles')
            .select('*')
            .order('updated_at', { ascending: false }); // Changed from created_at based on error hint

        if (error) {
            console.error('Error fetching users:', error);
        } else {
            setUsers(data || []);
        }
        setLoading(false);
    };

    /* eslint-disable react-hooks/set-state-in-effect */
    useEffect(() => {
        fetchUsers();
    }, []);
    /* eslint-enable react-hooks/set-state-in-effect */

    const toggleRole = async (userId: string, currentRole: string) => {
        const newRole = currentRole === 'admin' ? 'user' : 'admin';

        // Optimistic update
        setUsers(users.map(u => u.id === userId ? { ...u, role: newRole } : u));

        const { error } = await supabase
            .from('profiles')
            .update({ role: newRole })
            .eq('id', userId);

        if (error) {
            console.error('Error updating role:', error);
            // Revert on error
            fetchUsers();
            showToast('Failed to update role', 'error');
        } else {
            showToast(`User role updated to ${newRole}`, 'success');
        }
    };

    const filteredUsers = users.filter(user =>
        (user.full_name?.toLowerCase() || '').includes(search.toLowerCase()) ||
        (user.username?.toLowerCase() || '').includes(search.toLowerCase())
    );

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <h2 className="text-2xl font-bold bg-gradient-to-r from-gray-800 to-gray-600 bg-clip-text text-transparent">User Management</h2>
                <div className="relative">
                    <Search className="w-4 h-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                    <input
                        type="text"
                        placeholder="Search users..."
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        className="pl-10 pr-4 py-2 border border-gray-200 rounded-xl focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none text-sm"
                    />
                </div>
            </div>

            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full">
                        <thead className="bg-gray-50 border-b border-gray-100">
                            <tr>
                                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">User</th>
                                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Role</th>
                                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100">
                            {loading ? (
                                <tr>
                                    <td colSpan={3} className="px-6 py-8 text-center text-gray-500">
                                        <div className="flex items-center justify-center gap-2">
                                            <Loader2 className="w-4 h-4 animate-spin" /> Loading users...
                                        </div>
                                    </td>
                                </tr>
                            ) : filteredUsers.length === 0 ? (
                                <tr>
                                    <td colSpan={3} className="px-6 py-8 text-center text-gray-500">No users found.</td>
                                </tr>
                            ) : (
                                filteredUsers.map((user) => (
                                    <tr key={user.id} className="hover:bg-gray-50/50 transition-colors">
                                        <td className="px-6 py-4">
                                            <div className="flex items-center">
                                                <div className="h-10 w-10 flex-shrink-0 bg-primary/10 rounded-full flex items-center justify-center text-primary font-bold overflow-hidden">
                                                    {user.avatar_url ? (
                                                        <img src={user.avatar_url} alt={user.full_name || 'User Avatar'} className="w-full h-full object-cover" />
                                                    ) : (
                                                        (user.full_name?.[0] || user.username?.[0] || 'U').toUpperCase()
                                                    )}
                                                </div>
                                                <div className="ml-4">
                                                    <div className="text-sm font-medium text-gray-900">{user.full_name || 'Unknown Name'}</div>
                                                    <div className="text-sm text-gray-500">@{user.username || 'unknown'}</div>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4">
                                            <span className={`px-3 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${user.role === 'admin'
                                                ? 'bg-purple-100 text-purple-800 border border-purple-200'
                                                : 'bg-green-100 text-green-800 border border-green-200'
                                                }`}>
                                                {user.role}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 text-sm text-gray-500">
                                            <button
                                                onClick={() => toggleRole(user.id, user.role)}
                                                className={`flex items-center gap-1 px-3 py-1.5 rounded-lg border transition-colors text-xs font-medium ${user.role === 'admin'
                                                    ? 'border-gray-200 text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                                                    : 'border-purple-200 text-purple-600 hover:bg-purple-50 hover:text-purple-700'
                                                    }`}
                                            >
                                                {user.role === 'admin' ? (
                                                    <><ShieldOff className="w-3 h-3" /> Demote</>
                                                ) : (
                                                    <><Shield className="w-3 h-3" /> Make Admin</>
                                                )}
                                            </button>
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}
