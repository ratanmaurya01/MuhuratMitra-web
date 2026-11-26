import Link from 'next/link';
import React from 'react'
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
import BookNowButton from '../ui/BookNowButton';

function getInitials(name = "") {
    return name
        .trim()
        .split(/\s+/)
        .slice(0, 2)
        .map((part) => part[0]?.toUpperCase() || "")
        .join("");
}

export default function PanditCard({ pandit, onBook }) {
    const specializations = pandit.specializations || pandit.pujas || [];
    const languages = pandit.languages || [];
    const initials = getInitials(pandit.name);

    return (
        <div>
            <article className="flex h-full flex-col rounded-[28px] border border-[#e6ddca] bg-white p-5 shadow-[0_3px_12px_rgba(74,45,25,0.07)] transition-all hover:shadow-lg sm:p-6">
                {/* Pandit information */}
                <div className="flex items-center gap-4">
                    <div className="size-[88px] shrink-0 overflow-hidden rounded-full bg-[#f8ead9]">
                        {pandit.image || pandit.profileImage ? (
                            <img
                                src={pandit.image || pandit.profileImage}
                                alt={pandit.name}
                                className="h-full w-full object-cover"
                            />
                        ) : (
                            <div className="flex h-full w-full items-center justify-center text-xl font-semibold text-[#8b2929]">
                                {initials}
                            </div>
                        )}
                    </div>

                    <div className="min-w-0 flex-1">
                        <h2 className="text-lg font-semibold leading-snug text-[#35251f] sm:text-xl">
                            {pandit.name}
                        </h2>

                        <p className="mt-1 text-sm text-[#79675c]">
                            {pandit.city} • {pandit.experienceYears || 0} yrs exp
                        </p>

                        <div className="mt-2 flex flex-wrap gap-2">
                            <span className="rounded-full bg-[#fff1cc] px-3 py-1 text-xs font-medium text-[#60421b]">
                                ★ {Number(pandit.rating || 0).toFixed(1)} ({pandit.reviewCount || 0})
                            </span>

                            {pandit.availableDate && (
                                <span className="rounded-full bg-[#e0f4e8] px-3 py-1 text-xs font-medium text-[#39734e]">
                                    {formatDate(pandit.availableDate)}
                                </span>
                            )}

                            {pandit.verified && (
                                <span className="rounded-full bg-[#f9e8df] px-3 py-1 text-xs font-medium text-[#bd6338]">
                                    ✓ Verified
                                </span>
                            )}
                        </div>
                    </div>
                </div>

                {/* Specializations */}
                {specializations.length > 0 && (
                    <p className="mt-5 text-[15px] font-medium leading-6 text-[#bd6338]">
                        {specializations
                            .map((item) =>
                                typeof item === "string"
                                    ? item
                                    : item.name || item.nameHindi
                            )
                            .filter(Boolean)
                            .join(", ")}
                    </p>
                )}

                {/* Description */}
                <p className="mt-4 line-clamp-3 text-sm leading-6 text-[#76665c]">
                    {pandit.description ||
                        pandit.bio ||
                        "Experienced Vedic Pandit offering traditional puja services with devotion and authentic rituals."}
                </p>

                {/* Languages */}
                <div className="mt-4 flex flex-wrap items-center gap-2">
                    {languages.map((item) => (
                        <span
                            key={item}
                            className="rounded-full bg-[#fbf3e9] px-3 py-1 text-xs text-[#74594a]"
                        >
                            {item}
                        </span>
                    ))}
                </div>

                {/* Price and actions */}
                <div className="mt-auto flex flex-wrap items-center gap-3 border-t border-[#eee5d9] pt-5">
                    <div className="min-w-0 flex-1">
                        <p className="text-xs text-[#8b776b]">Dakshina</p>
                        <p className="text-xl font-semibold text-[#7b2929]">
                            ₹{Number(pandit.dakshina || pandit.price || 0).toLocaleString("en-IN")}
                        </p>
                    </div>

                    <Link
                        href={`/pandits/${pandit.id}`}
                        className="inline-flex min-h-12 items-center justify-center rounded-full border border-[#e5d5c3] px-5 text-sm font-medium text-[#bd6338] transition hover:bg-[#fff2e7]"
                    >
                        View Profile
                    </Link>


                    <BookNowButton
                        pandit={pandit}
                        onBook={onBook}
                    />

                    {/* <button
                        type="button"
                        onClick={() => onBook(pandit)}
                        className="inline-flex min-h-12 items-center justify-center gap-2 rounded-full bg-[#d95718] px-8 font-semibold text-white shadow-sm transition hover:bg-[#b94715]"
                    >
                        <CalendarDays size={18} />
                        Book Now
                    </button> */}

                </div>
            </article>
        </div>
    )
}
