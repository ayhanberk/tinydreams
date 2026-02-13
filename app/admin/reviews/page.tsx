import { getAllReviewsAdmin } from '@/actions/reviews';
import { CheckCircle, XCircle, Trash2, Star, MessageSquare } from 'lucide-react';
import ReviewActions from '@/components/admin/ReviewActions'; // Client component for actions

export default async function AdminReviewsPage() {
    const reviews = await getAllReviewsAdmin();

    return (
        <div className="space-y-6">
            <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 mb-6">
                <h1 className="text-2xl font-bold text-gray-900">Review Moderation</h1>
                <p className="text-gray-500">Approve or remove customer reviews.</p>
            </div>

            <div className="space-y-4">
                {reviews.length === 0 ? (
                    <div className="text-center py-12 bg-gray-50 rounded-2xl border border-dashed border-gray-200">
                        <MessageSquare className="w-10 h-10 text-gray-300 mx-auto mb-2" />
                        <p className="text-gray-500">No reviews found.</p>
                    </div>
                ) : (
                    reviews.map((review: any) => (
                        <div key={review.id} className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex flex-col md:flex-row gap-6">
                            <div className="flex-1 space-y-3">
                                <div className="flex items-center justify-between">
                                    <h3 className="font-bold text-gray-900">
                                        {review.products?.title || 'Unknown Product'}
                                    </h3>
                                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${review.is_approved ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'
                                        }`}>
                                        {review.is_approved ? 'Approved' : 'Pending'}
                                    </span>
                                </div>

                                <div className="flex items-center gap-2 text-sm text-gray-500">
                                    <span className="font-medium text-gray-900">{review.profile?.full_name || 'Anonymous'}</span>
                                    <span>•</span>
                                    <span>{new Date(review.created_at).toLocaleDateString()}</span>
                                </div>

                                <div className="flex text-yellow-400">
                                    {[...Array(5)].map((_, i) => (
                                        <Star key={i} className={`w-4 h-4 ${i < review.rating ? 'fill-current' : 'text-gray-200'}`} />
                                    ))}
                                </div>

                                <p className="text-gray-600 bg-gray-50 p-3 rounded-lg border border-gray-100 italic">
                                    "{review.comment}"
                                </p>
                            </div>

                            <div className="flex md:flex-col justify-center gap-2 border-t md:border-t-0 md:border-l border-gray-100 pt-4 md:pt-0 md:pl-6 min-w-[140px]">
                                <ReviewActions
                                    reviewId={review.id}
                                    isApproved={review.is_approved}
                                />
                            </div>
                        </div>
                    ))
                )}
            </div>
        </div>
    );
}
