'use client';

import { useState } from 'react';
import { addUserAddress } from '@/actions/profile';
import { useToast } from '@/context/ToastContext';
import { Loader2, Plus } from 'lucide-react';

export default function AddressForm({ onSuccess }: { onSuccess: () => void }) {
    const [isLoading, setIsLoading] = useState(false);
    const { addToast } = useToast();
    const [formData, setFormData] = useState({
        title: '',
        full_name: '',
        address_line1: '',
        address_line2: '',
        city: '',
        state: '',
        zip_code: '',
        country: '',
        phone_number: '',
        is_default: false
    });

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value, type } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: type === 'checkbox' ? (e.target as HTMLInputElement).checked : value
        }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);

        try {
            await addUserAddress(formData);
            addToast('Address added successfully', 'success');
            setFormData({
                title: '',
                full_name: '',
                address_line1: '',
                address_line2: '',
                city: '',
                state: '',
                zip_code: '',
                country: '',
                phone_number: '',
                is_default: false
            });
            onSuccess();
        } catch (error: unknown) {
            console.error(error);
            addToast(error instanceof Error ? error.message : 'Failed to add address', 'error');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <input
                    type="text"
                    name="title"
                    placeholder="Address Title (e.g. Home)"
                    value={formData.title}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-2 border border-gray-200 rounded-xl focus:ring-2 focus:ring-primary focus:border-transparent outline-none"
                />
                <input
                    type="text"
                    name="full_name"
                    placeholder="Full Name"
                    value={formData.full_name}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-2 border border-gray-200 rounded-xl focus:ring-2 focus:ring-primary focus:border-transparent outline-none"
                />
            </div>

            <input
                type="text"
                name="address_line1"
                placeholder="Address Line 1"
                value={formData.address_line1}
                onChange={handleChange}
                required
                className="w-full px-4 py-2 border border-gray-200 rounded-xl focus:ring-2 focus:ring-primary focus:border-transparent outline-none"
            />

            <input
                type="text"
                name="address_line2"
                placeholder="Address Line 2 (Optional)"
                value={formData.address_line2}
                onChange={handleChange}
                className="w-full px-4 py-2 border border-gray-200 rounded-xl focus:ring-2 focus:ring-primary focus:border-transparent outline-none"
            />

            <div className="grid grid-cols-2 gap-4">
                <input
                    type="text"
                    name="city"
                    placeholder="City"
                    value={formData.city}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-2 border border-gray-200 rounded-xl focus:ring-2 focus:ring-primary focus:border-transparent outline-none"
                />
                <input
                    type="text"
                    name="state"
                    placeholder="State"
                    value={formData.state}
                    onChange={handleChange}
                    className="w-full px-4 py-2 border border-gray-200 rounded-xl focus:ring-2 focus:ring-primary focus:border-transparent outline-none"
                />
            </div>

            <div className="grid grid-cols-2 gap-4">
                <input
                    type="text"
                    name="zip_code"
                    placeholder="Zip Code"
                    value={formData.zip_code}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-2 border border-gray-200 rounded-xl focus:ring-2 focus:ring-primary focus:border-transparent outline-none"
                />
                <input
                    type="text"
                    name="country"
                    placeholder="Country"
                    value={formData.country}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-2 border border-gray-200 rounded-xl focus:ring-2 focus:ring-primary focus:border-transparent outline-none"
                />
            </div>

            <input
                type="tel"
                name="phone_number"
                placeholder="Phone Number"
                value={formData.phone_number}
                onChange={handleChange}
                className="w-full px-4 py-2 border border-gray-200 rounded-xl focus:ring-2 focus:ring-primary focus:border-transparent outline-none"
            />

            <div className="flex items-center gap-2">
                <input
                    type="checkbox"
                    id="is_default"
                    name="is_default"
                    checked={formData.is_default}
                    onChange={handleChange}
                    className="w-4 h-4 text-primary border-gray-300 rounded focus:ring-primary"
                />
                <label htmlFor="is_default" className="text-sm text-gray-700">Set as default address</label>
            </div>

            <button
                type="submit"
                disabled={isLoading}
                className="w-full flex items-center justify-center gap-2 px-6 py-3 bg-primary text-white rounded-xl hover:bg-primary/90 disabled:opacity-50 transition-colors font-medium shadow-lg shadow-primary/20"
            >
                {isLoading ? <Loader2 className="w-5 h-5 animate-spin" /> : <Plus className="w-5 h-5" />}
                Add Address
            </button>
        </form>
    );
}
