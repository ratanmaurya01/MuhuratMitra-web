

"use client";

import { useCallback, useEffect, useState } from "react";
import Link from "next/link";
import {
    ArrowRight,
    CalendarDays,
    Clock3,
    CheckCircle2,
    Wallet,
    UserRound,
    RefreshCw,
    MapPin,
    CalendarCheck,
    BriefcaseBusiness,
    IndianRupee,
} from "lucide-react";

import { getPanditBookings } from "@/services/bookingService";

// Keep using your existing PageHeading and StatCard components.
// If they are in another file, import them from their actual path.

const formatMoney = (amount) =>
    `₹${Number(amount || 0).toLocaleString("en-IN")}`;

const formatDate = (date) => {
    if (!date) return "Date not available";

    const parsedDate = new Date(date);

    if (Number.isNaN(parsedDate.getTime())) return "Date not available";

    return parsedDate.toLocaleDateString("en-IN", {
        day: "2-digit",
        month: "short",
        year: "numeric",
    });
};

const getStatusStyle = (status) => {
    switch (status?.toLowerCase()) {
        case "pending":
            return "bg-orange-50 text-orange-700";

        case "accepted":
            return "bg-blue-50 text-blue-700";

        case "completed":
            return "bg-green-50 text-green-700";

        case "rejected":
            return "bg-red-50 text-red-700";

        case "cancelled":
            return "bg-gray-100 text-gray-600";

        default:
            return "bg-gray-100 text-gray-600";
    }
};

function DashboardStatCard({ title, value, icon: Icon, color }) {
    const colors = {
        blue: "bg-blue-50 text-blue-600",
        orange: "bg-orange-50 text-orange-600",
        green: "bg-green-50 text-green-600",
        purple: "bg-purple-50 text-purple-600",
    };

    return (
        <div className="rounded-2xl border border-[#ead8c7] bg-white p-4 shadow-sm sm:p-5">
            <div className="flex items-center justify-between gap-2">
                <div
                    className={`flex size-11 items-center justify-center rounded-xl ${
                        colors[color] || colors.orange
                    }`}
                >
                    <Icon size={21} />
                </div>
            </div>

            <p className="mt-4 text-sm font-medium text-[#82736b]">
                {title}
            </p>

            <h3 className="mt-1 text-2xl font-bold text-[#39251d]">
                {value}
            </h3>
        </div>
    );
}

export default function PanditDashboardScreen() {
    const [bookings, setBookings] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    const fetchDashboardData = useCallback(async () => {
        try {
            setLoading(true);
            setError("");

            // Same API already used in PanditBookingsScreen
            const response = await getPanditBookings();

            const list = Array.isArray(response?.data)
                ? response.data
                : [];

            setBookings(list);
        } catch (err) {
            console.error("Pandit dashboard error:", err);
            setError(err?.message || "Unable to load dashboard data.");
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchDashboardData();
    }, [fetchDashboardData]);

    // Dashboard statistics
    const totalBookings = bookings.length;

    const pendingCount = bookings.filter(
        (booking) => booking.status?.toLowerCase() === "pending"
    ).length;

    const completedCount = bookings.filter(
        (booking) => booking.status?.toLowerCase() === "completed"
    ).length;

    const totalEarnings = bookings
        .filter(
            (booking) =>
                booking.payment_status?.toLowerCase() === "paid"
        )
        .reduce(
            (total, booking) =>
                total + Number(booking.service_price || 0),
            0
        );

    // Latest two bookings
    const recentBookings = [...bookings]
        .sort(
            (a, b) =>
                new Date(b.created_at || 0).getTime() -
                new Date(a.created_at || 0).getTime()
        )
        .slice(0, 2);

    return (
        <div className="space-y-6">

            {/* Page Heading */}
            <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
                <div>
                    <p className="text-xs font-bold tracking-[0.18em] text-[#a66a48]">
                        PANDIT / OVERVIEW
                    </p>

                    <h1 className="mt-2 text-2xl font-bold text-[#573323] sm:text-3xl">
                        Welcome to your Dashboard
                    </h1>

                    <p className="mt-2 text-sm text-[#82736b]">
                        Manage your profile, puja services and customer bookings.
                    </p>
                </div>

                <div className="flex flex-wrap gap-2">
                    <button
                        type="button"
                        onClick={fetchDashboardData}
                        disabled={loading}
                        className="inline-flex items-center justify-center gap-2 rounded-xl border border-[#e8ddce] bg-white px-4 py-3 text-sm font-semibold text-[#705647] hover:bg-[#fff8f2] disabled:opacity-50"
                    >
                        <RefreshCw
                            size={16}
                            className={loading ? "animate-spin" : ""}
                        />
                        Refresh
                    </button>

                    <Link
                        href="/pandit/complete-profile"
                        className="inline-flex items-center justify-center gap-2 rounded-xl bg-[#8b472e] px-4 py-3 text-sm font-semibold text-white hover:bg-[#713923]"
                    >
                        Complete Profile
                        <ArrowRight size={17} />
                    </Link>
                </div>
            </div>

            {/* Profile Banner */}
            <div className="rounded-2xl border border-[#ead8c7] bg-gradient-to-r from-[#fff4e8] to-[#fffdf7] p-5 sm:p-7">
                <div className="flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-center">
                    <div className="max-w-xl">
                        <div className="flex items-center gap-2">
                            <UserRound
                                size={20}
                                className="text-[#8b472e]"
                            />

                            <span className="text-xs font-bold tracking-wider text-[#a66a48]">
                                YOUR PROFESSIONAL PROFILE
                            </span>
                        </div>

                        <h2 className="mt-3 text-xl font-bold text-[#573323] sm:text-2xl">
                            Build your Pandit profile
                        </h2>

                        <p className="mt-2 text-sm leading-6 text-[#82736b]">
                            Keep your profile and puja services updated so
                            devotees can learn about your services and
                            connect with you.
                        </p>
                    </div>

                    <Link
                        href="/pandit/complete-profile"
                        className="inline-flex shrink-0 items-center gap-2 rounded-xl border border-[#8b472e] px-4 py-3 text-sm font-semibold text-[#8b472e] transition hover:bg-[#8b472e] hover:text-white"
                    >
                        Update Profile
                        <ArrowRight size={16} />
                    </Link>
                </div>
            </div>

            {/* Error Message */}
            {error && (
                <div className="flex flex-wrap items-center justify-between gap-3 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
                    <span>{error}</span>

                    <button
                        type="button"
                        onClick={fetchDashboardData}
                        className="font-semibold underline"
                    >
                        Try Again
                    </button>
                </div>
            )}

            {/* Statistics */}
            <div className="grid grid-cols-2 gap-4 xl:grid-cols-4">
                <DashboardStatCard
                    title="Total Bookings"
                    value={loading ? "..." : totalBookings}
                    icon={CalendarDays}
                    color="blue"
                />

                <DashboardStatCard
                    title="Pending Requests"
                    value={loading ? "..." : pendingCount}
                    icon={Clock3}
                    color="orange"
                />

                <DashboardStatCard
                    title="Completed Bookings"
                    value={loading ? "..." : completedCount}
                    icon={CheckCircle2}
                    color="green"
                />

                <DashboardStatCard
                    title="Total Earnings"
                    value={loading ? "..." : formatMoney(totalEarnings)}
                    icon={Wallet}
                    color="purple"
                />
            </div>

            {/* Recent Bookings and Quick Actions */}
            <div className="grid gap-6 xl:grid-cols-2">

                {/* Recent Bookings */}
                <section className="overflow-hidden rounded-2xl border border-[#e8ddce] bg-white">
                    <div className="flex items-center justify-between gap-3 border-b border-[#eee4da] px-5 py-4">
                        <div>
                            <h2 className="font-bold text-[#573323]">
                                Recent Bookings
                            </h2>

                            <p className="mt-1 text-xs text-gray-500">
                                Your latest devotee booking requests.
                            </p>
                        </div>

                        <Link
                            href="/pandit/bookings"
                            className="inline-flex shrink-0 items-center gap-1 text-sm font-semibold text-[#8b472e] hover:underline"
                        >
                            View All
                            <ArrowRight size={15} />
                        </Link>
                    </div>

                    {loading ? (
                        <div className="space-y-4 p-5">
                            {[1, 2].map((item) => (
                                <div
                                    key={item}
                                    className="flex animate-pulse gap-3"
                                >
                                    <div className="size-11 rounded-xl bg-gray-100" />

                                    <div className="flex-1 space-y-2">
                                        <div className="h-4 w-1/2 rounded bg-gray-100" />
                                        <div className="h-3 w-1/3 rounded bg-gray-100" />
                                        <div className="h-3 w-1/4 rounded bg-gray-100" />
                                    </div>
                                </div>
                            ))}
                        </div>
                    ) : recentBookings.length === 0 ? (
                        <div className="px-5 py-12 text-center">
                            <CalendarDays
                                size={34}
                                className="mx-auto text-[#bd947d]"
                            />

                            <h3 className="mt-3 font-semibold text-[#573323]">
                                No Bookings Yet
                            </h3>

                            <p className="mt-1 text-sm text-gray-500">
                                New devotee bookings will appear here.
                            </p>
                        </div>
                    ) : (
                        <div className="divide-y divide-[#f1e9e1] px-5">
                            {recentBookings.map((booking) => (
                                <div
                                    key={booking.id}
                                    className="flex items-start justify-between gap-3 py-5"
                                >
                                    <div className="flex min-w-0 gap-3">
                                        <div className="flex size-11 shrink-0 items-center justify-center rounded-xl bg-[#fff4e8] text-[#8b472e]">
                                            <CalendarCheck size={20} />
                                        </div>

                                        <div className="min-w-0">
                                            <h3 className="truncate font-semibold text-[#573323]">
                                                {booking.service_name ||
                                                    (booking.puja_id
                                                        ? `Puja #${booking.puja_id}`
                                                        : "Puja Service")}
                                            </h3>

                                            <p className="mt-1 flex items-center gap-1 text-sm text-gray-600">
                                                <UserRound size={13} />
                                                {booking.devotee_name || "Devotee"}
                                            </p>

                                            <p className="mt-2 flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-gray-500">
                                                <span className="flex items-center gap-1">
                                                    <CalendarDays size={13} />
                                                    {formatDate(booking.booking_date)}
                                                </span>

                                                {booking.city && (
                                                    <span className="flex items-center gap-1">
                                                        <MapPin size={13} />
                                                        {booking.city}
                                                    </span>
                                                )}
                                            </p>

                                            <p className="mt-2 text-sm font-semibold text-[#573323]">
                                                {formatMoney(booking.service_price)}
                                            </p>
                                        </div>
                                    </div>

                                    <span
                                        className={`shrink-0 rounded-full px-3 py-1 text-xs font-semibold capitalize ${getStatusStyle(
                                            booking.status
                                        )}`}
                                    >
                                        {booking.status || "Pending"}
                                    </span>
                                </div>
                            ))}
                        </div>
                    )}
                </section>

                {/* Quick Actions */}
                <section className="rounded-2xl border border-[#e8ddce] bg-white p-5">
                    <div className="mb-5">
                        <h2 className="font-bold text-[#573323]">
                            Quick Actions
                        </h2>

                        <p className="mt-1 text-xs text-gray-500">
                            Manage your pandit account and services.
                        </p>
                    </div>

                    <div className="grid gap-3 sm:grid-cols-2">
                        <Link
                            href="/pandit/profile"
                            className="group flex items-center gap-3 rounded-xl border border-[#eee4da] p-4 transition hover:border-[#d9b59b] hover:bg-[#fffaf5]"
                        >
                            <div className="flex size-11 shrink-0 items-center justify-center rounded-xl bg-orange-50 text-[#8b472e]">
                                <UserRound size={20} />
                            </div>

                            <div className="min-w-0">
                                <h3 className="font-semibold text-[#573323]">
                                    My Profile
                                </h3>

                                <p className="mt-1 text-xs text-gray-500">
                                    Manage your details
                                </p>
                            </div>

                            <ArrowRight
                                size={16}
                                className="ml-auto shrink-0 text-gray-400 transition group-hover:translate-x-1"
                            />
                        </Link>

                        <Link
                            href="/pandit/services"
                            className="group flex items-center gap-3 rounded-xl border border-[#eee4da] p-4 transition hover:border-[#d9b59b] hover:bg-[#fffaf5]"
                        >
                            <div className="flex size-11 shrink-0 items-center justify-center rounded-xl bg-blue-50 text-blue-600">
                                <BriefcaseBusiness size={20} />
                            </div>

                            <div className="min-w-0">
                                <h3 className="font-semibold text-[#573323]">
                                    My Services
                                </h3>

                                <p className="mt-1 text-xs text-gray-500">
                                    Manage puja services
                                </p>
                            </div>

                            <ArrowRight
                                size={16}
                                className="ml-auto shrink-0 text-gray-400 transition group-hover:translate-x-1"
                            />
                        </Link>

                        <Link
                            href="/pandit/bookings"
                            className="group flex items-center gap-3 rounded-xl border border-[#eee4da] p-4 transition hover:border-[#d9b59b] hover:bg-[#fffaf5]"
                        >
                            <div className="flex size-11 shrink-0 items-center justify-center rounded-xl bg-green-50 text-green-600">
                                <CalendarDays size={20} />
                            </div>

                            <div className="min-w-0">
                                <h3 className="font-semibold text-[#573323]">
                                    My Bookings
                                </h3>

                                <p className="mt-1 text-xs text-gray-500">
                                    View booking requests
                                </p>
                            </div>

                            <ArrowRight
                                size={16}
                                className="ml-auto shrink-0 text-gray-400 transition group-hover:translate-x-1"
                            />
                        </Link>

                        <Link
                            href="/pandit/earnings"
                            className="group flex items-center gap-3 rounded-xl border border-[#eee4da] p-4 transition hover:border-[#d9b59b] hover:bg-[#fffaf5]"
                        >
                            <div className="flex size-11 shrink-0 items-center justify-center rounded-xl bg-purple-50 text-purple-600">
                                <IndianRupee size={20} />
                            </div>

                            <div className="min-w-0">
                                <h3 className="font-semibold text-[#573323]">
                                    My Earnings
                                </h3>

                                <p className="mt-1 text-xs text-gray-500">
                                    View payment details
                                </p>
                            </div>

                            <ArrowRight
                                size={16}
                                className="ml-auto shrink-0 text-gray-400 transition group-hover:translate-x-1"
                            />
                        </Link>
                    </div>
                </section>
            </div>
        </div>
    );
}

