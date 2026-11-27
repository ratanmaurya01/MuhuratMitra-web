import { Star, MessageCircle } from "lucide-react";

export function RatingStars({ rating = 0 }) {
    return (
        <div className="flex items-center gap-1 text-[#d99a0b]">
            {[1, 2, 3, 4, 5].map((star) => (
                <Star
                    key={star}
                    size={19}
                    className={
                        star <= Math.round(rating)
                            ? "fill-current"
                            : "text-[#d99a0b]"
                    }
                />
            ))}
        </div>
    );
}

export function RatingBreakdown({ reviews, rating }) {
    const total = reviews.length;
    const counts = [5, 4, 3, 2, 1].map(
        (star) =>
            reviews.filter((review) => Number(review.rating) === star).length
    );
    return (
        <section className="rounded-[28px] border border-[#e6ddca] bg-white p-5 shadow-sm sm:p-7">
            <h2 className="text-xl font-semibold text-[#38251f]">
                Rating Breakdown
            </h2>
            <div className="mt-6 grid grid-cols-[105px_1fr] items-center gap-4 sm:grid-cols-[140px_1fr] sm:gap-8">
                <div className="text-center">
                    <p className="text-5xl font-bold text-[#d95718]">
                        {Number(rating).toFixed(1)}
                    </p>

                    <div className="mt-2 flex justify-center">
                        <RatingStars rating={rating} />
                    </div>

                    <p className="mt-2 text-sm text-[#857469]">
                        {total} reviews
                    </p>
                </div>

                <div className="space-y-3">
                    {[5, 4, 3, 2, 1].map((star, index) => (
                        <div key={star} className="flex items-center gap-2">
                            <span className="w-3 text-sm text-[#604c40]">
                                {star}
                            </span>

                            <Star
                                size={15}
                                className="shrink-0 fill-[#d99a0b] text-[#d99a0b]"
                            />

                            <div className="h-3 flex-1 overflow-hidden rounded-full bg-[#f4e5e2]">
                                <div
                                    className="h-full rounded-full bg-[#d95718] transition-all"
                                    style={{
                                        width: `${total ? (counts[index] / total) * 100 : 0}%`,
                                    }}
                                />
                            </div>

                            <span className="w-5 text-right text-sm text-[#857469]">
                                {counts[index]}
                            </span>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}

function ReviewCard({ review }) {
    return (
        <div className="rounded-[22px] border border-[#e9dfd2] bg-white p-5 shadow-sm">
            <div className="flex items-start justify-between gap-3">
                <div>
                    <h3 className="font-semibold text-[#38251f]">
                        {review?.devotee_name || "Anonymous Devotee"}
                    </h3>

                    <p className="mt-1 text-xs text-[#857469]">
                        {review?.created_at
                            ? new Date(
                                review.created_at.replace(" ", "T")
                            ).toLocaleDateString("en-IN", {
                                day: "numeric",
                                month: "short",
                                year: "numeric",
                            })
                            : ""}
                    </p>
                </div>

                <div className="flex items-center gap-1 rounded-full bg-[#fff5e7] px-3 py-1">
                    <Star size={15} className="fill-[#e6a23c] text-[#e6a23c]" />
                    <span className="text-sm font-semibold text-[#38251f]">
                        {Number(review?.rating || 0).toFixed(1)}
                    </span>
                </div>
            </div>

            <p className="mt-4 text-sm leading-7 text-[#66564d]">
                {review?.review || "No written review."}
            </p>
        </div>
    );
}

export function DevoteeReviews({ reviews = [], totalReviews = 0 }) {
    return (
        <section>
            <div className="mb-5 flex items-center justify-between">
                <h2 className="font-serif text-2xl text-[#38251f]">
                    Reviews
                </h2>

                <span className="text-sm text-[#857469]">
                    {totalReviews} Reviews
                </span>
            </div>

            {reviews.length > 0 ? (
                <div className="space-y-5">
                    {reviews.map((review, index) => (
                        <ReviewCard
                            key={review.id || index}
                            review={review}
                        />
                    ))}
                </div>
            ) : (
                <div className="rounded-[26px] border border-dashed border-[#e6ddca] bg-white px-5 py-12 text-center">
                    <MessageCircle
                        size={35}
                        className="mx-auto text-[#bd6338]"
                    />

                    <h3 className="mt-3 font-semibold text-[#38251f]">
                        No Reviews Available
                    </h3>

                    <p className="mt-2 text-sm text-[#857469]">
                        Devotee reviews will appear here.
                    </p>
                </div>
            )}
        </section>
    );
}

