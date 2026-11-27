
"use client";

import { useState } from "react";
import { Star, X, Loader2 } from "lucide-react";
import { createReview } from "@/services/reviewService";

export default function ReviewDialog({
    booking,
    onClose,
    onSuccess,
}) {
    const [rating, setRating] = useState(5);
    const [review, setReview] = useState("");
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError("");

        if (!booking?.id) {
            setError("Invalid booking");
            return;
        }

        if (rating < 1 || rating > 5) {
            setError("Please select a valid rating");
            return;
        }

        try {
            setLoading(true);

            const response = await createReview({
                booking_id: booking.id,
                rating,
                review: review.trim(),
            });

            if (!response?.success) {
                throw new Error(
                    response?.message || "Unable to submit review"
                );
            }

            onSuccess?.();
            onClose();

        } catch (err) {
            setError(
                err?.response?.data?.message ||
                err?.message ||
                "Something went wrong"
            );
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/50 p-4">
            <div className="w-full max-w-md rounded-3xl bg-white p-6 shadow-2xl">

                <div className="mb-5 flex items-center justify-between">
                    <div>
                        <h2 className="text-xl font-bold text-[#442B20]">
                            Rate Your Experience
                        </h2>
                        <p className="mt-1 text-sm text-gray-500">
                            How was your experience with the Pandit?
                        </p>
                    </div>

                    <button
                        type="button"
                        onClick={onClose}
                        disabled={loading}
                        className="rounded-full p-2 hover:bg-gray-100"
                    >
                        <X size={20} />
                    </button>
                </div>

                <form onSubmit={handleSubmit}>
                    <div className="mb-5 flex justify-center gap-2">
                        {[1, 2, 3, 4, 5].map((star) => (
                            <button
                                type="button"
                                key={star}
                                onClick={() => setRating(star)}
                            >
                                <Star
                                    size={34}
                                    className={
                                        star <= rating
                                            ? "fill-amber-400 text-amber-400"
                                            : "text-gray-300"
                                    }
                                />
                            </button>
                        ))}
                    </div>

                    <p className="mb-4 text-center font-semibold text-[#8A572F]">
                        {rating} out of 5 stars
                    </p>

                    <label className="mb-2 block text-sm font-semibold">
                        Write your review
                    </label>

                    <textarea
                        value={review}
                        onChange={(e) => setReview(e.target.value)}
                        maxLength={2000}
                        rows={4}
                        placeholder="Share your experience..."
                        className="w-full resize-none rounded-xl border border-gray-200 p-3 outline-none focus:border-[#A96835]"
                    />

                    {error && (
                        <p className="mt-3 text-sm text-red-600">
                            {error}
                        </p>
                    )}

                    <button
                        type="submit"
                        disabled={loading}
                        className="mt-5 flex w-full items-center justify-center gap-2 rounded-xl bg-[#7B442C] py-3 font-semibold text-white hover:bg-[#623520] disabled:opacity-60"
                    >
                        {loading ? (
                            <>
                                <Loader2 className="animate-spin" size={18} />
                                Submitting...
                            </>
                        ) : (
                            "Submit Review"
                        )}
                    </button>
                </form>
            </div>
        </div>
    );
}
