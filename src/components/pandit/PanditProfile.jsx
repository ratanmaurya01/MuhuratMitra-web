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

export function ReviewCard({ review }) {
    return (
        <article className="rounded-[26px] border border-[#e6ddca] bg-white p-5 sm:p-6">
            <div className="flex flex-wrap items-start justify-between gap-3">
                <div>
                    <h3 className="text-lg font-medium text-[#38251f]">
                        {review.userName}
                    </h3>

                    <p className="mt-1 text-sm text-[#857469]">
                        {review.pujaName} {review.date && `• ${review.date}`}
                    </p>
                </div>
                <RatingStars rating={review.rating} />
            </div>

            {review.tags?.length > 0 && (
                <div className="mt-4 flex flex-wrap gap-2">
                    {review.tags.map((tag) => (
                        <span
                            key={tag}
                            className="rounded-full bg-[#ffeadc] px-4 py-2 text-xs font-medium text-[#bd6338]"
                        >
                            {tag}
                        </span>
                    ))}
                </div>
            )}
            <p className="mt-4 text-[15px] leading-7 text-[#4f4038]">
                {review.comment}
            </p>

            {review.images?.length > 0 && (
                <div className="mt-4 flex flex-wrap gap-3">
                    {review.images.map((image, index) => (
                        <img
                            key={index}
                            src={image}
                            alt="Puja experience"
                            className="size-36 rounded-2xl object-cover"
                        />
                    ))}
                </div>
            )}
        </article>
    );
}

export function DevoteeReviews({ reviews = [], totalReviews = 0 }) {
    return (
        <section>
            <div className="mb-5 flex items-center justify-between">
                <h2 className="font-serif text-2xl text-[#38251f]">
                    Devotee Reviews
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

