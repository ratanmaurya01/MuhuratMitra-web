
"use client";

import { useMemo, useState } from "react";
import {
    Search,
    CalendarDays,
    Clock3,
    Flower2,
    History,
    ChevronRight,
    Filter,
} from "lucide-react";
import { FILTERS } from "@/constants/filter";


const PUJA_HISTORY = [
    {
        id: 1,
        name: "Naamkaran Sanskar",
        pandit: "Vidwan Subramanian Iyer",
        date: "18 Nov 2026",
        time: "09:00 AM – 11:00 AM",
        amount: 3400,
        status: "Completed",
        bookingId: "MM-PUJA-1001",
        location: "Jaipur, Rajasthan",
        payment: "Paid",
    },
    {
        id: 2,
        name: "Ganesh Lakshmi Puja",
        pandit: "Pt. Harshvardhan Trivedi",
        date: "09 Nov 2026",
        time: "04:00 PM – 06:00 PM",
        amount: 2200,
        status: "Cancelled",
        bookingId: "MM-PUJA-1002",
        location: "Jaipur, Rajasthan",
        payment: "Refunded",
    },
    {
        id: 3,
        name: "Maha Rudrabhishek Puja",
        pandit: "Acharya Raghavendra Sharma",
        date: "02 Nov 2026",
        time: "06:30 AM – 08:30 AM",
        amount: 2500,
        status: "Completed",
        bookingId: "MM-PUJA-1003",
        location: "Varanasi, Uttar Pradesh",
        payment: "Paid",
    },
    {
        id: 4,
        name: "Navgraha Shanti Havan",
        pandit: "Acharya Vinayak Deshmukh",
        date: "19 Oct 2026",
        time: "10:00 AM – 12:00 PM",
        amount: 2700,
        status: "Completed",
        bookingId: "MM-PUJA-1004",
        location: "Jaipur, Rajasthan",
        payment: "Paid",
    },
];


function StatusBadge({ status }) {
    const styles = {
        Completed: "bg-[#ffeadc] text-[#bd6439]",
        Cancelled: "bg-[#f9e6e3] text-[#a73f3b]",
    };

    return (
        <span
            className={`rounded-full px-3 py-1.5 text-xs font-medium ${styles[status] || "bg-[#f4eee6] text-[#78665a]"
                }`}
        >
            {status}
        </span>
    );
}

function PujaCard({ puja }) {
    const [expanded, setExpanded] = useState(false);

    return (
        <article className="overflow-hidden rounded-[24px] border border-[#e6ddce] bg-white shadow-[0_3px_12px_rgba(70,45,25,0.045)]">
            <div className="p-5 sm:p-6">
                {/* Puja details */}
                <div className="flex items-start gap-3">
                    <div className="flex size-14 shrink-0 items-center justify-center rounded-full bg-[#f7e5e3] text-[#843f3b]">
                        <Flower2 size={27} strokeWidth={1.8} />
                    </div>

                    <div className="min-w-0 flex-1">
                        <h3 className="font-display text-xl text-[#39251d]">
                            {puja.name}
                        </h3>

                        <p className="mt-1 text-sm text-[#82736b]">
                            {puja.pandit}
                        </p>

                        <div className="mt-3 flex flex-wrap items-center gap-x-4 gap-y-2 text-sm text-[#82736b]">
                            <span className="flex items-center gap-1.5">
                                <CalendarDays size={16} className="text-[#bd6439]" />
                                {puja.date}
                            </span>

                            <span className="flex items-center gap-1.5">
                                <Clock3 size={16} className="text-[#bd6439]" />
                                {puja.time}
                            </span>
                        </div>
                    </div>

                    <div className="flex shrink-0 flex-col items-end gap-3">
                        <StatusBadge status={puja.status} />

                        <p className="font-display text-xl text-[#713c32]">
                            ₹{puja.amount.toLocaleString("en-IN")}
                        </p>
                    </div>
                </div>

                {/* Details button */}
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
                        <div className="flex justify-between gap-3">
                            <span className="text-[#82736b]">Booking ID</span>
                            <span className="font-medium text-[#39251d]">
                                {puja.bookingId}
                            </span>
                        </div>

                        <div className="flex justify-between gap-3">
                            <span className="text-[#82736b]">Location</span>
                            <span className="text-right text-[#39251d]">
                                {puja.location}
                            </span>
                        </div>

                        <div className="flex justify-between gap-3">
                            <span className="text-[#82736b]">Payment</span>
                            <span className="font-medium text-[#39251d]">
                                {puja.payment}
                            </span>
                        </div>

                        <div className="flex justify-between gap-3">
                            <span className="text-[#82736b]">Amount</span>
                            <span className="font-semibold text-[#713c32]">
                                ₹{puja.amount.toLocaleString("en-IN")}
                            </span>
                        </div>
                    </div>
                )}
            </div>
        </article>
    );
}

export default function PujaHistoryPage() {
    const [activeFilter, setActiveFilter] = useState("All");
    const [search, setSearch] = useState("");

    const filteredPujas = useMemo(() => {
        return PUJA_HISTORY.filter((puja) => {
            const matchesFilter =
                activeFilter === "All" || puja.status === activeFilter;

            const query = search.toLowerCase();

            const matchesSearch =
                puja.name.toLowerCase().includes(query) ||
                puja.pandit.toLowerCase().includes(query) ||
                puja.bookingId.toLowerCase().includes(query);

            return matchesFilter && matchesSearch;
        });
    }, [activeFilter, search]);

    const completedCount = PUJA_HISTORY.filter(
        (p) => p.status === "Completed"
    ).length;

    const cancelledCount = PUJA_HISTORY.filter(
        (p) => p.status === "Cancelled"
    ).length;

    return (
        <div className="min-w-0 space-y-7">
            {/* Heading */}
            <div>
                <p className="text-xs font-semibold tracking-widest text-[#bd6439]">
                    MY ACCOUNT / PUJA HISTORY
                </p>

                <h1 className="mt-2 font-display text-3xl font-medium text-[#39251d] sm:text-4xl">
                    My Puja History
                </h1>

                <p className="mt-2 text-sm leading-6 text-[#82736b]">
                    View all your past ceremonies, Pandit details and booking records.
                </p>
            </div>

            {/* Summary */}
            <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
                <div className="rounded-2xl border border-[#e6ddce] bg-white p-4">
                    <History size={21} className="text-[#bd6439]" />
                    <p className="mt-3 text-sm text-[#82736b]">
                        Total Ceremonies
                    </p>
                    <h2 className="mt-1 font-display text-3xl text-[#39251d]">
                        {PUJA_HISTORY.length}
                    </h2>
                </div>

                <div className="rounded-2xl border border-[#e6ddce] bg-white p-4">
                    <Flower2 size={21} className="text-[#39754d]" />
                    <p className="mt-3 text-sm text-[#82736b]">
                        Completed
                    </p>
                    <h2 className="mt-1 font-display text-3xl text-[#39754d]">
                        {completedCount}
                    </h2>
                </div>

                <div className="col-span-2 rounded-2xl border border-[#e6ddce] bg-white p-4 sm:col-span-1">
                    <CalendarDays size={21} className="text-[#a73f3b]" />
                    <p className="mt-3 text-sm text-[#82736b]">
                        Cancelled
                    </p>
                    <h2 className="mt-1 font-display text-3xl text-[#a73f3b]">
                        {cancelledCount}
                    </h2>
                </div>
            </div>

            {/* Search */}
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
                    className="h-12 w-full rounded-full border border-[#e6ddce] bg-white pl-12 pr-4 text-sm text-[#39251d] outline-none transition placeholder:text-[#aa9b90] focus:border-[#bd6439]"
                />
            </div>

            {/* Filters */}
            <div>
                <div className="mb-4 flex items-center gap-2 text-sm text-[#82736b]">
                    <Filter size={17} />
                    Filter by status
                </div>

                <div className="flex gap-2 overflow-x-auto pb-1">
                    {FILTERS.map((filter) => {
                        const count =
                            filter === "All"
                                ? PUJA_HISTORY.length
                                : PUJA_HISTORY.filter((p) => p.status === filter).length;

                        return (
                            <button
                                key={filter}
                                type="button"
                                onClick={() => setActiveFilter(filter)}
                                className={`shrink-0 rounded-full border px-5 py-2.5 text-sm font-medium transition ${activeFilter === filter
                                        ? "border-[#f3dfd8] bg-[#f8e7e5] text-[#843f3b]"
                                        : "border-[#e6ddce] bg-white text-[#82736b] hover:bg-[#fff6ed]"
                                    }`}
                            >
                                {filter} ({count})
                            </button>
                        );
                    })}
                </div>
            </div>

            {/* List heading */}
            <div className="flex items-center justify-between">
                <h2 className="font-display text-2xl text-[#39251d]">
                    Past Ceremonies
                </h2>

                <span className="text-sm text-[#82736b]">
                    {filteredPujas.length} records
                </span>
            </div>

            {/* Cards */}
            <div className="space-y-4">
                {filteredPujas.map((puja) => (
                    <PujaCard key={puja.id} puja={puja} />
                ))}

                {filteredPujas.length === 0 && (
                    <div className="rounded-[24px] border border-[#e6ddce] bg-white px-5 py-12 text-center">
                        <Flower2
                            size={35}
                            className="mx-auto mb-3 text-[#bd6439]"
                        />

                        <h3 className="font-display text-xl text-[#39251d]">
                            No ceremonies found
                        </h3>

                        <p className="mt-2 text-sm text-[#82736b]">
                            Try changing your filter or search.
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
        </div>
    );
}
