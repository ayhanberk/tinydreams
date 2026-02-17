'use client';

/* eslint-disable @next/next/no-img-element */

import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import { useAuth } from '@/context/AuthContext';
import { Button } from '@/components/ui/Button';
import StarRating from '@/components/ui/StarRating';
import { User, Loader2 } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface ReviewsProps {
    productId: string;
}

export default function Reviews({ productId }: ReviewsProps) {
    const { user } = useAuth();
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const [reviews, setReviews] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [showForm, setShowForm] = useState(false);
    const [newReview, setNewReview] = useState({ rating: 5, comment: '' });
    const [submitting, setSubmitting] = useState(false);

    const fetchReviews = async () => {
        setLoading(true);
        const { data, error } = await supabase
            .from('reviews')
            // Fetch reviews and join with profiles to get user name/avatar
            // Note: We need to ensure implicit join works or manually fetch profiles.
            // Assuming 'profiles' table has 'id' matching 'auth.users.id'
            // However, Supabase joins on auth.users are tricky. 
            // Phase 3 auto_create_profile.sql ensures public.profiles exists.
            // We need to alter reviews table to reference public.profiles instead of auth.users for easier joining, 
            // OR we just fetch profiles manually.
            // Let's try direct join if FK is set up correctly in Phase 5 migration?
            // "user_id uuid references auth.users" -> This links to auth. 
            // We should link to public.profiles for easier UI fetching.
            // But for now, let's just fetch reviews and then fetch profiles or use a view.
            // Simpler: Fetch reviews, then fetch profile names for those user_ids.
            .select('*')
            .eq('product_id', productId)
            .order('created_at', { ascending: false });

        if (error) {
            console.error('Error fetching reviews:', error);
        } else if (data) {
            const reviewsWithProfiles = await Promise.all(data.map(async (review) => {
                const { data: profile } = await supabase
                    .from('profiles')
                    .select('full_name, avatar_url')
                    .eq('id', review.user_id)
                    .single();
                return { ...review, profile };
            }));
            setReviews(reviewsWithProfiles);
        }
        setLoading(false);
    };

    /* eslint-disable react-hooks/set-state-in-effect, react-hooks/exhaustive-deps */
    useEffect(() => {
        fetchReviews();
    }, [productId]);
    /* eslint-enable react-hooks/set-state-in-effect, react-hooks/exhaustive-deps */

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!user) return;
        setSubmitting(true);

        const { error } = await supabase
            .from('reviews')
            .insert({
                user_id: user.id,
                product_id: productId,
                rating: newReview.rating,
                comment: newReview.comment
            });

        if (error) {
            alert('Error submitting review. You may have already reviewed this product.');
            console.error(error);
        } else {
            setNewReview({ rating: 5, comment: '' });
            setShowForm(false);
            fetchReviews();
        }
        setSubmitting(false);
    };

    const averageRating = reviews.length
        ? (reviews.reduce((acc, curr) => acc + curr.rating, 0) / reviews.length).toFixed(1)
        : '0.0';

    return (
        <div className="space-y-8">
            <div className="flex items-center justify-between border-b border-gray-100 pb-8">
                <div>
                    <h3 className="text-2xl font-bold text-gray-900">Customer Reviews</h3>
                    <div className="flex items-center mt-2 gap-2">
                        <div className="flex items-center text-yellow-400">
                            <span className="text-2xl font-bold text-gray-900 mr-2">{averageRating}</span>
                            <StarRating rating={Math.round(Number(averageRating))} size={20} />
                        </div>
                        <span className="text-gray-500">Based on {reviews.length} reviews</span>
                    </div>
                </div>
                {user ? (
                    !showForm && <Button onClick={() => setShowForm(true)}>Write a Review</Button>
                ) : (
                    <div className="text-sm text-gray-500">
                        Please <a href="/auth/login" className="text-primary underline">login</a> to write a review.
                    </div>
                )}
            </div>

            <AnimatePresence>
                {showForm && (
                    <motion.form
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        exit={{ opacity: 0, height: 0 }}
                        className="bg-gray-50 p-6 rounded-2xl space-y-4"
                        onSubmit={handleSubmit}
                    >
                        <h4 className="font-bold text-gray-900">Write your review</h4>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">Rating</label>
                            <StarRating
                                rating={newReview.rating}
                                size={24}
                                editable
                                onChange={(r) => setNewReview({ ...newReview, rating: r })}
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">Comment</label>
                            <textarea
                                required
                                rows={4}
                                className="w-full p-4 border rounded-xl focus:ring-2 focus:ring-primary/20 outline-none"
                                placeholder="Share your thoughts..."
                                value={newReview.comment}
                                onChange={(e) => setNewReview({ ...newReview, comment: e.target.value })}
                            />
                        </div>
                        <div className="flex gap-2 justify-end">
                            <Button type="button" variant="outline" onClick={() => setShowForm(false)}>Cancel</Button>
                            <Button type="submit" disabled={submitting}>
                                {submitting ? <Loader2 className="animate-spin w-4 h-4" /> : 'Submit Review'}
                            </Button>
                        </div>
                    </motion.form>
                )}
            </AnimatePresence>

            <div className="space-y-6">
                {loading ? (
                    <div className="text-center py-12 text-gray-400">Loading reviews...</div>
                ) : reviews.length === 0 ? (
                    <div className="text-center py-12 bg-gray-50 rounded-2xl border border-dashed border-gray-200">
                        <p className="text-gray-500">No reviews yet. Be the first to review this product!</p>
                    </div>
                ) : (
                    reviews.map((review) => (
                        <div key={review.id} className="border-b border-gray-100 last:border-0 pb-6 last:pb-0">
                            <div className="flex items-center gap-4 mb-2">
                                <div className="w-10 h-10 bg-gray-100 rounded-full flex items-center justify-center text-gray-500 overflow-hidden">
                                    {review.profile?.avatar_url ? (
                                        <img src={review.profile.avatar_url} alt={review.full_name || 'Reviewer'} className="w-full h-full object-cover" />
                                    ) : (
                                        <User className="w-5 h-5" />
                                    )}
                                </div>
                                <div>
                                    <p className="font-bold text-gray-900">{review.profile?.full_name || 'Anonymous User'}</p>
                                    <div className="flex items-center text-xs text-gray-500 gap-2">
                                        <StarRating rating={review.rating} size={12} />
                                        <span>•</span>
                                        <span>{new Date(review.created_at).toLocaleDateString()}</span>
                                    </div>
                                </div>
                            </div>
                            <p className="text-gray-600 leading-relaxed mt-2">{review.comment}</p>
                        </div>
                    ))
                )}
            </div>
        </div>
    );
}
