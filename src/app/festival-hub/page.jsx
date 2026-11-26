

"use client";

import { useMemo, useState } from "react";
import {
    ArrowLeft,
    Languages,
    Moon,
    Sun,
    UserRound,
    Sparkles,
    CalendarDays,
    Bell,
    SlidersHorizontal,
    Clock3,
    MapPin,
    ChevronRight,
    Check,
    X,
} from "lucide-react";
import Link from "next/link";

const festivals = [
    {
        id: 1,
        date: "2026-11-27",
        day: "Fri",
        month: "NOV",
        dateNumber: "27",
        category: "Pradosh Vrat",
        title: "Margashirsha Pradosh Vrat",
        description:
            "Evening Shiva worship during twilight removes obstacles and restores family harmony.",
        tithi: "Krishna Trayodashi",
        nakshatra: "Swati",
        time: "05:32 PM - 07:45 PM",
        ritual: "Shiva Rudrabhishek & Pradosh Stotra",
        status: "Tomorrow",
        statusColor: "green",
    },
    {
        id: 2,
        date: "2026-11-29",
        day: "Sun",
        month: "NOV",
        dateNumber: "29",
        category: "Major Utsav",
        title: "Kalabhairav Jayanti & Masik Ashtami",
        description:
            "Sacred manifestation day of Lord Kalabhairav: offers protection and fearless clarity.",
        tithi: "Krishna Ashtami",
        nakshatra: "Pushya",
        time: "06:40 AM - 09:05 AM",
        ritual: "Bhairav Ashtakam & Sesame Oil Diya",
        status: "In 3 days",
        statusColor: "orange",
    },
    {
        id: 3,
        date: "2026-12-04",
        day: "Fri",
        month: "DEC",
        dateNumber: "04",
        category: "Ekadashi Vrat",
        title: "Utpanna Ekadashi Vrat",
        description:
            "Auspicious Ekadashi dedicated to Devi Ekadashi and Shri Hari Vishnu; traditional vrat starting day.",
        tithi: "Margashirsha Shukla Ekadashi",
        nakshatra: "Hasta",
        time: "06:50 AM - 09:20 AM",
        ritual: "Vishnu Sahasranama & Tulsi Archana",
        status: "In 8 days",
        statusColor: "orange",
    },
    {
        id: 4,
        date: "2026-12-09",
        day: "Wed",
        month: "DEC",
        dateNumber: "09",
        category: "Major Festival",
        title: "Margashirsha Purnima",
        description:
            "A sacred full moon day traditionally observed with prayers, charity and holy rituals.",
        tithi: "Purnima",
        nakshatra: "Rohini",
        time: "06:30 AM - 08:30 AM",
        ritual: "Satyanarayan Katha & Daan",
        status: "In 13 days",
        statusColor: "orange",
    },
    {
        id: 5,
        date: "2026-12-14",
        day: "Mon",
        month: "DEC",
        dateNumber: "14",
        category: "Major Festival",
        title: "Vivah Panchami",
        description:
            "A traditional celebration commemorating the divine marriage of Shri Ram and Mata Sita.",
        tithi: "Shukla Panchami",
        nakshatra: "Uttara Ashadha",
        time: "07:00 AM - 10:00 AM",
        ritual: "Ram-Sita Puja & Katha",
        status: "In 18 days",
        statusColor: "orange",
    },
];

const categories = [
    "All",
    "Major Festivals",
    "Ekadashi & Vrat",
    "Purnima",
    "Pradosh Vrat",
];

const highlightedDates = [
    { date: "27", month: "Nov", name: "Margashirsha" },
    { date: "29", month: "Nov", name: "Kalabhairav" },
    { date: "04", month: "Dec", name: "Utpanna Ekadashi" },
    { date: "09", month: "Dec", name: "Margashirsha" },
    { date: "14", month: "Dec", name: "Vivah Panchami" },
    { date: "15", month: "Dec", name: "Vivah Panchami" },
    { date: "20", month: "Dec", name: "Vivah Panchami" },
    { date: "24", month: "Dec", name: "Vivah Panchami" },
];

function getFestivalCategory(category) {
    if (category === "Major Utsav") return "Major Festivals";
    if (category === "Major Festival") return "Major Festivals";
    return category;
}

export default function FestivalHubPage() {
    const [activeCategory, setActiveCategory] = useState("All");
    const [alerts, setAlerts] = useState([]);
    const [customizeOpen, setCustomizeOpen] = useState(false);
    const [selectedFestival, setSelectedFestival] = useState(null);
    const [darkMode, setDarkMode] = useState(false);
    const [showHindi, setShowHindi] = useState(false);

    const filteredFestivals = useMemo(() => {
        if (activeCategory === "All") return festivals;

        if (activeCategory === "Purnima") {
            return festivals.filter((item) =>
                item.title.toLowerCase().includes("purnima")
            );
        }

        return festivals.filter(
            (item) => getFestivalCategory(item.category) === activeCategory
        );
    }, [activeCategory]);

    function toggleAlert(id) {
        setAlerts((previous) =>
            previous.includes(id)
                ? previous.filter((item) => item !== id)
                : [...previous, id]
        );
    }

    return (
        <main
            className={`min-h-screen pb-10 ${darkMode
                ? "bg-[#211b17] text-[#f8eee2]"
                : "bg-[#fffdf7] text-[#4b3529]"
                }`}
        >

            <div className="mx-auto max-w-3xl space-y-5 px-4 py-5">
                {/* Hero Banner */}
                <section className="relative isolate overflow-hidden rounded-[25px] bg-gradient-to-r from-[#77200d] via-[#b6380c] to-[#ef5a08] px-4 py-5 text-white shadow-[0_8px_20px_rgba(160,60,15,0.15)] sm:px-6 sm:py-6">
                    <div className="absolute -right-8 -top-10 size-36 rounded-full bg-orange-300/15 blur-2xl" />

                    <Sparkles
                        size={20}
                        className="absolute right-5 top-5 text-[#ffd27c]"
                    />

                    <div className="relative">
                        <span className="inline-flex rounded-full border border-white/20 bg-white/20 px-3 py-1 text-[10px] font-medium text-white/90">
                            26 Nov - 26 Dec 2026
                        </span>

                        <h2 className="mt-3 font-serif text-[23px] leading-tight sm:text-3xl">
                            {showHindi ? "आने वाले महीने के खास पर्व" : "Upcoming Month Highlights"}
                        </h2>

                        <p className="mt-1 max-w-md text-xs leading-5 text-white/85 sm:text-sm">
                            Sacred vrats, Ekadashis, Purnima & festival dates for the next 30 days.
                        </p>

                        <div className="mt-4 grid grid-cols-3 gap-2">
                            <div className="rounded-xl border border-white/15 bg-white/20 px-3 py-2">
                                <p className="text-lg font-semibold leading-none">8</p>
                                <p className="mt-1 text-[10px] text-white/80">
                                    Important Dates
                                </p>
                            </div>

                            <div className="rounded-xl border border-white/15 bg-white/20 px-3 py-2">
                                <p className="text-lg font-semibold leading-none">
                                    {alerts.length}
                                </p>
                                <p className="mt-1 text-[10px] text-white/80">
                                    Alerts Set
                                </p>
                            </div>

                            <div className="rounded-xl border border-white/15 bg-white/20 px-3 py-2">
                                <p className="text-base font-semibold leading-none">Tomorrow</p>
                                <p className="mt-1 text-[10px] text-white/80">
                                    Next Event
                                </p>
                            </div>
                        </div>
                    </div>
                </section>

                {/* Highlighted Dates */}
                <section>
                    <div className="mb-3 flex items-center justify-between">
                        <h2 className="font-serif text-base font-semibold">
                            Highlighted Dates
                        </h2>
                        <span className="text-[11px] text-[#bd7951]">Next 30 days</span>
                    </div>

                    <div className="-mx-4 overflow-x-auto px-4 pb-2 scrollbar-hide">
                        <div className="flex w-max gap-2">
                            {highlightedDates.map((item) => (
                                <button
                                    type="button"
                                    key={`${item.month}-${item.date}`}
                                    onClick={() => {
                                        const festival = festivals.find(
                                            (event) =>
                                                event.dateNumber === item.date &&
                                                event.month === item.month.toUpperCase()
                                        );

                                        if (festival) setSelectedFestival(festival);
                                    }}
                                    className={`w-[76px] shrink-0 rounded-xl border px-2 py-3 text-center transition hover:border-[#df9a64] ${darkMode
                                            ? "border-[#514033] bg-[#30251e]"
                                            : "border-[#f1e7d8] bg-white"
                                        }`}
                                >
                                    <span className="block text-[10px] text-[#c27b4c]">
                                        {item.month}
                                    </span>

                                    <span className="mt-1 block font-serif text-xl leading-tight">
                                        {item.date}
                                    </span>

                                    <span className="mt-1 block truncate text-[9px] text-[#9b8271]">
                                        {item.name}
                                    </span>
                                </button>
                            ))}
                        </div>
                    </div>


                </section>

                {/* Category Filters */}
                <section>
                    <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-hide">
                        {categories.map((category) => {
                            const active = activeCategory === category;

                            return (
                                <button
                                    key={category}
                                    type="button"
                                    onClick={() => setActiveCategory(category)}
                                    className={`shrink-0 rounded-full border px-3 py-2 text-[11px] font-medium transition ${active
                                        ? "border-[#f9eee5] bg-[#fff0e6] text-[#b85d34]"
                                        : darkMode
                                            ? "border-[#514033] bg-[#30251e] text-[#d9c4ad]"
                                            : "border-[#eee5d8] bg-white text-[#8d7868] hover:border-[#dfaa83]"
                                        }`}
                                >
                                    {category}
                                </button>
                            );
                        })}
                    </div>
                </section>

                {/* Festival Cards */}
                <section className="space-y-3">
                    {filteredFestivals.length > 0 ? (
                        filteredFestivals.map((festival) => {
                            const alertActive = alerts.includes(festival.id);

                            return (
                                <article
                                    key={festival.id}
                                    className={`overflow-hidden rounded-[21px] border p-3.5 shadow-[0_2px_5px_rgba(80,50,25,0.025)] transition ${darkMode
                                        ? "border-[#514033] bg-[#30251e]"
                                        : "border-[#f0e7d8] bg-white"
                                        }`}
                                >
                                    {/* Card Heading */}
                                    <div className="flex items-start gap-3">
                                        <div className="flex h-[60px] w-[52px] shrink-0 flex-col items-center justify-center rounded-xl bg-[#fff4e8] text-[#a75d36]">
                                            <span className="text-[9px] font-medium">
                                                {festival.month}
                                            </span>
                                            <span className="font-serif text-[21px] leading-tight">
                                                {festival.dateNumber}
                                            </span>
                                            <span className="text-[9px]">{festival.day}</span>
                                        </div>

                                        <div className="min-w-0 flex-1">
                                            <div className="mb-1 flex flex-wrap items-center gap-1.5">
                                                <span className="rounded-full bg-[#fff1e4] px-2 py-0.5 text-[9px] font-medium text-[#b46a3c]">
                                                    {festival.category}
                                                </span>

                                                <span
                                                    className={`ml-auto rounded-full px-2 py-0.5 text-[9px] font-medium ${festival.statusColor === "green"
                                                        ? "bg-[#eaf6ed] text-[#55936b]"
                                                        : "bg-[#fff3e3] text-[#bd874c]"
                                                        }`}
                                                >
                                                    {festival.status}
                                                </span>
                                            </div>

                                            <h3 className="font-serif text-[15px] font-semibold leading-snug">
                                                {festival.title}
                                            </h3>

                                            <p className="mt-1 text-[10px] leading-[1.55] text-[#927d6c]">
                                                {festival.description}
                                            </p>
                                        </div>
                                    </div>

                                    {/* Tithi */}
                                    <div className="mt-3 space-y-1.5 pl-1">
                                        <div className="flex items-start gap-2 text-[10px] leading-4 text-[#79634f]">
                                            <Sun size={12} className="mt-0.5 shrink-0 text-[#d68a3c]" />
                                            <span>
                                                <strong className="font-semibold">Tithi & Nakshatra:</strong>{" "}
                                                {festival.tithi} • {festival.nakshatra}
                                            </span>
                                        </div>

                                        <div className="flex items-start gap-2 text-[10px] leading-4 text-[#57936a]">
                                            <Clock3 size={12} className="mt-0.5 shrink-0" />
                                            <span>
                                                Shubh Puja Window: {festival.time}
                                            </span>
                                        </div>

                                        <div className="flex items-start gap-2 text-[10px] leading-4 text-[#927d6c]">
                                            <span className="mt-0.5 shrink-0">🪔</span>
                                            <span>
                                                Recommended Ritual: {festival.ritual}
                                            </span>
                                        </div>
                                    </div>

                                    {/* Card Actions */}
                                    <div className="mt-4 flex flex-wrap items-center gap-2 border-t border-[#f2eadf] pt-3">
                                        <button
                                            type="button"
                                            onClick={() => toggleAlert(festival.id)}
                                            aria-pressed={alertActive}
                                            className="flex min-w-0 flex-1 items-center gap-2 text-left text-[10px] text-[#786c5e]"
                                        >
                                            <span className="flex size-7 shrink-0 items-center justify-center rounded-full bg-[#fbf6e9] text-[#8c7145]">
                                                {alertActive ? (
                                                    <Check size={14} />
                                                ) : (
                                                    <Bell size={14} />
                                                )}
                                            </span>
                                            <span>
                                                {alertActive ? "Alert is Set" : "Set Local Alert"}
                                            </span>
                                        </button>

                                        <button
                                            type="button"
                                            onClick={() => setCustomizeOpen(true)}
                                            className="flex shrink-0 items-center gap-1 text-[10px] font-medium text-[#bd7545]"
                                        >
                                            <SlidersHorizontal size={12} />
                                            Customize
                                        </button>

                                        <button
                                            type="button"
                                            onClick={() => toggleAlert(festival.id)}
                                            aria-label={alertActive ? "Disable alert" : "Enable alert"}
                                            className={`relative h-5 w-9 shrink-0 rounded-full transition ${alertActive ? "bg-[#d95718]" : "bg-[#f1e8da]"
                                                }`}
                                        >
                                            <span
                                                className={`absolute top-0.5 size-4 rounded-full bg-white shadow-sm transition-all ${alertActive ? "left-[18px]" : "left-0.5"
                                                    }`}
                                            />
                                        </button>
                                    </div>

                                    <button
                                        type="button"
                                        onClick={() => setSelectedFestival(festival)}
                                        className="mt-2 flex w-full items-center justify-end gap-1 text-[10px] font-medium text-[#bd7545]"
                                    >
                                        View Details <ChevronRight size={13} />
                                    </button>
                                </article>
                            );
                        })
                    ) : (
                        <div className="rounded-2xl border border-dashed border-[#eadfce] px-5 py-12 text-center">
                            <CalendarDays className="mx-auto text-[#bd7951]" size={30} />
                            <p className="mt-3 text-sm font-medium">No festivals found</p>
                            <p className="mt-1 text-xs text-[#927d6c]">
                                Try selecting another category.
                            </p>
                        </div>
                    )}
                </section>

                <p className="pb-4 text-center text-[10px] leading-5 text-[#a08c7b]">
                    Festival dates and puja timings are sample display data.
                    Please verify local Panchang timings before performing rituals.
                </p>
            </div>

            {/* Festival Details Modal */}
            {selectedFestival && (
                <div
                    className="fixed inset-0 z-50 flex items-end justify-center bg-black/40 p-3 backdrop-blur-sm sm:items-center"
                    onClick={() => setSelectedFestival(null)}
                >
                    <div
                        role="dialog"
                        aria-modal="true"
                        className="w-full max-w-md rounded-[25px] bg-[#fffdf7] p-5 text-[#4b3529] shadow-2xl"
                        onClick={(event) => event.stopPropagation()}
                    >
                        <div className="mb-4 flex items-center justify-between">
                            <span className="rounded-full bg-[#fff0e4] px-3 py-1 text-xs text-[#b85d34]">
                                {selectedFestival.category}
                            </span>
                            <button
                                type="button"
                                onClick={() => setSelectedFestival(null)}
                                aria-label="Close details"
                                className="rounded-full bg-[#f7eee4] p-2"
                            >
                                <X size={17} />
                            </button>
                        </div>

                        <h2 className="font-serif text-2xl font-semibold">
                            {selectedFestival.title}
                        </h2>

                        <p className="mt-2 text-sm leading-6 text-[#927d6c]">
                            {selectedFestival.description}
                        </p>

                        <div className="mt-5 space-y-3 rounded-2xl bg-[#fff5e9] p-4 text-sm">
                            <p>
                                <strong>Date:</strong> {selectedFestival.date}
                            </p>
                            <p>
                                <strong>Tithi:</strong> {selectedFestival.tithi}
                            </p>
                            <p>
                                <strong>Nakshatra:</strong> {selectedFestival.nakshatra}
                            </p>
                            <p>
                                <strong>Puja Window:</strong> {selectedFestival.time}
                            </p>
                            <p>
                                <strong>Recommended Ritual:</strong> {selectedFestival.ritual}
                            </p>
                        </div>

                        <button
                            type="button"
                            onClick={() => {
                                toggleAlert(selectedFestival.id);
                                setSelectedFestival(null);
                            }}
                            className="mt-5 w-full rounded-xl bg-[#d95718] px-5 py-3 text-sm font-semibold text-white"
                        >
                            Set Local Alert
                        </button>
                    </div>
                </div>
            )}

            {/* Customize Modal */}
            {customizeOpen && (
                <div
                    className="fixed inset-0 z-50 flex items-end justify-center bg-black/40 p-3 backdrop-blur-sm sm:items-center"
                    onClick={() => setCustomizeOpen(false)}
                >
                    <div
                        role="dialog"
                        aria-modal="true"
                        className="w-full max-w-md rounded-[25px] bg-[#fffdf7] p-5 text-[#4b3529] shadow-2xl"
                        onClick={(event) => event.stopPropagation()}
                    >
                        <div className="flex items-center justify-between">
                            <h2 className="font-serif text-xl font-semibold">
                                Customize Alerts
                            </h2>
                            <button
                                type="button"
                                onClick={() => setCustomizeOpen(false)}
                                className="rounded-full bg-[#f7eee4] p-2"
                                aria-label="Close customize"
                            >
                                <X size={17} />
                            </button>
                        </div>

                        <p className="mt-2 text-sm text-[#927d6c]">
                            Choose which festival reminders you want to receive.
                        </p>

                        <div className="mt-5 space-y-3">
                            {["Major Festivals", "Ekadashi & Vrat", "Purnima", "Pradosh Vrat"].map(
                                (category) => (
                                    <label
                                        key={category}
                                        className="flex items-center justify-between rounded-xl border border-[#eee3d5] bg-white p-3 text-sm"
                                    >
                                        {category}
                                        <input
                                            type="checkbox"
                                            defaultChecked
                                            className="size-4 accent-[#d95718]"
                                        />
                                    </label>
                                )
                            )}
                        </div>

                        <button
                            type="button"
                            onClick={() => setCustomizeOpen(false)}
                            className="mt-5 w-full rounded-xl bg-[#d95718] px-5 py-3 text-sm font-semibold text-white"
                        >
                            Save Preferences
                        </button>
                    </div>
                </div>
            )}
        </main>
    );
}
