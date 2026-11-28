"use client";

import { useEffect, useMemo, useState } from "react";
import {
    Search,
    CalendarDays,
    Clock3,
    Flower2,
    History,
    ChevronRight,
    Filter,
    Loader2,
    MapPin,
} from "lucide-react";

import { FILTERS } from "@/constants/filter";
import { getDevoteeBookings } from "@/services/bookingService";


function formatDate(date) {
    if (!date) return "Date not available";

    return new Date(date).toLocaleDateString("en-IN", {
        day: "2-digit",
        month: "short",
        year: "numeric",
    });
}

function formatTime(time) {
    if (!time) return "Time not available";

    const [hours, minutes] = String(time).split(":");
    const date = new Date();

    date.setHours(Number(hours), Number(minutes), 0);

    return date.toLocaleTimeString("en-IN", {
        hour: "2-digit",
        minute: "2-digit",
    });
}

function StatusBadge({ status }) {
    const styles = {
        completed: "bg-[#ffeadc] text-[#bd6439]",
        cancelled: "bg-[#f9e6e3] text-[#a73f3b]",
        rejected: "bg-[#f9e6e3] text-[#a73f3b]",
        accepted: "bg-[#e5f3e8] text-[#39754d]",
        pending: "bg-[#fff4d8] text-[#a47722]",
    };

    const value = status || "pending";

    return (
        <span
            className={`rounded-full px-3 py-1.5 text-xs font-medium capitalize ${styles[value.toLowerCase()] ||
                "bg-[#f4eee6] text-[#78665a]"
                }`}
        >
            {value}
        </span>
    );
}

function PujaCard({ puja }) {
    const [expanded, setExpanded] = useState(false);

    return (
        <article className="overflow-hidden rounded-[24px] border border-[#e6ddce] bg-white shadow-[0_3px_12px_rgba(70,45,25,0.045)]">
            <div className="p-5 sm:p-6">
                <div className="flex items-start gap-3">
                    <div className="flex size-14 shrink-0 items-center justify-center rounded-full bg-[#f7e5e3] text-[#843f3b]">
                        <Flower2 size={27} />
                    </div>

                    <div className="min-w-0 flex-1">
                        <h3 className="font-display text-xl text-[#39251d]">
                            {puja.puja_name || `Puja #${puja.puja_id}`}
                        </h3>

                        <p className="mt-1 text-sm text-[#82736b]">
                            {puja.pandit_name || "Pandit"}
                        </p>

                        <div className="mt-3 flex flex-wrap gap-x-4 gap-y-2 text-sm text-[#82736b]">
                            <span className="flex items-center gap-1.5">
                                <CalendarDays size={16} className="text-[#bd6439]" />
                                {formatDate(puja.booking_date)}
                            </span>

                            <span className="flex items-center gap-1.5">
                                <Clock3 size={16} className="text-[#bd6439]" />
                                {formatTime(puja.booking_time)}
                            </span>
                        </div>
                    </div>

                    <div className="flex shrink-0 flex-col items-end gap-3">
                        <StatusBadge status={puja.status} />

                        <p className="font-display text-xl text-[#713c32]">
                            ₹{Number(puja.service_price || 0).toLocaleString("en-IN")}
                        </p>
                    </div>
                </div>

                <button
                    type="button"
                    onClick={() => setExpanded((prev) => !prev)}
                    className="mt-5 flex w-full items-center justify-between border-t border-[#eee8dc] pt-4 text-sm font-medium text-[#bd6439]"
                >
                    {expanded ? "Hide Details" : "View Details"}

                    <ChevronRight
                        size={19}
                        className={`transition-transform ${expanded ? "rotate-90" : ""
                            }`}
                    />
                </button>

                {expanded && (
                    <div className="mt-3 space-y-3 rounded-xl bg-[#fcf5eb] p-4 text-sm">
                        <DetailRow
                            label="Booking ID"
                            value={puja.booking_number || `#${puja.id}`}
                        />

                        <DetailRow
                            label="Location"
                            value={[puja.address, puja.city].filter(Boolean).join(", ") || "Not provided"}
                        />

                        <DetailRow
                            label="Payment"
                            value={puja.payment_status || "Pending"}
                        />

                        <DetailRow
                            label="Amount"
                            value={`₹${Number(puja.service_price || 0).toLocaleString("en-IN")}`}
                        />
                    </div>
                )}
            </div>
        </article>
    );
}

function DetailRow({ label, value }) {
    return (
        <div className="flex justify-between gap-3">
            <span className="text-[#82736b]">{label}</span>
            <span className="text-right font-medium text-[#39251d]">
                {value}
            </span>
        </div>
    );
}

export default function PujaHistoryPage() {
    const [bookings, setBookings] = useState([]);
    const [activeFilter, setActiveFilter] = useState("All");
    const [search, setSearch] = useState("");
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    useEffect(() => {
        fetchPujaHistory();
    }, []);

    const fetchPujaHistory = async () => {
        try {
            setLoading(true);
            setError("");
            const response = await getDevoteeBookings("puja");
            const allBookings = Array.isArray(response) ? response : [];
            setBookings(allBookings);

        } catch (err) {
            console.error("Puja history error:", err);
            setError("Unable to load puja history. Please try again.");
        } finally {
            setLoading(false);
        }
    };

    const filteredPujas = useMemo(() => {
        return bookings.filter((puja) => {
            const matchesFilter =
                activeFilter === "All" ||
                puja.status?.toLowerCase() === activeFilter.toLowerCase();

            const query = search.toLowerCase();

            const matchesSearch =
                (puja.puja_name || "").toLowerCase().includes(query) ||
                (puja.pandit_name || "").toLowerCase().includes(query) ||
                (puja.booking_number || "").toLowerCase().includes(query);

            return matchesFilter && matchesSearch;
        });
    }, [bookings, activeFilter, search]);

    const completedCount = bookings.filter(
        (p) => p.status?.toLowerCase() === "completed"
    ).length;

    const cancelledCount = bookings.filter(
        (p) =>
            ["cancelled", "rejected"].includes(p.status?.toLowerCase())
    ).length;

    return (
        <div className="min-w-0 space-y-7">
            <div>
                <p className="text-xs font-semibold tracking-widest text-[#bd6439]">
                    MY ACCOUNT / PUJA HISTORY
                </p>

                <h1 className="mt-2 font-display text-3xl font-medium text-[#39251d] sm:text-4xl">
                    My Puja History
                </h1>

                <p className="mt-2 text-sm leading-6 text-[#82736b]">
                    View your past ceremonies, Pandit details and booking records.
                </p>
            </div>

            <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
                <SummaryCard
                    icon={<History size={21} />}
                    label="Total Ceremonies"
                    value={bookings.length}
                />

                <SummaryCard
                    icon={<Flower2 size={21} />}
                    label="Completed"
                    value={completedCount}
                />

                <SummaryCard
                    icon={<CalendarDays size={21} />}
                    label="Cancelled"
                    value={cancelledCount}
                    className="col-span-2 sm:col-span-1"
                />
            </div>

            <div className="relative">
                <Search
                    size={19}
                    className="absolute left-4 top-1/2 -translate-y-1/2 text-[#a18e81]"
                />

                <input
                    type="search"
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    placeholder="Search puja, Pandit or booking ID..."
                    className="h-12 w-full rounded-full border border-[#e6ddce] bg-white pl-12 pr-4 text-sm outline-none focus:border-[#bd6439]"
                />
            </div>

            <div>
                <div className="mb-4 flex items-center gap-2 text-sm text-[#82736b]">
                    <Filter size={17} />
                    Filter by status
                </div>

                <div className="flex gap-2 overflow-x-auto pb-1">
                    {FILTERS.map((filter) => {
                        const count =
                            filter === "All"
                                ? bookings.length
                                : bookings.filter(
                                    (p) =>
                                        p.status?.toLowerCase() ===
                                        filter.toLowerCase()
                                ).length;

                        return (
                            <button
                                key={filter}
                                type="button"
                                onClick={() => setActiveFilter(filter)}
                                className={`shrink-0 rounded-full border px-5 py-2.5 text-sm font-medium transition ${activeFilter === filter
                                    ? "border-[#f3dfd8] bg-[#f8e7e5] text-[#843f3b]"
                                    : "border-[#e6ddce] bg-white text-[#82736b]"
                                    }`}
                            >
                                {filter} ({count})
                            </button>
                        );
                    })}
                </div>
            </div>

            <div className="flex items-center justify-between">
                <h2 className="font-display text-2xl text-[#39251d]">
                    Past Ceremonies
                </h2>

                <span className="text-sm text-[#82736b]">
                    {filteredPujas.length} records
                </span>
            </div>

            {loading ? (
                <div className="flex items-center justify-center rounded-2xl border border-[#e6ddce] bg-white py-16">
                    <Loader2 className="animate-spin text-[#bd6439]" size={28} />
                    <span className="ml-3 text-sm text-[#82736b]">
                        Loading puja history...
                    </span>
                </div>
            ) : error ? (
                <div className="rounded-2xl border border-red-200 bg-white p-8 text-center">
                    <p className="text-sm text-red-600">{error}</p>
                    <button
                        onClick={fetchBookings}
                        className="mt-4 text-sm font-medium text-[#bd6439]"
                    >
                        Try Again
                    </button>
                </div>
            ) : filteredPujas.length > 0 ? (
                <div className="space-y-4">
                    {filteredPujas.map((puja) => (
                        <PujaCard key={puja.id} puja={puja} />
                    ))}
                </div>
            ) : (
                <div className="rounded-[24px] border border-[#e6ddce] bg-white px-5 py-12 text-center">
                    <Flower2
                        size={35}
                        className="mx-auto mb-3 text-[#bd6439]"
                    />

                    <h3 className="font-display text-xl text-[#39251d]">
                        No ceremonies found
                    </h3>

                    <p className="mt-2 text-sm text-[#82736b]">
                        Your Puja bookings will appear here.
                    </p>

                    <button
                        onClick={() => {
                            setActiveFilter("All");
                            setSearch("");
                        }}
                        className="mt-4 text-sm font-medium text-[#bd6439]"
                    >
                        Clear Filters
                    </button>
                </div>
            )}
        </div>
    );
}

function SummaryCard({ icon, label, value, className = "" }) {
    return (
        <div className={`rounded-2xl border border-[#e6ddce] bg-white p-4 ${className}`}>
            <div className="text-[#bd6439]">{icon}</div>
            <p className="mt-3 text-sm text-[#82736b]">{label}</p>
            <h2 className="mt-1 font-display text-3xl text-[#39251d]">
                {value}
            </h2>
        </div>
    );
}