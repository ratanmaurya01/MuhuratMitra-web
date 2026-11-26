
"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useState } from "react";

import {
    ArrowLeft,
    Flower2,
    Languages,
    Moon,
    Sun,
    UserRound,
    MapPin,
    Pencil,
    ChevronRight,
    CalendarCheck,
    Bell,
    Settings,
    CircleHelp,
    Info,
    LogOut,
    Home,
    CalendarDays,
    Building2,
    LayoutDashboard,
    Wallet,
    Clock3,
    CheckCircle2,
} from "lucide-react";

import { useAuth } from "@/hooks/useAuth";
import ProtectedRoute from "@/components/auth/ProtectedRoute";

function getInitials(name = "") {
    return (
        name
            .trim()
            .split(/\s+/)
            .filter(Boolean)
            .slice(0, 2)
            .map((part) => part[0].toUpperCase())
            .join("") || "P"
    );
}

function AccountSection({ title, children }) {
    return (
        <section className="space-y-4">
            <h2 className="font-display text-[25px] font-medium tracking-tight text-[#39251d] sm:text-[29px]">
                {title}
            </h2>

            <div className="overflow-hidden rounded-[25px] border border-[#e5dccb] bg-white">
                {children}
            </div>
        </section>
    );
}

function AccountRow({
    icon: Icon,
    title,
    description,
    badge,
    href,
}) {
    return (
        <Link
            href={href}
            className="group flex min-h-[82px] items-center gap-4 border-b border-[#eee8dc] px-4 py-4 last:border-b-0 sm:px-6"
        >
            <span className="flex size-12 shrink-0 items-center justify-center rounded-full bg-[#fbe9df] text-[#c85d2d] transition group-hover:bg-[#f8dfd2]">
                <Icon size={23} strokeWidth={2.2} />
            </span>

            <span className="min-w-0 flex-1">
                <span className="block truncate text-[15px] font-medium text-[#38251e] sm:text-base">
                    {title}
                </span>

                {description && (
                    <span className="mt-1 block text-sm leading-5 text-[#88766d]">
                        {description}
                    </span>
                )}
            </span>

            {badge && (
                <span className="shrink-0 rounded-full bg-[#ffeadc] px-3 py-1 text-xs font-medium text-[#c56b3c]">
                    {badge}
                </span>
            )}

            <ChevronRight
                size={22}
                className="shrink-0 text-[#78645a] transition group-hover:translate-x-1"
            />
        </Link>
    );
}

function StatCard({ value, label, icon: Icon }) {
    return (
        <div className="min-w-0 rounded-[25px] border border-[#e5dccb] bg-white p-4 shadow-[0_2px_8px_rgba(70,45,25,0.025)] sm:p-5">
            <div className="flex items-center gap-2">
                {Icon && (
                    <Icon size={17} className="shrink-0 text-[#c66b3d]" />
                )}

                <p className="truncate font-display text-[25px] font-medium text-[#bd6339] sm:text-[30px]">
                    {value}
                </p>
            </div>

            <p className="mt-1 truncate text-xs text-[#786b63] sm:text-sm">
                {label}
            </p>
        </div>
    );
}

const BOTTOM_NAV = [
    { name: "Home", href: "/", icon: Home },
    { name: "Panchang", href: "/panchang", icon: CalendarDays },
    { name: "Pujas", href: "/pujas", icon: Flower2 },
    {
        name: "Workspace",
        href: "/pandit/dashboard",
        icon: Building2,
    },
    {
        name: "Account",
        href: "/pandit/account",
        icon: UserRound,
    },
];

function PanditAccountContent() {
    const router = useRouter();
    const pathname = usePathname();

    const { user, logout } = useAuth();

    const [language, setLanguage] = useState("EN");
    const [darkMode, setDarkMode] = useState(false);

    const name = user?.name || "Pandit";
    const initials = getInitials(name);

    // Demo statistics: connect these to your API later.
    const stats = {
        earnings: "₹38,400",
        pending: "2",
        completed: "14",
    };

    const handleLogout = () => {
        logout();
        router.replace("/");
    };

    const toggleTheme = () => {
        const nextMode = !darkMode;
        setDarkMode(nextMode);
        document.documentElement.classList.toggle("dark", nextMode);
    };

    return (
        <main
            className={`min-h-screen pb-28 ${darkMode ? "bg-[#211c19]" : "bg-[#fffdf6]"
                }`}
        >
            <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8">

                {/* Header */}
                <header className="sticky top-0 z-30 -mx-4 flex h-[76px] items-center justify-between border-b border-[#eee7da] bg-[#fffdf6]/95 px-4 backdrop-blur-md sm:-mx-6 sm:px-6 lg:-mx-8 lg:px-8">
                    <div className="flex min-w-0 items-center gap-3">
                        <span className="flex size-11 shrink-0 items-center justify-center rounded-full bg-[#701c20] text-[#fff2d9]">
                            <Flower2 size={25} fill="currentColor" />
                        </span>

                        <h1 className="truncate font-display text-[23px] font-medium text-[#39251d] sm:text-[27px]">
                            Pandit Account
                        </h1>
                    </div>

                    <div className="flex shrink-0 items-center gap-2 sm:gap-4">
                        <button
                            type="button"
                            onClick={() =>
                                setLanguage((prev) => prev === "EN" ? "हि" : "EN")
                            }
                            className="flex h-10 items-center gap-1 rounded-full border border-[#ead9c8] bg-[#fff2e6] px-3 text-sm font-medium text-[#713c32]"
                            aria-label="Toggle language label"
                        >
                            <Languages size={17} />
                            {language}
                        </button>

                        <button
                            type="button"
                            onClick={toggleTheme}
                            aria-label="Toggle dark mode"
                            className="flex size-10 items-center justify-center rounded-full text-[#624b40] hover:bg-[#f6eee3]"
                        >
                            {darkMode ? <Sun size={22} /> : <Moon size={22} />}
                        </button>

                        <span className="flex size-10 items-center justify-center rounded-full bg-[#fbe9dc] font-display text-lg text-[#bd6439]">
                            {initials}
                        </span>
                    </div>
                </header>

                <div className="space-y-8 pt-7 sm:pt-10">

                    {/* Pandit Profile */}
                    <section className="rounded-[28px] border border-[#e6ddce] bg-white p-5 shadow-[0_3px_12px_rgba(70,45,25,0.08)] sm:p-8">
                        <div className="flex min-w-0 items-center gap-4">
                            <div className="flex size-[88px] shrink-0 items-center justify-center rounded-full bg-[#fce7d8] font-display text-[32px] text-[#bd6439] sm:size-24">
                                {initials}
                            </div>

                            <div className="min-w-0 flex-1">
                                <div className="flex flex-wrap items-center gap-2">
                                    <h2 className="max-w-full truncate font-display text-[25px] font-medium text-[#39251d] sm:text-[30px]">
                                        {name}
                                    </h2>

                                    <span className="shrink-0 rounded-full bg-[#ffeadc] px-3 py-1 text-xs font-medium text-[#bd6339]">
                                        Pandit
                                    </span>
                                </div>

                                <p className="mt-2 truncate text-sm text-[#84766e]">
                                    {user?.phone || "Mobile number not added"}
                                    {user?.email ? ` · ${user.email}` : ""}
                                </p>

                                <p className="mt-2 flex items-center gap-1.5 text-sm text-[#bd6339]">
                                    <MapPin size={17} />
                                    {user?.city || "Jaipur"}
                                </p>
                            </div>
                        </div>

                        <Link
                            href="/pandit/profile/edit"
                            className="mt-6 flex h-12 w-full items-center justify-center gap-2 rounded-full border border-[#e5d9c6] text-[15px] font-medium text-[#bd6339] transition hover:border-[#c86b3d] hover:bg-[#fff8f0]"
                        >
                            <Pencil size={18} />
                            Edit Profile
                        </Link>
                    </section>

                    {/* Statistics */}
                    <section className="grid grid-cols-3 gap-3 sm:gap-4">
                        <StatCard
                            value={stats.earnings}
                            label="This Month"
                            icon={Wallet}
                        />

                        <StatCard
                            value={stats.pending}
                            label="Pending Requests"
                            icon={Clock3}
                        />

                        <StatCard
                            value={stats.completed}
                            label="Completed Pujas"
                            icon={CheckCircle2}
                        />
                    </section>

                    {/* Pandit Workspace */}
                    <AccountSection title="Pandit Workspace">
                        <AccountRow
                            icon={Flower2}
                            title="Pandit Dashboard"
                            description="Verification, slots & incoming requests"
                            href="/pandit/dashboard"
                        />

                        <AccountRow
                            icon={CalendarCheck}
                            title="Availability & Incoming Requests"
                            description="Set ceremony slots and respond to devotees"
                            badge="2"
                            href="/pandit/availability"
                        />

                        <AccountRow
                            icon={Bell}
                            title="Notifications Inbox"
                            badge="2 unread"
                            href="/pandit/notifications"
                        />
                    </AccountSection>

                    {/* Preferences & Support */}
                    <AccountSection title="Preferences & Support">
                        <AccountRow
                            icon={Bell}
                            title="Panchang Alerts & Rituals"
                            description="City-based optimal ritual & puja reminders"
                            href="/account/alerts"
                        />

                        <AccountRow
                            icon={Settings}
                            title="Settings"
                            href="/pandit/settings"
                        />

                        <AccountRow
                            icon={CircleHelp}
                            title="Help & Support"
                            href="/help"
                        />

                        <AccountRow
                            icon={Info}
                            title="About"
                            href="/about"
                        />
                    </AccountSection>

                    {/* Logout */}
                    <button
                        type="button"
                        onClick={handleLogout}
                        className="flex min-h-[82px] w-full items-center gap-4 rounded-[25px] border border-[#e8c5bd] bg-[#fff1eb] px-6 text-[#a73f3b] transition hover:bg-[#fce6df]"
                    >
                        <span className="flex size-12 items-center justify-center rounded-full bg-[#f7dfda]">
                            <LogOut size={24} />
                        </span>

                        <span className="text-base font-medium">
                            Logout
                        </span>
                    </button>

                    <p className="pb-4 text-center text-xs text-[#a39488]">
                        MuhuratMitra · Pandit Workspace
                    </p>
                </div>
            </div>

            {/* Mobile Bottom Navigation */}
            <nav className="fixed inset-x-0 bottom-0 z-40 border-t border-[#f0ddca] bg-[#ffead9] pb-[env(safe-area-inset-bottom)]">
                <div className="mx-auto grid max-w-3xl grid-cols-5">
                    {BOTTOM_NAV.map(({ name, href, icon: Icon }) => {
                        const active =
                            pathname === href ||
                            (href !== "/" && pathname.startsWith(`${href}/`));

                        return (
                            <Link
                                key={name}
                                href={href}
                                className={`flex min-w-0 flex-col items-center justify-center gap-1.5 px-1 py-3 transition ${active
                                        ? "text-[#c85d2d]"
                                        : "text-[#796458] hover:text-[#c85d2d]"
                                    }`}
                            >
                                <Icon
                                    size={25}
                                    strokeWidth={active ? 2.5 : 2}
                                    fill={active && name === "Account" ? "currentColor" : "none"}
                                />

                                <span className="max-w-full truncate text-[11px] font-medium sm:text-sm">
                                    {name}
                                </span>
                            </Link>
                        );
                    })}
                </div>
            </nav>
        </main>
    );
}

export default function PanditAccountPage() {
    return (
        <ProtectedRoute allowedRoles={["PANDIT"]}>
            <PanditAccountContent />
        </ProtectedRoute>
    );
}
