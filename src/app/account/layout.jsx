
"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";

import {
    LayoutDashboard,
    CalendarDays,
    CreditCard,
    Bookmark,
    Bell,
    MapPin,
    Users,
    Settings,
    CircleHelp,
    Info,
    LogOut,
    ChevronRight,
} from "lucide-react";

import { useAuth } from "@/hooks/useAuth";
import ProtectedRoute from "@/components/auth/ProtectedRoute";

const SIDEBAR_GROUPS = [
    {
        title: "OVERVIEW",
        items: [
            {
                label: "Dashboard",
                href: "/account",
                icon: LayoutDashboard,
            },
        ],
    },
    {
        title: "BOOKINGS & MUHURATS",
        items: [
            {
                label: "My Bookings",
                href: "/account/bookings",
                icon: CalendarDays,
            },
            {
                label: "Puja History",
                href: "/account/puja-history",
                icon: CalendarDays,
            },
            {
                label: "Payment History",
                href: "/account/payments",
                icon: CreditCard,
            },
            {
                label: "Saved Muhurats",
                href: "/account/saved-muhurats",
                icon: Bookmark,
                badge: "2",
            },
            {
                label: "Notifications",
                href: "/account/notifications",
                icon: Bell,
                badge: "2",
            },
        ],
    },
    {
        title: "PERSONAL & FAMILY",
        items: [
            {
                label: "Saved Addresses",
                href: "/account/addresses",
                icon: MapPin,
            },
            {
                label: "My Family",
                href: "/account/family",
                icon: Users,
            },
        ],
    },
    {
        title: "PREFERENCES & SUPPORT",
        items: [
            {
                label: "Panchang Alerts",
                href: "/account/alerts",
                icon: Bell,
            },
            {
                label: "Settings",
                href: "/account/settings",
                icon: Settings,
            },
            {
                label: "Help & Support",
                href: "/account/help",
                icon: CircleHelp,
            },
            {
                label: "About",
                href: "/about",
                icon: Info,
            },
        ],
    },
];

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

function AccountSidebar() {
    const pathname = usePathname();
    const router = useRouter();

    const { user, logout } = useAuth();

    const handleLogout = async () => {
        await logout();
        router.replace("/");
    };

    const isActive = (href) => {
        if (href === "/account") {
            return pathname === "/account";
        }

        return pathname === href || pathname.startsWith(`${href}/`);
    };

    return (
        <aside className="flex h-full min-h-0 w-full flex-col overflow-hidden">

            {/* Profile Header - Fixed */}
            <div className="shrink-0 border-b border-[#eee4d7] p-4 sm:p-5">
                <Link
                    href="/account/profile"
                    className="flex items-center gap-3 rounded-xl p-2 transition hover:bg-[#fff6ed]"
                >
                    <span className="flex size-12 shrink-0 items-center justify-center rounded-full bg-[#fbe7d8] font-display text-lg text-[#bd6439]">
                        {getInitials(user?.name)}
                    </span>

                    <span className="min-w-0 flex-1">
                        <span className="block truncate font-semibold text-[#39251d]">
                            {user?.name || "Devotee"}
                        </span>

                        <span className="block text-xs text-[#9a8579]">
                            Devotee Account
                        </span>
                    </span>

                    <ChevronRight
                        size={17}
                        className="shrink-0 text-[#9a8579]"
                    />
                </Link>
            </div>

            {/* Navigation - Independently Scrollable */}
            <nav
                className="min-h-0 flex-1 overflow-x-hidden overflow-y-auto overscroll-y-contain p-4"
                style={{
                    WebkitOverflowScrolling: "touch",
                    scrollbarWidth: "thin",
                }}
            >
                <div className="space-y-6">
                    {SIDEBAR_GROUPS.map((group) => (
                        <div key={group.title}>
                            <p className="mb-2 px-3 text-[10px] font-bold tracking-[0.13em] text-[#a18e81]">
                                {group.title}
                            </p>

                            <div className="space-y-1">
                                {group.items.map((item) => {
                                    const Icon = item.icon;
                                    const active = isActive(item.href);

                                    return (
                                        <Link
                                            key={item.href}
                                            href={item.href}
                                            aria-current={
                                                active ? "page" : undefined
                                            }
                                            className={`flex items-center gap-3 rounded-xl px-3 py-3 text-sm font-medium transition ${active
                                                ? "bg-[#fbe9df] text-[#bd5b30] shadow-sm"
                                                : "text-[#705e53] hover:bg-[#fff7ef] hover:text-[#bd5b30]"
                                                }`}
                                        >
                                            <Icon
                                                size={19}
                                                strokeWidth={1.9}
                                                className="shrink-0"
                                            />

                                            <span className="min-w-0 flex-1">
                                                {item.label}
                                            </span>

                                            {item.badge && (
                                                <span className="flex min-w-6 shrink-0 items-center justify-center rounded-full bg-[#fff0e5] px-2 py-0.5 text-xs text-[#bd6439]">
                                                    {item.badge}
                                                </span>
                                            )}
                                        </Link>
                                    );
                                })}
                            </div>
                        </div>
                    ))}
                </div>
            </nav>

            {/* Footer - Fixed */}
            <div className="shrink-0 border-t border-[#eee4d7] bg-white p-4">
                <button
                    type="button"
                    onClick={handleLogout}
                    className="flex w-full items-center gap-3 rounded-xl px-3 py-3 text-sm font-medium text-[#a7463e] transition hover:bg-[#fff0eb]"
                >
                    <LogOut size={19} />
                    Logout
                </button>
            </div>
        </aside>
    );
}

export default function AccountLayout({ children }) {
    return (
        <ProtectedRoute allowedRoles={["DEVOTEE"]}>
            <div className="min-h-screen bg-[#fffdf7]">

                <div className="mx-auto grid max-w-[1500px] grid-cols-1 items-start gap-6 px-4 py-5 sm:px-6 lg:grid-cols-[270px_minmax(0,1fr)] lg:gap-8 lg:px-8 lg:py-8">

                    {/* Desktop Sidebar */}
                    <div className="hidden lg:sticky lg:top-8 lg:block">
                        <div className="h-[calc(100dvh-64px)] max-h-[850px] min-h-[500px] overflow-hidden rounded-2xl border border-[#e8ddce] bg-white shadow-[0_3px_14px_rgba(70,45,25,0.04)]">
                            <AccountSidebar />
                        </div>
                    </div>

                    {/* Mobile Sidebar */}
                    <div className="lg:hidden">
                        <div className="h-[65vh] min-h-[350px] max-h-[560px] overflow-hidden rounded-2xl border border-[#e8ddce] bg-white shadow-[0_3px_14px_rgba(70,45,25,0.04)]">
                            <AccountSidebar />
                        </div>
                    </div>

                    {/* Main Content */}
                    <main className="min-w-0">
                        {children}
                    </main>

                </div>
            </div>
        </ProtectedRoute>
    );
}
