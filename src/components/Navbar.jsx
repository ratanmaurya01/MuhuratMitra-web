
"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
  CalendarDays,
  Flower2,
  Home,
  Menu,
  Users,
  X,
  UserRound,
  LogOut,
  LayoutDashboard,
  ChevronDown,
} from "lucide-react";
import { useEffect, useState } from "react";
import { useAuth } from "@/hooks/useAuth";

const NAV_ITEMS = [
  { name: "Home", href: "/", icon: Home },
  { name: "Panchang", href: "/panchang", icon: CalendarDays },
  { name: "Muhurat", href: "/muhurat", icon: Users },
  { name: "Pujas", href: "/pujas", icon: Flower2 },
  { name: "Pandits", href: "/pandits", icon: Users },
];

function isActiveRoute(pathname, href) {
  if (href === "/") return pathname === "/";
  return pathname === href || pathname.startsWith(`${href}/`);
}

export default function Navbar() {
  const pathname = usePathname();
  const router = useRouter();

  const [menuOpen, setMenuOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);
  const [mounted, setMounted] = useState(false);

  // Wait until the component mounts on the client
  useEffect(() => {
    setMounted(true);
  }, []);

  // Centralized authentication
  const {
    user,
    loading,
    isAuthenticated,
    logout,
  } = useAuth();

  // Role-based dashboard
  const role = user?.role;

  const dashboardPath =
    role === "ADMIN"
      ? "/admin/dashboard"
      : role === "PANDIT"
        ? "/pandit/dashboard"
        : "/account";

  const dashboardLabel =
    role === "ADMIN"
      ? "Admin Dashboard"
      : role === "PANDIT"
        ? "Pandit Dashboard"
        : "My Account";

  // Logout
  const handleLogout = () => {
    logout();

    setProfileOpen(false);
    setMenuOpen(false);

    router.replace("/");
  };

  // Close menus
  const closeMenus = () => {
    setMenuOpen(false);
    setProfileOpen(false);
  };

  // Close menus when route changes
  useEffect(() => {
    closeMenus();
  }, [pathname]);

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border bg-background/95 backdrop-blur-md">
      <div className="mx-auto flex h-20 max-w-7xl items-center justify-between px-5 lg:px-8">

        {/* Brand */}
        <Link
          href="/"
          onClick={closeMenus}
          className="flex shrink-0 items-center gap-2"
          aria-label="MuhuratMitra Home"
        >
          <span className="flex size-10 items-center justify-center rounded-xl bg-primary text-primary-foreground">
            <Flower2 size={23} />
          </span>

          <span className="font-display text-lg font-semibold">
            MuhuratMitra
          </span>
        </Link>

        {/* Desktop Navigation */}
        <nav
          aria-label="Main navigation"
          className="hidden items-center gap-8 md:flex"
        >
          {NAV_ITEMS.map(({ name, href, icon: Icon }) => {
            const active = isActiveRoute(pathname, href);

            return (
              <Link
                key={href}
                href={href}
                aria-current={active ? "page" : undefined}
                className={`flex items-center gap-2 text-sm font-medium transition-colors ${
                  active
                    ? "text-primary"
                    : "text-muted-foreground hover:text-primary"
                }`}
              >
                <Icon size={17} aria-hidden="true" />
                {name}
              </Link>
            );
          })}
        </nav>

        {/* Desktop Actions */}
        <div className="relative hidden items-center md:flex">

          {!mounted || loading ? (
            <div className="h-10 w-24 animate-pulse rounded-lg bg-muted" />
          ) : !isAuthenticated ? (
            <Link
              href="/login"
              className="rounded-lg border border-border px-5 py-2.5 text-sm font-medium text-foreground transition-colors hover:border-primary hover:text-primary"
            >
              Login
            </Link>
          ) : (
            <div className="relative">

              {/* Profile Button */}
              <button
                type="button"
                onClick={() => setProfileOpen((prev) => !prev)}
                className="flex items-center gap-2 rounded-xl border border-border px-3 py-2 transition hover:border-primary"
                aria-expanded={profileOpen}
                aria-label="Open account menu"
              >
                <span className="flex size-9 items-center justify-center rounded-full bg-saffron-light text-primary">
                  <UserRound size={19} />
                </span>

                <span className="max-w-32 text-left">
                  <span className="block truncate text-sm font-semibold">
                    {user?.name || "My Account"}
                  </span>

                  <span className="block text-xs text-muted-foreground">
                    {dashboardLabel}
                  </span>
                </span>

                <ChevronDown
                  size={16}
                  className={`transition-transform ${
                    profileOpen ? "rotate-180" : ""
                  }`}
                />
              </button>

              {/* Profile Dropdown */}
              {profileOpen && (
                <>
                  <button
                    type="button"
                    aria-label="Close account menu"
                    className="fixed inset-0 z-40 cursor-default"
                    onClick={() => setProfileOpen(false)}
                  />

                  <div className="absolute right-0 top-full z-50 mt-2 w-56 rounded-xl border border-border bg-background p-2 shadow-xl">

                    <div className="border-b border-border px-3 py-2.5">
                      <p className="truncate text-sm font-semibold">
                        {user?.name}
                      </p>

                      <p className="truncate text-xs text-muted-foreground">
                        {user?.email}
                      </p>
                    </div>

                    <Link
                      href={dashboardPath}
                      onClick={() => setProfileOpen(false)}
                      className="mt-1 flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm transition-colors hover:bg-muted"
                    >
                      <LayoutDashboard size={17} />
                      {dashboardLabel}
                    </Link>

                    <button
                      type="button"
                      onClick={handleLogout}
                      className="flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-sm text-destructive transition-colors hover:bg-destructive/10"
                    >
                      <LogOut size={17} />
                      Logout
                    </button>

                  </div>
                </>
              )}
            </div>
          )}
        </div>

        {/* Mobile Menu Toggle */}
        <button
          type="button"
          onClick={() => setMenuOpen((prev) => !prev)}
          className="rounded-lg border border-border p-2 text-foreground transition-colors hover:bg-muted md:hidden"
          aria-label={menuOpen ? "Close menu" : "Open menu"}
          aria-expanded={menuOpen}
          aria-controls="mobile-navigation"
        >
          {menuOpen ? <X size={23} /> : <Menu size={23} />}
        </button>
      </div>

      {/* Mobile Navigation */}
      {menuOpen && (
        <nav
          id="mobile-navigation"
          aria-label="Mobile navigation"
          className="border-t border-border bg-background px-5 py-4 md:hidden"
        >
          <div className="mx-auto flex max-w-7xl flex-col gap-2">

            {/* Mobile Nav Links */}
            {NAV_ITEMS.map(({ name, href, icon: Icon }) => {
              const active = isActiveRoute(pathname, href);

              return (
                <Link
                  key={href}
                  href={href}
                  onClick={closeMenus}
                  aria-current={active ? "page" : undefined}
                  className={`flex items-center gap-3 rounded-lg px-4 py-3 text-sm font-medium transition-colors ${
                    active
                      ? "bg-saffron-light text-primary"
                      : "text-muted-foreground hover:bg-muted hover:text-foreground"
                  }`}
                >
                  <Icon size={19} aria-hidden="true" />
                  {name}
                </Link>
              );
            })}

            {/* Mobile Authentication */}
            {!mounted || loading ? (
              <div className="mt-2 h-11 animate-pulse rounded-lg bg-muted" />
            ) : !isAuthenticated ? (
              <Link
                href="/login"
                onClick={closeMenus}
                className="mt-2 rounded-lg bg-primary px-4 py-3 text-center text-sm font-semibold text-primary-foreground transition hover:opacity-90"
              >
                Login
              </Link>
            ) : (
              <>
                {/* User Details */}
                <div className="mt-3 flex items-center gap-3 rounded-xl border border-border p-3">
                  <span className="flex size-10 shrink-0 items-center justify-center rounded-full bg-saffron-light text-primary">
                    <UserRound size={20} />
                  </span>

                  <div className="min-w-0">
                    <p className="truncate text-sm font-semibold">
                      {user?.name || "My Account"}
                    </p>

                    <p className="truncate text-xs text-muted-foreground">
                      {dashboardLabel}
                    </p>
                  </div>
                </div>

                {/* Dashboard */}
                <Link
                  href={dashboardPath}
                  onClick={closeMenus}
                  className="mt-2 flex items-center gap-3 rounded-lg bg-primary px-4 py-3 text-sm font-semibold text-primary-foreground transition hover:opacity-90"
                >
                  <LayoutDashboard size={18} />
                  {dashboardLabel}
                </Link>

                {/* Logout */}
                <button
                  type="button"
                  onClick={handleLogout}
                  className="flex items-center gap-3 rounded-lg px-4 py-3 text-sm text-destructive transition-colors hover:bg-destructive/10"
                >
                  <LogOut size={18} />
                  Logout
                </button>
              </>
            )}
          </div>
        </nav>
      )}
    </header>
  );
}
