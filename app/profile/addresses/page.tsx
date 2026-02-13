import { getUserAddresses, deleteUserAddress } from '@/actions/profile';
import AddressForm from '@/components/profile/AddressForm';
import AddressListModule from '@/components/profile/AddressListModule'; // Client component for list to handle mutations if needed, or just server render + client delete buttons
import { MapPin } from 'lucide-react';

export default async function AddressesPage() {
    const addresses = await getUserAddresses();

    return (
        <div className="space-y-8">
            <h1 className="text-2xl font-bold text-gray-900">My Addresses</h1>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* List of Addresses */}
                <div className="space-y-4">
                    <h2 className="text-lg font-semibold text-gray-800">Saved Addresses</h2>
                    {addresses.length === 0 ? (
                        <p className="text-gray-500 italic">No addresses saved yet.</p>
                    ) : (
                        <AddressListModule initialAddresses={addresses} />
                    )}
                </div>

                {/* Add New Address Form */}
                <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 h-fit">
                    <div className="flex items-center gap-3 mb-6">
                        <div className="p-2 bg-purple-50 rounded-lg">
                            <MapPin className="w-5 h-5 text-purple-500" />
                        </div>
                        <h2 className="text-lg font-semibold text-gray-800">Add New Address</h2>
                    </div>
                    <AddressFormClientWrapper />
                </div>
            </div>
        </div>
    );
}

// Client wrapper for the form to handle onSuccess/refresh if needed
// Actually, easier to put AddressListModule and AddressForm in separate files.
// Let's rely on server actions revalidating path for now.
import AddressFormClientWrapper from '@/components/profile/AddressFormClientWrapper';
