
"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
    House,
    CalendarDays,
    Flower2,
    UsersRound,
    UserRound,
} from "lucide-react";

const navItems = [
    {
        name: "Home",
        href: "/",
        icon: House,
    },
    {
        name: "Panchang",
        href: "/panchang",
        icon: CalendarDays,
    },
    {
        name: "Pujas",
        href: "/pujas",
        icon: Flower2,
    },
    {
        name: "Pandits",
        href: "/pandits",
        icon: UsersRound,
    },
    {
        name: "Profile",
        href: "/profile",
        icon: UserRound,
    },
];

export default function BottomNav() {
    const pathname = usePathname();

    const isActive = (href) => {
        if (href === "/") return pathname === "/";
        return pathname === href || pathname.startsWith(`${href}/`);
    };

    return (
        <nav
            aria-label="Main navigation"
            className="fixed inset-x-0 bottom-0 z-50 border-t border-border/70 bg-background/95 shadow-[0_-4px_15px_rgba(0,0,0,0.04)] backdrop-blur-md"
        >
            <div className="mx-auto grid h-16 w-full grid-cols-5 max-w-md md:max-w-5xl lg:max-w-7xl">
                {navItems.map((item) => {
                    const Icon = item.icon;
                    const active = isActive(item.href);

                    return (
                        <Link
                            key={item.href}
                            href={item.href}
                            aria-label={item.name}
                            aria-current={active ? "page" : undefined}
                            className={`relative flex flex-col items-center justify-center gap-1 transition-colors ${active
                                    ? "font-semibold text-[#E8590C]"
                                    : "text-muted-foreground hover:text-foreground"
                                }`}
                        >
                            {active && (
                                <span className="absolute top-0 h-[3px] w-9 rounded-b-full bg-[#E8590C]" />
                            )}

                            <Icon
                                size={21}
                                strokeWidth={active ? 2.5 : 1.8}
                            />

                            <span className="text-[10px] leading-tight sm:text-xs">
                                {item.name}
                            </span>
                        </Link>
                    );
                })}
            </div>

            {/* iPhone safe area */}
            <div className="h-[env(safe-area-inset-bottom)]" />
        </nav>
    );
}
