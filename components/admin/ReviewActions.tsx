'use client';

import { useState } from 'react';
import { approveReview, deleteReview } from '@/actions/reviews';
import { Button } from '@/components/ui/Button';
import { Check, Trash2, Loader2 } from 'lucide-react';
import { useToast } from '@/context/ToastContext';
import { useRouter } from 'next/navigation';

interface ReviewActionsProps {
    reviewId: string;
    isApproved: boolean;
}

export default function ReviewActions({ reviewId, isApproved }: ReviewActionsProps) {
    const [loading, setLoading] = useState(false);
    const router = useRouter();
    const { showToast } = useToast();

    const handleApprove = async () => {
        setLoading(true);
        try {
            await approveReview(reviewId);
            showToast('Review approved', 'success');
            router.refresh(); // Refresh to update list
        } catch (error) {
            console.error(error);
            showToast('Failed to approve review', 'error');
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async () => {
        if (!confirm('Are you sure you want to delete this review?')) return;
        setLoading(true);
        try {
            await deleteReview(reviewId);
            showToast('Review deleted', 'success');
            router.refresh();
        } catch (error) {
            console.error(error);
            showToast('Failed to delete review', 'error');
        } finally {
            setLoading(false);
        }
    };

    return (
        <>
            {!isApproved && (
                <Button
                    onClick={handleApprove}
                    disabled={loading}
                    className="w-full bg-green-600 hover:bg-green-700 text-white flex gap-2 justify-center"
                    size="sm"
                >
                    {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <> <Check className="w-4 h-4" /> Approve </>}
                </Button>
            )}
            <Button
                onClick={handleDelete}
                disabled={loading}
                variant="outline"
                className="w-full text-red-600 hover:bg-red-50 hover:text-red-700 hover:border-red-200 flex gap-2 justify-center"
                size="sm"
            >
                {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <> <Trash2 className="w-4 h-4" /> Delete </>}
            </Button>
        </>
    );
}
