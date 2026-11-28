
"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

import {
    MapPin,
    CalendarDays,
    Pencil,
    History,
    Flower2,
    Users,
    Clock,
    CheckCircle2,
    Wallet,
    ArrowRight,
    Sparkles,
    LoaderCircle,
    CalendarCheck,
    UserRound,
} from "lucide-react";

import { useAuth } from "@/hooks/useAuth";
import { getDevoteeBookings } from "@/services/bookingService";

function getInitials(name = "") {
    return (
        name
            .trim()
            .split(/\s+/)
            .filter(Boolean)
            .slice(0, 2)
            .map((part) => part[0].toUpperCase())
            .join("") || "U"
    );
}

function formatDate(date) {
    if (!date) return "Date not available";

    const datePart = String(date).slice(0, 10);
    const [year, month, day] = datePart.split("-").map(Number);

    if (!year || !month || !day) return datePart;

    return new Date(year, month - 1, day).toLocaleDateString("en-IN", {
        day: "2-digit",
        month: "short",
        year: "numeric",
    });
}

function formatTime(time) {
    if (!time) return "";

    const [hours, minutes] = String(time).slice(0, 5).split(":");

    if (hours === undefined || minutes === undefined) return time;

    const date = new Date();
    date.setHours(Number(hours), Number(minutes), 0, 0);

    return date.toLocaleTimeString("en-IN", {
        hour: "2-digit",
        minute: "2-digit",
        hour12: true,
    });
}

function formatPrice(price) {
    if (price === null || price === undefined || price === "") {
        return "Price unavailable";
    }

    return `₹${Number(price).toLocaleString("en-IN")}`;
}

function getBookingTitle(booking, type) {
    return type === "puja"
        ? booking.puja_name || booking.service_name || "Puja Booking"
        : booking.service_name || "Pandit Service";
}

function getStatusStyle(status) {
    switch (String(status || "").toLowerCase()) {
        case "completed":
            return "bg-green-50 text-green-700";

        case "cancelled":
        case "rejected":
            return "bg-red-50 text-red-600";

        case "accepted":
            return "bg-blue-50 text-blue-700";

        default:
            return "bg-[#fff0e5] text-[#bd6439]";
    }
}

function AccountSection({ title, children, action }) {
    return (
        <section className="space-y-4">
            <div className="flex items-center justify-between gap-3">
                <h2 className="font-display text-xl font-medium tracking-tight text-[#39251d] sm:text-2xl">
                    {title}
                </h2>
                {action}
            </div>

            <div className="overflow-hidden rounded-[25px] border border-[#e5dccb] bg-white shadow-[0_2px_8px_rgba(70,45,25,0.025)]">
                {children}
            </div>
        </section>
    );
}

function StatCard({ title, value, icon: Icon, description }) {
    return (
        <div className="rounded-2xl border border-[#e9dfd1] bg-white p-4 shadow-[0_2px_8px_rgba(70,45,25,0.03)] sm:p-5">
            <div className="flex items-center justify-between gap-2">
                <span className="text-sm text-[#82736b]">{title}</span>
                <span className="flex size-10 items-center justify-center rounded-xl bg-[#fff0e5] text-[#bd6439]">
                    <Icon size={20} />
                </span>
            </div>

            <p className="mt-3 font-display text-3xl font-semibold text-[#39251d]">
                {value}
            </p>

            <p className="mt-1 text-xs text-[#a39488]">{description}</p>
        </div>
    );
}

function BookingCard({ booking, type }) {
    const status = String(booking.status || "pending");
    const isPuja = type === "puja";

    return (
        <div className="flex items-center gap-3 border-b border-[#eee8dc] px-4 py-5 last:border-b-0 sm:gap-5 sm:px-6">
            <span className="flex size-12 shrink-0 items-center justify-center rounded-full bg-[#f7e5e3] text-[#873d35]">
                {isPuja ? <Flower2 size={24} /> : <UserRound size={23} />}
            </span>

            <div className="min-w-0 flex-1">
                <h3 className="truncate text-sm font-semibold text-[#39251d] sm:text-base">
                    {getBookingTitle(booking, type)}
                </h3>

                <p className="mt-1 truncate text-sm text-[#82736b]">
                    {booking.pandit_name || "Pandit not assigned"}
                </p>

                <p className="mt-1.5 flex items-center gap-1.5 text-xs text-[#88766d] sm:text-sm">
                    <CalendarDays size={15} className="shrink-0 text-[#c75d31]" />
                    <span className="truncate">
                        {formatDate(booking.booking_date)}
                        {booking.booking_time
                            ? ` · ${formatTime(booking.booking_time)}`
                            : ""}
                    </span>
                </p>
            </div>

            <div className="flex shrink-0 flex-col items-end gap-2">
                <span className={`rounded-full px-2.5 py-1 text-[10px] font-semibold capitalize sm:text-xs ${getStatusStyle(status)}`}>
                    {status}
                </span>

                <span className="font-display text-sm font-semibold text-[#713c32] sm:text-base">
                    {formatPrice(booking.service_price)}
                </span>
            </div>
        </div>
    );
}

function QuickAction({ href, icon: Icon, title, description }) {
    return (
        <Link
            href={href}
            className="group flex items-center gap-3 rounded-2xl border border-[#eee1d3] bg-white p-4 transition hover:-translate-y-0.5 hover:border-[#e5b99e] hover:shadow-md"
        >
            <span className="flex size-11 shrink-0 items-center justify-center rounded-xl bg-[#fff0e5] text-[#bd6439] transition group-hover:bg-[#fbe3d3]">
                <Icon size={21} />
            </span>

            <span className="min-w-0 flex-1">
                <span className="block text-sm font-semibold text-[#39251d]">
                    {title}
                </span>
                <span className="mt-1 block text-xs text-[#82736b]">
                    {description}
                </span>
            </span>

            <ArrowRight
                size={17}
                className="shrink-0 text-[#bd6439] transition group-hover:translate-x-1"
            />
        </Link>
    );
}

function DevoteeAccountContent() {
    const { user } = useAuth();

    const [pujaBookings, setPujaBookings] = useState([]);
    const [serviceBookings, setServiceBookings] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    const name = user?.name || "Devotee";
    const initials = getInitials(name);

    useEffect(() => {
        let active = true;

        const fetchDashboardBookings = async () => {
            try {
                setLoading(true);
                setError("");

                const [pujaResponse, serviceResponse] = await Promise.all([
                    getDevoteeBookings("puja"),
                    getDevoteeBookings("service"),
                ]);

                if (!active) return;

                setPujaBookings(
                    Array.isArray(pujaResponse) ? pujaResponse : []
                );

                setServiceBookings(
                    Array.isArray(serviceResponse) ? serviceResponse : []
                );
            } catch (err) {
                console.error("Dashboard Booking Error:", err);

                if (active) {
                    setError("Unable to load your bookings.");
                }
            } finally {
                if (active) setLoading(false);
            }
        };

        fetchDashboardBookings();

        return () => {
            active = false;
        };
    }, []);

    const allBookings = [...pujaBookings, ...serviceBookings];

    const completedCount = allBookings.filter(
        (booking) => String(booking.status).toLowerCase() === "completed"
    ).length;

    const pendingCount = allBookings.filter(
        (booking) => ["pending", "accepted"].includes(
            String(booking.status).toLowerCase()
        )
    ).length;

    const upcomingBookings = allBookings
        .filter((booking) => {
            const status = String(booking.status).toLowerCase();

            if (!["pending", "accepted"].includes(status)) return false;

            const bookingDate = String(booking.booking_date || "").slice(0, 10);
            const today = new Date().toLocaleDateString("en-CA");

            return bookingDate >= today;
        })
        .sort((a, b) =>
            String(a.booking_date).localeCompare(String(b.booking_date))
        );

    const recentPujas = [...pujaBookings]
        .sort((a, b) => b.id - a.id)
        .slice(0, 4);

    const recentServices = [...serviceBookings]
        .sort((a, b) => b.id - a.id)
        .slice(0, 4);

    return (
        <div className="mx-auto w-full max-w-6xl space-y-8 pb-12">

            {/* Welcome Header */}
            <section className="relative overflow-hidden rounded-[28px] bg-gradient-to-br from-[#e95b0b] via-[#d6531d] to-[#873d35] p-6 text-white shadow-[0_8px_25px_rgba(190,83,35,0.15)] sm:p-8">
                <div className="absolute -right-16 -top-20 size-64 rounded-full border border-white/15" />
                <div className="absolute -bottom-36 right-20 size-72 rounded-full border border-white/10" />

                <div className="relative z-10 flex flex-col justify-between gap-5 sm:flex-row sm:items-center">
                    <div>
                        <p className="text-sm font-medium text-white/75">
                            Welcome back,
                        </p>

                        <h1 className="mt-2 font-display text-3xl font-semibold sm:text-4xl">
                            Namaste, {name.split(" ")[0]}!
                        </h1>

                        <p className="mt-3 max-w-lg text-sm leading-6 text-white/80">
                            Your spiritual journey starts here. Manage your
                            bookings, explore auspicious moments and stay
                            connected with your traditions.
                        </p>
                    </div>

                    <Link
                        href="/account/profile"
                        className="inline-flex shrink-0 items-center justify-center gap-2 rounded-full border border-white/30 bg-white/15 px-5 py-3 text-sm font-semibold backdrop-blur-md transition hover:bg-white/25"
                    >
                        <Pencil size={16} />
                        Edit Profile
                    </Link>
                </div>
            </section>

            {/* Profile Card */}
            <section className="rounded-[25px] border border-[#e6ddce] bg-white p-5 shadow-[0_3px_12px_rgba(70,45,25,0.04)] sm:p-6">
                <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
                    <div className="flex size-16 shrink-0 items-center justify-center rounded-full bg-[#fce7d8] font-display text-2xl text-[#bd6439] sm:size-20 sm:text-3xl">
                        {initials}
                    </div>

                    <div className="min-w-0 flex-1">
                        <div className="flex flex-wrap items-center gap-2">
                            <h2 className="font-display text-xl font-semibold text-[#39251d] sm:text-2xl">
                                {name}
                            </h2>

                            <span className="rounded-full bg-[#f8e8e7] px-3 py-1 text-xs font-medium text-[#843f3b]">
                                Devotee
                            </span>
                        </div>

                        <p className="mt-2 break-all text-sm text-[#84766e]">
                            {user?.email || "Email not added"}
                        </p>

                        <p className="mt-1 text-sm text-[#84766e]">
                            {user?.phone || user?.mobile || "Mobile number not added"}
                        </p>

                        <p className="mt-2 flex items-center gap-1.5 text-sm text-[#bd6339]">
                            <MapPin size={16} />
                            {user?.city || "Jaipur"}
                        </p>
                    </div>
                </div>
            </section>

            {/* Booking Statistics */}
            <section>
                <div className="mb-4 flex items-center justify-between">
                    <h2 className="font-display text-xl font-medium text-[#39251d] sm:text-2xl">
                        Booking Overview
                    </h2>
                </div>

                {loading ? (
                    <div className="flex justify-center rounded-2xl border border-[#e9dfd1] bg-white py-10">
                        <LoaderCircle className="animate-spin text-[#bd6439]" />
                    </div>
                ) : (
                    <div className="grid grid-cols-2 gap-3 xl:grid-cols-4">
                        <StatCard
                            title="Total Bookings"
                            value={allBookings.length}
                            icon={CalendarCheck}
                            description="All your bookings"
                        />

                        <StatCard
                            title="Upcoming"
                            value={upcomingBookings.length}
                            icon={Clock}
                            description="Pending and accepted"
                        />

                        <StatCard
                            title="Completed"
                            value={completedCount}
                            icon={CheckCircle2}
                            description="Successfully completed"
                        />

                        <StatCard
                            title="Pending"
                            value={pendingCount}
                            icon={Wallet}
                            description="Awaiting completion"
                        />
                    </div>
                )}
            </section>

            {/* Error */}
            {error && (
                <div className="rounded-xl border border-red-100 bg-red-50 p-4 text-sm text-red-600">
                    {error}
                    <button
                        onClick={() => window.location.reload()}
                        className="ml-2 font-semibold underline"
                    >
                        Retry
                    </button>
                </div>
            )}

            {/* Quick Actions */}
            <section className="space-y-4">
                <h2 className="font-display text-xl font-medium text-[#39251d] sm:text-2xl">
                    Quick Actions
                </h2>

                <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
                    <QuickAction
                        href="/muhurat"
                        icon={Sparkles}
                        title="Find Muhurat"
                        description="Discover auspicious timings"
                    />

                    <QuickAction
                        href="/pujas"
                        icon={Flower2}
                        title="Explore Pujas"
                        description="Browse religious ceremonies"
                    />

                    <QuickAction
                        href="/pandits"
                        icon={Users}
                        title="Find Pandit"
                        description="Connect with trusted Pandits"
                    />

                    <QuickAction
                        href="/account/family"
                        icon={Users}
                        title="My Family"
                        description="Manage family reminders"
                    />
                </div>
            </section>

            {/* Upcoming Bookings */}
            <AccountSection
                title="Upcoming Bookings"
                action={
                    <Link
                        href="/account/bookings"
                        className="shrink-0 text-sm font-medium text-[#bd6339] hover:underline"
                    >
                        View All
                    </Link>
                }
            >
                {loading ? (
                    <div className="flex justify-center py-10">
                        <LoaderCircle className="animate-spin text-[#bd6439]" />
                    </div>
                ) : upcomingBookings.length > 0 ? (
                    upcomingBookings.slice(0, 3).map((booking) => (
                        <BookingCard
                            key={`${booking.booking_type}-${booking.id}`}
                            booking={booking}
                            type={booking.booking_type}
                        />
                    ))
                ) : (
                    <div className="px-5 py-10 text-center">
                        <CalendarDays
                            size={32}
                            className="mx-auto text-[#bd6439]"
                        />
                        <p className="mt-3 font-semibold text-[#39251d]">
                            No Upcoming Bookings
                        </p>
                        <p className="mt-1 text-sm text-[#82736b]">
                            Your upcoming Puja and Pandit bookings will appear here.
                        </p>
                        <Link
                            href="/pujas"
                            className="mt-4 inline-flex items-center gap-2 rounded-full bg-[#d6531d] px-5 py-2.5 text-sm font-semibold text-white"
                        >
                            Explore Pujas
                            <ArrowRight size={16} />
                        </Link>
                    </div>
                )}
            </AccountSection>

            {/* Recent Puja History */}
            <AccountSection
                title="Recent Puja History"
                action={
                    <Link
                        href="/account/puja-history"
                        className="shrink-0 text-sm font-medium text-[#bd6339] hover:underline"
                    >
                        View All
                    </Link>
                }
            >
                <div className="flex items-center gap-3 border-b border-[#eee8dc] px-5 py-4">
                    <span className="flex size-10 items-center justify-center rounded-full bg-[#fbe9df] text-[#c85d2d]">
                        <History size={21} />
                    </span>

                    <span className="text-sm text-[#82736b]">
                        {pujaBookings.length} Puja bookings
                    </span>
                </div>

                {loading ? (
                    <div className="flex justify-center py-10">
                        <LoaderCircle className="animate-spin text-[#bd6439]" />
                    </div>
                ) : recentPujas.length > 0 ? (
                    recentPujas.map((booking) => (
                        <BookingCard
                            key={booking.id}
                            booking={booking}
                            type="puja"
                        />
                    ))
                ) : (
                    <p className="px-5 py-8 text-center text-sm text-[#82736b]">
                        No Puja history available.
                    </p>
                )}
            </AccountSection>

            {/* Recent Pandit Bookings */}
            <AccountSection
                title="Recent Pandit Bookings"
                action={
                    <Link
                        href="/account/bookings"
                        className="shrink-0 text-sm font-medium text-[#bd6339] hover:underline"
                    >
                        View All
                    </Link>
                }
            >
                <div className="flex items-center gap-3 border-b border-[#eee8dc] px-5 py-4">
                    <span className="flex size-10 items-center justify-center rounded-full bg-[#fbe9df] text-[#c85d2d]">
                        <Users size={21} />
                    </span>

                    <span className="text-sm text-[#82736b]">
                        {serviceBookings.length} service bookings
                    </span>
                </div>

                {loading ? (
                    <div className="flex justify-center py-10">
                        <LoaderCircle className="animate-spin text-[#bd6439]" />
                    </div>
                ) : recentServices.length > 0 ? (
                    recentServices.map((booking) => (
                        <BookingCard
                            key={booking.id}
                            booking={booking}
                            type="service"
                        />
                    ))
                ) : (
                    <p className="px-5 py-8 text-center text-sm text-[#82736b]">
                        No Pandit service bookings available.
                    </p>
                )}
            </AccountSection>

            <p className="pb-3 text-center text-xs text-[#a39488]">
                MuhuratMitra · Your Spiritual Companion
            </p>
        </div>
    );
}

export default function AccountPage() {
    return <DevoteeAccountContent />;
}
