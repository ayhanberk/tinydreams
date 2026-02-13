'use client';

import AddressForm from '@/components/profile/AddressForm';
import { useRouter } from 'next/navigation';

export default function AddressFormClientWrapper() {
    const router = useRouter();

    return <AddressForm onSuccess={() => router.refresh()} />;
}
