
"use client";

import { useState } from "react";
import Link from "next/link";

import {
  ArrowRight,
  BriefcaseBusiness,
  Heart,
  Sparkles,
  Star,
  ChevronRight,
} from "lucide-react";

const RASHIS = [
  ["Aries", "AR", "bg-red-50 border-red-200 text-red-700"],
  ["Taurus", "TA", "bg-green-50 border-green-200 text-green-700"],
  ["Gemini", "GE", "bg-yellow-50 border-yellow-200 text-yellow-700"],
  ["Cancer", "CA", "bg-slate-50 border-slate-200 text-slate-700"],
  ["Leo", "LE", "bg-amber-50 border-amber-200 text-amber-700"],
  ["Virgo", "VI", "bg-lime-50 border-lime-200 text-lime-700"],
  ["Libra", "LI", "bg-pink-50 border-pink-200 text-pink-700"],
  ["Scorpio", "SC", "bg-rose-50 border-rose-200 text-rose-700"],
  ["Sagittarius", "SA", "bg-purple-50 border-purple-200 text-purple-700"],
  ["Capricorn", "CP", "bg-stone-100 border-stone-200 text-stone-700"],
  ["Aquarius", "AQ", "bg-sky-50 border-sky-200 text-sky-700"],
  ["Pisces", "PI", "bg-teal-50 border-teal-200 text-teal-700"],
];

export default function HoroscopeSection() {
  const [selectedRashi, setSelectedRashi] = useState("Taurus");

  const selectedSign = RASHIS.find(
    ([name]) => name === selectedRashi
  );

  return (
    <section className="space-y-3">

      {/* Section Heading */}
      <div className="flex items-center justify-between gap-2">
        <h2 className="text-lg font-semibold text-[#38251f] sm:text-xl">
          Today's Vedic Horoscope
        </h2>

        <Link
          href="/horoscope"
          className="flex shrink-0 items-center text-xs font-semibold text-[#C75B2C] transition hover:text-[#9d3e1d]"
        >
          View All
          <ArrowRight size={14} className="ml-1" />
        </Link>
      </div>

      {/* Main Card */}
      <div className="overflow-hidden rounded-xl border border-[#E5D8C8] bg-white shadow-sm">

        {/* Header */}
        <div className="flex items-center justify-between gap-2 bg-gradient-to-r from-[#F9E4DE] to-[#FCEBDD] px-3 py-3">

          <div className="flex min-w-0 items-center gap-2">

            <span className="flex size-9 shrink-0 items-center justify-center rounded-full bg-[#7D2025] text-xl text-white">
              {selectedSign?.[1] || "♉"}
            </span>

            <div className="min-w-0">
              <p className="truncate text-sm font-semibold text-[#38251f]">
                {selectedRashi} Horoscope
              </p>

              <p className="text-xs text-[#80665B]">
                View Today's Horoscope
              </p>
            </div>
          </div>

          <span className="shrink-0 rounded-full bg-[#DDF2E5] px-2.5 py-1 text-[10px] font-medium text-[#28734F]">
            12 Signs
          </span>
        </div>

        {/* Horizontal Zodiac Selector */}
        <div className="min-w-0 overflow-x-auto overscroll-x-contain border-b border-[#EEE3D7] px-3 py-3 scrollbar-hide">
          <div className="flex gap-2 overflow-x-auto p-3">
            {RASHIS.map(([name, short, color], index) => (
              <Link
                key={name}
                href="/horoscope"
                className={`flex shrink-0 items-center gap-2 rounded-full border px-3 py-2 text-sm font-medium transition ${color} ${index === 1 ? "ring-1 ring-green-200" : "hover:brightness-95"
                  }`}
              >
                <span className="flex size-6 items-center justify-center rounded-full bg-white/80 text-[10px] font-bold">
                  {short}
                </span>
                <span className="whitespace-nowrap">{name}</span>
              </Link>
            ))}
          </div>
        </div>

        {/* Horoscope Details */}
        <div className="grid grid-cols-1 gap-2 p-3 sm:grid-cols-2">

          {/* Career */}
          <div className="rounded-lg bg-[#FBF3E9] p-3 transition hover:bg-[#F8EBDD]">
            <p className="flex items-center gap-2 text-sm font-semibold text-[#38251f]">
              <BriefcaseBusiness size={16} className="text-[#C65B2D]" />
              Career & Finance
            </p>

            <p className="mt-1 text-xs leading-5 text-[#80695D]">
              Today's career and financial horoscope for {selectedRashi} will be available soon.
            </p>
          </div>

          {/* Family */}
          <div className="rounded-lg bg-[#FBF3E9] p-3 transition hover:bg-[#F8EBDD]">
            <p className="flex items-center gap-2 text-sm font-semibold text-[#38251f]">
              <Heart size={16} className="text-[#C65B2D]" />
              Family & Well-being
            </p>

            <p className="mt-1 text-xs leading-5 text-[#80695D]">
              Daily family and relationship insights for {selectedRashi} will be available soon.
            </p>
          </div>

          {/* Vedic Remedies */}
          <div className="rounded-lg bg-[#FFF5E2] p-3 transition hover:bg-[#FCECCF] sm:col-span-2">
            <p className="flex items-center gap-2 text-sm font-semibold text-[#38251f]">
              <Star size={16} className="text-[#A87912]" />
              Vedic Remedies
            </p>

            <p className="mt-1 text-xs leading-5 text-[#80695D]">
              Daily Vedic remedies and mantras for {selectedRashi} will appear here.
            </p>
          </div>

        </div>

        {/* AI Assistant */}
        <div className="flex justify-end border-t border-[#EEE3D7] px-3 py-3">
          <Link
            href={`/assistant?rashi=${encodeURIComponent(selectedRashi)}`}
            className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#C65B2D] transition hover:text-[#9d3e1d] hover:underline"
          >
            <Sparkles size={14} />
            Ask AI about {selectedRashi}
            <ChevronRight size={13} />
          </Link>
        </div>

      </div>
    </section>
  );
}
