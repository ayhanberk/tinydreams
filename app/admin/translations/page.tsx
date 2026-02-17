'use client';

import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import { useAuth } from '@/context/AuthContext';
import { Button } from '@/components/ui/Button';
import { Loader2, Plus, Download, Upload, Trash2, Edit2, Save, X, Search } from 'lucide-react';
import { motion } from 'framer-motion';

interface Translation {
    id: string;
    locale: string;
    namespace: string;
    key: string;
    value: string;
}

interface Language {
    code: string;
    name: string;
    flag: string;
}

export default function AdminTranslations() {
    const { profile } = useAuth();
    const [translations, setTranslations] = useState<Translation[]>([]);
    const [languages, setLanguages] = useState<Language[]>([]);
    const [loading, setLoading] = useState(true);
    const [selectedLocale, setSelectedLocale] = useState('en');
    const [searchQuery, setSearchQuery] = useState('');

    // Edit/Add State
    const [editingId, setEditingId] = useState<string | null>(null);
    const [editValue, setEditValue] = useState('');
    const [isAdding, setIsAdding] = useState(false);
    const [newTrans, setNewTrans] = useState({ namespace: '', key: '', value: '' });

    const fetchLanguages = async () => {
        const { data } = await supabase.from('supported_languages').select('*');
        if (data) setLanguages(data);
    };

    const fetchTranslations = async () => {
        setLoading(true);
        const { data } = await supabase
            .from('translations')
            .select('*')
            .eq('locale', selectedLocale)
            .order('namespace', { ascending: true });

        if (data) setTranslations(data);
        setLoading(false);
    };

    /* eslint-disable react-hooks/set-state-in-effect, react-hooks/exhaustive-deps */
    useEffect(() => {
        if (profile?.role === 'admin') {
            fetchLanguages();
            fetchTranslations();
        }
    }, [profile, selectedLocale]);
    /* eslint-enable react-hooks/set-state-in-effect, react-hooks/exhaustive-deps */

    const handleUpdate = async (id: string) => {
        const { error } = await supabase
            .from('translations')
            .update({ value: editValue })
            .eq('id', id);

        if (!error) {
            setTranslations(prev => prev.map(t => t.id === id ? { ...t, value: editValue } : t));
            setEditingId(null);
        } else {
            alert('Failed to update: ' + error.message);
        }
    };

    const handleDelete = async (id: string) => {
        if (!confirm('Are you sure?')) return;
        const { error } = await supabase.from('translations').delete().eq('id', id);
        if (!error) {
            setTranslations(prev => prev.filter(t => t.id !== id));
        }
    };

    const handleAdd = async () => {
        const { key, value } = newTrans;
        if (!key || !value) return;
        const { data, error } = await supabase
            .from('translations')
            .insert([{
                locale: selectedLocale,
                namespace: newTrans.namespace,
                key: newTrans.key,
                value: newTrans.value
            }])
            .select()
            .single();

        if (data) {
            setTranslations(prev => [...prev, data]);
            setIsAdding(false);
            setNewTrans({ namespace: '', key: '', value: '' });
        } else if (error) {
            alert('Error adding translation: ' + error.message);
        }
    };

    // CSV Export
    const handleExportCSV = () => {
        const headers = ['namespace,key,value'];
        const rows = translations.map(t => `${t.namespace},${t.key},"${t.value.replace(/"/g, '""')}"`);
        const csvContent = headers.concat(rows).join('\n');

        const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
        const url = URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.setAttribute('download', `translations_${selectedLocale}.csv`);
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    };

    // CSV Import
    const handleImportCSV = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        const reader = new FileReader();
        reader.onload = async (event) => {
            const text = event.target?.result as string;
            const lines = text.split('\n');
            // Skip header
            const rows = lines.slice(1).filter(line => line.trim() !== '');

            let successCount = 0;
            let failCount = 0;

            for (const row of rows) {
                // Simple CSV parser logic (handles basic quotes)
                // const parts = row.match(/(".*?"|[^",\s]+)(?=\s*,|\s*$)/g) || [];
                // const namespace = parts[0]?.replace(/^"|"$/g, '');

                // Proper split by comma respecting quotes is harder, let's assume simple format for now or use library
                // Simpler split for Prototype:
                const [ns, k, ...vParts] = row.split(',');
                const val = vParts.join(',').replace(/^"|"$/g, '').replace(/""/g, '"');

                if (ns && k && val) {
                    const { error } = await supabase
                        .from('translations')
                        .upsert({
                            locale: selectedLocale,
                            namespace: ns.trim(),
                            key: k.trim(),
                            value: val.trim()
                        }, { onConflict: 'locale,namespace,key' });

                    if (!error) successCount++;
                    else failCount++;
                }
            }

            alert(`Import finished: ${successCount} imported, ${failCount} failed.`);
            fetchTranslations();
        };
        reader.readAsText(file);
    };

    const filteredTranslations = translations.filter(t =>
        t.key.toLowerCase().includes(searchQuery.toLowerCase()) ||
        t.value.toLowerCase().includes(searchQuery.toLowerCase()) ||
        t.namespace.toLowerCase().includes(searchQuery.toLowerCase())
    );

    if (profile?.role !== 'admin') return <div className="p-8">Access Denied</div>;

    return (
        <div className="p-8 max-w-7xl mx-auto">
            <div className="flex flex-col md:flex-row justify-between items-center mb-8 gap-4">
                <div>
                    <h1 className="text-3xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
                        Translation Manager
                    </h1>
                    <p className="text-gray-500 mt-1">Manage languages and text resources</p>
                </div>

                <div className="flex items-center gap-3 bg-white p-2 rounded-lg shadow-sm border border-gray-100">
                    <span className="text-sm font-medium text-gray-500 pl-2">Locale:</span>
                    <select
                        value={selectedLocale}
                        onChange={(e) => setSelectedLocale(e.target.value)}
                        className="bg-gray-50 border border-gray-200 rounded-md px-3 py-1.5 text-sm outline-none focus:ring-2 focus:ring-primary"
                    >
                        {languages.map(l => (
                            <option key={l.code} value={l.code}>{l.flag} {l.name}</option>
                        ))}
                    </select>
                </div>
            </div>

            {/* Actions Bar */}
            <div className="flex flex-wrap gap-4 mb-6 justify-between items-center">
                <div className="relative">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                    <input
                        type="text"
                        placeholder="Search keys or values..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="pl-9 pr-4 py-2 border border-gray-200 rounded-lg text-sm w-64 focus:outline-none focus:ring-2 focus:ring-primary"
                    />
                </div>

                <div className="flex gap-2">
                    <Button variant="outline" onClick={handleExportCSV} className="gap-2">
                        <Download className="w-4 h-4" /> Export CSV
                    </Button>
                    <div className="relative">
                        <input
                            type="file"
                            accept=".csv"
                            onChange={handleImportCSV}
                            className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                        />
                        <Button variant="secondary" className="gap-2">
                            <Upload className="w-4 h-4" /> Import CSV
                        </Button>
                    </div>
                    <Button onClick={() => setIsAdding(true)} className="gap-2">
                        <Plus className="w-4 h-4" /> Add New
                    </Button>
                </div>
            </div>

            {/* Add New Modal / Form area */}
            {isAdding && (
                <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    className="bg-gray-50 border border-gray-200 rounded-xl p-4 mb-6"
                >
                    <h3 className="font-semibold mb-3">Add New Translation ({selectedLocale})</h3>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-3">
                        <input
                            placeholder="Namespace (e.g. nav)"
                            className="border p-2 rounded"
                            value={newTrans.namespace}
                            onChange={e => setNewTrans({ ...newTrans, namespace: e.target.value })}
                        />
                        <input
                            placeholder="Key (e.g. home)"
                            className="border p-2 rounded"
                            value={newTrans.key}
                            onChange={e => setNewTrans({ ...newTrans, key: e.target.value })}
                        />
                        <input
                            placeholder="Value (e.g. Home)"
                            className="border p-2 rounded"
                            value={newTrans.value}
                            onChange={e => setNewTrans({ ...newTrans, value: e.target.value })}
                        />
                    </div>
                    <div className="flex justify-end gap-2">
                        <Button variant="ghost" onClick={() => setIsAdding(false)} size="sm">Cancel</Button>
                        <Button onClick={handleAdd} size="sm">Save</Button>
                    </div>
                </motion.div>
            )}

            {/* Translations Table */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
                <table className="w-full text-left border-collapse">
                    <thead className="bg-gray-50 border-b border-gray-100 text-xs text-gray-500 uppercase">
                        <tr>
                            <th className="p-4">Namespace</th>
                            <th className="p-4">Key</th>
                            <th className="p-4">Value ({selectedLocale})</th>
                            <th className="p-4">Actions</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100 text-sm">
                        {loading ? (
                            <tr><td colSpan={4} className="p-8 text-center text-gray-500"><Loader2 className="w-6 h-6 animate-spin mx-auto mb-2" />Loading translations...</td></tr>
                        ) : filteredTranslations.length === 0 ? (
                            <tr><td colSpan={4} className="p-8 text-center text-gray-500">No translations found.</td></tr>
                        ) : (
                            filteredTranslations.map(t => (
                                <tr key={t.id} className="hover:bg-gray-50/50">
                                    <td className="p-4 text-gray-500 font-mono text-xs">{t.namespace}</td>
                                    <td className="p-4 font-medium text-gray-700">{t.key}</td>
                                    <td className="p-4">
                                        {editingId === t.id ? (
                                            <div className="flex gap-2">
                                                <input
                                                    className="border border-primary rounded px-2 py-1 w-full"
                                                    value={editValue}
                                                    onChange={e => setEditValue(e.target.value)}
                                                    autoFocus
                                                />
                                                <button onClick={() => handleUpdate(t.id)} className="text-green-600 hover:bg-green-50 p-1 rounded"><Save className="w-4 h-4" /></button>
                                                <button onClick={() => setEditingId(null)} className="text-gray-400 hover:bg-gray-100 p-1 rounded"><X className="w-4 h-4" /></button>
                                            </div>
                                        ) : (
                                            <span className="text-gray-600">{t.value}</span>
                                        )}
                                    </td>
                                    <td className="p-4">
                                        {editingId !== t.id && (
                                            <div className="flex items-center gap-2">
                                                <button
                                                    onClick={() => { setEditingId(t.id); setEditValue(t.value); }}
                                                    className="p-1.5 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                                                >
                                                    <Edit2 className="w-4 h-4" />
                                                </button>
                                                <button
                                                    onClick={() => handleDelete(t.id)}
                                                    className="p-1.5 text-red-400 hover:bg-red-50 hover:text-red-600 rounded-lg transition-colors"
                                                >
                                                    <Trash2 className="w-4 h-4" />
                                                </button>
                                            </div>
                                        )}
                                    </td>
                                </tr>
                            ))
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
}
