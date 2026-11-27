

"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
    LayoutDashboard,
    Users,
    UserCheck,
    CalendarDays,
    Flower2,
    CreditCard,
    Settings,
    LogOut,
    ShieldCheck,
} from "lucide-react";

const NAVIGATION = [
    {
        title: "OVERVIEW",
        items: [
            {
                label: "Dashboard",
                href: "/admin/dashboard",
                icon: LayoutDashboard,
            },
        ],
    },
    {
        title: "MANAGEMENT",
        items: [
            {
                label: "Pandits",
                href: "/admin/pandits",
                icon: UserCheck,
            },
            {
                label: "Users",
                href: "/admin/users",
                icon: Users,
            },
            {
                label: "Pujas",
                href: "/admin/pujas",
                icon: Flower2,
            },
            {
                label: "Bookings",
                href: "/admin/bookings",
                icon: CalendarDays,
            },
            {
                label: "Payments",
                href: "/admin/payments",
                icon: CreditCard,
            },
        ],
    },
    {
        title: "PREFERENCES",
        items: [
            {
                label: "Settings",
                href: "/admin/settings",
                icon: Settings,
            },
        ],
    },
];

export default function AdminSidebar() {
    const pathname = usePathname();

    return (
        <aside className="w-full rounded-3xl border border-[#e8ddce] bg-[#fffdf7] p-5">

            <div className="mb-7 flex items-center gap-3 border-b border-[#e8ddce] pb-5">
                <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-[#8b472e] text-white">
                    <ShieldCheck size={23} />
                </div>

                <div>
                    <h2 className="font-bold text-[#573323]">
                        MuhuratMitra
                    </h2>
                    <p className="text-xs text-[#9a8172]">
                        Administration
                    </p>
                </div>
            </div>

            <nav className="space-y-7">
                {NAVIGATION.map((group) => (
                    <div key={group.title}>
                        <p className="mb-3 px-3 text-[10px] font-bold tracking-[1.5px] text-[#a58d7d]">
                            {group.title}
                        </p>

                        <div className="space-y-1">
                            {group.items.map((item) => {
                                const Icon = item.icon;

                                const isActive =
                                    pathname === item.href ||
                                    pathname.startsWith(`${item.href}/`);

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
                                        <Icon size={19} />
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

