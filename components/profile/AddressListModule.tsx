'use client';

import { deleteUserAddress } from '@/actions/profile';
import { useToast } from '@/context/ToastContext';
import { Trash2, CheckCircle, MapPin } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useState } from 'react';

export default function AddressListModule({ initialAddresses }: { initialAddresses: any[] }) {
    const { addToast } = useToast();
    const router = useRouter();
    const [deletingId, setDeletingId] = useState<string | null>(null);

    const handleDelete = async (id: string) => {
        if (!confirm('Are you sure you want to delete this address?')) return;
        setDeletingId(id);
        try {
            await deleteUserAddress(id);
            addToast('Address deleted', 'success');
            router.refresh(); // Refresh to update list
        } catch (error) {
            console.error(error);
            addToast('Failed to delete address', 'error');
        } finally {
            setDeletingId(null);
        }
    };

    return (
        <div className="space-y-4">
            {initialAddresses.map((address) => (
                <div
                    key={address.id}
                    className={`bg-white p-5 rounded-xl border relative group transition-all ${address.is_default ? 'border-primary ring-1 ring-primary/20' : 'border-gray-100 hover:border-gray-300'}`}
                >
                    <div className="flex justify-between items-start">
                        <div className="flex items-center gap-2 mb-2">
                            <span className="font-semibold text-gray-900">{address.title}</span>
                            {address.is_default && (
                                <span className="flex items-center gap-1 text-[10px] uppercase font-bold tracking-wider text-primary bg-primary/10 px-2 py-0.5 rounded-full">
                                    <CheckCircle className="w-3 h-3" /> Default
                                </span>
                            )}
                        </div>
                        <button
                            onClick={() => handleDelete(address.id)}
                            disabled={deletingId === address.id}
                            className="text-gray-400 hover:text-red-500 transition-colors p-1"
                            title="Delete Address"
                        >
                            <Trash2 className="w-4 h-4" />
                        </button>
                    </div>

                    <div className="text-sm text-gray-600 space-y-0.5">
                        <p className="font-medium text-gray-800">{address.full_name}</p>
                        <p>{address.address_line1}</p>
                        {address.address_line2 && <p>{address.address_line2}</p>}
                        <p>{address.city}, {address.state} {address.zip_code}</p>
                        <p>{address.country}</p>
                        {address.phone_number && <p className="mt-2 text-xs text-gray-500">Phone: {address.phone_number}</p>}
                    </div>
                </div>
            ))}
        </div>
    );
}
