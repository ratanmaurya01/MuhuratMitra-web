
"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import {
    ArrowLeft,
    BadgeCheck,
    MapPin,
    Clock3,
    IndianRupee,
    Languages,
    UserRound,
    RefreshCw,
} from "lucide-react";

import { getPanditById } from "@/services/panditService";
import PanditBookingDialog from "@/components/pandit/PanditBookingDialog";
import BookNowButton from "@/components/ui/BookNowButton";
import {
    DevoteeReviews,
    RatingBreakdown,
    RatingStars,
} from "@/components/pandit/PanditProfile";

export default function PanditProfilePage() {
    const params = useParams();
    const router = useRouter();

    const [pandit, setPandit] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const [bookingOpen, setBookingOpen] = useState(false);

    useEffect(() => {
        if (!params?.id) return;
        let active = true;
        const fetchProfile = async () => {
            try {
                setLoading(true);
                setError("");
                const response = await getPanditById(params.id);

                console.log("Rest", response);

                const profile =
                    response?.data?.data ||
                    response?.data ||
                    response?.pandit ||
                    response;

                if (!profile || !profile.id) {
                    throw new Error("Pandit profile not found.");
                }

                if (active) {
                    setPandit(profile);
                }
            } catch (err) {
                console.error("Fetch Pandit Profile Error:", err);

                if (active) {
                    setError(
                        err?.message || "Unable to load Pandit profile. Please try again."
                    );
                    setPandit(null);
                }
            } finally {
                if (active) setLoading(false);
            }
        };

        fetchProfile();

        return () => {
            active = false;
        };
    }, [params?.id]);

    if (loading) {
        return (
            <main className="flex min-h-[70vh] items-center justify-center bg-[#fffdf6]">
                <div className="text-center">
                    <RefreshCw className="mx-auto animate-spin text-[#bd6338]" size={32} />
                    <p className="mt-3 text-sm text-[#857469]">
                        Loading Pandit profile...
                    </p>
                </div>
            </main>
        );
    }

    if (error || !pandit) {
        return (
            <main className="flex min-h-[70vh] flex-col items-center justify-center bg-[#fffdf6] px-5 text-center">
                <UserRound size={45} className="text-[#bd6338]" />

                <h2 className="mt-4 text-xl font-semibold text-[#38251f]">
                    Pandit Profile Not Available
                </h2>

                <p className="mt-2 text-sm text-[#857469]">
                    {error || "This Pandit profile could not be found."}
                </p>

                <div className="mt-5 flex gap-3">
                    <button
                        onClick={() => window.location.reload()}
                        className="rounded-full border border-[#d95718] px-5 py-3 text-sm font-semibold text-[#d95718]"
                    >
                        Try Again
                    </button>

                    <Link
                        href="/pandits"
                        className="rounded-full bg-[#d95718] px-6 py-3 text-sm font-semibold text-white"
                    >
                        Browse Pandits
                    </Link>
                </div>
            </main>
        );
    }

    // Normalize API fields while retaining original API data.
    const name = pandit.name || pandit.fullName || "Pandit";
    const image = pandit.profile_image || pandit.image || pandit.profileImage;
    const city = pandit.city || "";
    const experience = Number(
        pandit.experience ?? pandit.experienceYears ?? 0
    );

    const languages = Array.isArray(pandit.languages)
        ? pandit.languages
        : typeof pandit.languages === "string"
            ? pandit.languages.split(",").map((item) => item.trim()).filter(Boolean)
            : [];

    const specializations = Array.isArray(pandit.specializations)
        ? pandit.specializations
        : typeof pandit.specializations === "string"
            ? pandit.specializations.split(",").map((item) => item.trim()).filter(Boolean)
            : pandit.specialization
                ? [pandit.specialization]
                : [];

    const reviews = Array.isArray(pandit.reviews) ? pandit.reviews : [];
    const rating = Number(pandit.average_rating ?? pandit.rating ?? 0);
    const totalReviews = Number(
        pandit.total_reviews ?? pandit.reviewCount ?? reviews.length
    );
    const dakshina = Number(pandit.dakshina ?? pandit.price ?? 0);

    const verified =
        pandit.verification_status === "approved" || pandit.verified === true;

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

                        {verified && (
                            <BadgeCheck className="shrink-0 text-[#d95718]" size={23} />
                        )}
                    </div>
                </header>

                <div className="mx-auto max-w-5xl space-y-7 px-5 py-7">
                    {/* Profile Details */}
                    <section className="rounded-[30px] border border-[#e6ddca] bg-white p-5 shadow-[0_3px_12px_rgba(74,45,25,0.06)] sm:p-8">
                        <div className="flex flex-col gap-5 sm:flex-row sm:items-center">
                            {/* Avatar */}
                            <div className="flex size-32 shrink-0 items-center justify-center overflow-hidden rounded-full border-4 border-[#f8ead9] bg-[#f8ead9]">
                                {image ? (
                                    <img
                                        src={image}
                                        alt={name}
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
                                        {name}
                                    </h2>

                                    {verified && (
                                        <BadgeCheck size={22} className="text-[#d95718]" />
                                    )}
                                </div>

                                {verified && (
                                    <p className="mt-1 text-xs font-semibold text-green-700">
                                        Verified Pandit
                                    </p>
                                )}

                                <p className="mt-2 flex items-center gap-2 text-sm text-[#857469]">
                                    <MapPin size={16} />
                                    {city || "Location not available"}
                                    {" • "}
                                    {experience} yrs exp
                                </p>

                                <div className="mt-3 flex flex-wrap items-center gap-2 text-sm text-[#bd6338]">
                                    <Languages size={17} />
                                    {languages.length
                                        ? languages.join(", ")
                                        : "Languages not specified"}
                                </div>

                                <div className="mt-3 flex flex-wrap items-center gap-2">
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
                                    {specializations.map((item, index) => (
                                        <span
                                            key={`${item}-${index}`}
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

                            <p className="mt-2 whitespace-pre-line text-[15px] leading-7 text-[#76665c]">
                                {pandit.about ||
                                    pandit.description ||
                                    "No introduction available."}
                            </p>
                        </div>

                        {/* Experience and Languages */}
                        <div className="mt-6 grid gap-4 rounded-2xl bg-[#fff8ee] p-4 sm:grid-cols-2">
                            <div className="flex items-center gap-3">
                                <Clock3 className="text-[#bd6338]" size={21} />
                                <div>
                                    <p className="text-xs text-[#857469]">Experience</p>
                                    <p className="font-semibold text-[#38251f]">
                                        {experience} Years
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
                                <p className="text-sm text-[#857469]">Dakshina</p>

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
                    <RatingBreakdown reviews={reviews} rating={rating} />

                    {/* Devotee Reviews */}
                    <DevoteeReviews
                        reviews={reviews}
                        totalReviews={totalReviews}
                    />
                </div>
            </main>

            {/* Booking Dialog */}
            <PanditBookingDialog
                open={bookingOpen}
                onOpenChange={setBookingOpen}
                pandit={pandit}
            />
        </>
    );
}

