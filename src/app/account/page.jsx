
"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import {
    ArrowLeft,
    UserRound,
    MapPin,
    CalendarDays,
    CreditCard,
    Bookmark,
    Bell,
    ChevronRight,
    Users,
    Settings,
    CircleHelp,
    Info,
    LogOut,
    Pencil,
    History,
    Flower2,
    Moon,
    Sun,
    Languages,
    Clock3,
} from "lucide-react";

import { useAuth } from "@/hooks/useAuth";

const PUJA_HISTORY = [
    {
        id: 1,
        name: "Naamkaran Sanskar",
        pandit: "Vidwan Subramanian Iyer",
        date: "18 Nov 2026",
        time: "09:00 AM",
        price: "₹3,400",
        status: "Completed",
    },
    {
        id: 2,
        name: "Ganesh Lakshmi Puja",
        pandit: "Pt. Harshvardhan Trivedi",
        date: "09 Nov 2026",
        time: "04:00 PM",
        price: "₹2,200",
        status: "Cancelled",
    },
    {
        id: 3,
        name: "Maha Rudrabhishek Puja",
        pandit: "Acharya Raghavendra Sharma",
        date: "02 Nov 2026",
        time: "06:30 AM",
        price: "₹2,500",
        status: "Completed",
    },
    {
        id: 4,
        name: "Navgraha Shanti Havan",
        pandit: "Acharya Vinayak Deshmukh",
        date: "19 Oct 2026",
        time: "10:00 AM",
        price: "₹2,700",
        status: "Completed",
    },
];

function getInitials(name = "") {
    return name
        .trim()
        .split(/\s+/)
        .filter(Boolean)
        .slice(0, 2)
        .map((part) => part[0].toUpperCase())
        .join("") || "U";
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
                <span className="block text-[15px] font-medium text-[#38251e] sm:text-base">
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


function AccountSection({ title, children, action }) {
    return (
        <section className="space-y-4">
            <div className="flex items-center justify-between gap-3">
                <h2 className="font-display text-[25px] font-medium tracking-tight text-[#39251d] sm:text-[29px]">
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

function BookingCard({ booking }) {
    const isCancelled = booking.status === "Cancelled";

    return (
        <div className="flex items-center gap-3 border-b border-[#eee8dc] px-4 py-5 last:border-b-0 sm:gap-5 sm:px-6">
            <span className="flex size-14 shrink-0 items-center justify-center rounded-full bg-[#f7e5e3] text-[#873d35]">
                <Flower2 size={25} />
            </span>

            <div className="min-w-0 flex-1">
                <h3 className="truncate text-[15px] font-medium text-[#39251d] sm:text-base">
                    {booking.name}
                </h3>

                <p className="mt-1 truncate text-sm text-[#82736b]">
                    {booking.pandit}
                </p>

                <p className="mt-1.5 flex min-w-0 items-center gap-1.5 text-sm text-[#88766d]">
                    <CalendarDays
                        size={17}
                        className="shrink-0 text-[#c75d31]"
                    />
                    <span className="truncate">
                        {booking.date} · {booking.time}
                    </span>
                </p>
            </div>

            <div className="flex shrink-0 flex-col items-end gap-2">
                <span
                    className={`rounded-full px-3 py-1 text-xs font-medium ${isCancelled
                        ? "bg-[#fbe7e6] text-[#a73f3b]"
                        : "bg-[#ffeadc] text-[#c56b3c]"
                        }`}
                >
                    {booking.status}
                </span>

                <span className="font-display text-lg text-[#713c32]">
                    {booking.price}
                </span>
            </div>
        </div>
    );
}


function DevoteeAccountContent() {
    const router = useRouter();
    const { user, logout } = useAuth();

    const [darkMode, setDarkMode] = useState(false);
    const [language, setLanguage] = useState("EN");
    const [showAllHistory, setShowAllHistory] = useState(false);

    const name = user?.name || "Devotee";
    const initials = getInitials(name);

    const bookings = showAllHistory
        ? PUJA_HISTORY
        : PUJA_HISTORY.slice(0, 4);

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
        <div className="w-full space-y-9">
            <div className="mx-auto max-w-5xl px-4 pb-16 sm:px-6 lg:px-8">
                <div className="space-y-9 ">
                    {/* Profile Card */}
                    <section className="rounded-[28px] border border-[#e6ddce] bg-white p-5 shadow-[0_3px_12px_rgba(70,45,25,0.08)] sm:p-8">
                        <div className="flex flex-col gap-5 sm:flex-row sm:items-center">
                            <div className="flex min-w-0 flex-1 items-center gap-4">
                                <div className="flex size-[88px] shrink-0 items-center justify-center rounded-full bg-[#fce7d8] font-display text-[32px] text-[#bd6439] sm:size-24">
                                    {initials}
                                </div>

                                <div className="min-w-0 flex-1">
                                    <div className="flex flex-wrap items-center gap-2">
                                        <h2 className="font-display text-[26px] font-medium text-[#39251d] sm:text-[30px]">
                                            {name}
                                        </h2>

                                        <span className="rounded-full bg-[#f8e8e7] px-3 py-1 text-xs font-medium text-[#843f3b]">
                                            Devotee
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
                        </div>

                        <Link
                            href="/account/profile"
                            className="mt-6 flex h-12 w-full items-center justify-center gap-2 rounded-full border border-[#e5d9c6] text-[15px] font-medium text-[#bd6339] transition hover:border-[#c86b3d] hover:bg-[#fff8f0]"
                        >
                            <Pencil size={18} />
                            Edit Profile
                        </Link>
                    </section>

                    {/* Bookings & Muhurats */}
                    <AccountSection title="Bookings & Muhurats">
                        <AccountRow
                            icon={CalendarDays}
                            title="My Bookings"
                            href="/account/bookings"
                        />

                        <AccountRow
                            icon={CreditCard}
                            title="Payment History"
                            href="/account/payments"
                        />

                        <AccountRow
                            icon={Bookmark}
                            title="Saved Muhurats"
                            badge="2 saved"
                            href="/account/saved-muhurats"
                        />

                        <AccountRow
                            icon={Bell}
                            title="Notifications Inbox"
                            badge="2 unread"
                            href="/account/notifications"
                        />
                    </AccountSection>

                    {/* Puja History */}
                    <AccountSection
                        title="My Puja History"
                        action={
                            <button
                                type="button"
                                onClick={() => setShowAllHistory((prev) => !prev)}
                                className="shrink-0 text-sm font-medium text-[#bd6339] hover:underline sm:text-base"
                            >
                                {showAllHistory ? "Show Less" : "View All"}
                            </button>
                        }
                    >
                        <div className="flex items-center gap-3 border-b border-[#eee8dc] px-5 py-4 sm:px-6">
                            <span className="flex size-10 items-center justify-center rounded-full bg-[#fbe9df] text-[#c85d2d]">
                                <History size={21} />
                            </span>

                            <span className="text-sm text-[#82736b]">
                                {PUJA_HISTORY.length} past ceremonies
                            </span>
                        </div>

                        {bookings.map((booking) => (
                            <BookingCard key={booking.id} booking={booking} />
                        ))}
                    </AccountSection>

                    {/* Personal & Family */}
                    <AccountSection title="Personal & Family">
                        <AccountRow
                            icon={MapPin}
                            title="Saved Addresses"
                            href="/account/addresses"
                        />

                        <AccountRow
                            icon={Users}
                            title="My Family"
                            href="/account/family"
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
                            href="/account/settings"
                        />

                        <AccountRow
                            icon={CircleHelp}
                            title="Help & Support"
                            href="/account/help"
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

                    <p className="pb-5 text-center text-xs text-[#a39488]">
                        MuhuratMitra · Your Spiritual Companion
                    </p>
                </div>
            </div>
        </div>
    );
}


export default function AccountPage() {
    return <DevoteeAccountContent />;
}

// export default function AccountPage() {
//     return (
//         <ProtectedRoute allowedRoles={["DEVOTEE"]}>
//             <DevoteeAccountContent />
//         </ProtectedRoute>
//     );
// }
