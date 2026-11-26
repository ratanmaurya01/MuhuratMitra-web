
"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import {
    ArrowLeft,
    BadgeCheck,
    MapPin,
    Star,
    Clock3,
    IndianRupee,
    Languages,
    CalendarDays,
    UserRound,
    MessageCircle,
} from "lucide-react";

// Change this import path according to your existing pandits.js location
import { pandits } from "@/lib/mock/pandits";
import PanditBookingDialog from "@/components/pandit/PanditBookingDialog";
import BookNowButton from "@/components/ui/BookNowButton";
import { DevoteeReviews, RatingBreakdown, RatingStars, ReviewCard } from "@/components/pandit/PanditProfile";

export default function PanditProfilePage() {
    const params = useParams();
    const router = useRouter();
    const pandit = useMemo(
        () =>
            pandits.find(
                (item) => String(item.id) === String(params.id)
            ),
        [params.id]
    );
    const [bookingOpen, setBookingOpen] = useState(false);

    if (!pandit) {
        return (

            <main className="flex min-h-[70vh] flex-col items-center justify-center bg-[#fffdf6] px-5 text-center">
                <UserRound size={45} className="text-[#bd6338]" />

                <h2 className="mt-4 text-xl font-semibold text-[#38251f]">
                    Pandit Not Found
                </h2>

                <p className="mt-2 text-sm text-[#857469]">
                    This pandit profile is not available.
                </p>

                <Link
                    href="/pandits"
                    className="mt-5 rounded-full bg-[#d95718] px-6 py-3 text-white"
                >
                    Browse Pandits
                </Link>
            </main>
        );
    }

    const reviews = pandit.reviews || [];
    const rating = Number(pandit.rating || 0);
    const dakshina = Number(pandit.dakshina || 0);
    const specializations = pandit.specializations || [];
    const languages = pandit.languages || [];
    const totalReviews = pandit.reviewCount ?? reviews.length;
  
    return (
       
       <>
            <main className="min-h-screen bg-[#fffdf6] pb-12">
                {/* Header */}
                <header className="sticky top-0 z-40 border-b border-[#eee3d5] bg-[#fffdf6]/95 backdrop-blur">
                    <div className="mx-auto flex max-w-5xl items-center gap-4 px-5 py-5">
                        <button
                            onClick={() => router.back()}
                            aria-label="Go back"
                            className="rounded-full p-2 text-[#54251f] transition hover:bg-[#f8e9dc]"
                        >
                            <ArrowLeft size={25} />
                        </button>

                        <h1 className="min-w-0 flex-1 truncate font-serif text-2xl text-[#38251f]">
                            Pandit Profile
                        </h1>

                        {pandit.verified && (
                            <BadgeCheck className="shrink-0 text-[#d95718]" size={23} />
                        )}
                    </div>
                </header>

                <div className="mx-auto max-w-5xl space-y-7 px-5 py-7">
                    <section className="rounded-[30px] border border-[#e6ddca] bg-white p-5 shadow-[0_3px_12px_rgba(74,45,25,0.06)] sm:p-8">
                        <div className="flex flex-col gap-5 sm:flex-row sm:items-center">

                            {/* Avatar */}
                            <div className="flex size-32 shrink-0 items-center justify-center overflow-hidden rounded-full border-4 border-[#f8ead9] bg-[#f8ead9]">
                                {pandit.image || pandit.profileImage ? (
                                    <img
                                        src={pandit.image || pandit.profileImage}
                                        alt={pandit.name}
                                        className="h-full w-full object-cover"
                                    />
                                ) : (
                                    <UserRound size={55} className="text-[#8b2929]" />
                                )}
                            </div>

                            {/* Details */}
                            <div className="min-w-0 flex-1">
                                <div className="flex flex-wrap items-center gap-2">
                                    <h2 className="font-serif text-2xl font-semibold leading-tight text-[#38251f] sm:text-3xl">
                                        {pandit.name}
                                    </h2>

                                    {pandit.verified && (
                                        <BadgeCheck size={22} className="text-[#d95718]" />
                                    )}
                                </div>

                                <p className="mt-2 flex items-center gap-2 text-sm text-[#857469]">
                                    <MapPin size={16} />
                                    {pandit.city}
                                    {" • "}
                                    {pandit.experienceYears} yrs exp
                                </p>

                                <div className="mt-3 flex flex-wrap items-center gap-2 text-sm text-[#bd6338]">
                                    <Languages size={17} />
                                    {languages.join(", ")}
                                </div>

                                <div className="mt-3 flex items-center gap-2">
                                    <RatingStars rating={rating} />

                                    <span className="text-sm font-semibold text-[#38251f]">
                                        {rating.toFixed(1)}
                                    </span>

                                    <span className="text-sm text-[#857469]">
                                        ({totalReviews} reviews)
                                    </span>
                                </div>
                            </div>
                        </div>

                        {/* Specializations */}
                        {specializations.length > 0 && (
                            <div className="mt-7 border-t border-[#eee5d9] pt-5">
                                <h3 className="mb-3 text-sm font-semibold text-[#857469]">
                                    SPECIALIZES IN
                                </h3>

                                <div className="flex flex-wrap gap-2">
                                    {specializations.map((item) => (
                                        <span
                                            key={item}
                                            className="rounded-full bg-[#f9e8df] px-4 py-2 text-sm text-[#a94f2e]"
                                        >
                                            {item}
                                        </span>
                                    ))}
                                </div>
                            </div>
                        )}

                        {/* About */}
                        <div className="mt-6">
                            <h3 className="text-lg font-semibold text-[#38251f]">
                                About Pandit
                            </h3>

                            <p className="mt-2 text-[15px] leading-7 text-[#76665c]">
                                {pandit.description ||
                                    "Experienced Vedic Pandit offering traditional puja services with devotion and authentic rituals."}
                            </p>
                        </div>

                        {/* Experience and languages */}
                        <div className="mt-6 grid gap-4 rounded-2xl bg-[#fff8ee] p-4 sm:grid-cols-2">
                            <div className="flex items-center gap-3">
                                <Clock3 className="text-[#bd6338]" size={21} />
                                <div>
                                    <p className="text-xs text-[#857469]">Experience</p>
                                    <p className="font-semibold text-[#38251f]">
                                        {pandit.experienceYears} Years
                                    </p>
                                </div>
                            </div>

                            <div className="flex items-center gap-3">
                                <Languages className="text-[#bd6338]" size={21} />
                                <div>
                                    <p className="text-xs text-[#857469]">Languages</p>
                                    <p className="font-semibold text-[#38251f]">
                                        {languages.length} Languages
                                    </p>
                                </div>
                            </div>
                        </div>

                        {/* Dakshina and Booking */}
                        <div className="mt-7 flex flex-wrap items-center justify-between gap-4 border-t border-[#eee5d9] pt-6">
                            <div>
                                <p className="text-sm text-[#857469]">
                                    Dakshina
                                </p>

                                <p className="mt-1 flex items-center text-2xl font-bold text-[#7b2929]">
                                    <IndianRupee size={23} />
                                    {dakshina.toLocaleString("en-IN")}
                                </p>
                            </div>

                            <BookNowButton
                                pandit={pandit}
                                onBook={() => setBookingOpen(true)}
                            />

                        </div>

                    </section>

                    {/* Rating Breakdown */}
                    <RatingBreakdown
                        reviews={reviews}
                        rating={rating}
                    />

                    {/* Devotee Reviews */}

                    <DevoteeReviews
                        reviews={reviews}
                        totalReviews={totalReviews}
                    />
                </div>

            </main>


            <PanditBookingDialog
                open={bookingOpen}
                onOpenChange={setBookingOpen}
                pandit={pandit}
            />
        </>
    );
}
