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

    // Matrix CSV Export
    const handleExportCSV = async () => {
        setLoading(true);
        // Fetch ALL translations to export them all
        const { data: allTrans } = await supabase.from('translations').select('*');
        const { data: allLangs } = await supabase.from('supported_languages').select('code').order('code');

        if (!allTrans || !allLangs) {
            alert("Failed to fetch translations for export.");
            setLoading(false);
            return;
        }

        const langCodes = allLangs.map(l => l.code);
        const grouped = {} as Record<string, Record<string, string>>;

        for (const t of allTrans) {
            const path = `${t.namespace}.${t.key}`;
            if (!grouped[path]) grouped[path] = {};
            // Encode value for CSV (escape double quotes)
            let val = t.value || "";
            val = val.replace(/"/g, '""');
            if (val.includes(',') || val.includes('"') || val.includes('\n')) {
                val = `"${val}"`;
            }
            grouped[path][t.locale] = val;
        }

        const headers = ['namespace', 'key', ...langCodes].join(',');
        const sortedKeys = Object.keys(grouped).sort();

        const rows = sortedKeys.map(fullKey => {
            const [namespace, key] = fullKey.split('.');
            let row = `${namespace},${key}`;
            for (const code of langCodes) {
                row += `,${grouped[fullKey][code] || ""}`;
            }
            return row;
        });

        const csvContent = [headers, ...rows].join('\n');
        const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
        const url = URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.setAttribute('download', `translations_all.csv`);
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        setLoading(false);
    };

    // Matrix CSV Parser Helper
    const parseCSV = (text: string) => {
        const rows = [];
        let currentRow = [];
        let currentCell = '';
        let inQuotes = false;
        for (let i = 0; i < text.length; i++) {
            const char = text[i];
            const nextChar = text[i + 1];
            if (char === '"') {
                if (inQuotes && nextChar === '"') {
                    currentCell += '"';
                    i++;
                } else {
                    inQuotes = !inQuotes;
                }
            } else if (char === ',' && !inQuotes) {
                currentRow.push(currentCell.trim());
                currentCell = '';
            } else if ((char === '\n' || char === '\r') && !inQuotes) {
                if (char === '\r' && nextChar === '\n') i++;
                currentRow.push(currentCell.trim());
                if (currentRow.some(c => c !== '')) rows.push(currentRow);
                currentRow = [];
                currentCell = '';
            } else {
                currentCell += char;
            }
        }
        if (currentCell || currentRow.length > 0) {
            currentRow.push(currentCell.trim());
            rows.push(currentRow);
        }
        return rows;
    };

    // Matrix CSV Import
    const handleImportCSV = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        setLoading(true);
        const reader = new FileReader();
        reader.onload = async (event) => {
            const text = event.target?.result as string;
            const rows = parseCSV(text);

            if (rows.length < 2) {
                alert("Invalid or empty CSV.");
                setLoading(false);
                return;
            }

            const header = rows[0]; // [namespace, key, en, tr, de...]
            const csvLanguageCodes = header.slice(2);

            // Check for new languages and insert them
            const existingCodes = languages.map(l => l.code);
            for (const csvCode of csvLanguageCodes) {
                if (!existingCodes.includes(csvCode) && csvCode.trim() !== '') {
                    // It's a brand new language!
                    console.log("New language detected:", csvCode);
                    await supabase.from('supported_languages').upsert({
                        code: csvCode.trim().toLowerCase(),
                        name: csvCode.trim().toUpperCase(),
                        flag: '🌐', // Generic flag for automatically added languages
                        is_default: false
                    }, { onConflict: 'code' });
                }
            }

            let successCount = 0;
            let failCount = 0;

            // Start from row 1 (ignore header)
            for (let i = 1; i < rows.length; i++) {
                const row = rows[i];
                const namespace = row[0];
                const key = row[1];
                if (!namespace || !key) continue;

                for (let c = 0; c < csvLanguageCodes.length; c++) {
                    const locale = csvLanguageCodes[c];
                    const value = row[2 + c];

                    if (value !== undefined && value !== '') {
                        const { error } = await supabase.from('translations').upsert({
                            locale: locale.trim(),
                            namespace: namespace.trim(),
                            key: key.trim(),
                            value: value.trim()
                        }, { onConflict: 'locale,namespace,key' });

                        if (!error) successCount++;
                        else failCount++;
                    }
                }
            }

            // Reset file input
            e.target.value = '';
            alert(`Import finished: ${successCount} imported, ${failCount} failed.`);
            fetchLanguages(); // Refresh languages array in case new ones were added
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
                    <p className="text-gray-500 mt-1">Manage all text resources across languages via CSV</p>
                </div>

                <div className="flex items-center gap-3 bg-white p-2 rounded-lg shadow-sm border border-gray-100">
                    <span className="text-sm font-medium text-gray-500 pl-2">View Locale:</span>
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
            <div className="flex flex-wrap gap-4 mb-6 justify-between items-center bg-blue-50/50 p-4 border border-blue-100 rounded-xl">
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

                <div className="flex gap-3">
                    <div className="flex gap-2 border-r border-gray-200 pr-3 mr-1">
                        <Button variant="outline" onClick={handleExportCSV} className="gap-2 bg-white hover:bg-gray-50 shadow-sm">
                            <Download className="w-4 h-4" /> Export All (CSV)
                        </Button>
                        <div className="relative group overflow-hidden">
                            <input
                                type="file"
                                accept=".csv"
                                onChange={handleImportCSV}
                                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
                                title="Import an edited translation CSV"
                            />
                            <Button variant="secondary" className="gap-2 shadow-sm pointer-events-none">
                                <Upload className="w-4 h-4" /> Import CSV
                            </Button>
                        </div>
                    </div>
                    <Button onClick={() => setIsAdding(true)} className="gap-2 shadow-sm">
                        <Plus className="w-4 h-4" /> Single Key
                    </Button>
                </div>
            </div>

            {/* Add New Modal / Form area */}
            {isAdding && (
                <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    className="bg-white border border-gray-200 shadow-md rounded-xl p-6 mb-6"
                >
                    <h3 className="font-semibold mb-3 text-lg text-gray-800">Add New Translation ({selectedLocale})</h3>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                        <input
                            placeholder="Namespace (e.g. hero)"
                            className="border border-gray-200 px-3 py-2 rounded focus:ring-2 focus:ring-primary/20 outline-none"
                            value={newTrans.namespace}
                            onChange={e => setNewTrans({ ...newTrans, namespace: e.target.value })}
                        />
                        <input
                            placeholder="Key (e.g. title)"
                            className="border border-gray-200 px-3 py-2 rounded focus:ring-2 focus:ring-primary/20 outline-none"
                            value={newTrans.key}
                            onChange={e => setNewTrans({ ...newTrans, key: e.target.value })}
                        />
                        <input
                            placeholder="Value (e.g. Welcome)"
                            className="border border-gray-200 px-3 py-2 rounded focus:ring-2 focus:ring-primary/20 outline-none"
                            value={newTrans.value}
                            onChange={e => setNewTrans({ ...newTrans, value: e.target.value })}
                        />
                    </div>
                    <div className="flex justify-end gap-3 pt-2 border-t border-gray-100">
                        <Button variant="ghost" onClick={() => setIsAdding(false)}>Cancel</Button>
                        <Button onClick={handleAdd}>Save to {selectedLocale.toUpperCase()}</Button>
                    </div>
                </motion.div>
            )}

            {/* Translations Table */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
                <table className="w-full text-left border-collapse">
                    <thead className="bg-gray-50 border-b border-gray-200 text-xs font-semibold text-gray-500 uppercase tracking-wider">
                        <tr>
                            <th className="p-4 px-6 w-3/12">Namespace</th>
                            <th className="p-4 w-3/12">Key</th>
                            <th className="p-4 w-4/12">Value ({selectedLocale.toUpperCase()})</th>
                            <th className="p-4 w-2/12 text-right">Actions</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100 text-sm">
                        {loading ? (
                            <tr><td colSpan={4} className="p-12 text-center text-gray-500"><Loader2 className="w-8 h-8 animate-spin mx-auto mb-4 text-primary" />Loading translations database...</td></tr>
                        ) : filteredTranslations.length === 0 ? (
                            <tr><td colSpan={4} className="p-12 text-center text-gray-500">No translations found for this locale.</td></tr>
                        ) : (
                            filteredTranslations.map(t => (
                                <tr key={t.id} className="hover:bg-gray-50/70 transition-colors">
                                    <td className="p-4 px-6 text-gray-400 font-mono text-xs"><span className="bg-gray-100 px-2 py-1 rounded">{t.namespace}</span></td>
                                    <td className="p-4 font-medium text-gray-800">{t.key}</td>
                                    <td className="p-4">
                                        {editingId === t.id ? (
                                            <div className="flex gap-2 w-full">
                                                <input
                                                    className="border border-primary rounded-md px-3 py-1.5 w-full bg-white shadow-sm focus:outline-none focus:ring-1 focus:ring-primary"
                                                    value={editValue}
                                                    onChange={e => setEditValue(e.target.value)}
                                                    autoFocus
                                                />
                                                <button onClick={() => handleUpdate(t.id)} className="text-white bg-green-500 hover:bg-green-600 p-1.5 rounded-md shadow-sm transition-colors"><Save className="w-4 h-4" /></button>
                                                <button onClick={() => setEditingId(null)} className="text-gray-500 bg-gray-100 hover:bg-gray-200 p-1.5 rounded-md shadow-sm transition-colors"><X className="w-4 h-4" /></button>
                                            </div>
                                        ) : (
                                            <span className="text-gray-600 line-clamp-2" title={t.value}>{t.value}</span>
                                        )}
                                    </td>
                                    <td className="p-4">
                                        {editingId !== t.id && (
                                            <div className="flex items-center justify-end gap-2 pr-2">
                                                <button
                                                    onClick={() => { setEditingId(t.id); setEditValue(t.value); }}
                                                    className="p-1.5 text-blue-600 bg-blue-50/50 hover:bg-blue-100 rounded-lg transition-colors border border-blue-100/50"
                                                    title="Edit"
                                                >
                                                    <Edit2 className="w-4 h-4" />
                                                </button>
                                                <button
                                                    onClick={() => handleDelete(t.id)}
                                                    className="p-1.5 text-red-500 bg-red-50/50 hover:bg-red-100 rounded-lg transition-colors border border-red-100/50"
                                                    title="Delete"
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
