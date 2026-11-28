
"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import {
    Users,
    UserCheck,
    CalendarDays,
    IndianRupee,
    Flower2,
    Clock,
    CheckCircle2,
    XCircle,
    ArrowUpRight,
    Plus,
    Eye,
    RefreshCw,
    LayoutDashboard,
    TrendingUp,
    Activity,
    CreditCard,
    Bell,
} from "lucide-react";

import { apiCall } from "@/lib/api";
import { useAuth } from "@/hooks/useAuth";

const statCards = [
    {
        title: "Total Devotees",
        value: "—",
        description: "Registered devotees",
        icon: Users,
        color: "bg-blue-50 text-blue-600",
    },
    {
        title: "Total Pandits",
        value: "—",
        description: "Registered pandits",
        icon: UserCheck,
        color: "bg-purple-50 text-purple-600",
    },
    {
        title: "Total Bookings",
        value: "—",
        description: "All bookings",
        icon: CalendarDays,
        color: "bg-orange-50 text-orange-600",
    },
    {
        title: "Total Revenue",
        value: "—",
        description: "Successful payments",
        icon: IndianRupee,
        color: "bg-green-50 text-green-600",
    },
];

const managementStats = [
    {
        title: "Total Pujas",
        value: "—",
        icon: Flower2,
        color: "text-orange-600 bg-orange-50",
    },
    {
        title: "Completed Bookings",
        value: "—",
        icon: CheckCircle2,
        color: "text-green-600 bg-green-50",
    },
    {
        title: "Pending Bookings",
        value: "—",
        icon: Clock,
        color: "text-amber-600 bg-amber-50",
    },
    {
        title: "Cancelled Bookings",
        value: "—",
        icon: XCircle,
        color: "text-red-600 bg-red-50",
    },
];

const quickActions = [
    {
        title: "Manage Pandits",
        description: "Review and manage pandit accounts",
        href: "/admin/pandits",
        icon: UserCheck,
    },
    {
        title: "Manage Users",
        description: "View registered devotees",
        href: "/admin/users",
        icon: Users,
    },
    {
        title: "Manage Pujas",
        description: "Add and update puja services",
        href: "/admin/pujas",
        icon: Flower2,
    },
    {
        title: "Manage Bookings",
        description: "Track all platform bookings",
        href: "/admin/bookings",
        icon: CalendarDays,
    },
];

function getArrayResponse(response) {
    if (Array.isArray(response)) return response;

    if (Array.isArray(response?.data)) {
        return response.data;
    }

    if (Array.isArray(response?.data?.data)) {
        return response.data.data;
    }

    if (Array.isArray(response?.data?.pandits)) {
        return response.data.pandits;
    }

    if (Array.isArray(response?.pandits)) {
        return response.pandits;
    }

    return [];
}

function formatDate(date) {
    if (!date) return "—";

    const parsedDate = new Date(date);

    if (Number.isNaN(parsedDate.getTime())) return "—";

    return parsedDate.toLocaleDateString("en-IN", {
        day: "numeric",
        month: "short",
        year: "numeric",
    });
}

function StatCard({ item }) {
    const Icon = item.icon;

    return (
        <div className="rounded-2xl border border-[#eadfd2] bg-white p-5 shadow-[0_3px_14px_rgba(76,48,30,0.04)] transition hover:-translate-y-0.5 hover:shadow-md">
            <div className="flex items-start justify-between gap-3">
                <div>
                    <p className="text-sm font-medium text-[#82736b]">
                        {item.title}
                    </p>

                    <h3 className="mt-3 text-2xl font-bold text-[#39251d]">
                        {item.value}
                    </h3>

                    <p className="mt-1 text-xs text-[#9b8c83]">
                        {item.description}
                    </p>
                </div>

                <div className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-xl ${item.color}`}>
                    <Icon size={21} />
                </div>
            </div>
        </div>
    );
}

function SectionHeader({ title, description, action }) {
    return (
        <div className="mb-5 flex flex-wrap items-center justify-between gap-3">
            <div>
                <h2 className="text-lg font-bold text-[#39251d]">
                    {title}
                </h2>
                {description && (
                    <p className="mt-1 text-sm text-[#95847a]">
                        {description}
                    </p>
                )}
            </div>

            {action}
        </div>
    );
}

export default function AdminDashboardPage() {
    const { logout } = useAuth();

    const [pendingPandits, setPendingPandits] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    const fetchDashboard = async () => {
        try {
            setLoading(true);
            setError("");

            const response = await apiCall({
                endpoint: "/admin/pandits/pending",
                method: "GET",
            });

            setPendingPandits(getArrayResponse(response));
        } catch (err) {
            console.error("Admin dashboard error:", err);
            setError(
                err?.message || "Unable to load pending pandit approvals."
            );
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchDashboard();
    }, []);

    const handleLogout = async () => {
        try {
            await logout();
            window.location.href = "/login";
        } catch (error) {
            console.error("Logout error:", error);
        }
    };

    return (
        <div className="min-w-0 space-y-7 pb-8">

            {/* Dashboard Header */}
            <div className="flex flex-wrap items-center justify-between gap-4">
                <div>
                    <div className="mb-2 flex items-center gap-2 text-sm text-[#9a8172]">
                        <LayoutDashboard size={16} />
                        <span>Administration</span>
                        <span>/</span>
                        <span>Dashboard</span>
                    </div>

                    <h1 className="text-2xl font-bold tracking-tight text-[#39251d] sm:text-3xl">
                        Dashboard Overview
                    </h1>

                    <p className="mt-2 text-sm text-[#82736b]">
                        Welcome to your MuhuratMitra administration panel.
                    </p>
                </div>

                <div className="flex items-center gap-2">
                    <button
                        onClick={fetchDashboard}
                        disabled={loading}
                        className="flex items-center gap-2 rounded-xl border border-[#e8ddce] bg-white px-4 py-2.5 text-sm font-semibold text-[#705647] transition hover:bg-[#f8f1e9] disabled:opacity-50"
                    >
                        <RefreshCw
                            size={16}
                            className={loading ? "animate-spin" : ""}
                        />
                        Refresh
                    </button>

                    <button
                        onClick={handleLogout}
                        className="rounded-xl bg-[#8b472e] px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-[#713923]"
                    >
                        Logout
                    </button>
                </div>
            </div>

            {/* Main Statistics */}
            <section>
                <SectionHeader
                    title="Platform Overview"
                    description="A quick summary of your platform performance"
                />

                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
                    {statCards.map((item) => (
                        <StatCard key={item.title} item={item} />
                    ))}
                </div>
            </section>

            {/* Additional Statistics */}
            <section>
                <SectionHeader
                    title="Booking Overview"
                    description="Booking and service statistics"
                />

                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
                    {managementStats.map((item) => (
                        <div
                            key={item.title}
                            className="flex items-center gap-4 rounded-2xl border border-[#eadfd2] bg-white p-4"
                        >
                            <div className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-xl ${item.color}`}>
                                <item.icon size={21} />
                            </div>

                            <div>
                                <p className="text-sm text-[#82736b]">
                                    {item.title}
                                </p>
                                <h3 className="mt-1 text-xl font-bold text-[#39251d]">
                                    {item.value}
                                </h3>
                            </div>
                        </div>
                    ))}
                </div>
            </section>

            {/* Pending Approvals */}
            <section className="rounded-2xl border border-[#eadfd2] bg-white p-5 shadow-[0_3px_14px_rgba(76,48,30,0.04)] sm:p-6">
                <SectionHeader
                    title="Pending Pandit Approvals"
                    description="Pandits waiting for admin verification"
                    action={
                        <Link
                            href="/admin/pandits"
                            className="flex items-center gap-1 text-sm font-semibold text-[#8b472e] hover:underline"
                        >
                            View All
                            <ArrowUpRight size={16} />
                        </Link>
                    }
                />

                {error && (
                    <div className="mb-4 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
                        {error}
                    </div>
                )}

                {loading ? (
                    <div className="space-y-3">
                        {[1, 2, 3].map((item) => (
                            <div
                                key={item}
                                className="h-16 animate-pulse rounded-xl bg-[#f7f1e9]"
                            />
                        ))}
                    </div>
                ) : pendingPandits.length === 0 ? (
                    <div className="rounded-xl border border-dashed border-[#e8ddce] py-12 text-center">
                        <CheckCircle2
                            size={35}
                            className="mx-auto mb-3 text-green-600"
                        />
                        <h3 className="font-semibold text-[#39251d]">
                            No Pending Approvals
                        </h3>
                        <p className="mt-1 text-sm text-[#95847a]">
                            All pandit applications are up to date.
                        </p>
                    </div>
                ) : (
                    <>
                        <div className="hidden overflow-x-auto md:block">
                            <table className="w-full text-left">
                                <thead>
                                    <tr className="border-b border-[#eee5dc] text-xs uppercase tracking-wider text-[#9a8172]">
                                        <th className="px-4 py-3 font-semibold">Pandit</th>
                                        <th className="px-4 py-3 font-semibold">Email</th>
                                        <th className="px-4 py-3 font-semibold">Mobile</th>
                                        <th className="px-4 py-3 font-semibold">Registered</th>
                                        <th className="px-4 py-3 text-right font-semibold">Action</th>
                                    </tr>
                                </thead>

                                <tbody>
                                    {pendingPandits.slice(0, 5).map((pandit, index) => (
                                        <tr
                                            key={pandit.id || index}
                                            className="border-b border-[#f2ebe4] last:border-0 hover:bg-[#fffaf4]"
                                        >
                                            <td className="px-4 py-4">
                                                <div className="flex items-center gap-3">
                                                    <div className="flex h-10 w-10 items-center justify-center rounded-full bg-[#f5e9df] font-bold text-[#8b472e]">
                                                        {(pandit.name || "P").charAt(0).toUpperCase()}
                                                    </div>

                                                    <span className="text-sm font-semibold text-[#39251d]">
                                                        {pandit.name || "Unknown"}
                                                    </span>
                                                </div>
                                            </td>

                                            <td className="px-4 py-4 text-sm text-[#705f54]">
                                                {pandit.email || "—"}
                                            </td>

                                            <td className="px-4 py-4 text-sm text-[#705f54]">
                                                {pandit.mobile || "—"}
                                            </td>

                                            <td className="px-4 py-4 text-sm text-[#705f54]">
                                                {formatDate(pandit.created_at)}
                                            </td>

                                            <td className="px-4 py-4 text-right">
                                                <Link
                                                    href="/admin/pandits"
                                                    className="inline-flex items-center gap-2 rounded-lg bg-[#f5e9df] px-3 py-2 text-xs font-semibold text-[#8b472e] hover:bg-[#ead7c8]"
                                                >
                                                    <Eye size={14} />
                                                    Review
                                                </Link>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>

                        {/* Mobile View */}
                        <div className="space-y-3 md:hidden">
                            {pendingPandits.slice(0, 5).map((pandit, index) => (
                                <div
                                    key={pandit.id || index}
                                    className="rounded-xl border border-[#eee5dc] p-4"
                                >
                                    <div className="flex items-center gap-3">
                                        <div className="flex h-10 w-10 items-center justify-center rounded-full bg-[#f5e9df] font-bold text-[#8b472e]">
                                            {(pandit.name || "P").charAt(0).toUpperCase()}
                                        </div>

                                        <div className="min-w-0">
                                            <h3 className="truncate text-sm font-semibold text-[#39251d]">
                                                {pandit.name || "Unknown"}
                                            </h3>
                                            <p className="truncate text-xs text-[#95847a]">
                                                {pandit.email || "—"}
                                            </p>
                                        </div>
                                    </div>

                                    <div className="mt-3 flex items-center justify-between gap-3">
                                        <span className="text-xs text-[#95847a]">
                                            {pandit.mobile || "—"}
                                        </span>

                                        <Link
                                            href="/admin/pandits"
                                            className="rounded-lg bg-[#8b472e] px-3 py-2 text-xs font-semibold text-white"
                                        >
                                            Review
                                        </Link>
                                    </div>
                                </div>
                            ))}
                        </div>

                        {pendingPandits.length > 5 && (
                            <div className="mt-4 text-center">
                                <Link
                                    href="/admin/pandits"
                                    className="text-sm font-semibold text-[#8b472e] hover:underline"
                                >
                                    View all {pendingPandits.length} pending applications
                                </Link>
                            </div>
                        )}
                    </>
                )}
            </section>

            {/* Quick Actions */}
            <section>
                <SectionHeader
                    title="Quick Actions"
                    description="Quick access to important management sections"
                />

                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
                    {quickActions.map((action) => {
                        const Icon = action.icon;

                        return (
                            <Link
                                key={action.title}
                                href={action.href}
                                className="group rounded-2xl border border-[#eadfd2] bg-white p-5 transition hover:-translate-y-1 hover:border-[#d9bda9] hover:shadow-md"
                            >
                                <div className="flex items-center justify-between">
                                    <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-[#f6e9df] text-[#8b472e]">
                                        <Icon size={22} />
                                    </div>

                                    <ArrowUpRight
                                        size={19}
                                        className="text-[#b49c8d] transition group-hover:-translate-y-1 group-hover:translate-x-1 group-hover:text-[#8b472e]"
                                    />
                                </div>

                                <h3 className="mt-4 font-bold text-[#39251d]">
                                    {action.title}
                                </h3>

                                <p className="mt-1 text-sm leading-relaxed text-[#95847a]">
                                    {action.description}
                                </p>
                            </Link>
                        );
                    })}
                </div>
            </section>

            {/* Recent Activity */}
            <section className="rounded-2xl border border-[#eadfd2] bg-white p-5 shadow-[0_3px_14px_rgba(76,48,30,0.04)] sm:p-6">
                <SectionHeader
                    title="Recent Activity"
                    description="Latest platform updates and activities"
                />

                <div className="flex flex-col items-center justify-center rounded-xl border border-dashed border-[#e8ddce] py-10 text-center">
                    <div className="mb-3 flex h-12 w-12 items-center justify-center rounded-full bg-[#f6e9df] text-[#8b472e]">
                        <Activity size={23} />
                    </div>

                    <h3 className="font-semibold text-[#39251d]">
                        Activity Feed
                    </h3>

                    <p className="mt-1 max-w-sm text-sm text-[#95847a]">
                        Recent booking, payment and registration activity
                        will appear here once the activity API is connected.
                    </p>
                </div>
            </section>

            {/* Platform Management */}
            <section className="rounded-2xl bg-[#713923] p-6 text-white sm:p-7">
                <div className="flex flex-wrap items-center justify-between gap-4">
                    <div>
                        <div className="mb-2 flex items-center gap-2 text-sm text-[#f1d7c5]">
                            <TrendingUp size={17} />
                            Platform Management
                        </div>

                        <h2 className="text-xl font-bold">
                            Manage MuhuratMitra
                        </h2>

                        <p className="mt-1 text-sm text-[#f1d7c5]">
                            Keep your platform organized and running smoothly.
                        </p>
                    </div>

                    <Link
                        href="/admin/settings"
                        className="inline-flex items-center gap-2 rounded-xl bg-white px-4 py-3 text-sm font-bold text-[#713923] transition hover:bg-[#f8eadf]"
                    >
                        <Plus size={17} />
                        Platform Settings
                    </Link>
                </div>

                <div className="mt-6 grid grid-cols-1 gap-3 sm:grid-cols-3">
                    <Link
                        href="/admin/festivals"
                        className="flex items-center gap-3 rounded-xl border border-white/15 bg-white/10 p-4 transition hover:bg-white/15"
                    >
                        <Bell size={20} />
                        <span className="text-sm font-semibold">Festivals</span>
                    </Link>

                    <Link
                        href="/admin/payments"
                        className="flex items-center gap-3 rounded-xl border border-white/15 bg-white/10 p-4 transition hover:bg-white/15"
                    >
                        <CreditCard size={20} />
                        <span className="text-sm font-semibold">Payments</span>
                    </Link>

                    <Link
                        href="/admin/bookings"
                        className="flex items-center gap-3 rounded-xl border border-white/15 bg-white/10 p-4 transition hover:bg-white/15"
                    >
                        <CalendarDays size={20} />
                        <span className="text-sm font-semibold">Bookings</span>
                    </Link>
                </div>
            </section>

            <div className="border-t border-[#eadfd2] pt-5 text-center text-xs text-[#a18f83]">
                © {new Date().getFullYear()} MuhuratMitra. Admin Panel.
            </div>
        </div>
    );
}
