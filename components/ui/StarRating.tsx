import { Star } from 'lucide-react';

interface StarRatingProps {
    rating: number; // 0 to 5
    size?: number;
    editable?: boolean;
    onChange?: (rating: number) => void;
}

export default function StarRating({ rating, size = 16, editable = false, onChange }: StarRatingProps) {
    const handleStarClick = (index: number) => {
        if (editable && onChange) {
            onChange(index + 1);
        }
    };

    return (
        <div className="flex items-center gap-0.5">
            {[...Array(5)].map((_, i) => (
                <button
                    key={i}
                    disabled={!editable}
                    onClick={() => handleStarClick(i)}
                    className={`${editable ? 'cursor-pointer hover:scale-110 transition-transform' : 'cursor-default'}`}
                >
                    <Star
                        size={size}
                        className={`${i < rating
                            ? 'fill-yellow-400 text-yellow-400'
                            : 'fill-gray-100 text-gray-300'
                            }`}
                    />
                </button>
            ))}
        </div>
    );
}
