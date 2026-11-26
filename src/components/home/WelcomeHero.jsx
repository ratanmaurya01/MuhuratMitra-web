
"use client";

import { useEffect, useState } from "react";
import {
  CalendarDays,
  Sun,
} from "lucide-react";

function getIndianDateTime() {
  const now = new Date();

  const date = new Intl.DateTimeFormat("en-IN", {
    weekday: "short",
    day: "2-digit",
    month: "short",
    year: "numeric",
    timeZone: "Asia/Kolkata",
  }).format(now);

  const time = new Intl.DateTimeFormat("en-IN", {
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
    hour12: true,
    timeZone: "Asia/Kolkata",
  }).format(now);

  return { date, time };
}

export default function WelcomeHero({ citySelect }) {
  const [dateTime, setDateTime] = useState(null);

  useEffect(() => {
    const updateClock = () => {
      setDateTime(getIndianDateTime());
    };

    updateClock();

    const interval = setInterval(updateClock, 1000);

    return () => clearInterval(interval);
  }, []);

  return (
    <section className="relative isolate flex min-h-[360px] flex-col justify-end overflow-hidden rounded-[30px] border border-[#E8D5C1] bg-[#6F3828] p-6 shadow-[0_12px_30px_rgba(83,43,27,0.16)] sm:p-9">

      {/* Background */}
      <div
        className="absolute inset-0 -z-20 bg-cover bg-center"
        style={{
          backgroundImage:
            "url('https://images.unsplash.com/photo-1606293926075-69a00db8f2f8?auto=format&fit=crop&w=1800&q=85')",
        }}
      />



      {/* Top Bar: Date Left + Location Right */}
    
    <div className="absolute left-3 right-3 top-4 z-10 flex items-center justify-between gap-2 sm:left-6 sm:right-6 sm:top-6">

  {/* Live Date and Time - Left */}
  <div className="inline-flex min-w-0 items-center gap-1.5 rounded-full border border-white/30 bg-[#fffaf0]/95 px-2 py-1.5 text-[#68402d] shadow-md backdrop-blur-md sm:gap-2 sm:px-2.5 sm:py-2">
    <div className="flex size-6 shrink-0 items-center justify-center rounded-full bg-[#fff0d8] text-[#d95718] sm:size-7">
      <CalendarDays size={12} className="sm:size-[14px]" />
    </div>

    <div className="min-w-0">
      <p className="whitespace-nowrap text-[8px] font-semibold leading-tight sm:text-[10px]">
        {dateTime?.date || "Loading date..."}
      </p>

      <p className="mt-0.5 flex items-center gap-1 whitespace-nowrap text-[8px] font-medium 
      leading-tight text-[#b96b3d] sm:text-[10px]">
        <span className="size-1 animate-pulse rounded-full bg-green-500 sm:size-1.5" />
        {dateTime?.time || "--:--:--"}
      </p>
    </div>
  </div>

  {/* Location - Right */}
  <div className="w-auto max-w-[42%] shrink overflow-hidden [&>*]:!max-w-full">
    {citySelect}
  </div>

</div>


      {/* Hero Content */}
      <div className="relative z-10 max-w-2xl text-white">

        <div className="mb-3 inline-flex items-center gap-2 rounded-full bg-white/15 px-3 py-1.5 text-xs text-white/90 backdrop-blur">
          <Sun size={15} />
          Your Daily Spiritual Guidance
        </div>

        <h1 className="font-display text-3xl font-semibold tracking-tight sm:text-5xl">
          Good Morning 🙏
        </h1>

        <p className="mt-3 max-w-xl text-base leading-relaxed text-white/90 sm:text-xl">
          Plan auspicious rituals with the Vedic Panchang and experienced pandits.
        </p>
      </div>

    </section>
  );
}
