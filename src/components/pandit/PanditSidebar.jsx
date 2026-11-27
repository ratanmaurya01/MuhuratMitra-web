
"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
    LayoutDashboard,
    UserRound,
    FileUser,
    Flower2,
    CalendarDays,
    Wallet,
    Settings,
} from "lucide-react";

const NAV_ITEMS = [
    {
        title: "OVERVIEW",
        items: [
            {
                label: "Dashboard",
                href: "/pandit/dashboard",
                icon: LayoutDashboard,
            },
        ],
    },
    {
        title: "MY ACCOUNT",
        items: [
            {
                label: "Complete Profile",
                href: "/pandit/complete-profile",
                icon: FileUser,
            },
          
        ],
    },
    {
        title: "BUSINESS",
        items: [
            {
                label: "My Services",
                href: "/pandit/services",
                icon: Flower2,
            },
            {
                label: "Bookings",
                href: "/pandit/bookings",
                icon: CalendarDays,
            },
            {
                label: "Earnings",
                href: "/pandit/earnings",
                icon: Wallet,
            },
        ],
    },
];

export default function PanditSidebar() {
    const pathname = usePathname();

    return (
        <aside className="rounded-3xl border border-[#e8ddce] bg-[#fffdf7] p-4">
            <div className="mb-6 flex items-center gap-3 border-b border-[#eee4da] px-2 pb-5">
                <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-[#8b472e] text-xl text-white">
                    ॐ
                </div>

                <div>
                    <h2 className="font-bold text-[#573323]">
                        MuhuratMitra
                    </h2>
                    <p className="text-xs text-[#9a8172]">
                        Pandit Panel
                    </p>
                </div>
            </div>

            <nav className="space-y-6">
                {NAV_ITEMS.map((group) => (
                    <div key={group.title}>
                        <p className="mb-2 px-3 text-[10px] font-bold tracking-[1.5px] text-[#a58d7d]">
                            {group.title}
                        </p>

                        <div className="space-y-1">
                            {group.items.map((item) => {
                                const Icon = item.icon;
                                const isActive = pathname === item.href;

                                return (
                                    <Link
                                        key={item.href}
                                        href={item.href}
                                        className={`flex items-center gap-3 rounded-xl px-3 py-3 text-sm font-medium transition ${
                                            isActive
                                                ? "bg-[#8b472e] text-white shadow-sm"
                                                : "text-[#705647] hover:bg-[#f5ede4]"
                                        }`}
                                    >
                                        <Icon size={18} />
                                        {item.label}
                                    </Link>
                                );
                            })}
                        </div>
                    </div>
                ))}
            </nav>
        </aside>
    );
}
